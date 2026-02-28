import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Crown, Check, Zap, Package, ChevronRight } from "lucide-react";

// ── BACKEND ──────────────────────────────────────────────────────
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// ── Types ─────────────────────────────────────────────────────────
interface Rank {
  id: string; name: string; tagline: string;
  prices: { month: number; quarter: number; forever: number };
  color: string; icon: string; commands: string[]; perks: string[]; description: string;
}

// ── Data ──────────────────────────────────────────────────────────
const RANKS: Rank[] = [
  { id: "ping", name: "Ping", tagline: "Establish your first connection",
    prices: { month: 0.99, quarter: 2.49, forever: 5.99 }, color: "#60a5fa", icon: "/img/ranks/ping.png",
    description: "The entry point of Pixel. Unique chat presence and survival utilities to get you started on day one.",
    commands: ["/back","/heal","/clearinv","/trash","/afk","/kit ping"],
    perks: ["[Ping] chat prefix","Neon-styled messages","3 Home points","/back — return to death","/heal (5 min CD)","/clearinv & /trash","Kit every 3 days"] },
  { id: "packet", name: "Packet", tagline: "Transmit your presence",
    prices: { month: 1.99, quarter: 4.99, forever: 9.99 }, color: "#34d399", icon: "/img/ranks/packet.png",
    description: "A solid packet of data. Better survival tools and server-wide broadcasting at your fingertips.",
    commands: ["/fly","/freecam","/bc","/ignore","/bonus_packet","/repair","/kit packet"],
    perks: ["[Packet] chat prefix","5 Home points","Flight /fly","Free camera /freecam","Server broadcast /bc","Item repair (5 min CD)","$25K money bonus","All Ping privileges"] },
  { id: "protocol", name: "Protocol", tagline: "Define the rules of engagement",
    prices: { month: 2.99, quarter: 7.99, forever: 14.99 }, color: "#a78bfa", icon: "/img/ranks/protocol.png",
    description: "Follow the protocol. God mode, inventory inspection, and the legendary moonwalk animation.",
    commands: ["/god","/inv","/moonwalk","/neardeath","/seen","/bonus_protocol","/clearchat","/repair all"],
    perks: ["[Protocol] chat prefix","7 Home points","God mode /god","View inventories /inv","Moonwalk animation","/seen — last login","$50K bonus","Repair all items","Custom prefix on Lifetime"] },
  { id: "script", name: "Script", tagline: "Automate your victory",
    prices: { month: 3.99, quarter: 9.99, forever: 19.99 }, color: "#fb923c", icon: "/img/ranks/script.png",
    description: "Write your own destiny. Gamemode switching, global chat clear, and player IP info at a glance.",
    commands: ["/gmc","/gma","/clearchat","/bonus_script","/ipinfo","/kit script"],
    perks: ["[Script] chat prefix","10 Home points","Creative /gmc & Survival /gma","Clear global chat","$100K bonus","Player IP /ipinfo","All previous privileges"] },
  { id: "kernel", name: "Kernel", tagline: "Access the core functionality",
    prices: { month: 5.99, quarter: 14.99, forever: 29.99 }, color: "#f43f5e", icon: "/img/ranks/kernel.png",
    description: "Deep system access. Damage players, grant flight, phase through walls, and teleport by gaze.",
    commands: ["/hurt","/fly (others)","/thru","/jump","/freeze_me","/bonus_kernel"],
    perks: ["[Kernel] chat prefix","15 Home points","Damage players /hurt (30m CD)","Grant others flight (30m CD)","Phase walls /thru","Gaze teleport /jump","$200K bonus","Self-freeze"] },
  { id: "cipher", name: "Cipher", tagline: "Encrypt your movements",
    prices: { month: 7.99, quarter: 19.99, forever: 39.99 }, color: "#8b5cf6", icon: "/img/ranks/cipher.png",
    description: "Unreadable by enemies. God-gift others, surveil inventories, and create your own server warp.",
    commands: ["/god (others)","/freeze","/socialspy","/setwarp","/bonus_cipher"],
    perks: ["[Cipher] chat prefix","25 Home points","God for others (30m CD)","Freeze players","Social spy","Own warp /setwarp","$300K bonus","All previous privileges"] },
  { id: "quantum", name: "Quantum", tagline: "Exist in multiple states",
    prices: { month: 11.99, quarter: 29.99, forever: 59.99 }, color: "#06b6d4", icon: "/img/ranks/quantum.png",
    description: "Bend reality. Full teleport authority, admin chat access, and player moderation rights.",
    commands: ["/tp (full)","/a","/mute","/kick","/kit quantum"],
    perks: ["[Quantum] chat prefix","Full teleport /tp","Admin chat /a","Mute players /mute","Kick players /kick","Quantum particle effect","All previous privileges"] },
  { id: "core", name: "Core", tagline: "The heart of the machine",
    prices: { month: 17.99, quarter: 44.99, forever: 89.99 }, color: "#eab308", icon: "/img/ranks/core.png",
    description: "Pure processing power. WorldEdit tools and temporary ban authority — near-total server control.",
    commands: ["/set","/pos1","/pos2","/tempban","/kit core"],
    perks: ["[Core] chat prefix","Unlimited homes","WorldEdit /set /pos1 /pos2","Temporary ban /tempban","Core aura effect","All previous privileges"] },
  { id: "overclock", name: "Overclock", tagline: "Push beyond the limits",
    prices: { month: 24.99, quarter: 59.99, forever: 129.99 }, color: "#ec4899", icon: "/img/ranks/overclock.png",
    description: "Running at maximum frequency. Unmatched privileges and supreme server priority.",
    commands: ["/kit overclock","/fly","/god","/sudo","/top","/v"],
    perks: ["[Overclock] chat prefix","Force commands /sudo","Teleport top /top","Max server priority","Overclocked kit drops","Overclock particle effect"] },
  { id: "singularity", name: "Singularity", tagline: "Become one with the system",
    prices: { month: 49.99, quarter: 119.99, forever: 249.99 }, color: "#f87171", icon: "/img/ranks/singularity.png",
    description: "The final tier. Every command on the server, VIP event access, and a direct line to the developers.",
    commands: ["/kit singularity","ALL COMMANDS"],
    perks: ["[Singularity] chat prefix","Every server command","VIP event access","Unique particle","Direct dev support","Custom Discord role"] },
];

