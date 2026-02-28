import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Home,
  ShoppingBag,
  Copy,
  Check,
  Loader2,
  Zap,
  ExternalLink
} from "lucide-react";
import { Page } from "../types";

const API_URL = ((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");
const DEFAULT_RATE = 91.5;

interface Props { onNavigate: (p: Page) => void; }
interface PurchaseData {
  invId: string; nick: string; item: string;
  price: string; dateStr: string; serverIp: string;
}

export const Success: React.FC<Props> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usdRate, setUsdRate] = useState(DEFAULT_RATE);

  useEffect(() => {
    // 1. Получаем курс USD/RUB
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(res => { if (res.rates?.RUB) setUsdRate(res.rates.RUB); })
      .catch(() => console.warn("Using fallback rate"));

    // 2. Получаем данные платежа
    const params = new URLSearchParams(window.location.search);
    const invId = params.get("InvId") || params.get("invId");

    if (!invId) { setLoading(false); return; }
    
    fetch(`${API_URL}/payment-info/${invId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const rawPrice = data?.price || new URLSearchParams(window.location.search).get("OutSum") || "0";
  const priceInUsd = (parseFloat(rawPrice.replace(/[^\d.]/g, "")) / usdRate).toFixed(2);

  const copyIp = () => {
    navigator.clipboard.writeText(data?.serverIp || "pixel.my-craft.cc");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ice-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

        .ice-root {
          min-height: 100vh;
          background: #020408;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        /* Анимированный фон (Сетка + Свечение) */
        .ice-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(0, 149, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 149, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          animation: gridPan 40s linear infinite;
        }

        @keyframes gridPan {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }

        .ice-glow {
          position: absolute;
          top: -20%; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(0, 149, 255, 0.15), transparent 70%);
          pointer-events: none;
        }

        /* Карточка */
        .ice-card {
          width: 100%;
          max-width: 440px;
          background: rgba(10, 12, 18, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 36px;
          padding: 40px;
          z-index: 10;
          text-align: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05);
          animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Логотип */
        .ice-logo-box {
          width: 110px; height: 110px;
          margin: -95px auto 25px;
          position: relative;
          filter: drop-shadow(0 15px 30px rgba(0, 149, 255, 0.3));
          animation: iceFloat 4s ease-in-out infinite;
        }

        @keyframes iceFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* Цена */
        .ice-price-tag {
          background: linear-gradient(135deg, rgba(0, 149, 255, 0.1), rgba(34, 197, 94, 0.1));
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: inline-block;
          padding: 12px 24px;
          border-radius: 20px;
          margin: 20px 0;
        }

        .ice-usd {
          font-family: 'JetBrains Mono', monospace;
          font-size: 38px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -1px;
        }

        /* Инфо-сетка */
        .ice-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 25px;
        }

        .ice-info-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 16px;
          text-align: left;
        }

        .ice-label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 1px; }
        .ice-val { font-size: 13px; font-weight: 600; color: #ddd; margin-top: 2px; }

        /* Кнопки */
        .btn-ice-primary {
          background: #0095ff;
          color: #fff;
          width: 100%;
          padding: 18px;
          border: none;
          border-radius: 20px;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.3s cubic-bezier(0.2, 0, 0, 1);
        }

        .btn-ice-primary:hover {
          background: #33aaff;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 149, 255, 0.4);
        }

        .btn-ice-ghost {
          background: transparent;
          color: #777;
          width: 100%;
          padding: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          margin-top: 12px;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-ice-ghost:hover { background: rgba(255,255,255,0.03); color: #fff; }

        .loader { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ice-grid" />
      <div className="ice-glow" />

      <div className="ice-card">
        {loading ? (
          <div style={{ padding: '40px' }}>
            <Loader2 className="loader" size={40} color="#0095ff" />
          </div>
        ) : (
          <>
            <div className="ice-logo-box">
              <img src="/img/ice.png" style={{ width: '100%' }} alt="Ice Store" />
            </div>

            <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: 700, letter-spacing: '1px' }}>
               <Zap size={14} style={{ marginBottom: -2, marginRight: 4 }} fill="currentColor" />
               PAYMENT VERIFIED
            </div>

            <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '8px 0' }}>Order Success!</h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Welcome back, <b>{data?.nick || 'Player'}</b></p>

            <div className="ice-price-tag">
              <div className="ice-usd">${priceInUsd}</div>
              <div style={{ fontSize: '10px', color: '#555', marginTop: -4 }}>TOTAL PAID</div>
            </div>

            <div className="ice-info-grid">
              <div className="ice-info-card">
                <div className="ice-label">Package</div>
                <div className="ice-val">{data?.item || 'Donation Item'}</div>
              </div>
              <div className="ice-info-card">
                <div className="ice-label">Invoice ID</div>
                <div className="ice-val">#{new URLSearchParams(window.location.search).get("InvId") || '000'}</div>
              </div>
              <div className="ice-info-card" style={{ gridColumn: 'span 2' }}>
                <div className="ice-label">Connect to Server</div>
                <div className="ice-val" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {data?.serverIp || 'pixel.my-craft.cc'}
                  <button onClick={copyIp} style={{ background: 'none', border: 'none', color: '#0095ff', cursor: 'pointer' }}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button className="btn-ice-primary" onClick={() => onNavigate(Page.HOME)}>
              <Home size={18} /> BACK TO LOBBY
            </button>

            <button className="btn-ice-ghost" onClick={() => onNavigate(Page.DONATE)}>
              <ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Browse Store
            </button>

            <div style={{ marginTop: 25, fontSize: '11px', color: '#444' }}>
              Automatic delivery. Issues? <a href="https://t.me/BIaziee" style={{ color: '#666' }}>@BIaziee</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};