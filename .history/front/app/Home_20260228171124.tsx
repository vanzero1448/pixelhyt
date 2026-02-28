import React, { useState, useEffect, useRef } from "react";
import {
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  BookOpen,
  X,
  Zap,
  Shield,
  Users,
  Sword,
  Headset,
} from "lucide-react";
import { Page } from "../types";

interface Props {
  onNavigate: (p: Page) => void;
}

export const Home: React.FC<Props> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [counter, setCounter] = useState(0);

  // Animate player counter
  useEffect(() => {
    const target = 2847;
    const step = Math.ceil(target / 60);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCounter(cur);
      if (cur >= target) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, []);

  const copy = () => {
    navigator.clipboard.writeText("play.pixel.net").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');

/* ── reset ── */
*,*::before,*::after{box-sizing:border-box}

/* ── tokens ── */
:root{
  --bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;--s3:#14141e;
  --w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);--w3:rgba(255,255,255,.18);
  --t1:#eaeaf4;--t2:#76769a;--t3:#40405a;
  --blue:#3b82f6;--blue-dim:rgba(59,130,246,.12);
  --line:rgba(255,255,255,.06);
  --fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace;
}

/* ── noise overlay ── */
.h-noise{pointer-events:none;position:fixed;inset:0;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:300px;opacity:.022}

/* grid */
.h-grid{pointer-events:none;position:fixed;inset:0;z-index:0;
  background-image:linear-gradient(var(--w) 1px,transparent 1px),
    linear-gradient(90deg,var(--w) 1px,transparent 1px);
  background-size:80px 80px;opacity:.45}

/* ── HERO ── */
.h-hero{position:relative;height:100vh;min-height:640px;display:flex;align-items:center;overflow:hidden}
.h-video{position:absolute;inset:0;z-index:0}
.h-video video,.h-video img{width:100%;height:100%;object-fit:cover}
.h-scrim{position:absolute;inset:0;z-index:1;
  background:linear-gradient(to right,rgba(7,7,11,.92) 0%,rgba(7,7,11,.6) 55%,rgba(7,7,11,.1) 100%)}
.h-scrim2{position:absolute;bottom:0;left:0;right:0;height:160px;z-index:1;
  background:linear-gradient(to bottom,transparent,var(--bg))}

.h-hero-inner{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 28px;width:100%}

/* pill */
.h-pill{display:inline-flex;align-items:center;gap:8px;
  border:1px solid var(--w2);border-radius:999px;padding:5px 14px 5px 8px;
  background:rgba(255,255,255,.04);backdrop-filter:blur(10px);
  font-family:var(--fm);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--t2);
  margin-bottom:24px}
.h-pill-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;
  box-shadow:0 0 8px #22c55e;animation:pdot 2s ease-in-out infinite}
@keyframes pdot{0%,100%{opacity:1}50%{opacity:.4}}

/* headline */
.h-h1{font-family:var(--fh);font-size:clamp(52px,8vw,88px);font-weight:800;
  line-height:.92;letter-spacing:-.04em;color:#fff;margin-bottom:22px}
.h-h1 em{font-style:normal;color:var(--blue);position:relative}
.h-h1 em::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;
  background:var(--blue);opacity:.35;border-radius:2px}

.h-sub{font-size:16px;color:rgba(255,255,255,.55);line-height:1.75;max-width:440px;margin-bottom:36px}

/* hero actions */
.h-actions{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:40px}

/* hero stats */
.h-stats{display:flex;gap:24px;flex-wrap:wrap}
.h-stat{display:flex;flex-direction:column}
.h-stat-val{font-family:var(--fh);font-size:22px;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1}
.h-stat-lbl{font-family:var(--fm);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);margin-top:4px}

/* scroll hint */
.h-scroll{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);z-index:2;
  width:1px;height:48px;background:linear-gradient(to bottom,rgba(255,255,255,.3),transparent);opacity:.4}

/* ── btn overrides ── */
.btn{display:inline-flex;align-items:center;gap:7px;border-radius:9px;
  font-family:var(--fb);font-weight:600;cursor:pointer;border:1px solid transparent;
  transition:all .2s;white-space:nowrap}
