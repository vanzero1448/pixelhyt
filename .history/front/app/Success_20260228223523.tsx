import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Home,
  Package,
  Copy,
  Check,
  Loader,
  ShieldCheck,
} from "lucide-react";
import { Page } from "../types";

const API_URL = ((import.meta as any).env?.VITE_API_URL || "")
  .trim()
  .replace(/\/$/, "");

// Коэффициент конвертации (если API недоступно, будет использоваться 92 руб за 1$)
const DEFAULT_EXCHANGE_RATE = 92;

interface Props {
  onNavigate: (p: Page) => void;
}
interface PurchaseData {
  invId: string;
  nick: string;
  item: string;
  price: string;
  dateStr: string;
  serverIp: string;
}

export const Success: React.FC<Props> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [usdRate, setUsdRate] = useState(DEFAULT_EXCHANGE_RATE);
  const [particles, setParticles] = useState<
    { id: number; x: number; color: string; size: number; delay: number }[]
  >([]);

  const params = new URLSearchParams(window.location.search);
  const invId = params.get("InvId") || params.get("invId") || "";

  // 1. Получаем курс валют и данные платежа
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((res) => {
        if (res.rates && res.rates.RUB) setUsdRate(res.rates.RUB);
      })
      .catch(() => console.log("Using default exchange rate"));

    if (!invId) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/payment-info/${invId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [invId]);

  // Конвертация цены
  const convertToUsd = (rubAmount: string) => {
    const num = parseFloat(rubAmount.replace(/[^\d.]/g, ""));
    if (isNaN(num)) return "0.00";
    return (num / usdRate).toFixed(2);
  };

  useEffect(() => {
    const target = (parseInt(invId || "4821") % 9000) + 1000;
    const step = Math.ceil(target / 50);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCounter(cur);
      if (cur >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [invId]);

  // Генерируем "ледяные" частицы вместо зеленых
  useEffect(() => {
    const colors = ["#38bdf8", "#7dd3fc", "#0ea5e9", "#0284c7", "#e0f2fe"];
    setParticles(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[i % colors.length],
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
      })),
    );
  }, []);

  const serverIp = data?.serverIp || "pixel.my-craft.cc:25612";
  const nick = data?.nick || params.get("nickname") || "Player";
  const item = data?.item || params.get("item") || "Your purchase";
  const rawPrice = data?.price || params.get("OutSum") || "0";
  const priceInUsd = convertToUsd(rawPrice);

  const dateStr =
    data?.dateStr ||
    new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const copy = () => {
    navigator.clipboard.writeText(serverIp).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        
        :root {
          --bg: #030712;
          --ice: #38bdf8;
          --ice-dark: #0284c7;
          --ice-glow: rgba(56, 189, 248, 0.4);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --glass-bg: rgba(15, 23, 42, 0.65);
          --glass-border: rgba(56, 189, 248, 0.2);
          
          --fh: 'Oxanium', sans-serif;
          --fb: 'DM Sans', sans-serif;
          --fm: 'IBM Plex Mono', monospace;
        }

        .suc-page {
          min-height: 100vh;
          background: var(--bg);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px 40px; /* Увеличен верхний паддинг для выпирающего лого */
        }
        
        /* Фон: шум и сетка остались, но адаптированы под темный стиль */
        .suc-page::before {
          content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size:300px; opacity:0.03;
        }
        .suc-page::after {
          content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:linear-gradient(rgba(56,189,248,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.03) 1px,transparent 1px);
          background-size:60px 60px;
        }

        /* Синее морозное свечение на фоне */
        .suc-glow {
          position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
          width: 800px; height: 800px; border-radius:50%; pointer-events:none; z-index:0;
          background: radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 60%);
          animation: gp 5s ease-in-out infinite alternate;
        }
        @keyframes gp { 0% { transform:translate(-50%,-50%) scale(0.9); opacity:0.8; } 100% { transform:translate(-50%,-50%) scale(1.1); opacity:1; } }

        /* Частицы (теперь ледяные) */
        .suc-pt { position:fixed; border-radius:50%; pointer-events:none; z-index:0; animation: fpu linear infinite; }
        @keyframes fpu { 0% { transform:translateY(100vh) scale(0); opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { transform:translateY(-20vh) scale(1.5); opacity:0; } }

        /* Glassmorphism Карточка */
        .suc-card {
          position: relative; z-index: 1;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-top: 1px solid rgba(56, 189, 248, 0.4);
          border-radius: 24px;
          width: 100%; max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(2, 132, 199, 0.1);
          animation: crd 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes crd { from { opacity:0; transform:translateY(40px) scale(0.95); } to { opacity:1; transform:none; } }

        /* Выпирающий Логотип */
        .ice-hero {
          position: absolute;
          top: -50px; left: 50%;
          transform: translateX(-50%);
          display: flex; justify-content: center; align-items: center;
          animation: float 4s ease-in-out infinite;
          z-index: 2;
        }
        .ice-hero img {
          width: 100px; height: 100px; object-fit: contain;
          filter: drop-shadow(0 0 25px var(--ice-glow));
        }
        @keyframes float { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -10px); } }

        .suc-inner { padding: 70px 36px 36px; } /* Паддинг сверху увеличен для логотипа */

        .suc-loader {
          display:flex; align-items:center; justify-content:center; padding: 40px 0; gap:10px;
          font-family:var(--fm); font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:var(--ice);
        }
        .suc-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Типографика */
        .suc-ey { font-family:var(--fm); font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--ice); text-align:center; margin-bottom:8px; animation: fu 0.5s ease 0.3s both; }
        .suc-h { font-family:var(--fh); font-size:clamp(26px, 5vw, 36px); font-weight:800; text-transform: uppercase; letter-spacing:-0.02em; line-height:1; color:var(--text-main); text-align:center; margin-bottom:12px; animation: fu 0.5s ease 0.35s both; 
                 text-shadow: 0 0 15px rgba(255,255,255,0.2); }
        .suc-sub { font-family:var(--fb); font-size:14px; color:var(--text-muted); line-height:1.6; text-align:center; margin:0 auto 28px; animation: fu 0.5s ease 0.4s both; }
        .suc-sub strong { color: #fff; font-weight: 600; }

        /* Линия разделитель */
        .suc-div { height: 1px; background: linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent); margin-bottom: 24px; animation: fi 0.5s ease 0.45s both; }

        /* Блок с чеком (Игровой инвентарь стайл) */
        .suc-rows {
          display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;
          animation: fu 0.5s ease 0.5s both;
        }
        .suc-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 16px; background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 12px;
          transition: background 0.2s;
        }
        .suc-row:hover { background: rgba(56, 189, 248, 0.05); }
        .suc-row-k { font-family:var(--fm); font-size:11px; letter-spacing:0.05em; text-transform:uppercase; color:var(--text-muted); }
        .suc-row-v { font-family:var(--fb); font-size:14px; font-weight:600; color:var(--text-main); text-align:right;}
        .suc-row-v.highlight { color: var(--ice); text-shadow: 0 0 10px rgba(56,189,248,0.4); }
        .suc-row-v.green { display:flex; align-items:center; gap:6px; color: #4ade80; }

        /* Блок с IP */
        .suc-ip {
          display: flex; align-items: center; gap: 12px; padding: 14px 16px;
          background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.3);
          border-radius: 12px; margin-bottom: 28px; animation: fu 0.5s ease 0.55s both;
        }
        .suc-ip-lbl { font-family:var(--fm); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--ice); flex-shrink:0; }
        .suc-ip-val { flex:1; font-family:var(--fm); font-size:13px; font-weight:600; color:#fff; letter-spacing: 0.5px;}

        /* Кнопки */
        .suc-btns { display: flex; flex-direction: column; gap: 10px; animation: fu 0.5s ease 0.6s both; }
        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          border-radius: 12px; font-family: var(--fb); font-weight: 600; font-size: 15px;
          cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); padding: 14px 24px; width: 100%; border: none;
        }
        .btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          color: #fff; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5); filter: brightness(1.1); }
        .btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: var(--text-main); }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .btn-sm { padding: 8px 14px; font-size: 12px; border-radius: 8px; }

        /* Заметка внизу */
        .suc-note {
          display: flex; align-items: flex-start; gap: 12px; padding: 14px;
          background: rgba(255,255,255,0.02); border-radius: 12px; margin-top: 20px;
          animation: fu 0.5s ease 0.65s both;
        }
        .suc-note-icon { color: var(--ice); flex-shrink: 0; animation: pdot 2s ease-in-out infinite; }
        @keyframes pdot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.95); } }
        .suc-note-txt { font-family: var(--fb); font-size: 12px; color: var(--text-muted); line-height: 1.6; }
        .suc-note-txt strong { color: var(--text-main); font-weight: 600; }

        @keyframes fu { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:none; } }
        @keyframes fi { from { opacity:0; } to { opacity:1; } }
      `}</style>

      <div className="suc-glow" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="suc-pt"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDuration: `${6 + p.delay}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="suc-page">
        <div className="suc-card">
          {/* ВЫПИРАЮЩИЙ ЛОГОТИП */}
          <div className="ice-hero">
            <img src="/img/ice.png" alt="Ice Logo" />
          </div>

          <div className="suc-inner">
            {loading ? (
              <div className="suc-loader">
                <Loader size={18} className="suc-spin" /> Fetching loot...
              </div>
            ) : (
              <>
                <div className="suc-ey">// Transaction Verified</div>
                <h1 className="suc-h">Quest Complete!</h1>
                <p className="suc-sub">
                  Awesome, <strong>{nick}</strong>! The magic has been
                  processed. Your items will appear shortly.
                </p>

                <div className="suc-div" />

                <div className="suc-rows">
                  <div className="suc-row">
                    <span className="suc-row-k">Order ID</span>
                    <span className="suc-row-v">#{invId || counter}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Hero</span>
                    <span className="suc-row-v highlight">{nick}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Loot (Item)</span>
                    <span className="suc-row-v">{item}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Amount</span>
                    <span className="suc-row-v">${priceInUsd}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Time</span>
                    <span className="suc-row-v">{dateStr}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Status</span>
                    <span className="suc-row-v green">
                      <ShieldCheck size={14} /> Activated
                    </span>
                  </div>
                </div>

                <div className="suc-ip">
                  <span className="suc-ip-lbl">Realm IP</span>
                  <span className="suc-ip-val">{serverIp}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={copy}
                    style={{ width: "auto", flexShrink: 0 }}
                  >
                    {copied ? (
                      <>
                        <Check size={12} color="#38bdf8" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="suc-btns">
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate(Page.HOME)}
                  >
                    <Home size={18} /> Enter the Realm
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => onNavigate(Page.DONATE)}
                  >
                    <Package size={16} /> View More Loot{" "}
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="suc-note">
                  <div className="suc-note-icon">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--ice)",
                        boxShadow: "0 0 8px var(--ice)",
                        marginTop: 4,
                      }}
                    ></div>
                  </div>
                  <div className="suc-note-txt">
                    Your rank/items will sync in-game within{" "}
                    <strong>5 minutes</strong>. Need help? Message{" "}
                    <strong>@BIaziee</strong> on Telegram.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
