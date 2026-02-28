import React, { useEffect, useState } from "react";
import {
  XCircle,
  ArrowRight,
  Home,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { Page } from "../types";

interface Props {
  onNavigate: (p: Page) => void;
}

export const Fail: React.FC<Props> = ({ onNavigate }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  // Periodic glitch effect on the error code
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 280);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Animated scan line
  useEffect(() => {
    let frame: number;
    let y = 0;
    const animate = () => {
      y = (y + 0.4) % 100;
      setScanLine(y);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason") || "Payment was cancelled or declined";

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box}
:root{
  --bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;--s3:#14141e;
  --w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);--w3:rgba(255,255,255,.18);
  --t1:#eaeaf4;--t2:#76769a;--t3:#40405a;
  --red:#f43f5e;--red-dim:rgba(244,63,94,.1);
  --fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace;
}

.fail-page{
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
.fail-page::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:300px;opacity:.025;
}

/* grid */
.fail-page::after{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
  background-size:80px 80px;
}

/* red ambient */
.fail-glow{
  position:fixed;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:560px;height:560px;
  border-radius:50%;
  background:radial-gradient(ellipse,rgba(244,63,94,.07) 0%,transparent 70%);
  pointer-events:none;z-index:0;
  animation:fail-glow-pulse 5s ease-in-out infinite;
}
@keyframes fail-glow-pulse{
  0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(.95)}
  50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}
}

/* corner brackets decoration */
.fail-bracket{
  position:fixed;
  width:60px;height:60px;
  border-color:rgba(244,63,94,.12);
  border-style:solid;
  pointer-events:none;
  z-index:0;
}
.fail-bracket.tl{top:32px;left:32px;border-width:1px 0 0 1px}
.fail-bracket.tr{top:32px;right:32px;border-width:1px 1px 0 0}
.fail-bracket.bl{bottom:32px;left:32px;border-width:0 0 1px 1px}
.fail-bracket.br{bottom:32px;right:32px;border-width:0 1px 1px 0}