.btn-lg{padding:12px 22px;font-size:14px}
.btn-sm{padding:8px 14px;font-size:12px}
.btn-blue{background:var(--blue);border-color:var(--blue);color:#fff}
.btn-blue:hover{filter:brightness(1.12)}
.btn-ghost{background:rgba(255,255,255,.05);border-color:var(--w2);color:var(--t2)}
.btn-ghost:hover{background:rgba(255,255,255,.09);color:var(--t1)}
.btn-outline{background:transparent;border-color:var(--w2);color:var(--t2)}
.btn-outline:hover{border-color:var(--w3);color:var(--t1)}

/* ── sections ── */
.h-section{padding:80px 0}
.h-cx{max-width:1180px;margin:0 auto;padding:0 28px}

.h-sh{margin-bottom:36px}
.h-tag{display:inline-flex;align-items:center;gap:5px;font-family:var(--fm);font-size:9px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--t3);
  border:1px solid var(--w);border-radius:4px;padding:3px 9px;margin-bottom:12px}
.h-sh h2{font-family:var(--fh);font-size:clamp(26px,4vw,36px);font-weight:800;
  letter-spacing:-.03em;line-height:1.05}

/* ── features row ── */
.h-feats{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-bottom:56px}
.h-feat{background:var(--s1);border:1px solid var(--w);border-radius:12px;padding:20px;
  transition:border-color .25s,transform .3s cubic-bezier(.34,1.2,.64,1)}
.h-feat:hover{transform:translateY(-4px)}
.h-feat-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;
  justify-content:center;margin-bottom:14px;border:1px solid}
.h-feat-name{font-family:var(--fh);font-size:13px;font-weight:800;letter-spacing:-.01em;margin-bottom:5px}
.h-feat-desc{font-size:12px;color:var(--t3);line-height:1.6}

/* ── SERVER CARD ── */
.h-card{background:var(--s1);border:1px solid var(--w);border-radius:14px;
  overflow:hidden;margin-bottom:12px;transition:border-color .3s}
.h-card:hover{border-color:rgba(59,130,246,.3)}
.h-card-bar{height:2px;background:linear-gradient(90deg,var(--blue),transparent)}
.h-card-body{display:flex;align-items:stretch;flex-wrap:wrap}
.h-card-img{width:190px;flex-shrink:0;background:var(--s2);position:relative;
  display:flex;align-items:center;justify-content:center;padding:28px 16px;overflow:hidden}
.h-card-img-glow{position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 80%,rgba(59,130,246,.14) 0%,transparent 70%)}
.h-card-img img{width:100%;max-width:140px;height:auto;object-fit:contain;
  position:relative;z-index:1;animation:float 5s ease-in-out infinite;
  filter:drop-shadow(0 20px 40px rgba(59,130,246,.3))}
@keyframes float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}}
.h-card-sep{width:1px;background:var(--line);flex-shrink:0}
.h-card-content{flex:1;padding:26px 28px;min-width:220px;display:flex;flex-direction:column;gap:16px}

.h-card-header{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px}
.h-card-title{font-family:var(--fh);font-size:20px;font-weight:800;letter-spacing:-.025em;margin-bottom:4px}
.h-card-sub{font-size:12px;color:var(--t3)}
.h-online{display:flex;align-items:center;gap:7px;
  background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.2);
  border-radius:8px;padding:6px 12px}
.h-online-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;
  box-shadow:0 0 6px #22c55e;animation:pdot 2s ease-in-out infinite}
.h-online span{font-size:12px;font-weight:600;color:#22c55e}

.h-card-desc{font-size:13px;color:var(--t2);line-height:1.7}

.h-stats-row{display:flex;gap:8px;flex-wrap:wrap}
.h-stat-box{background:var(--s2);border:1px solid var(--w);border-radius:8px;
  padding:8px 14px;display:flex;flex-direction:column;align-items:center;min-width:60px}
.h-stat-box-val{font-family:var(--fh);font-size:17px;font-weight:800;
  letter-spacing:-.035em;color:var(--t1);line-height:1}
.h-stat-box-lbl{font-family:var(--fm);font-size:9px;font-weight:600;
  color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-top:3px}

.h-ip-row{display:flex;align-items:center;gap:10px;
  background:var(--s2);border:1px solid var(--w);border-radius:8px;padding:10px 14px}
.h-ip-label{font-family:var(--fm);font-size:10px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--t3);flex-shrink:0}
.h-ip-val{flex:1;font-family:var(--fm);font-size:13px;font-weight:600;
  color:var(--t1);letter-spacing:.04em}

.h-card-actions{display:flex;gap:8px;flex-wrap:wrap}

/* coming soon */
.h-coming{border:1px dashed rgba(255,255,255,.07);border-radius:12px;
  padding:14px 20px;display:flex;justify-content:space-between;align-items:center;color:var(--t3)}

