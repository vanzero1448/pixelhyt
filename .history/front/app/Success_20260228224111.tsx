import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  ArrowRight,
  Home,
  Package,
  Copy,
  Check,
  Loader,
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
  price: string; // Сумма в рублях из БД
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

  // 1. Получаем курс валют (опционально) и данные платежа
  useEffect(() => {
    // Получение курса (пример через бесплатное API)
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

  // Остальные эффекты (счетчик и частицы) остаются без изменений
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
    const colors = ["#22c55e", "#34d399", "#4ade80", "#86efac", "#60a5fa"];
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
        /* ... существующие стили ... */
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        :root{--bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;--w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);
          --t1:#eaeaf4;--t2:#76769a;--t3:#40405a;--green:#22c55e;
          --fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace}
        .suc-page{min-height:100vh;background:var(--bg);position:relative;overflow:hidden;
          display:flex;align-items:center;justify-content:center;padding:40px 20px}
        
        /* НОВЫЙ СТИЛЬ ДЛЯ ЛОГОТИПА */
        .suc-logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: -15px;
            animation: fu .5s ease .2s both;
        }
        .suc-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            filter: drop-shadow(0 0 15px rgba(34, 197, 94, 0.3));
        }

        .suc-page::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size:300px;opacity:.02}
        .suc-page::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
          background-size:80px 80px}
        .suc-glow{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;
          border-radius:50%;pointer-events:none;z-index:0;
          background:radial-gradient(ellipse,rgba(34,197,94,.07) 0%,transparent 70%);
          animation:gp 4s ease-in-out infinite}
        @keyframes gp{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.12)}}
        .suc-pt{position:fixed;border-radius:50%;pointer-events:none;z-index:0;animation:fpu linear infinite}
        @keyframes fpu{0%{transform:translateY(100vh) scale(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-20vh) scale(1.5);opacity:0}}
        .suc-card{position:relative;z-index:1;background:var(--s1);border:1px solid rgba(34,197,94,.2);
          border-radius:24px;width:100%;max-width:520px;overflow:hidden;
          animation:crd .7s cubic-bezier(.34,1.2,.64,1) both}
        @keyframes crd{from{opacity:0;transform:translateY(40px) scale(.94)}to{opacity:1;transform:none}}
        .suc-topbar{height:2px;background:linear-gradient(90deg,#22c55e,#4ade80,#34d399,transparent)}
        .suc-inner{padding:40px 36px 36px}
        .suc-loader{display:flex;align-items:center;justify-content:center;padding:56px 0;
          gap:10px;font-family:var(--fm);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--t3)}
        @keyframes spin{to{transform:rotate(360deg)}}
        .suc-spin{animation:spin .9s linear infinite}
        .suc-icon-wrap{display:flex;align-items:center;justify-content:center;margin-bottom:28px;animation:ipop .8s cubic-bezier(.34,1.5,.64,1) .2s both}
        @keyframes ipop{from{opacity:0;transform:scale(.4) rotate(-20deg)}to{opacity:1;transform:none}}
        .suc-ring{width:90px;height:90px;border-radius:50%;border:1px solid rgba(34,197,94,.25);
          background:rgba(34,197,94,.06);display:flex;align-items:center;justify-content:center;
          animation:rping 2.5s ease-out .8s infinite}
        @keyframes rping{0%{box-shadow:0 0 0 0 rgba(34,197,94,.3)}70%{box-shadow:0 0 0 22px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
        .suc-ring svg{filter:drop-shadow(0 0 12px rgba(34,197,94,.6))}
        .suc-ey{font-family:var(--fm);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#22c55e;text-align:center;margin-bottom:10px;animation:fu .5s ease .3s both}
        .suc-h{font-family:var(--fh);font-size:clamp(28px,5vw,40px);font-weight:800;letter-spacing:-.035em;line-height:1;color:var(--t1);text-align:center;margin-bottom:8px;animation:fu .5s ease .35s both}
        .suc-sub{font-size:13px;color:var(--t2);line-height:1.75;text-align:center;max-width:340px;margin:0 auto 28px;animation:fu .5s ease .4s both}
        .suc-sub strong{color:#eaeaf4}
        .suc-div{height:1px;background:var(--w);margin-bottom:22px;animation:fi .5s ease .45s both}
        .suc-rows{display:flex;flex-direction:column;gap:7px;margin-bottom:22px;animation:fu .5s ease .5s both}
        .suc-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--s2);border:1px solid var(--w);border-radius:8px}
        .suc-row-k{font-family:var(--fm);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--t3)}
        .suc-row-v{font-family:var(--fb);font-size:13px;font-weight:600;color:var(--t1)}
        .suc-row-v.green{color:#22c55e}
        .suc-row-v.blue{color:#60a5fa}
        .suc-ip{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--s2);border:1px solid var(--w);border-radius:8px;margin-bottom:22px;animation:fu .5s ease .55s both}
        .suc-ip-lbl{font-family:var(--fm);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);flex-shrink:0}
        .suc-ip-val{flex:1;font-family:var(--fm);font-size:13px;font-weight:600;color:var(--t1)}
        .suc-btns{display:flex;flex-direction:column;gap:8px;animation:fu .5s ease .6s both}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:9px;font-family:var(--fb);font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .2s;padding:12px 22px;font-size:14px;width:100%}
        .btn-green{background:var(--green);border-color:var(--green);color:#000}
        .btn-green:hover{filter:brightness(1.1)}
        .btn-ghost{background:rgba(255,255,255,.04);border-color:var(--w2);color:var(--t2)}
        .btn-ghost:hover{background:rgba(255,255,255,.08);color:var(--t1)}
        .btn-sm{padding:9px 16px;font-size:12px}
        .suc-note{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;background:rgba(34,197,94,.05);border:1px solid rgba(34,197,94,.15);border-radius:8px;margin-top:14px;animation:fu .5s ease .65s both}
        .suc-note-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;flex-shrink:0;margin-top:5px;animation:pdot 2s ease-in-out infinite}
        @keyframes pdot{0%,100%{opacity:1}50%{opacity:.35}}
        .suc-note-txt{font-size:12px;color:var(--t2);line-height:1.7}
        .suc-note-txt strong{color:#4ade80;font-weight:600}
        @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
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
          <div className="suc-topbar" />
          <div className="suc-inner">
            {loading ? (
              <div className="suc-loader">
                <Loader size={16} className="suc-spin" /> Fetching order data...
              </div>
            ) : (
              <>
                {/* ЛОГОТИП */}
                <div className="suc-logo-container">
                  <img src="/img/ice.png" alt="Ice Logo" className="suc-logo" />
                </div>

                <div className="suc-icon-wrap">
                  <div className="suc-ring">
                    <CheckCircle size={40} color="#22c55e" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="suc-ey">// Payment confirmed</div>
                <h1 className="suc-h">Purchase Successful!</h1>
                <p className="suc-sub">
                  Thank you, <strong>{nick}</strong>! Your order has been
                  processed and will be active shortly.
                </p>

                <div className="suc-div" />

                <div className="suc-rows">
                  <div className="suc-row">
                    <span className="suc-row-k">Order #</span>
                    <span className="suc-row-v">#{invId || counter}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Player</span>
                    <span className="suc-row-v blue">{nick}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Item</span>
                    <span className="suc-row-v">{item}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Amount</span>
                    {/* ОТОБРАЖЕНИЕ В ДОЛЛАРАХ */}
                    <span className="suc-row-v">${priceInUsd}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Date</span>
                    <span className="suc-row-v">{dateStr}</span>
                  </div>
                  <div className="suc-row">
                    <span className="suc-row-k">Status</span>
                    <span className="suc-row-v green">✓ Activated</span>
                  </div>
                </div>

                {/* ОСТАЛЬНОЕ БЕЗ ИЗМЕНЕНИЙ */}
                <div className="suc-ip">
                  <span className="suc-ip-lbl">Server IP</span>
                  <span className="suc-ip-val">{serverIp}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={copy}
                    style={{ width: "auto", flexShrink: 0 }}
                  >
                    {copied ? (
                      <>
                        <Check size={11} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="suc-btns">
                  <button
                    className="btn btn-green"
                    onClick={() => onNavigate(Page.HOME)}
                  >
                    <Home size={15} /> Back to Home
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => onNavigate(Page.DONATE)}
                  >
                    <Package size={14} /> Continue Shopping{" "}
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="suc-note">
                  <div className="suc-note-dot" />
                  <div className="suc-note-txt">
                    Your rank is active in-game{" "}
                    <strong>within 5 minutes</strong>. Issues? Contact us on{" "}
                    <strong>Telegram @BIaziee</strong>.
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