/* card */
.fail-card{
  position:relative;z-index:1;
  background:var(--s1);
  border:1px solid rgba(244,63,94,.2);
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

/* scan line overlay on card */
.fail-scan{
  position:absolute;
  left:0;right:0;
  height:2px;
  background:linear-gradient(90deg,transparent,rgba(244,63,94,.15),transparent);
  pointer-events:none;
  z-index:10;
  transition:top .016s linear;
}

.fail-top-bar{
  height:2px;
  background:linear-gradient(90deg,#f43f5e,#fb7185,rgba(244,63,94,.3),transparent);
}

.fail-inner{padding:40px 36px 36px;position:relative}

/* icon */
.fail-icon-wrap{
  display:flex;align-items:center;justify-content:center;
  margin-bottom:28px;
  animation:icon-shake .5s cubic-bezier(.36,.07,.19,.97) .4s both;
}
@keyframes icon-shake{
  0%,100%{transform:none}
  10%,90%{transform:translateX(-4px)}
  20%,80%{transform:translateX(4px)}
  30%,50%,70%{transform:translateX(-4px)}
  40%,60%{transform:translateX(4px)}
}
.fail-icon-ring{
  width:90px;height:90px;
  border-radius:50%;
  border:1px solid rgba(244,63,94,.25);
  background:rgba(244,63,94,.06);
  display:flex;align-items:center;justify-content:center;
  position:relative;
}
.fail-icon-ring::before{
  content:'';
  position:absolute;inset:-8px;
  border-radius:50%;
  border:1px dashed rgba(244,63,94,.12);
  animation:spin-slow 12s linear infinite;
}
@keyframes spin-slow{to{transform:rotate(360deg)}}
.fail-icon-ring svg{filter:drop-shadow(0 0 12px rgba(244,63,94,.5))}

/* error code */
.fail-code{
  display:inline-flex;
  align-items:center;
  gap:7px;
  font-family:var(--fm);
  font-size:9px;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--red);
  background:rgba(244,63,94,.06);
  border:1px solid rgba(244,63,94,.2);
  border-radius:5px;
  padding:4px 12px;
  margin:0 auto 14px;
  display:flex;justify-content:center;
  width:fit-content;
  transition:all .05s;
  animation:fade-up .4s ease .2s both;
}
.fail-code.glitch{
  transform:translate(2px,0);
  filter:drop-shadow(-2px 0 #f43f5e) drop-shadow(2px 0 #06b6d4);
  letter-spacing:.25em;
}

.fail-h{
  font-family:var(--fh);
  font-size:clamp(28px,5vw,40px);
  font-weight:800;
  letter-spacing:-.035em;
  line-height:1;
  color:var(--t1);
  text-align:center;
  margin-bottom:8px;
  animation:fade-up .5s ease .25s both;
}
.fail-sub{
  font-size:13px;
  color:var(--t2);
  line-height:1.75;
  text-align:center;
  max-width:340px;
  margin:0 auto 28px;
  animation:fade-up .5s ease .3s both;
}

.fail-div{height:1px;background:var(--w);margin-bottom:24px;animation:fade-in .5s ease .35s both}

/* reason block */
.fail-reason{
  background:rgba(244,63,94,.05);
  border:1px solid rgba(244,63,94,.15);
  border-radius:10px;
  padding:14px 16px;
  margin-bottom:20px;
  display:flex;align-items:flex-start;gap:12px;
  animation:fade-up .5s ease .4s both;
}
.fail-reason-icon{
  width:28px;height:28px;flex-shrink:0;
  border-radius:6px;
  background:rgba(244,63,94,.1);
  border:1px solid rgba(244,63,94,.2);
  display:flex;align-items:center;justify-content:center;
  color:#f43f5e;
  margin-top:1px;
}
.fail-reason-title{
  font-family:var(--fh);font-size:12px;font-weight:700;
  letter-spacing:-.01em;margin-bottom:3px;color:var(--t1);
}
.fail-reason-text{font-size:12px;color:var(--t2);line-height:1.65}

/* tips */
.fail-tips{
  display:flex;flex-direction:column;gap:6px;
  margin-bottom:24px;
  animation:fade-up .5s ease .45s both;
}
.fail-tip{
  display:flex;align-items:center;gap:10px;
  padding:9px 13px;
  background:var(--s2);
  border:1px solid var(--w);
  border-radius:7px;
  font-size:12px;
  color:var(--t2);
}
.fail-tip-num{
  font-family:var(--fm);font-size:9px;font-weight:700;
  color:var(--t3);letter-spacing:.06em;
  flex-shrink:0;
  min-width:20px;
}

/* buttons */
.fail-btns{
  display:flex;flex-direction:column;gap:8px;
  animation:fade-up .5s ease .5s both;
}
.fail-btn-row{display:flex;gap:8px}
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  border-radius:9px;
  font-family:var(--fb);font-weight:600;cursor:pointer;
  border:1px solid transparent;
  transition:all .2s;
  padding:12px 22px;font-size:14px;
  width:100%;
}
.btn-red{background:var(--red);border-color:var(--red);color:#fff}
.btn-red:hover{filter:brightness(1.1)}
.btn-ghost{background:rgba(255,255,255,.04);border-color:var(--w2);color:var(--t2)}
.btn-ghost:hover{background:rgba(255,255,255,.08);color:var(--t1)}

@keyframes fade-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
`}</style>

      <div className="fail-glow" />
      <div className="fail-bracket tl" />
      <div className="fail-bracket tr" />
      <div className="fail-bracket bl" />
      <div className="fail-bracket br" />

      <div className="fail-page">
        <div className="fail-card">
          {/* Animated scan line */}
          <div className="fail-scan" style={{ top: `${scanLine}%` }} />

          <div className="fail-top-bar" />
          <div className="fail-inner">
            {/* Icon */}
            <div className="fail-icon-wrap">
              <div className="fail-icon-ring">
                <XCircle size={40} color="#f43f5e" strokeWidth={1.5} />
              </div>
            </div>

            {/* Error code */}
            <div className={`fail-code${glitchActive ? " glitch" : ""}`}>
              ERR_PAYMENT_DECLINED
            </div>

            <h1 className="fail-h">Payment Failed</h1>
            <p className="fail-sub">
              Something went wrong during your transaction. Your card has not
              been charged.
            </p>

            <div className="fail-div" />

            {/* Reason */}
            <div className="fail-reason">
              <div className="fail-reason-icon">
                <XCircle size={13} strokeWidth={2} />
              </div>
              <div>
                <div className="fail-reason-title">Reason</div>
                <div className="fail-reason-text">{reason}</div>
              </div>
            </div>

            {/* Tips */}
            <div className="fail-tips">
              {[
                "Check that your card details are entered correctly",
                "Make sure you have sufficient funds available",
                "Try a different payment method or card",
                "Contact your bank if the issue persists",
              ].map((tip, i) => (
                <div key={i} className="fail-tip">
                  <span className="fail-tip-num">0{i + 1}</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="fail-btns">
              <button
                className="btn btn-red"
                onClick={() => onNavigate(Page.DONATE)}
              >
                <RefreshCw size={14} /> Try Again
              </button>
              <div className="fail-btn-row">
                <button
                  className="btn btn-ghost"
                  onClick={() => onNavigate(Page.HOME)}
                >
                  <Home size={14} /> Home
                </button>
                <a
                  href="https://t.me/pixelhyt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                  style={{ textDecoration: "none" }}
                >
                  <MessageCircle size={14} /> Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
