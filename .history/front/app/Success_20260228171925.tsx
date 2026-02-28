import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  ArrowRight,
  Home,
  Package,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { Page } from "../types";

interface Props {
  onNavigate: (p: Page) => void;
}

export const Success: React.FC<Props> = ({ onNavigate }) => {
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      color: string;
      size: number;
      delay: number;
    }[]
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated counter for order number
  useEffect(() => {
    const target = 4821;
    const step = Math.ceil(target / 40);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(cur);
      if (cur >= target) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, []);

  // Floating particles
  useEffect(() => {
    const colors = ["#22c55e", "#34d399", "#4ade80", "#86efac", "#60a5fa"];
    const pts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
      delay: Math.random() * 4,
    }));
    setParticles(pts);
  }, []);

  const SERVER_IP = "pixel.my-craft.cc:25612";

  const copy = () => {
    navigator.clipboard.writeText(SERVER_IP).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get order details from URL params (if present)
  const params = new URLSearchParams(window.location.search);
  const nickname = params.get("nickname") || "Player";
  const item = params.get("item") || "Unknown item";
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box}
:root{
  --bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;--s3:#14141e;
  --w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);--w3:rgba(255,255,255,.18);
  --t1:#eaeaf4;--t2:#76769a;--t3:#40405a;
  --green:#22c55e;--green-dim:rgba(34,197,94,.12);
  --fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace;
}

.suc-page{
  min-height:100vh;
  background:var(--bg);
  position:relative;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:40px 20px;
}

/* noise */
.suc-page::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:300px;opacity:.02;
}

/* grid */
.suc-page::after{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);
  background-size:80px 80px;
}

/* big ambient glow */
.suc-glow{
  position:fixed;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:600px;height:600px;
  border-radius:50%;
  background:radial-gradient(ellipse,rgba(34,197,94,.08) 0%,transparent 70%);
  pointer-events:none;z-index:0;
  animation:glow-pulse 4s ease-in-out infinite;
}
@keyframes glow-pulse{
  0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}
  50%{transform:translate(-50%,-50%) scale(1.15);opacity:1}
}

/* particle */
.suc-particle{
  position:fixed;
  border-radius:50%;
  pointer-events:none;
  z-index:0;
  animation:float-up linear infinite;
}
@keyframes float-up{
  0%{transform:translateY(100vh) scale(0);opacity:0}
  10%{opacity:1}
  90%{opacity:1}
  100%{transform:translateY(-20vh) scale(1.5);opacity:0}
}

/* main card */
.suc-card{
  position:relative;z-index:1;
  background:var(--s1);
  border:1px solid rgba(34,197,94,.2);
  border-radius:24px;
  width:100%;
  max-width:520px;
  overflow:hidden;
  animation:card-in .7s cubic-bezier(.34,1.2,.64,1) both;
}
@keyframes card-in{
  from{opacity:0;transform:translateY(40px) scale(.94)}
  to{opacity:1;transform:none}
}

.suc-top-bar{
  height:2px;
  background:linear-gradient(90deg,#22c55e,#4ade80,#34d399,transparent);
}

.suc-inner{padding:40px 36px 36px}

/* icon */
.suc-icon-wrap{
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:28px;
  animation:icon-pop .8s cubic-bezier(.34,1.5,.64,1) .2s both;
}
@keyframes icon-pop{
  from{opacity:0;transform:scale(.4) rotate(-20deg)}
  to{opacity:1;transform:none}
}
.suc-icon-ring{
  width:90px;height:90px;
  border-radius:50%;
  border:1px solid rgba(34,197,94,.25);
  background:rgba(34,197,94,.06);
  display:flex;align-items:center;justify-content:center;
  position:relative;
  box-shadow:0 0 0 0 rgba(34,197,94,.2);
  animation:ring-ping 2.5s ease-out .8s infinite;
}
@keyframes ring-ping{
  0%{box-shadow:0 0 0 0 rgba(34,197,94,.3)}
  70%{box-shadow:0 0 0 22px rgba(34,197,94,0)}
  100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}
}
.suc-icon-ring svg{filter:drop-shadow(0 0 12px rgba(34,197,94,.6))}

/* text */
.suc-eyebrow{
  font-family:var(--fm);
  font-size:9px;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:#22c55e;
  text-align:center;
  margin-bottom:10px;
  animation:fade-up .5s ease .3s both;
}
.suc-h{
  font-family:var(--fh);
  font-size:clamp(30px,5vw,42px);
  font-weight:800;
  letter-spacing:-.035em;
  line-height:1;
  color:var(--t1);
  text-align:center;
  margin-bottom:8px;
  animation:fade-up .5s ease .35s both;
}
.suc-sub{
  font-size:13px;
  color:var(--t2);
  line-height:1.75;
  text-align:center;
  max-width:340px;
  margin:0 auto 28px;
  animation:fade-up .5s ease .4s both;
}

/* divider */
.suc-div{height:1px;background:var(--w);margin-bottom:24px;animation:fade-in .5s ease .45s both}

