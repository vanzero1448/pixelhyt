const express = require("express");
const { Rcon } = require("rcon-client");
const crypto = require("crypto");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const https = require("https");

const app = express();

// ═══════════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════
app.use(helmet());

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) cb(null, true);
      else cb(new Error("CORS: origin not allowed"));
    },
    methods: ["GET", "POST"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

// ═══════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════
const payLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: { error: "Too many requests." },
});
const resLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  message: { error: "Too many requests." },
});

// ═══════════════════════════════════════════════
// ENV VALIDATION
// ═══════════════════════════════════════════════
const REQUIRED_ENV = [
  "ROBOKASSA_MERCHANT_LOGIN",
  "ROBOKASSA_PASSWORD1",
  "ROBOKASSA_PASSWORD2",
  "HYRCON_HOST",
  "HYRCON_PASSWORD",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "SITE_URL",
];

for (const k of REQUIRED_ENV) {
  if (!process.env[k]) {
    console.error(`❌ Missing required env variable: ${k}`);
    process.exit(1);
  }
}

const MERCHANT = process.env.ROBOKASSA_MERCHANT_LOGIN;
const PASS1 = process.env.ROBOKASSA_PASSWORD1;
const PASS2 = process.env.ROBOKASSA_PASSWORD2;
const RCON_HOST = process.env.HYRCON_HOST;
const RCON_PORT = parseInt(process.env.HYRCON_PORT || "25575");
const RCON_PASS = process.env.HYRCON_PASSWORD;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SITE_URL = process.env.SITE_URL.replace(/\/$/, "");
const SERVER_IP = "pixel.my-craft.cc:25612";

// ═══════════════════════════════════════════════
// IN-MEMORY PURCHASE STORE
// Replace with a real database (PostgreSQL/Redis) in production
// ═══════════════════════════════════════════════
const purchases = new Map(); // invId (string) → PurchaseData

// ═══════════════════════════════════════════════
// RANK / PACK CONFIG
// ═══════════════════════════════════════════════
const VALID_RANKS = new Set([
  "ping",
  "packet",
  "protocol",
  "script",
  "kernel",
  "cipher",
  "quantum",
  "core",
  "overclock",
  "singularity",
  "bp",
]);

// Starter pack definitions
const PACK_CONFIG = {
  s1: { rank: "ping", duration: "90d", kit: "start" }, // Novice — Ping 3mo
  s2: { rank: "packet", duration: null, kit: "packet" }, // Pro — Packet lifetime
  s3: { rank: "protocol", duration: null, kit: "protocol" }, // Sponsor — Protocol lifetime
};

/**
 * Build the list of RCON commands for a purchase.
 * Returns { cmds: string[], rankName: string|null }
 */
function buildCommands(itemId, itemType, nick) {
  const cmds = [];
  let rankName = null;

  if (itemType === "rank") {
    // itemId format: "protocol_forever" | "ping_month" | "kernel_quarter"
    const parts = itemId.split("_");
    const period = parts[parts.length - 1];
    const rank = parts.slice(0, -1).join("_");

    if (!VALID_RANKS.has(rank)) return { cmds: [], rankName: null };
    rankName = rank;

    if (period === "forever") cmds.push(`lp user ${nick} parent set ${rank}`);
    else if (period === "month")
      cmds.push(`lp user ${nick} parent addtemp ${rank} 30d`);
    else if (period === "quarter")
      cmds.push(`lp user ${nick} parent addtemp ${rank} 90d`);
  } else if (itemType === "pack") {
    const cfg = PACK_CONFIG[itemId];
    if (!cfg) return { cmds: [], rankName: null };

    rankName = cfg.rank;
    if (cfg.duration) {
      cmds.push(`lp user ${nick} parent addtemp ${cfg.rank} ${cfg.duration}`);
    } else {
      cmds.push(`lp user ${nick} parent set ${cfg.rank}`);
    }
    // Give kit
    cmds.push(`kit ${cfg.kit} ${nick}`);
  } else if (itemType === "pass") {
    rankName = "bp";
    cmds.push(`lp user ${nick} parent add bp`);
  }

  return { cmds, rankName };
}

/**
 * Build revoke RCON commands for a purchase.
 */
