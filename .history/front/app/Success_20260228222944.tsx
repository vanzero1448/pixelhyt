import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  ArrowRight,
  Home,
  Package,
  Copy,
  Check,
  Loader,
  ExternalLink,
} from "lucide-react";
import { Page } from "../types";

const API_URL = ((import.meta as any).env?.VITE_API_URL || "").trim().replace(/\/$/, "");
const DEFAULT_RATE = 92;

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
  const invId = params.get("InvId") || params.get("invId") || "0000";

  useEffect(() => {
    // Получаем курс валют
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r => r.json())
      .then(res => { if (res.rates?.RUB) setUsdRate(res.rates.RUB); })
      .catch(() => console.warn("Using default rate"));

    if (!invId || invId === "0000") { setLoading(false); return; }
    
    fetch(`${API_URL}/payment-info/${invId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [invId]);

  const rawPrice = data?.price || params.get("OutSum") || "0";
  const priceUsd = (parseFloat(rawPrice.replace(/[^\d.]/g, "")) / usdRate).toFixed(2);

  const copy = () => {
    navigator.clipboard.writeText(data?.serverIp || "pixel.my-craft.cc:25612");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono:wght@500&display=swap');
        
        :root {
          --accent: #22c55e;
          --accent-glow: rgba(34, 197, 94, 0.4);
          --bg-dark: #050508;
          --card-bg: rgba(13, 13, 20, 0.8);
        }

        .suc-container {
          min-height: 100vh;
          background: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #fff;
          perspective: 1000px;
          overflow: hidden;
          position: relative;
        }

        /* Анимированный фон сетки */
        .suc-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: rotateX(45deg) scale(2);
          transform-origin: top;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }

        .suc-card {
          width: 100%;
          max-width: 480px;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 32px;
          padding: 40px;
          position: relative;
          z-index: 10;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          animation: cardEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardEntry {
          from { opacity: 0; transform: translateY(30px) rotateX(-10deg); }
          to { opacity: 1; transform: translateY(0) rotateX(0); }
        }

        .logo-wrap {
          width: 100px;
          height: 100px;
          margin: -90px auto 20px;
          position: relative;
          filter: drop-shadow(0 0 20px var(--accent-glow));
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .price-badge {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid var(--accent);
          color: var(--accent);
          padding: 6px 16px;
          border-radius: 100px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          font-weight: 800;
          display: inline-block;
          margin: 15px 0;
        }

        .data-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 25px 0;
        }

        .data-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 12px;
          border-radius: 16px;
          text-align: left;
        }

        .data-label {
          font-size: 10px;
          text-transform: uppercase;
          color: #666;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .data-value {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-main {
          background: var(--accent);
          color: #000;
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
        }

        .btn-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--accent-glow);
        }

        .btn-sec {
          background: transparent;
          color: #aaa;
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-sec:hover { background: rgba(255,255,255,0.05); color: #fff; }
      `}</style>

      <div className="suc-container">
        <div className="suc-bg-grid" />
        
        <div className="suc-card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Loader className="animate-spin" size={40} />
            </div>
          ) : (
            <>
              <div className="logo-wrap">
                <img src="/img/ice.png" style={{ width: '100%' }} alt="ice" />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ color: var(--accent), fontSize: '12px', fontWeight: 800 }}>
                  <CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  PAYMENT RECEIVED
                </div>
                <h2 style={{ fontSize: '32px', margin: '10px 0 0' }}>Success!</h2>
                <p style={{ color: '#888', fontSize: '14px' }}>Welcome to the server, {data?.nick || 'Player'}</p>
                
                <div className="price-badge">${priceUsd}</div>
              </div>

              <div className="data-grid">
                <div className="data-item">
                  <div className="data-label">Item</div>
                  <div className="data-value">{data?.item || 'Premium Pack'}</div>
                </div>
                <div className="data-item">
                  <div className="data-label">Order ID</div>
                  <div className="data-value">#{invId}</div>
                </div>
                <div className="data-item" style={{ gridColumn: 'span 2' }}>
                  <div className="data-label">Server IP</div>
                  <div className="data-value" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {data?.serverIp || 'pixel.my-craft.cc'}
                    <button onClick={copy} style={{ background: 'none', border: 'none', color: var(--accent), cursor: 'pointer' }}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button className="btn-main" onClick={() => onNavigate(Page.HOME)}>
                <Home size={20} /> START PLAYING
              </button>
              
              <button className="btn-sec" onClick={() => onNavigate(Page.DONATE)}>
                Store <ArrowRight size={14} style={{ float: 'right', marginTop: 3 }} />
              </button>

              <div style={{ marginTop: 25, fontSize: '11px', color: '#555', textAlign: 'center' }}>
                Automated delivery by <b>Ice Store</b>. <br/>
                Support: <a href="https://t.me/BIaziee" style={{ color: '#777' }}>@BIaziee</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};