/* ── CTA ── */
.h-cta{background:var(--s1);border-top:1px solid var(--line);border-bottom:1px solid var(--line);
  padding:72px 0;text-align:center}
.h-cta h2{font-family:var(--fh);font-size:clamp(28px,4vw,42px);font-weight:800;
  letter-spacing:-.03em;margin-bottom:12px}
.h-cta p{font-size:14px;color:var(--t2);margin-bottom:28px;max-width:340px;margin-left:auto;margin-right:auto;line-height:1.7}
.h-cta-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}

/* ── HOW TO PLAY MODAL ── */
.h-ov{position:fixed;inset:0;z-index:900;background:rgba(0,0,0,.88);
  backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;
  padding:20px;animation:hfo .18s ease}
@keyframes hfo{from{opacity:0}to{opacity:1}}
.h-modal{background:var(--s1);border:1px solid var(--w);border-radius:18px;
  width:100%;max-width:540px;max-height:90vh;overflow-y:auto;
  animation:hsu .28s cubic-bezier(.34,1.1,.64,1);scrollbar-width:none}
.h-modal::-webkit-scrollbar{display:none}
@keyframes hsu{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
.h-modal-stripe{height:1px;background:linear-gradient(90deg,var(--blue),rgba(59,130,246,.2),transparent);border-radius:18px 18px 0 0}
.h-modal-inner{padding:26px 28px}
.h-modal-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px}
.h-modal-close{background:var(--s2);border:1px solid var(--w);border-radius:8px;
  padding:7px;cursor:pointer;color:var(--t3);line-height:1;transition:all .2s}
.h-modal-close:hover{border-color:var(--w2);color:var(--t2)}

.h-steps{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
.h-step{display:flex;gap:14px;align-items:flex-start;
  background:var(--s2);border:1px solid var(--w);border-radius:10px;padding:14px 16px;
  transition:border-color .2s}
.h-step:hover{border-color:var(--w2)}
.h-step-num{width:34px;height:34px;border-radius:8px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fm);font-size:11px;font-weight:700;letter-spacing:.04em;border:1px solid}
.h-step-title{font-weight:700;font-size:14px;margin-bottom:4px}
.h-step-desc{font-size:13px;color:var(--t2);line-height:1.6}
.h-step-code{display:inline-flex;align-items:center;gap:6px;margin-top:8px;
  background:var(--s1);border:1px solid var(--w);border-radius:6px;
  padding:4px 10px;font-family:var(--fm);font-size:12px;letter-spacing:.04em}

/* misc */
.div{height:1px;background:var(--w);margin-bottom:24px}