const PACKS = [
  { id: "s1", name: "Novice", label: "STARTER", tagline: "The perfect first step", price: 5, color: "#60a5fa", img: "/img/s1.png", kitImg: "/img/k1.png",
    description: "Everything a new player needs to hit the ground running on Pixel. Ping rank for 3 months, a hand-crafted starter kit, and cosmetic items to stand out from day one.",
    kitDescription: "Full set of iron gear, 64 food, starter tools, and 500 coins — enough to establish yourself in the first hours of play.",
    includes: ["Ping rank — 3 Months","Exclusive Novice Kit","Novice cosmetic set","500 starter coins"] },
  { id: "s2", name: "Pro", label: "POPULAR", tagline: "Hit the ground running", price: 12, color: "#34d399", img: "/img/s2.png", kitImg: "/img/k2.png",
    description: "The most popular choice. Packet rank for life means you never pay again — plus flight, freecam, and a powerful kit that gives you a real edge on the server.",
    kitDescription: "Diamond tools, enchanted armor, a full food stack, 2,500 coins, and an exclusive cosmetic banner — a serious advantage from minute one.",
    includes: ["Packet rank — Lifetime","Exclusive Pro Kit","Pro cosmetic set","2,500 starter coins"] },
  { id: "s3", name: "Sponsor", label: "BEST VALUE", tagline: "Support and dominate", price: 24, color: "#a78bfa", img: "/img/s3.png", kitImg: "/img/sk3.png",
    description: "The ultimate starter bundle. Protocol rank for life grants god mode, inventory inspection, the moonwalk — plus the richest kit on the server.",
    kitDescription: "Full enchanted netherite gear, elytra, 7,500 coins, and a unique Sponsor cosmetic title that marks you as a true backer.",
    includes: ["Protocol rank — Lifetime","Exclusive Sponsor Kit","Sponsor cosmetic set","7,500 starter coins"] },
];

const COSMETICS = [
  { id: "pet_ember", name: "Ember Dragon", type: "Pet", price: 4.99, color: "#f43f5e", icon: "/img/cosmetics/ember_dragon.png", rarity: "Legendary",
    description: "A miniature dragon companion that trails ember particles in your wake." },
];

const PERIOD_LABELS = { month: "1 Month", quarter: "3 Months", forever: "Lifetime" };
const PERIODS = ["month", "quarter", "forever"] as const;
type Period = typeof PERIODS[number];

