import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Home,
  ShoppingBag,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Page } from "../types";

// Константы
const API_URL = ((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");
const DEFAULT_RATE = 91.5; // Резервный курс

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

  const params = new URLSearchParams(window.location.search);
  const invId = params.get("InvId") || params.get("invId") || "777";

  useEffect(() => {
    // 1. Подтягиваем актуальный курс валют
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(res => { if (res.rates?.RUB) setUsdRate(res.rates.RUB); })
      .catch(() => console.warn("Using fallback rate"));

    // 2. Получаем данные о заказе
    if (!invId) { setLoading(false); return; }
    
    fetch(`${API_URL}/payment-info/${invId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [invId]);

  // Логика конвертации
  const rawPrice = data?.price || params.get("OutSum") || "0";
  const priceInRub = parseFloat(rawPrice.replace(/[^\d.]/g, ""));
  const priceInUsd = (priceInRub / usdRate).toFixed(2);

  const copyIp = () => {
    const ip = data?.serverIp || "pixel.my-craft.cc";
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ice-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

        :root {
          --ice-blue: #00d2ff;
          --ice-deep: #004e92;
          --success-green: #22c55e;
          --glass: rgba(255, 255, 255, 0.03);
          --border: rgba(255, 255, 255, 0.08);
        }

        .ice-wrapper {
          min-height: 100vh;
          background: #02040a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #fff;
          overflow: hidden;
          position: relative;
        }

        /* Анимированный ледяной фон */
        .ice-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% -20%, #004e92 0%, #02040a 60%);
          z-index: 0;
        }

        .ice-flakes {
          position: absolute;
          inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
          opacity: 0.3;
          animation: snow 60s linear infinite;
        }

        @keyframes snow {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }

        /* Карточка */
        .ice-card {
          width: 100%;
          max-width: 460px;
          background: rgba(10, 15, 25, 0.8);
          backdrop-filter: blur(25px);
          border: 1px solid var(--border);
          border-radius: 40px;
          padding: 48px 40px;
          position: relative;
          z-index: 10;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 
                      0 0 40px rgba(0, 210, 255, 0.1);
          text-align: center;
        }

        .ice-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 40%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--ice-blue), transparent);
        }

        /* Логотип с левитацией */
        .ice-logo-container {
          width: 120px;
          height: 120px;
          margin: -110px auto 24px;
          position: relative;
          filter: drop-shadow(0 0 25px rgba(0, 210, 255, 0.4));
          animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }

        .ice-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.1);
          color: var(--success-green);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .ice-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(to bottom, #fff 40%, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ice-price-box {
          margin: 24px 0;
          padding: 20px;
          background: linear-gradient(135deg, rgba(0, 210, 255, 0.05), rgba(0, 78, 146, 0.05));
          border-radius: 24px;
          border: 1px solid rgba(0, 210, 255, 0.1);
        }

        .ice-price-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 42px;
          font-weight: 800;
          color: #fff;
          text-shadow: 0 0 20px rgba(0, 210, 255, 0.3);
        }

        .ice-price-sub {
          font-size: 12px;
          color: #556075;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 4px;
        }

        /* Список данных */
        .ice-details {
          display: grid;
          gap: 12px;
          margin-bottom: 32px;
        }

        .ice-detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          padding: 14px 18px;
          border-radius: 18px;
          border: 1px solid var(--border);
        }

        .ice-detail-label { color: #556075; font-size: 12px; font-weight: 600; }
        .ice-detail-value { font-size: 14px; font-weight: 700; color: #e2e8f0; }

        /* Кнопки */
        .ice-btn-primary {
          background: var(--ice-blue);
          color: #000;
          width: 100%;
          padding: 18px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .ice-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 210, 255, 0.3);
          filter: brightness(1.1);
        }

        .ice-btn-secondary {
          background: transparent;
          color: #94a3b8;
          width: 100%;
          padding: 14px;
          margin-top: 12px;
          border-radius: 18px;
          font-weight: 600;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: 0.2s;
        }

        .ice-btn-secondary:hover {
          background: var(--glass);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }

        .loader-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ice-bg">
        <div className="ice-flakes" />
      </div>

      <div className="ice-card">
        {loading ? (
          <div style={{ padding: "60px 0" }}>
            <Loader2 className="loader-spin" size={48} color="#00d2ff" />
            <p style={{ marginTop: 16, color: "#475569" }}>Freezing your transaction...</p>
          </div>
        ) : (
          <>
            <div className="ice-logo-container">
              <img src="/img/ice.png" style={{ width: '100%' }} alt="Ice Logo" />
            </div>

            <div className="ice-status">
              <ShieldCheck size={14} />
              VERIFIED TRANSACTION
            </div>

            <h1 className="ice-title">Ice Delivery</h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
              Welcome to the elite, <b>{data?.nick || 'Player'}</b>. Your purchase is now active.
            </p>

            <div className="ice-price-box">
              <div className="ice-price-val">${priceInUsd}</div>
              <div className="ice-price-sub">Amount Paid</div>
            </div>

            <div className="ice-details">
              <div className="ice-detail-item">
                <span className="ice-detail-label">PRODUCT</span>
                <span className="ice-detail-value">{data?.item || 'Store Item'}</span>
              </div>
              
              <div className="ice-detail-item">
                <span className="ice-detail-label">ORDER ID</span>
                <span className="ice-detail-value" style={{ fontFamily: 'monospace' }}>#{invId}</span>
              </div>

              <div className="ice-detail-item" style={{ cursor: 'pointer' }} onClick={copyIp}>
                <span className="ice-detail-label">SERVER IP</span>
                <span className="ice-detail-value" style={{ color: var(--ice-blue), display: 'flex', alignItems: 'center', gap: 6 }}>
                  {data?.serverIp || 'pixel.my-craft.cc'}
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </span>
              </div>
            </div>

            <button className="ice-btn-primary" onClick={() => onNavigate(Page.HOME)}>
              <Zap size={20} fill="currentColor" />
              START PLAYING
            </button>

            <button className="ice-btn-secondary" onClick={() => onNavigate(Page.DONATE)}>
              <ShoppingBag size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Open Store
            </button>

            <div style={{ marginTop: 32, fontSize: "11px", color: "#475569", display: 'flex', justifyContent: 'center', gap: 15 }}>
              <span>Secure by IceStore</span>
              <span>•</span>
              <a href="https://t.me/BIaziee" style={{ color: "inherit", textDecoration: 'none' }}>Support: @BIaziee</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};