/* order details */
.suc-details{
  display:flex;flex-direction:column;gap:8px;
  margin-bottom:24px;
  animation:fade-up .5s ease .5s both;
}
.suc-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:10px 14px;
  background:var(--s2);
  border:1px solid var(--w);
  border-radius:8px;
}
.suc-row-key{
  font-family:var(--fm);
  font-size:10px;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:var(--t3);
}
.suc-row-val{
  font-family:var(--fb);
  font-size:13px;
  font-weight:600;
  color:var(--t1);
}
.suc-row-val.green{color:#22c55e}

/* ip chip */
.suc-ip{
  display:flex;
  align-items:center;
  gap:10px;
  padding:12px 14px;
  background:var(--s2);
  border:1px solid var(--w);
  border-radius:8px;
  margin-bottom:24px;
  animation:fade-up .5s ease .55s both;
}
.suc-ip-lbl{
  font-family:var(--fm);
  font-size:9px;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--t3);
  flex-shrink:0;
}
.suc-ip-val{
  flex:1;
  font-family:var(--fm);
  font-size:13px;
  font-weight:600;
  color:var(--t1);
}

/* buttons */
.suc-btns{
  display:flex;
  flex-direction:column;
  gap:8px;
  animation:fade-up .5s ease .6s both;
}
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  border-radius:9px;
  font-family:var(--fb);font-weight:600;cursor:pointer;
  border:1px solid transparent;
  transition:all .2s;
  padding:12px 22px;font-size:14px;
  width:100%;
}
.btn-green{background:var(--green);border-color:var(--green);color:#000}
.btn-green:hover{filter:brightness(1.1)}
.btn-ghost{background:rgba(255,255,255,.04);border-color:var(--w2);color:var(--t2)}
.btn-ghost:hover{background:rgba(255,255,255,.08);color:var(--t1)}
.btn-sm{padding:9px 16px;font-size:12px}

/* info note */
.suc-note{
  display:flex;align-items:flex-start;gap:10px;
  padding:12px 14px;
  background:rgba(34,197,94,.05);
  border:1px solid rgba(34,197,94,.15);
  border-radius:8px;
  margin-top:16px;
  animation:fade-up .5s ease .65s both;
}
.suc-note-dot{
  width:6px;height:6px;border-radius:50%;
  background:#22c55e;box-shadow:0 0 6px #22c55e;
  flex-shrink:0;margin-top:5px;
  animation:pdot 2s ease-in-out infinite;
}
@keyframes pdot{0%,100%{opacity:1}50%{opacity:.35}}
.suc-note-text{font-size:12px;color:var(--t2);line-height:1.7}
.suc-note-text strong{color:#4ade80;font-weight:600}

@keyframes fade-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
`}</style>

      {/* Ambient glow */}
      <div className="suc-glow" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="suc-particle"
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
          <div className="suc-top-bar" />
          <div className="suc-inner">
            {/* Icon */}
            <div className="suc-icon-wrap">
              <div className="suc-icon-ring">
                <CheckCircle size={40} color="#22c55e" strokeWidth={1.5} />
              </div>
            </div>

            {/* Headline */}
            <div className="suc-eyebrow">// Payment confirmed</div>
            <h1 className="suc-h">Purchase Successful!</h1>
            <p className="suc-sub">
              Thank you,{" "}
              <strong style={{ color: "#eaeaf4" }}>{nickname}</strong>! Your
              order has been processed and will be activated on the server
              within a few minutes.
            </p>

            <div className="suc-div" />

            {/* Order details */}
            <div className="suc-details">
              <div className="suc-row">
                <span className="suc-row-key">Order #</span>
                <span className="suc-row-val">#{count}</span>
              </div>
              <div className="suc-row">
                <span className="suc-row-key">Player</span>
                <span className="suc-row-val" style={{ color: "#60a5fa" }}>
                  {nickname}
                </span>
              </div>
              <div className="suc-row">
                <span className="suc-row-key">Item</span>
                <span
                  className="suc-row-val"
                  style={{ textTransform: "capitalize" }}
                >
                  {item}
                </span>
              </div>
              <div className="suc-row">
                <span className="suc-row-key">Date</span>
                <span className="suc-row-val">{dateStr}</span>
              </div>
              <div className="suc-row">
                <span className="suc-row-key">Time</span>
                <span className="suc-row-val">{timeStr}</span>
              </div>
              <div className="suc-row">
                <span className="suc-row-key">Status</span>
                <span className="suc-row-val green">✓ Activated</span>
              </div>
            </div>

            {/* IP row */}
            <div className="suc-ip">
              <span className="suc-ip-lbl">Server IP</span>
              <span className="suc-ip-val">{SERVER_IP}</span>
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

            {/* Buttons */}
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
                <Package size={14} /> Continue Shopping <ArrowRight size={13} />
              </button>
            </div>

            {/* Note */}
            <div className="suc-note">
              <div className="suc-note-dot" />
              <div className="suc-note-text">
                Your rank will be active in-game{" "}
                <strong>within 5 minutes</strong>. If you experience any issues,
                contact us on <strong>Telegram @pixelhyt</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