// ── Component ─────────────────────────────────────────────────────
export const Donate: React.FC = () => {
  const [rankModal, setRankModal]   = useState<Rank | null>(null);
  const [packModal, setPackModal]   = useState<typeof PACKS[0] | null>(null);
  const [bpModal, setBpModal]       = useState(false);
  const [period, setPeriod]         = useState<Period>("forever");
  const [mPeriod, setMPeriod]       = useState<Period>("forever");
  const [tab, setTab]               = useState<"ranks"|"cosmetics">("ranks");
  const [nick, setNick]             = useState("");
  const [nickError, setNickError]   = useState("");
  const [loading, setLoading]       = useState(false);

  const pswRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill]             = useState({ x: 0, w: 0 });
  const mpRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [mpill, setMpill]           = useState({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const el = pswRef.current[PERIODS.indexOf(period)];
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [period, tab]);

  useEffect(() => {
    if (rankModal) {
      const t = setTimeout(() => {
        const el = mpRef.current[PERIODS.indexOf(mPeriod)];
        if (el) setMpill({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
      }, 10);
      return () => clearTimeout(t);
    }
  }, [mPeriod, rankModal]);

  useEffect(() => {
    if (rankModal || packModal || bpModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [rankModal, packModal, bpModal]);

  const openRank = (r: Rank) => { setRankModal(r); setMPeriod(period); setNick(""); setNickError(""); };
  const openPack = (p: typeof PACKS[0]) => { setPackModal(p); setNick(""); setNickError(""); };
  const openBp = () => { setBpModal(true); setNick(""); setNickError(""); };
  const closeAllModals = () => { setRankModal(null); setPackModal(null); setBpModal(false); };

  const validateNickname = (name: string) => {
    if (!name.trim()) return "Nickname is required";
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(name)) return "Invalid format (3-16 chars, a-z, 0-9, _)";
    return "";
  };

  // ── Real purchase → Robokassa redirect ────────────────────────
  const handlePurchase = async (itemId: string, itemType: string, price: number) => {
    const error = validateNickname(nick);
    if (error) { setNickError(error); return; }
    setNickError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, itemId, itemType, price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initialization failed");
      window.location.href = data.url; // redirect to Robokassa
    } catch (err: any) {
      alert("Payment error: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;--s3:#14141e;--w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);--w3:rgba(255,255,255,.18);--t1:#eaeaf4;--t2:#76769a;--t3:#40405a;--fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace;}
html,body{background:var(--bg);color:var(--t1);font-family:var(--fb);-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--w2);border-radius:2px}
.store{min-height:100vh;background:var(--bg);position:relative}
.store::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");background-size:300px 300px;opacity:.018}
.store::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(var(--w) 1px,transparent 1px),linear-gradient(90deg,var(--w) 1px,transparent 1px);background-size:80px 80px;opacity:.5}
.z1{position:relative;z-index:1}.cx{max-width:1180px;margin:0 auto;padding:0 28px}
.hero{padding:88px 0 56px}.hero-layout{display:flex;align-items:flex-end;justify-content:space-between}
.hero-text{flex:1;min-width:0}
.hero-img-wrap{flex-shrink:0;position:relative;width:320px;margin-bottom:-56px;display:flex;align-items:flex-end;justify-content:center;pointer-events:none}
@media(max-width:760px){.hero-img-wrap{display:none}}
.hero-char{width:290px;height:auto;object-fit:contain;position:relative;z-index:2;filter:drop-shadow(0 32px 48px rgba(0,0,0,.75));animation:hfloat 4s ease-in-out infinite}
@keyframes hfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.hero-glow{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);width:180px;height:50px;border-radius:50%;background:rgba(124,92,252,.18);filter:blur(26px);z-index:1;animation:gpulse 4s ease-in-out infinite}
@keyframes gpulse{0%,100%{opacity:.5;transform:translateX(-50%) scaleX(1)}50%{opacity:.85;transform:translateX(-50%) scaleX(1.15)}}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--fm);font-size:10px;color:var(--t3);letter-spacing:.15em;text-transform:uppercase;margin-bottom:20px}
.eyebrow-line{width:22px;height:1px;background:var(--w3)}
.hero-h{font-family:var(--fh);font-size:clamp(40px,6.5vw,72px);font-weight:800;line-height:.94;letter-spacing:-.035em;margin-bottom:20px;color:var(--t1)}
.hero-h .dim{color:rgba(255,255,255,.15)}.hero-p{font-size:14px;color:var(--t2);line-height:1.8;max-width:360px}
.snav{display:flex;border-bottom:1px solid var(--w);margin-bottom:52px}
.snav-btn{font-family:var(--fb);font-size:13px;font-weight:600;padding:13px 22px;border:none;background:transparent;cursor:pointer;color:var(--t3);position:relative;transition:color .2s}
.snav-btn.on{color:var(--t1)}.snav-btn.on::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:var(--t1)}
.bp{border:1px solid var(--w);border-radius:14px;overflow:hidden;background:var(--s1);margin-bottom:72px;cursor:pointer;transition:border-color .3s}
.bp:hover{border-color:rgba(124,92,252,.35)}.bp-line{height:1px;background:rgba(124,92,252,.7)}
.bp-layout{display:grid;grid-template-columns:1fr 200px}
@media(max-width:640px){.bp-layout{grid-template-columns:1fr}}
.bp-left{padding:36px 40px}
.bp-right{border-left:1px solid var(--w);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:32px 24px}
@media(max-width:640px){.bp-right{border-left:none;border-top:1px solid var(--w);padding:24px}}
.bp-chip{display:inline-flex;align-items:center;gap:5px;font-family:var(--fm);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--t3);border:1px solid var(--w2);border-radius:4px;padding:3px 9px;margin-bottom:14px}
.bp-h{font-family:var(--fh);font-size:30px;font-weight:800;letter-spacing:-.03em;margin-bottom:10px}
.bp-p{font-size:13px;color:var(--t2);line-height:1.75;max-width:440px;margin-bottom:22px}
.bp-tags{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:26px}
.bp-tag{display:flex;align-items:center;gap:7px;border:1px solid var(--w);border-radius:5px;padding:5px 12px;font-size:11px;color:var(--t2)}
.bp-dot{width:4px;height:4px;border-radius:50%;background:rgba(124,92,252,.85);flex-shrink:0}
.bp-cta{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:7px;cursor:pointer;border:1px solid rgba(124,92,252,.3);background:rgba(124,92,252,.09);font-family:var(--fb);font-size:13px;font-weight:600;color:#c4b5fd;transition:all .2s}
.bp-cta:hover{background:rgba(124,92,252,.18);border-color:rgba(124,92,252,.55)}
.bp-img{width:76px;height:76px;object-fit:contain}
.bp-price{font-family:var(--fh);font-size:48px;font-weight:800;letter-spacing:-.05em;color:var(--t1)}
.bp-plbl{font-family:var(--fm);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);margin-top:3px;text-align:center}
.sh{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:18px}
.sh-title{font-family:var(--fh);font-size:17px;font-weight:700;letter-spacing:-.015em}
.sh-sub{font-family:var(--fm);font-size:10px;color:var(--t3);margin-top:5px;letter-spacing:.06em}
.div{height:1px;background:var(--w);margin-bottom:26px}
.psw{position:relative;display:inline-flex;background:var(--s2);border:1px solid var(--w);border-radius:7px;padding:3px;gap:2px}
.psw-bg{position:absolute;top:3px;bottom:3px;left:0;background:var(--s3);border:1px solid var(--w2);border-radius:5px;pointer-events:none;transition:transform .45s cubic-bezier(.34,1.4,.64,1),width .35s cubic-bezier(.34,1.4,.64,1)}
.psw-btn{position:relative;z-index:1;padding:7px 16px;border:none;background:transparent;cursor:pointer;font-family:var(--fb);font-size:12px;font-weight:600;border-radius:4px;transition:color .25s;white-space:nowrap}
.sp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:72px}
@media(max-width:760px){.sp-grid{grid-template-columns:1fr}}
.sp-card{background:var(--s1);border:1px solid var(--w);border-radius:14px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;transition:border-color .25s,transform .32s cubic-bezier(.34,1.2,.64,1)}
.sp-card:hover{transform:translateY(-5px)}.sp-card:hover .sp-cover{transform:scale(1.04)}
.sp-img-zone{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--s2);border-bottom:1px solid var(--w)}
.sp-glow{position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.18;transition:opacity .3s}
.sp-card:hover .sp-glow{opacity:.28}
.sp-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:2;transition:transform .55s cubic-bezier(.25,.46,.45,.94)}
.sp-img-fade{position:absolute;bottom:0;left:0;right:0;height:60px;z-index:3;pointer-events:none;background:linear-gradient(to bottom,transparent,var(--s1))}
.sp-body{padding:20px 22px 24px;flex:1;display:flex;flex-direction:column}
.sp-label{display:inline-flex;align-items:center;align-self:flex-start;font-family:var(--fm);font-size:9px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;padding:3px 8px;border-radius:4px;border:1px solid;margin-bottom:10px}
.sp-name{font-family:var(--fh);font-size:22px;font-weight:800;letter-spacing:-.025em;margin-bottom:3px}
.sp-tagline{font-size:11px;color:var(--t3);margin-bottom:18px}
.sp-price{font-family:var(--fh);font-size:40px;font-weight:800;letter-spacing:-.04em;line-height:1;margin-bottom:18px}
.sp-price sup{font-size:17px;vertical-align:top;margin-top:9px;display:inline-block;opacity:.6}
.sp-list{display:flex;flex-direction:column;gap:9px;flex:1;margin-bottom:20px}
.sp-item{display:flex;align-items:center;gap:9px;font-size:12px;color:var(--t2)}
.sp-btn{width:100%;padding:12px;border-radius:7px;border:1px solid;font-family:var(--fb);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;background:transparent;transition:opacity .2s}
.sp-btn:hover{opacity:.75}
.rg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:72px}
.rc{background:var(--s1);border:1px solid var(--w);border-radius:12px;padding:20px;cursor:pointer;position:relative;overflow:hidden;display:flex;flex-direction:column;transition:border-color .25s,transform .32s cubic-bezier(.34,1.2,.64,1)}
.rc:hover{transform:translateY(-4px)}
.rc-bar{position:absolute;top:0;left:0;right:0;height:1px}
.rc-img{width:40px;height:40px;object-fit:contain;margin-bottom:14px}
.rc-name{font-family:var(--fh);font-size:14px;font-weight:800;letter-spacing:-.01em;margin-bottom:3px}
.rc-tag{font-size:11px;color:var(--t3);line-height:1.55;margin-bottom:16px;min-height:34px}
.rc-price{font-family:var(--fh);font-size:26px;font-weight:800;letter-spacing:-.03em;margin-top:auto;margin-bottom:14px}
.rc-period{font-family:var(--fm);font-size:10px;color:var(--t3)}
.rc-cta{width:100%;padding:9px;border-radius:7px;border:1px solid var(--w);background:transparent;font-family:var(--fb);font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;color:var(--t3);transition:border-color .2s,color .2s}
.rc:hover .rc-cta{border-color:var(--w2);color:var(--t2)}
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:72px}
.cc{background:var(--s1);border:1px solid var(--w);border-radius:14px;overflow:hidden;cursor:pointer;transition:border-color .25s,transform .32s cubic-bezier(.34,1.2,.64,1)}
.cc:hover{transform:translateY(-5px)}
.cc-img-zone{position:relative;background:var(--s2);border-bottom:1px solid var(--w);display:flex;align-items:center;justify-content:center;padding:32px 24px 28px;min-height:155px}
.cc-glow{position:absolute;width:80px;height:80px;border-radius:50%;filter:blur(32px);opacity:.2}
.cc-img{width:72px;height:72px;object-fit:contain;position:relative;z-index:1}
.cc-rarity{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-family:var(--fm);font-size:8px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;padding:2px 8px;border-radius:3px;border:1px solid;white-space:nowrap}
.cc-body{padding:18px}
.cc-type{font-family:var(--fm);font-size:9px;letter-spacing:.13em;text-transform:uppercase;color:var(--t3);margin-bottom:5px}
.cc-name{font-family:var(--fh);font-size:16px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
.cc-desc{font-size:11px;color:var(--t3);line-height:1.65;margin-bottom:14px}
.cc-price{font-family:var(--fh);font-size:22px;font-weight:800;letter-spacing:-.03em;margin-bottom:12px}
.cc-btn{width:100%;padding:10px;border-radius:7px;border:1px solid;font-family:var(--fb);font-size:12px;font-weight:600;cursor:pointer;background:transparent;transition:opacity .2s}
.cc-btn:hover{opacity:.7}
.soon{background:var(--s1);border:1px solid var(--w);border-radius:14px;min-height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:var(--t3)}
.soon-lbl{font-family:var(--fm);font-size:9px;letter-spacing:.14em;text-transform:uppercase}
.ov{position:fixed;inset:0;z-index:800;background:rgba(0,0,0,.9);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fo .18s ease}
@keyframes fo{from{opacity:0}to{opacity:1}}
@keyframes su{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
.modal{background:var(--s1);border:1px solid var(--w);border-radius:18px;width:100%;max-width:680px;max-height:92vh;overflow-y:auto;animation:su .28s cubic-bezier(.34,1.1,.64,1);scrollbar-width:none}
.modal::-webkit-scrollbar{display:none}.m-stripe{height:1px;border-radius:18px 18px 0 0}
.m-body{display:grid;grid-template-columns:1fr 190px}
@media(max-width:560px){.m-body{grid-template-columns:1fr}}
.m-left{padding:26px;overflow:hidden}
.m-right{border-left:1px solid var(--w);padding:22px 16px;display:flex;flex-direction:column;align-items:center;gap:12px;background:var(--s2);position:sticky;top:0;align-self:start;border-radius:0 18px 18px 0;min-height:200px}
@media(max-width:560px){.m-right{display:none}}
.m-right-img{width:120px;height:120px;object-fit:contain}
.m-right-lbl{font-family:var(--fm);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);text-align:center}
.m-right-price{font-family:var(--fh);font-size:28px;font-weight:800;letter-spacing:-.03em;text-align:center}
.m-right-period{font-family:var(--fm);font-size:9px;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;text-align:center;margin-top:2px}
.m-sep{width:100%;height:1px;background:var(--w)}
.m-top{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:20px}
.m-close{background:var(--s2);border:1px solid var(--w);border-radius:7px;padding:6px;cursor:pointer;color:var(--t3);line-height:1;flex-shrink:0;transition:border-color .2s}
.m-close:hover{border-color:var(--w2);color:var(--t2)}
.m-rname{font-family:var(--fh);font-size:24px;font-weight:800;letter-spacing:-.03em}
.m-rtag{font-size:12px;color:var(--t3);margin-top:3px}
.m-desc{font-size:13px;color:var(--t2);line-height:1.75;padding:13px 15px;background:var(--s2);border:1px solid var(--w);border-radius:8px;margin-bottom:20px}
.m-lbl{font-family:var(--fm);font-size:9px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--t3);margin-bottom:9px}
.m-pg{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:20px}
.m-ind{position:absolute;top:0;left:0;border-radius:8px;z-index:0;pointer-events:none;transition:transform .45s cubic-bezier(.34,1.4,.64,1),width .35s cubic-bezier(.34,1.4,.64,1),height .35s ease}
.m-pbtn{position:relative;z-index:1;padding:12px 8px;border-radius:8px;cursor:pointer;font-family:var(--fb);border:1px solid var(--w);background:var(--s2);text-align:center;transition:color .22s,border-color .22s}
.m-pnum{font-family:var(--fh);font-size:18px;font-weight:800;letter-spacing:-.03em}
.m-plbl{font-size:10px;color:var(--t3);margin-top:2px}
.m-perks{display:flex;flex-direction:column;gap:2px;margin-bottom:18px}
.m-perk{display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--s2);border-radius:7px;font-size:13px}
.m-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0}
.m-cmds{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
.m-cmd{font-family:var(--fm);font-size:11px;padding:4px 9px;background:var(--s2);border:1px solid var(--w);border-radius:5px}
.nick-wrap{margin-bottom:16px}
.nick-lbl{font-family:var(--fm);font-size:9px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--t3);margin-bottom:7px;display:flex;justify-content:space-between}
.nick-error{color:#ef4444;font-weight:bold}
.nick-inp{width:100%;padding:11px 13px;border-radius:8px;background:var(--s2);border:1px solid var(--w2);color:var(--t1);font-family:var(--fb);font-size:14px;font-weight:500;outline:none;transition:border-color .2s}
.nick-inp::placeholder{color:var(--t3)}.nick-inp:focus{border-color:var(--w3)}.nick-inp.invalid{border-color:rgba(239,68,68,.5)}
.m-buy{width:100%;padding:14px;border-radius:10px;border:none;font-family:var(--fh);font-size:16px;font-weight:800;letter-spacing:-.01em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;color:#000;transition:filter .2s,opacity .2s}
.m-buy:hover:not(:disabled){filter:brightness(1.1)}.m-buy:disabled{opacity:.5;cursor:not-allowed}
.pm-body{display:grid;grid-template-columns:1fr 220px}
@media(max-width:580px){.pm-body{grid-template-columns:1fr}}
.pm-right{border-left:1px solid var(--w);display:flex;flex-direction:column;align-items:stretch;background:var(--s2);border-radius:0 18px 18px 0;overflow:hidden;position:sticky;top:0;align-self:start}
.pm-kit-zone{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:var(--s3);border-bottom:1px solid var(--w);flex-shrink:0}
.pm-kit-glow{position:absolute;inset:0;opacity:.2;pointer-events:none;z-index:1}
.pm-kit-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:2;transition:transform .5s cubic-bezier(.25,.46,.45,.94)}
.pm-kit-img:hover{transform:scale(1.05)}
.pm-kit-label{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-family:var(--fm);font-size:8px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:3px 10px;border-radius:4px;border:1px solid;z-index:3;white-space:nowrap;background:rgba(0,0,0,.5);backdrop-filter:blur(6px)}
.pm-right-info{padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px}
@media(max-width:580px){.pm-right{display:none}}
.rc,.sp-card,.cc{animation:ci .4s ease both}
@keyframes ci{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
`}</style>

      <div className="store">
        <div className="z1">
          <div className="cx">
            <div className="hero">
              <div className="hero-layout">
                <div className="hero-text">
                  <div className="eyebrow"><div className="eyebrow-line" />Official Store<div className="eyebrow-line" /></div>
                  <h1 className="hero-h">Power up your<br /><span className="dim">Pixel</span> account</h1>
                  <p className="hero-p">Support the Hytale server, unlock real advantages, and make your presence felt. Every purchase funds development.</p>
                </div>
                <div className="hero-img-wrap"><div className="hero-glow" /><img className="hero-char" src="/img/herodonate.png" alt="hero" /></div>
              </div>
            </div>

            <nav className="snav">
              <button className={`snav-btn${tab==="ranks"?" on":""}`} onClick={() => setTab("ranks")}>Ranks & Packs</button>
              <button className={`snav-btn${tab==="cosmetics"?" on":""}`} onClick={() => setTab("cosmetics")}>Cosmetics</button>
            </nav>

            {tab === "ranks" && (
              <>
                <div className="bp" onClick={openBp}>
                  <div className="bp-line" />
                  <div className="bp-layout">
                    <div className="bp-left">
                      <div className="bp-chip"><Zap size={9} />Season Pass</div>
                      <h2 className="bp-h">Battle Pass</h2>
                      <p className="bp-p">Unlock 50+ tiers of exclusive seasonal rewards, cosmetics, and challenges. The highest-value purchase on the server — full stop.</p>
                      <div className="bp-tags">{["50+ tier rewards","Exclusive BP cosmetics","XP multiplier","Seasonal challenges","Season support badge"].map(t => <div key={t} className="bp-tag"><div className="bp-dot" />{t}</div>)}</div>
                      <button className="bp-cta"><Crown size={13} />Get Battle Pass<ArrowRight size={13} /></button>
                    </div>
                    <div className="bp-right">
                      <img className="bp-img" src="/img/ranks/bp.png" alt="bp" />
                      <div><div className="bp-price">$7</div><div className="bp-plbl">One-time · Current Season</div></div>
                    </div>
                  </div>
                </div>

                <div className="sh"><div><div className="sh-title">Starter Packs</div><div className="sh-sub">// Bundled value — smartest first purchase</div></div></div>
                <div className="div" />
                <div className="sp-grid">
                  {PACKS.map((pk, idx) => (
                    <div key={pk.id} className="sp-card" style={{ animationDelay: `${idx*80}ms` }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = pk.color+"55"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--w)"}
                      onClick={() => openPack(pk)}>
                      <div className="sp-img-zone">
                        <div className="sp-glow" style={{ background: `radial-gradient(ellipse at 50% 60%, ${pk.color}55 0%, transparent 70%)` }} />
                        <img className="sp-cover" src={pk.img} alt={pk.name} />
                        <div className="sp-img-fade" />
                      </div>
                      <div className="sp-body">
                        <span className="sp-label" style={{ color: pk.color, borderColor: pk.color+"44", background: pk.color+"10" }}>{pk.label}</span>
                        <div className="sp-name">{pk.name}</div>
                        <div className="sp-tagline">{pk.tagline}</div>
                        <div className="sp-price" style={{ color: pk.color }}><sup>$</sup>{pk.price}</div>
                        <div className="sp-list">{pk.includes.map(it => <div key={it} className="sp-item"><Check size={11} color={pk.color} strokeWidth={2.5} style={{ flexShrink: 0 }} />{it}</div>)}</div>
                        <button className="sp-btn" style={{ borderColor: pk.color+"44", color: pk.color }}>View Pack<ArrowRight size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sh">
                  <div><div className="sh-title">Server Ranks</div><div className="sh-sub">// Permanent account upgrades</div></div>
                  <div className="psw">
                    <div className="psw-bg" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
                    {PERIODS.map((p, i) => (
                      <button key={p} ref={el => { pswRef.current[i] = el; }} onClick={() => setPeriod(p)} className="psw-btn" style={{ color: period===p ? "var(--t1)" : "var(--t2)" }}>{PERIOD_LABELS[p]}</button>
                    ))}
                  </div>
                </div>
                <div className="div" />
                <div className="rg">
                  {RANKS.map((r, idx) => (
                    <div key={r.id} className="rc" style={{ animationDelay: `${idx*40}ms` }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = r.color+"40"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--w)"}
                      onClick={() => openRank(r)}>
                      <div className="rc-bar" style={{ background: r.color }} />
                      <img className="rc-img" src={r.icon} alt={r.name} />
                      <div className="rc-name">{r.name}</div>
                      <div className="rc-tag">{r.tagline}</div>
                      <div className="rc-price" style={{ color: r.color }}>${r.prices[period]}<div className="rc-period">/ {period==="month"?"month":period==="quarter"?"3 months":"lifetime"}</div></div>
                      <button className="rc-cta">View Details<ChevronRight size={11} /></button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "cosmetics" && (
              <>
                <div className="sh"><div><div className="sh-title">Cosmetics</div><div className="sh-sub">// Purely visual · no gameplay impact</div></div></div>
                <div className="div" />
                <div className="cg">
                  {COSMETICS.map((c, idx) => (
                    <div key={c.id} className="cc" style={{ animationDelay: `${idx*60}ms` }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = c.color+"44"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--w)"}
                      onClick={() => { setNick(""); setNickError(""); }}>
                      <div className="cc-img-zone">
                        <div className="cc-glow" style={{ background: c.color }} />
                        <img className="cc-img" src={c.icon} alt={c.name} />
                        <div className="cc-rarity" style={{ color: c.color, borderColor: c.color+"40", background: c.color+"0c" }}>{c.rarity}</div>
                      </div>
                      <div className="cc-body">
                        <div className="cc-type">{c.type}</div>
                        <div className="cc-name">{c.name}</div>
                        <div className="cc-desc">{c.description}</div>
                        <div className="cc-price" style={{ color: c.color }}>${c.price}</div>
                        <button className="cc-btn" disabled={loading} style={{ borderColor: c.color+"44", color: c.color }} onClick={() => handlePurchase(c.id, "cosmetic", c.price)}>Buy Cosmetic</button>
                      </div>
                    </div>
                  ))}
                  {[0,1,2].map(i => <div key={i} className="soon"><Package size={20} strokeWidth={1.2} /><div className="soon-lbl">Coming Soon</div></div>)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RANK MODAL */}
      {rankModal && (
        <div className="ov" onClick={closeAllModals}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-stripe" style={{ background: rankModal.color }} />
            <div className="m-body">
              <div className="m-left">
                <div className="m-top">
                  <div><div className="m-rname" style={{ color: rankModal.color }}>{rankModal.name}</div><div className="m-rtag">{rankModal.tagline}</div></div>
                  <button className="m-close" onClick={closeAllModals}><X size={15} /></button>
                </div>
                <div className="m-desc">{rankModal.description}</div>
                <div className="m-lbl">Select duration</div>
                <div className="m-pg">
                  <div className="m-ind" style={{ transform: `translate(${mpill.x}px,${mpill.y}px)`, width: mpill.w, height: mpill.h, background: rankModal.color+"12", border: `1px solid ${rankModal.color}40` }} />
                  {PERIODS.map((p, i) => (
                    <button key={p} ref={el => { mpRef.current[i] = el; }} onClick={() => setMPeriod(p)} className="m-pbtn" style={{ color: mPeriod===p ? rankModal.color : "var(--t2)", borderColor: mPeriod===p ? "transparent" : undefined }}>
                      <div className="m-pnum">${rankModal.prices[p]}</div><div className="m-plbl">{PERIOD_LABELS[p]}</div>
                    </button>
                  ))}
                </div>
                <div className="m-lbl">Included features</div>
                <div className="m-perks">{rankModal.perks.map(pk => <div key={pk} className="m-perk"><div className="m-dot" style={{ background: rankModal.color }} /><span style={{ color: "var(--t1)" }}>{pk}</span></div>)}</div>
                <div className="m-lbl">Commands</div>
                <div className="m-cmds">{rankModal.commands.map(cmd => <code key={cmd} className="m-cmd" style={{ color: rankModal.color }}>{cmd}</code>)}</div>
                <div className="nick-wrap">
                  <label className="nick-lbl"><span>Your Hytale nickname</span>{nickError && <span className="nick-error">{nickError}</span>}</label>
                  <input className={`nick-inp ${nickError?"invalid":""}`} placeholder="Enter your nickname..." value={nick} onChange={e => { setNick(e.target.value); setNickError(""); }} style={{ borderColor: nick && !nickError ? rankModal.color+"55" : undefined }} />
                </div>
                <button className="m-buy" disabled={loading || !nick.trim()} onClick={() => handlePurchase(`${rankModal.id}_${mPeriod}`, "rank", rankModal.prices[mPeriod])} style={{ background: rankModal.color }}>
                  <Crown size={14} />{loading ? "Redirecting to payment..." : `Purchase ${rankModal.name} · $${rankModal.prices[mPeriod]}`}
                </button>
              </div>
              <div className="m-right">
                <img className="m-right-img" src={rankModal.icon} alt={rankModal.name} />
                <div className="m-right-lbl">{rankModal.name} Rank</div>
                <div className="m-sep" />
                <div style={{ marginTop: "auto", width: "100%", textAlign: "center" }}>
                  <div className="m-right-price" style={{ color: rankModal.color }}>${rankModal.prices[mPeriod]}</div>
                  <div className="m-right-period">{PERIOD_LABELS[mPeriod]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PACK MODAL */}
      {packModal && (
        <div className="ov" onClick={closeAllModals}>
          <div className="modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="m-stripe" style={{ background: packModal.color }} />
            <div className="pm-body">
              <div className="m-left">
                <div className="m-top">
                  <div><div className="m-rname" style={{ color: packModal.color }}>{packModal.name} Pack</div><div className="m-rtag">{packModal.tagline}</div></div>
                  <button className="m-close" onClick={closeAllModals}><X size={15} /></button>
                </div>
                <div className="m-desc">{packModal.description}</div>
                <div className="m-lbl">Kit contents</div>
                <div className="m-desc" style={{ marginBottom: 20 }}>{packModal.kitDescription}</div>
                <div className="m-lbl">What's included</div>
                <div className="m-perks" style={{ marginBottom: 20 }}>{packModal.includes.map(it => <div key={it} className="m-perk"><div className="m-dot" style={{ background: packModal.color }} /><span style={{ color: "var(--t1)" }}>{it}</span></div>)}</div>
                <div className="nick-wrap">
                  <label className="nick-lbl"><span>Your Hytale nickname</span>{nickError && <span className="nick-error">{nickError}</span>}</label>
                  <input className={`nick-inp ${nickError?"invalid":""}`} placeholder="Enter your nickname..." value={nick} onChange={e => { setNick(e.target.value); setNickError(""); }} style={{ borderColor: nick && !nickError ? packModal.color+"55" : undefined }} />
                </div>
                <button className="m-buy" disabled={loading || !nick.trim()} onClick={() => handlePurchase(packModal.id, "pack", packModal.price)} style={{ background: packModal.color, color: "#000" }}>
                  <Package size={14} />{loading ? "Redirecting to payment..." : `Purchase ${packModal.name} Pack · $${packModal.price}`}
                </button>
              </div>
              <div className="pm-right">
                <div className="pm-kit-zone">
                  <div className="pm-kit-glow" style={{ background: `radial-gradient(ellipse at 50% 50%, ${packModal.color}60 0%, transparent 70%)` }} />
                  <img className="pm-kit-img" src={packModal.kitImg} alt="Kit" />
                  <div className="pm-kit-label" style={{ color: packModal.color, borderColor: packModal.color+"50" }}>Exclusive Kit</div>
                </div>
                <div className="pm-right-info">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={packModal.img} alt={packModal.name} style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "var(--fh)", fontSize: 13, fontWeight: 800, color: packModal.color, letterSpacing: "-.015em" }}>{packModal.name} Pack</div>
                      <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--t3)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 2 }}>{packModal.includes[0]}</div>
                    </div>
                  </div>
                  <div className="m-sep" />
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div className="m-right-price" style={{ color: packModal.color }}>${packModal.price}</div>
                    <div className="m-right-period">One-time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BP MODAL */}
      {bpModal && (
        <div className="ov" onClick={closeAllModals}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-stripe" style={{ background: "rgba(124,92,252,.8)" }} />
            <div className="m-body">
              <div className="m-left">
                <div className="m-top">
                  <div><div className="m-rname" style={{ color: "#b4a4ff" }}>Battle Pass</div><div className="m-rtag">Current Season · One-time purchase</div></div>
                  <button className="m-close" onClick={closeAllModals}><X size={15} /></button>
                </div>
                <div className="m-desc">Unlock 50+ tiers of exclusive seasonal rewards — cosmetics, currency bonuses, unique challenges, and the season support badge. Once purchased, it's yours for the entire season.</div>
                <div className="m-lbl">What you get</div>
                <div className="m-perks" style={{ marginBottom: 20 }}>
                  {["50+ tier rewards","Exclusive BP cosmetics per tier","XP multiplier (full season)","Seasonal challenges with prizes","Season support badge in chat","Access to BP-only events"].map(it => (
                    <div key={it} className="m-perk"><div className="m-dot" style={{ background: "#7c5cfc" }} /><span style={{ color: "var(--t1)" }}>{it}</span></div>
                  ))}
                </div>
                <div className="nick-wrap">
                  <label className="nick-lbl"><span>Your Hytale nickname</span>{nickError && <span className="nick-error">{nickError}</span>}</label>
                  <input className={`nick-inp ${nickError?"invalid":""}`} placeholder="Enter your nickname..." value={nick} onChange={e => { setNick(e.target.value); setNickError(""); }} style={{ borderColor: nick && !nickError ? "rgba(124,92,252,.55)" : undefined }} />
                </div>
                <button className="m-buy" disabled={loading || !nick.trim()} onClick={() => handlePurchase("battlepass", "pass", 7)} style={{ background: "#7c5cfc" }}>
                  <Zap size={14} />{loading ? "Redirecting to payment..." : "Purchase Battle Pass · $7"}
                </button>
              </div>
              <div className="m-right">
                <img src="/img/ranks/bp.png" alt="bp" style={{ width: 100, height: 100, objectFit: "contain" }} />
                <div className="m-right-lbl">Battle Pass</div>
                <div className="m-sep" />
                <div style={{ width: "100%", textAlign: "center", marginTop: "auto" }}>
                  <div className="m-right-price" style={{ color: "#b4a4ff" }}>$7</div>
                  <div className="m-right-period">One-time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};