/* fade animations */
.fade-up{opacity:0;animation:fup .6s ease forwards}
.fade-in{opacity:0;animation:fin .5s ease forwards}
@keyframes fup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes fin{from{opacity:0}to{opacity:1}}
.d1{animation-delay:.05s}.d2{animation-delay:.15s}.d3{animation-delay:.25s}.d4{animation-delay:.38s}.d5{animation-delay:.5s}
`}</style>

      <div className="h-noise" />
      <div className="h-grid" />

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="h-hero">
        <div className="h-video">
          <video autoPlay loop muted playsInline>
            <source src="/img/fight.mp4" type="video/mp4" />
            <img
              src="/img/view.jpeg"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </video>
        </div>
        <div className="h-scrim" />
        <div className="h-scrim2" />

        <div className="h-hero-inner">
          <div style={{ maxWidth: 580 }}>
            <div className="fade-in d1">
              <div className="h-pill">
                <div className="h-pill-dot" />
                Server is Online · Hytale · Season 1
              </div>
            </div>

            <h1 className="h-h1 fade-up d2">
              First
              <br />
              <em>and best</em>
            </h1>

            <p className="h-sub fade-up d3">
              Build networks, forge factions, and explore the system. Pixel is
              the next-generation Hytale server.
            </p>

            <div className="h-actions fade-up d4">
              <button
                className="btn btn-blue btn-lg"
                onClick={() => onNavigate(Page.DONATE)}
              >
                Go to Store <ArrowRight size={15} />
              </button>
              <button
                className="btn btn-ghost btn-lg"
                onClick={() => setShowHowTo(true)}
              >
                <BookOpen size={15} /> How to Play
              </button>
              <button className="btn btn-ghost btn-lg" onClick={copy}>
                {copied ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> play.pixel.net
                  </>
                )}
              </button>
            </div>

            <div
              className="fade-up d5"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 10,
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid var(--w2)",
                  borderRadius: 12,
                  padding: "10px 22px",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--fh)",
                    fontSize: 38,
                    fontWeight: 800,
                    letterSpacing: "-.055em",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {counter.toLocaleString()}
                </span>
                <span
                  style={{
                    fontFamily: "var(--fm)",
                    fontSize: 10,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "var(--t3)",
                  }}
                >
                  players joined
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-scroll" />
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section className="h-section" style={{ background: "var(--bg)" }}>
        <div className="h-cx">
          <div className="h-sh">
            <div className="h-tag">Why Pixel</div>
            <h2>
              Everything you need
              <br />
              to dominate
            </h2>
          </div>

          <div className="h-feats">
            {[
              {
                icon: <Zap size={16} />,
                color: "#60a5fa",
                name: "Instant Setup",
                desc: "Buy a rank, get activated in seconds. No waiting, no tickets.",
              },
              {
                icon: <Shield size={16} />,
                color: "#34d399",
                name: "Anti-Cheat",
                desc: "Multi-layer protection keeps the playing field fair for everyone.",
              },
              {
                icon: <Users size={16} />,
                color: "#a78bfa",
                name: "Faction System",
                desc: "Build alliances, wage wars, and conquer territories with your crew.",
              },
              {
                icon: <Sword size={16} />,
                color: "#fb923c",
                name: "Unique PvP",
                desc: "Custom combat mechanics that reward skill over gear.",
              },
              {
                icon: <Headset size={16} />,
                color: "#f43f5e",
                name: "24/7 Support",
                desc: "Fast, real human support via Telegram. Most issues resolved under 10 minutes.",
              },
            ].map((f) => (
              <div
                key={f.name}
                className="h-feat"
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    f.color + "44")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "var(--w)")
                }
              >
                <div
                  className="h-feat-icon"
                  style={{
                    background: f.color + "12",
                    borderColor: f.color + "30",
                    color: f.color,
                  }}
                >
                  {f.icon}
                </div>
                <div className="h-feat-name">{f.name}</div>
                <div className="h-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* ── SECTION HEADER ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div>
              <div className="h-tag">Game Modes</div>
              <h2 style={{ marginTop: 6 }}>Choose your journey</h2>
            </div>
          </div>
          <div className="div" />

          {/* ── SERVER CARD ── */}
          <div className="h-card">
            <div className="h-card-bar" />
            <div className="h-card-body">
              {/* image */}
              <div className="h-card-img">
                <div className="h-card-img-glow" />
                <img src="/img/survival.jpg" alt="Survival ONE" />
              </div>

              <div className="h-card-sep" />

              {/* content */}
              <div className="h-card-content">
                <div className="h-card-header">
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 5,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--fm)",
                          fontSize: 9,
                          letterSpacing: ".15em",
                          textTransform: "uppercase",
                          color: "#22c55e",
                          background: "rgba(34,197,94,.08)",
                          border: "1px solid rgba(34,197,94,.2)",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        Available
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--fm)",
                          fontSize: 10,
                          color: "var(--t3)",
                          letterSpacing: ".06em",
                        }}
                      >
                        survival · pve/pvp
                      </span>
                    </div>
                    <div className="h-card-title">Survival ONE</div>
                    <div className="h-card-sub">Season 1 · Fresh start</div>
                  </div>
                  <div className="h-online">
                    <div className="h-online-dot" />
                    <span>Online</span>
                  </div>
                </div>

                <div className="h-card-desc">
                  Hardcore survival with unique world generation, technical
                  artifacts, and a complex faction system. Build your empire,
                  forge alliances, and climb the leaderboard.
                </div>

                <div className="h-stats-row">
                  {[
                    ["100", "Slots"],
                    ["SMP", "Mode"],
                    ["24/7", "Uptime"],
                    ["1.0", "Season"],
                  ].map(([v, l]) => (
                    <div key={l} className="h-stat-box">
                      <span className="h-stat-box-val">{v}</span>
                      <span className="h-stat-box-lbl">{l}</span>
                    </div>
                  ))}
                </div>

                <div className="h-ip-row">
                  <span className="h-ip-label">IP</span>
                  <span className="h-ip-val">pixel.my-craft.cc:25612</span>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={copy}
                    style={{ fontSize: 11, padding: "4px 10px" }}
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

                <div className="h-card-actions">
                  <button
                    className="btn btn-blue btn-sm"
                    onClick={() => onNavigate(Page.DONATE)}
                  >
                    Go to Store <ArrowRight size={13} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowHowTo(true)}
                  >
                    <BookOpen size={13} /> How to Play
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onNavigate(Page.COMMUNITY)}
                  >
                    Community
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* coming soon */}
          <div className="h-coming">
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                New Mode
              </div>
              <div style={{ fontSize: 13 }}>In development</div>
            </div>
            <div style={{ fontSize: 20, opacity: 0.25, letterSpacing: ".2em" }}>
              ···
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="h-cta">
        <div
          className="h-cx"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="h-tag">Join Us</div>
          <h2
            className="h-cta h2"
            style={{
              fontFamily: "var(--fh)",
              fontSize: "clamp(28px,4vw,42px)",
              fontWeight: 800,
              letterSpacing: "-.03em",
              marginBottom: 12,
              marginTop: 12,
            }}
          >
            Ready to start?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--t2)",
              marginBottom: 28,
              maxWidth: 340,
              lineHeight: 1.75,
              textAlign: "center",
            }}
          >
            Purchase a rank, support the server's development, and get an edge
            from day one.
          </p>
          <div className="h-cta-btns">
            <button
              className="btn btn-blue btn-lg"
              onClick={() => onNavigate(Page.DONATE)}
            >
              Go to Store <ArrowRight size={15} />
            </button>
            <a
              href="https://t.me/pixelhyt"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
              style={{ textDecoration: "none" }}
            >
              Telegram <ExternalLink size={14} />
            </a>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => setShowHowTo(true)}
            >
              <BookOpen size={14} /> How to Play
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW TO PLAY MODAL ══════════════════ */}
      {showHowTo && (
        <div className="h-ov" onClick={() => setShowHowTo(false)}>
          <div className="h-modal" onClick={(e) => e.stopPropagation()}>
            <div className="h-modal-stripe" />
            <div className="h-modal-inner">
              <div className="h-modal-top">
                <div>
                  <div
                    style={{
                      fontFamily: "var(--fm)",
                      fontSize: 9,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "var(--t3)",
                      marginBottom: 6,
                    }}
                  >
                    // Getting Started
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--fh)",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-.025em",
                    }}
                  >
                    How to Play
                  </div>
                </div>
                <button
                  className="h-modal-close"
                  onClick={() => setShowHowTo(false)}
                >
                  <X size={15} />
                </button>
              </div>

              <div className="h-steps">
                {[
                  {
                    n: "01",
                    color: "#60a5fa",
                    title: "Download Hytale",
                    desc: "Get the official Hytale launcher from the Hytale website and install it on your PC or Mac.",
                  },
                  {
                    n: "02",
                    color: "#34d399",
                    title: "Create an Account",
                    desc: "Launch the client and create or sign in to your Hytale account to access multiplayer.",
                  },
                  {
                    n: "03",
                    color: "#a78bfa",
                    title: "Add the Server",
                    desc: "Go to Multiplayer → Add Server, enter the IP below and click Save.",
                    code: "play.pixel.net",
                  },
                  {
                    n: "04",
                    color: "#fb923c",
                    title: "Connect & Play",
                    desc: "Select Pixel from your server list and click Join. You're in — welcome to the server!",
                  },
                  {
                    n: "05",
                    color: "#f43f5e",
                    title: "Get a Rank (optional)",
                    desc: "Visit our Store to unlock ranks, kits, and cosmetics for a real edge on the server.",
                  },
                ].map((s) => (
                  <div key={s.n} className="h-step">
                    <div
                      className="h-step-num"
                      style={{
                        background: s.color + "10",
                        borderColor: s.color + "30",
                        color: s.color,
                      }}
                    >
                      {s.n}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="h-step-title">{s.title}</div>
                      <div className="h-step-desc">{s.desc}</div>
                      {s.code && (
                        <div className="h-step-code" style={{ color: s.color }}>
                          {s.code}
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "inherit",
                              padding: 0,
                              lineHeight: 1,
                            }}
                            onClick={copy}
                          >
                            {copied ? <Check size={11} /> : <Copy size={11} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className="btn btn-blue btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowHowTo(false);
                    onNavigate(Page.DONATE);
                  }}
                >
                  Go to Store <ArrowRight size={13} />
                </button>
                <button className="btn btn-ghost btn-sm" onClick={copy}>
                  {copied ? (
                    <>
                      <Check size={13} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy IP
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
