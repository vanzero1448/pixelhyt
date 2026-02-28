const express = require("express");
const { Rcon } = require("rcon-client");
const crypto = require("crypto");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// =============================================
// БЕЗОПАСНОСТЬ — заголовки
// =============================================
app.use(helmet());

// CORS — только свой домен, не wildcard
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Разрешаем запросы без origin (Render health checks, curl, Robokassa)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: origin not allowed"));
      }
    },
    methods: ["GET", "POST"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" })); // защита от огромных тел запросов

// =============================================
// RATE LIMITING
// =============================================
const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 10, // не более 10 запросов на создание платежа с одного IP
  message: { error: "Too many requests, slow down." },
});

const resultLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // Robokassa может стучать много раз
  message: { error: "Too many requests." },
});

// =============================================
// ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ — проверяем при старте
// =============================================
const REQUIRED_ENV = [
  "ROBOKASSA_MERCHANT_LOGIN",
  "ROBOKASSA_PASSWORD1",
  "ROBOKASSA_PASSWORD2",
  "HYRCON_HOST",
  "HYRCON_PASSWORD",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
}

const MERCHANT_LOGIN = process.env.ROBOKASSA_MERCHANT_LOGIN;
const PASSWORD1 = process.env.ROBOKASSA_PASSWORD1;
const PASSWORD2 = process.env.ROBOKASSA_PASSWORD2;
const HYRCON_HOST = process.env.HYRCON_HOST;
const HYRCON_PORT = parseInt(process.env.HYRCON_PORT || "25575", 10);
const HYRCON_PASS = process.env.HYRCON_PASSWORD;

// Допустимые ранги — whitelist, чтобы никто не передал произвольную команду
const ALLOWED_RANKS = (process.env.ALLOWED_RANKS || "vip,premium,elite")
  .split(",")
  .map((r) => r.trim().toLowerCase());

// =============================================
// ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ
// =============================================
function isValidNick(nick) {
  // Minecraft ник: 3-16 символов, только буквы/цифры/подчёркивание
  return /^[a-zA-Z0-9_]{3,16}$/.test(nick);
}

function isValidSum(sum) {
  const n = parseFloat(sum);
  return !isNaN(n) && n >= 1 && n <= 100000;
}

function isValidRank(rank) {
  return ALLOWED_RANKS.includes(String(rank).toLowerCase());
}

// =============================================
// ПОДПИСЬ ROBOKASSA (timingSafeEqual против timing-атак)
// =============================================
function safeCompare(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// =============================================
// HEALTH CHECK
// =============================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// =============================================
// 1. Создание ссылки на оплату
// =============================================
app.post("/create-payment", paymentLimiter, (req, res) => {
  const { nick, rank, sum } = req.body;

  if (!nick || !rank || !sum) {
    return res.status(400).json({ error: "Missing fields: nick, rank, sum" });
  }
  if (!isValidNick(nick)) {
    return res.status(400).json({ error: "Invalid nick format" });
  }
  if (!isValidRank(rank)) {
    return res.status(400).json({ error: "Invalid rank" });
  }
  if (!isValidSum(sum)) {
    return res.status(400).json({ error: "Invalid sum" });
  }

  const orderId = Date.now();
  const normalizedRank = String(rank).toLowerCase();
  const description = `Rank ${normalizedRank} for ${nick}`;

  // shp_ параметры ОБЯЗАТЕЛЬНО в алфавитном порядке в подписи
  const signatureString = `${MERCHANT_LOGIN}:${sum}:${orderId}:${PASSWORD1}:shp_nick=${nick}:shp_rank=${normalizedRank}`;
  const signature = crypto
    .createHash("md5")
    .update(signatureString)
    .digest("hex");

  const paymentUrl =
    `https://auth.robokassa.ru/Merchant/Index.aspx?` +
    `MrchLogin=${encodeURIComponent(MERCHANT_LOGIN)}` +
    `&OutSum=${encodeURIComponent(sum)}` +
    `&InvId=${orderId}` +
    `&Desc=${encodeURIComponent(description)}` +
    `&SignatureValue=${signature}` +
    `&shp_nick=${encodeURIComponent(nick)}` +
    `&shp_rank=${encodeURIComponent(normalizedRank)}`;

  res.json({ url: paymentUrl });
});

// =============================================
// 2. Result URL — Robokassa уведомляет об оплате
// =============================================
app.post("/robokassa/result", resultLimiter, async (req, res) => {
  const { InvId, OutSum, SignatureValue, shp_nick, shp_rank } = req.body;

  // Проверяем наличие всех полей
  if (!InvId || !OutSum || !SignatureValue || !shp_nick || !shp_rank) {
    return res.status(400).send("missing params");
  }

  // Валидация данных из callback — защита от подделки команд
  if (!isValidNick(shp_nick) || !isValidRank(shp_rank) || !isValidSum(OutSum)) {
    return res.status(400).send("invalid params");
  }

  // Проверка подписи через PASSWORD2 (shp_ в алфавитном порядке)
  const signatureString = `${OutSum}:${InvId}:${PASSWORD2}:shp_nick=${shp_nick}:shp_rank=${shp_rank}`;
  const mySig = crypto
    .createHash("md5")
    .update(signatureString)
    .digest("hex")
    .toUpperCase();

  if (!safeCompare(mySig, SignatureValue.toUpperCase())) {
    console.warn(`⚠️  Bad signature for InvId=${InvId}`);
    return res.status(400).send("bad sign");
  }

  // Выдаём привилегию через RCON
  try {
    const rcon = await Rcon.connect({
      host: HYRCON_HOST,
      port: HYRCON_PORT,
      password: HYRCON_PASS,
      timeout: 5000,
    });

    // Только whitelist-ранги попадают в команду — инъекция невозможна
    const command = `lp user ${shp_nick} parent add ${shp_rank}`;
    const response = await rcon.send(command);
    await rcon.end();

    console.log(
      `✅ Rank issued: ${shp_rank} → ${shp_nick} | InvId=${InvId} | RCON: ${response}`,
    );
    res.send(`OK${InvId}`); // Robokassa требует именно такой ответ
  } catch (e) {
    console.error(`❌ RCON error for InvId=${InvId}:`, e.message);
    res.status(500).send("rcon error");
  }
});

// =============================================
// Глобальный обработчик ошибок
// =============================================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// =============================================
// ЗАПУСК
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`✅ Allowed ranks: ${ALLOWED_RANKS.join(", ")}`);
});