function buildRevokeCommands(p) {
  if (!p.rankName) return [];
  return [`lp user ${p.nick} parent remove ${p.rankName}`];
}

/**
 * Human-readable item label.
 */
function buildItemLabel(itemId, itemType) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  if (itemType === "rank") {
    const parts = itemId.split("_");
    const period = parts[parts.length - 1];
    const rank = parts.slice(0, -1).join("_");
    const pMap = { month: "1 Month", quarter: "3 Months", forever: "Lifetime" };
    return `${capitalize(rank)} Rank · ${pMap[period] || period}`;
  }
  if (itemType === "pack") {
    const names = {
      s1: "Novice Starter Pack",
      s2: "Pro Starter Pack",
      s3: "Sponsor Starter Pack",
    };
    return names[itemId] || capitalize(itemId);
  }
  if (itemType === "pass") return "Battle Pass (Current Season)";
  return capitalize(itemId);
}

/**
 * Format date to readable string.
 */
function fmtDate(d = new Date()) {
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ═══════════════════════════════════════════════
// RCON HELPER
// ═══════════════════════════════════════════════
async function sendRcon(commands) {
  if (!commands.length) return [];
  const rcon = await Rcon.connect({
    host: RCON_HOST,
    port: RCON_PORT,
    password: RCON_PASS,
    timeout: 6000,
  });
  const results = [];
  for (const cmd of commands) {
    console.log(`→ RCON: ${cmd}`);
    results.push(await rcon.send(cmd));
  }
  await rcon.end();
  return results;
}

// ═══════════════════════════════════════════════
// TELEGRAM BOT HELPER
// ═══════════════════════════════════════════════
async function telegramRequest(method, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${BOT_TOKEN}/${method}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (d) => (raw += d));
      res.on("end", () => {
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve({});
        }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

/**
 * Build the Telegram message text for a purchase.
 */
function buildPurchaseCaption(p) {
  const statusLine = p.revoked
    ? "🔴 <b>Status:</b> REVOKED BY ADMIN"
    : "🟢 <b>Status:</b> ACTIVE";

  return [
    `🛒 <b>NEW PURCHASE</b>  #<code>${p.invId}</code>`,
    ``,
    `👤 <b>Player:</b>  <code>${p.nick}</code>`,
    `🎖  <b>Item:</b>  ${p.itemLabel}`,
    `💰 <b>Amount:</b>  $${p.price}`,
    `📅 <b>Date:</b>  ${p.dateStr}`,
    `🔢 <b>Order ID:</b>  <code>${p.invId}</code>`,
    `🌐 <b>Server:</b>  <code>${SERVER_IP}</code>`,
    ``,
    statusLine,
  ].join("\n");
}

/**
 * Build Telegram inline keyboard.
 */
function buildKeyboard(p) {
  if (p.revoked) {
    return {
      inline_keyboard: [
        [{ text: "✅  Privilege Revoked", callback_data: "noop" }],
      ],
    };
  }
  return {
    inline_keyboard: [
      [{ text: "🔴  Revoke Privilege", callback_data: `revoke|${p.invId}` }],
    ],
  };
}

/**
 * Send purchase notification to Telegram and return message_id.
 */
async function sendPurchaseNotification(p) {
  const res = await telegramRequest("sendMessage", {
    chat_id: CHAT_ID,
    text: buildPurchaseCaption(p),
    parse_mode: "HTML",
    reply_markup: buildKeyboard(p),
  });
  return res?.result?.message_id ?? null;
}

/**
 * Edit existing Telegram message after revoke.
 */
async function editRevokedMessage(p) {
  if (!p.tgMsgId) return;
  await telegramRequest("editMessageText", {
    chat_id: CHAT_ID,
    message_id: p.tgMsgId,
    text: buildPurchaseCaption({ ...p, revoked: true }),
    parse_mode: "HTML",
    reply_markup: buildKeyboard({ ...p, revoked: true }),
  });
}

// ═══════════════════════════════════════════════
// VALIDATORS
// ═══════════════════════════════════════════════
const isValidNick = (n) => /^[a-zA-Z0-9_]{3,16}$/.test(n);
const isValidSum = (s) => {
  const n = parseFloat(s);
  return !isNaN(n) && n >= 0.5 && n <= 100_000;
};

function safeCompare(a, b) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// ═══════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════

// Health check
app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ──────────────────────────────────────────────
// 1. Create Robokassa payment link
// ──────────────────────────────────────────────
app.post("/create-payment", payLimiter, (req, res) => {
  const { nick, itemId, itemType, price } = req.body;

  if (!nick || !itemId || !itemType || !price)
    return res
      .status(400)
      .json({ error: "Missing fields: nick, itemId, itemType, price" });

  if (!isValidNick(nick))
    return res.status(400).json({ error: "Invalid nickname format" });
  if (!isValidSum(price))
    return res.status(400).json({ error: "Invalid price" });

  // Pre-validate the item to fail fast before sending to Robokassa
  const { cmds } = buildCommands(itemId, itemType, nick);
  if (!cmds.length)
    return res.status(400).json({ error: "Unknown item or type" });

  const invId = Date.now();
  const sum = parseFloat(price).toFixed(2);
  const desc = `${buildItemLabel(itemId, itemType)} for ${nick}`;

  // shp_ params MUST be in alphabetical order in the signature
  const sigStr = `${MERCHANT}:${sum}:${invId}:${PASS1}:shp_item=${itemId}:shp_nick=${nick}:shp_type=${itemType}`;
  const sig = crypto.createHash("md5").update(sigStr).digest("hex");

  const url = new URL("https://auth.robokassa.ru/Merchant/Index.aspx");
  url.searchParams.set("MrchLogin", MERCHANT);
  url.searchParams.set("OutSum", sum);
  url.searchParams.set("InvId", String(invId));
  url.searchParams.set("Desc", desc);
  url.searchParams.set("SignatureValue", sig);
  url.searchParams.set("shp_item", itemId);
  url.searchParams.set("shp_nick", nick);
  url.searchParams.set("shp_type", itemType);
  url.searchParams.set("SuccessURL", `${SITE_URL}/success`);
  url.searchParams.set("FailURL", `${SITE_URL}/fail`);

  console.log(
    `📦 Payment created: ${nick} | ${itemId} | $${sum} | InvId=${invId}`,
  );
  res.json({ url: url.toString(), invId });
});

// ──────────────────────────────────────────────
// 2. Robokassa ResultURL callback (server-to-server)
// ──────────────────────────────────────────────
app.post("/robokassa/result", resLimiter, async (req, res) => {
  const { InvId, OutSum, SignatureValue, shp_item, shp_nick, shp_type } =
    req.body;

  // Field presence
  if (
    !InvId ||
    !OutSum ||
    !SignatureValue ||
    !shp_item ||
    !shp_nick ||
    !shp_type
  )
    return res.status(400).send("missing params");

  if (!isValidNick(shp_nick)) return res.status(400).send("invalid nick");

  // ── Signature verification (PASSWORD2, shp_ in alphabetical order) ──
  const expectedSig = `${OutSum}:${InvId}:${PASS2}:shp_item=${shp_item}:shp_nick=${shp_nick}:shp_type=${shp_type}`;
  const mySig = crypto
    .createHash("md5")
    .update(expectedSig)
    .digest("hex")
    .toUpperCase();

  if (!safeCompare(mySig, (SignatureValue || "").toUpperCase())) {
    console.warn(`⚠️  Signature mismatch InvId=${InvId}`);
    return res.status(400).send("bad sign");
  }

  // ── Build RCON commands ──
  const { cmds, rankName } = buildCommands(shp_item, shp_type, shp_nick);
  if (!cmds.length) {
    console.error(`❌ Unknown item: ${shp_item} / ${shp_type}`);
    return res.status(400).send("unknown item");
  }

  // ── Execute RCON ──
  try {
    const results = await sendRcon(cmds);
    console.log(
      `✅ RCON OK for ${shp_nick}: ${cmds.join(" | ")} → ${results.join(" | ")}`,
    );
  } catch (e) {
    console.error(`❌ RCON error InvId=${InvId}:`, e.message);
    return res.status(500).send("rcon error");
  }

  // ── Store purchase ──
  const p = {
    invId: String(InvId),
    nick: shp_nick,
    itemId: shp_item,
    itemType: shp_type,
    itemLabel: buildItemLabel(shp_item, shp_type),
    price: parseFloat(OutSum).toFixed(2),
    rankName,
    dateStr: fmtDate(),
    revoked: false,
    tgMsgId: null,
    commands: cmds,
  };
  purchases.set(String(InvId), p);

  // ── Telegram notification ──
  try {
    const msgId = await sendPurchaseNotification(p);
    p.tgMsgId = msgId;
    console.log(`📬 Telegram notified (msg ${msgId})`);
  } catch (e) {
    console.warn("⚠️  Telegram error:", e.message);
  }

  // Robokassa requires this exact response
  res.send(`OK${InvId}`);
});

// ──────────────────────────────────────────────
// 3. Get purchase data (called by Success page)
// ──────────────────────────────────────────────
app.get("/payment-info/:invId", (req, res) => {
  const p = purchases.get(req.params.invId);
  if (!p) return res.status(404).json({ error: "Purchase not found" });

  res.json({
    invId: p.invId,
    nick: p.nick,
    item: p.itemLabel,
    price: p.price,
    dateStr: p.dateStr,
    revoked: p.revoked,
    serverIp: SERVER_IP,
  });
});

// ──────────────────────────────────────────────
// 4. Telegram Webhook (receives inline button callbacks)
// ──────────────────────────────────────────────
app.post("/telegram/webhook", async (req, res) => {
  // Answer Telegram immediately (within 5 sec requirement)
  res.sendStatus(200);

  const update = req.body;
  const cbq = update?.callback_query;
  if (!cbq) return;

  const callbackId = cbq.id;
  const data = cbq.data || "";

  // Acknowledge the callback immediately
  await telegramRequest("answerCallbackQuery", {
    callback_query_id: callbackId,
  }).catch(() => {});

  if (data === "noop") return;

  if (data.startsWith("revoke|")) {
    const invId = data.split("|")[1];
    const p = purchases.get(invId);

    if (!p) {
      await telegramRequest("answerCallbackQuery", {
        callback_query_id: callbackId,
        text: "❌ Order not found in memory",
        show_alert: true,
      }).catch(() => {});
      return;
    }

    if (p.revoked) {
      await telegramRequest("answerCallbackQuery", {
        callback_query_id: callbackId,
        text: "⚠️ Already revoked!",
        show_alert: true,
      }).catch(() => {});
      return;
    }

    // Build revoke commands and execute
    const revokeCmds = buildRevokeCommands(p);
    if (!revokeCmds.length) {
      await telegramRequest("answerCallbackQuery", {
        callback_query_id: callbackId,
        text: "⚠️ No rank to revoke for this order.",
        show_alert: true,
      }).catch(() => {});
      return;
    }

    try {
      await sendRcon(revokeCmds);
      p.revoked = true;
      await editRevokedMessage(p);
      console.log(`🔴 Revoked ${p.rankName} from ${p.nick} (InvId=${invId})`);
    } catch (e) {
      console.error("❌ Revoke RCON error:", e.message);
      await telegramRequest("answerCallbackQuery", {
        callback_query_id: callbackId,
        text: `❌ RCON error: ${e.message}`,
        show_alert: true,
      }).catch(() => {});
    }
  }
});

// ═══════════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════════
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ═══════════════════════════════════════════════
// START SERVER & REGISTER TELEGRAM WEBHOOK
// ═══════════════════════════════════════════════
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Pixel backend running on port ${PORT}`);
  console.log(`🌐 Server IP: ${SERVER_IP}`);

  // Register Telegram webhook
  const webhookUrl = `${SITE_URL}/telegram/webhook`;
  try {
    const r = await telegramRequest("setWebhook", {
      url: webhookUrl,
      drop_pending_updates: true,
      allowed_updates: ["callback_query", "message"],
    });
    if (r.ok) {
      console.log(`📬 Telegram webhook registered: ${webhookUrl}`);
    } else {
      console.warn(`⚠️  Telegram webhook failed: ${r.description}`);
    }
  } catch (e) {
    console.warn("⚠️  Could not set Telegram webhook:", e.message);
  }
});
