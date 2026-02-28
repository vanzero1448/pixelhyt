import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Home,
  Package,
  Copy,
  Check,
  Loader,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Page } from "../types";

const API_URL = ((import.meta as any).env?.VITE_API_URL || "")
  .trim()
  .replace(/\/$/, "");

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

  useEffect(() => {
    // Ледяные цвета для частиц
    const colors = ["#00f0ff", "#00d0ff", "#33bbff", "#88ddff", "#ffffff"];
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[i % colors.length],
        size: Math.random() * 3 + 2,
        delay: Math.random() * 4,
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
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        
        :root {
          /* ОРИГИНАЛЬНЫЙ ФОН */
          --bg: #07070b;
          
          /* ЦВЕТА КАРТОЧКИ (ICE THEME) */
          --c-bg: #0b0b11;
          --c-panel: #12121a;
          --ice: #00e5ff;
          --ice-glow: rgba(0, 229, 255, 0.5);
          --ice-dim: rgba(0, 229, 255, 0.15);
          --text-main: #f8fafc;
          --text-muted: #8b8b9d;
          
          --fh: 'Oxanium', sans-serif;
          --fb: 'DM Sans', sans-serif;
          --fm: 'IBM Plex Mono', monospace;
        }

        /* ОРИГИНАЛЬНЫЙ ФОН - НЕ ТРОГАТЬ */
        .suc-page {
          min-height: 100vh;
          background: var(--bg);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px 40px;
        }
        .suc-page::before {
          content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size:300px; opacity:0.02;
        }
        .suc-page::after {
          content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
          background-size:80px 80px;
        }

        /* Заменили зеленое свечение на ледяное */
        .suc-glow {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 700px; height: 700px; border-radius: 50%; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse, rgba(0, 229, 255, 0.08) 0%, transparent 65%);
          animation: gp 4s ease-in-out infinite alternate;
        }
        @keyframes gp { 0% { transform:translate(-50%,-50%) scale(0.9); } 100% { transform:translate(-50%,-50%) scale(1.1); } }

        /* Частицы */
        .suc-pt { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; animation: fpu linear infinite; }
        @keyframes fpu { 0% { transform:translateY(100vh) scale(0); opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { transform:translateY(-20vh) scale(1.5); opacity:0; } }

        /* НОВАЯ КРУТАЯ КАРТОЧКА */
        .suc-card {
          position: relative; z-index: 1;
          background: linear-gradient(180deg, var(--c-bg) 0%, #08080c 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          width: 100%; max-width: 500px;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 229, 255, 0.05);
          animation: crd 0.7s cubic-bezier(0.2, 1, 0.3, 1) both;
        }
        @keyframes crd { from { opacity:0; transform:translateY(40px) scale(0.96); } to { opacity:1; transform:none; } }

        /* Верхняя неоновая линия */
        .suc-topbar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, var(--ice), #fff, var(--ice), transparent);
          border-top-left-radius: 20px; border-top-right-radius: 20px;
          box-shadow: 0 0 15px var(--ice);
          z-index: 2;
        }

        /* МЕДАЛЬОН С ЛОГОТИПОМ ICE.PNG */
        .ice-medallion {
          position: absolute;
          top: -45px; left: 50%; transform: translateX(-50%);
          width: 90px; height: 90px;
          background: var(--bg);
          border: 2px solid var(--ice);
          border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
          box-shadow: 0 0 25px var(--ice-dim), inset 0 0 20px var(--ice-dim);
          z-index: 3;
          animation: float-logo 4s ease-in-out infinite;
        }
        .ice-medallion::before {
          content: ''; position: absolute; inset: -6px; border-radius: 50%;
          border: 1px dashed rgba(0, 229, 255, 0.3); animation: spin-dash 10s linear infinite;
        }
        .ice-medallion img {
          width: 55px; height: 55px; object-fit: contain;
          filter: drop-shadow(0 0 10px var(--ice));
        }
        @keyframes float-logo { 0%, 100% { transform: translate(-50%, 0); box-shadow: 0 0 25px var(--ice-dim), inset 0 0 20px var(--ice-dim); } 50% { transform: translate(-50%, -5px); box-shadow: 0 0 35px var(--ice-glow), inset 0 0 25px var(--ice-glow); } }
        @keyframes spin-dash { to { transform: rotate(360deg); } }

        .suc-inner { padding: 60px 32px 36px; display: flex; flex-direction: column; align-items: center; }

        .suc-loader {
          display: flex; align-items: center; gap: 10px; padding: 40px 0;
          font-family: var(--fm); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ice);
        }
        .suc-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Тексты */
        .suc-ey { font-family: var(--fm); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--ice); margin-bottom: 8px; animation: fu 0.4s ease 0.2s both; }
        .suc-h { 
          font-family: var(--fh); font-size: clamp(24px, 5vw, 32px); font-weight: 800; 
          text-transform: uppercase; letter-spacing: -0.02em; color: var(--text-main); 
          margin-bottom: 12px; animation: fu 0.4s ease 0.3s both;
          text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
          text-align: center;
        }
        .suc-sub { font-family: var(--fb); font-size: 14px; color: var(--text-muted); line-height: 1.6; text-align: center; margin-bottom: 24px; animation: fu 0.4s ease 0.4s both; }
        .suc-sub strong { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.4); }

        /* HUD Блок с данными */
        .suc-hud {
          width: 100%; background: var(--c-panel); border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px; padding: 16px; margin-bottom: 24px;
          position: relative; overflow: hidden; animation: fu 0.4s ease 0.5s both;
        }
        /* Декоративная линия сбоку */
        .suc-hud::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--ice); box-shadow: 0 0 10px var(--ice);
        }
        
        .suc-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .suc-row:last-child { border-bottom: none; }
        .suc-row-k { font-family: var(--fm); font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-muted); }
        .suc-row-v { font-family: var(--fm); font-size: 13px; font-weight: 700; color: var(--text-main); text-align: right; }
        .suc-row-v.highlight { color: var(--ice); text-shadow: 0 0 10px var(--ice-glow); }
        
        .status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0, 229, 255, 0.1); border: 1px solid var(--ice-dim);
          padding: 4px 10px; border-radius: 30px; font-size: 11px; font-weight: 700;
          color: var(--ice); text-transform: uppercase; letter-spacing: 0.1em;
          box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.1);
        }

        /* Блок IP Сервера */
        .suc-ip {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          background: #000; border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px; padding: 6px 6px 6px 16px; margin-bottom: 24px;
          transition: border-color 0.3s, box-shadow 0.3s;
          animation: fu 0.4s ease 0.6s both;
        }
        .suc-ip:hover { border-color: var(--ice-dim); box-shadow: 0 0 15px rgba(0, 229, 255, 0.05); }
        .suc-ip-col { display: flex; flex-direction: column; gap: 2px; }
        .suc-ip-lbl { font-family: var(--fm); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #5a5a72; }
        .suc-ip-val { font-family: var(--fm); font-size: 13px; font-weight: 700; color: var(--text-main); }

        /* Кнопки */
        .suc-btns { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; animation: fu 0.4s ease 0.7s both; }
        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          height: 44px; border-radius: 10px; font-family: var(--fh); font-weight: 700; font-size: 13px;
          text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s;
          position: relative; overflow: hidden; border: none;
        }
        /* Главная ледяная кнопка */
        .btn-ice {
          background: var(--ice); color: #000;
          box-shadow: 0 0 15px var(--ice-dim);
        }
        .btn-ice::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg); transition: 0.5s;
        }
        .btn-ice:hover { box-shadow: 0 0 25px var(--ice-glow); transform: translateY(-2px); }
        .btn-ice:hover::after { left: 150%; }

        /* Вторичная кнопка */
        .btn-ghost { background: var(--c-panel); border: 1px solid rgba(255,255,255,0.06); color: var(--text-main); }
        .btn-ghost:hover { background: #1a1a24; border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }
        .btn-sm { height: 32px; padding: 0 14px; border-radius: 6px; font-size: 11px; width: auto; font-family: var(--fm); }

        /* Игровая подсказка внизу */
        .suc-note {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 24px; padding-top: 20px; border-top: 1px dashed rgba(255,255,255,0.05);
          animation: fu 0.4s ease 0.8s both;
        }
        .suc-note-icon { color: var(--ice); animation: pulse-icon 2s infinite; }
        .suc-note-txt { font-family: var(--fb); font-size: 12px; color: #5a5a72; }
        .suc-note-txt strong { color: var(--text-muted); }

        @keyframes pulse-icon { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
        @keyframes fu { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* ОРИГИНАЛЬНОЕ СВЕЧЕНИЕ (цвет изменен на лед) */}
      <div className="suc-glow" />

      {/* ЧАСТИЦЫ */}
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
            animationDuration: `${5 + p.delay}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ОРИГИНАЛЬНАЯ СТРУКТУРА ФОНА */}
      <div className="suc-page">
        <div className="suc-card">
          <div className="suc-topbar" />

          {/* КРУТОЙ МЕДАЛЬОН С ЛОГОТИПОМ */}
          <div className="ice-medallion">
            <img src="/img/ice.png" alt="Ice Logo" />
          </div>

          <div className="suc-inner">
            {loading ? (
              <div className="suc-loader">
                <Loader size={16} className="suc-spin" /> Syncing data...
              </div>
            ) : (
              <>
                <div className="suc-ey">// TRANSACT_OK</div>
                <h1 className="suc-h">Purchase Successful</h1>
                <p className="suc-sub">
                  Welcome to the elite, <strong>{nick}</strong>.<br /> Your
                  items are being teleported to your inventory.
                </p>

                {/* HUD ПАНЕЛЬ ДАННЫХ */}
                <div className="suc-hud">
                  <div className="suc-row">
                    <span className="suc-row-k">Order Ref</span>
                    <span className="suc-row-v">#{invId || counter}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Player</span>
                    <span className="suc-row-v highlight">{nick}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Loot</span>
                    <span className="suc-row-v">{item}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Amount</span>
                    <span className="suc-row-v">${priceInUsd}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Date</span>
                    <span className="suc-row-v">{dateStr}</span>
                  </div>
                  <div
                    className="suc-row"
                    style={{
                      paddingTop: "12px",
                      marginTop: "4px",
                      borderTop: "1px dashed rgba(255,255,255,0.05)",
                    }}
                  >
                    <span className="suc-row-k">Status</span>
                    <span className="status-badge">
                      <ShieldCheck size={12} strokeWidth={2.5} /> Active
                    </span>
                  </div>
                </div>

                {/* БЛОК КОПИРОВАНИЯ IP */}
                <div className="suc-ip">
                  <div className="suc-ip-col">
                    <span className="suc-ip-lbl">Connection IP</span>
                    <span className="suc-ip-val">{serverIp}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={copy}>
                    {copied ? (
                      <>
                        <Check size={12} color="var(--ice)" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* КНОПКИ ДЕЙСТВИЙ */}
                <div className="suc-btns">
                  <button
                    className="btn btn-ghost"
                    onClick={() => onNavigate(Page.DONATE)}
                  >
                    <Package size={16} /> Store
                  </button>
                  <button
                    className="btn btn-ice"
                    onClick={() => onNavigate(Page.HOME)}
                  >
                    Play Now <ArrowRight size={16} />
                  </button>
                </div>

                {/* ПОДСКАЗКА ПОДДЕРЖКИ */}
                <div className="suc-note">
                  <Sparkles size={14} className="suc-note-icon" />
                  <span className="suc-note-txt">
                    Items issue? DM <strong>@BIaziee</strong> on Telegram.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
