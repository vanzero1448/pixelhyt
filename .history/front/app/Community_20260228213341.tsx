import React from "react";
import { Send, Youtube, Mail, ExternalLink } from "lucide-react";

// TikTok icon (not in lucide)
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
  </svg>
);

const SOCIALS = [
  {
    id: "telegram",
    name: "Telegram",
    handle: "@pixelhyt",
    color: "#0088cc",
    bg: "rgba(0,136,204,.1)",
    border: "rgba(0,136,204,.25)",
    desc: "The main server channel: announcements, dev logs, and direct admin interaction in real time.",
    href: "https://t.me/pixelhyt",
    label: "Join Channel",
    icon: <Send size={20} strokeWidth={1.8} />,
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@pixelhytale",
    color: "#ff4444",
    bg: "rgba(255,68,68,.08)",
    border: "rgba(255,68,68,.22)",
    desc: "Guides, patch reviews, let's plays, and update showcases from our administration team.",
    href: "https://youtube.com/@pixelhytale?si=32pXltNlkDqfKidv",
    label: "Watch",
    icon: <Youtube size={20} strokeWidth={1.8} />,
  },
  {
    id: "tiktok",
    name: "TikTok",
    handle: "@pixel.hytale",
    color: "#ee1d52",
    bg: "rgba(238,29,82,.08)",
    border: "rgba(238,29,82,.22)",
    desc: "Short-form clips, server highlights, and fun moments from the Pixel community.",
    href: "https://www.tiktok.com/@pixel.hytale?_r=1&_t=ZT-94DBNYUTSRS",
    label: "Follow",
    icon: <TikTokIcon size={20} />,
  },
];

export const Community: React.FC = () => (
  <>
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;--s3:#14141e;
  --w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);--w3:rgba(255,255,255,.18);
  --t1:#eaeaf4;--t2:#76769a;--t3:#40405a;
  --fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace;
}
html,body{background:var(--bg);color:var(--t1);font-family:var(--fb);-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--w2);border-radius:2px}

.comm-page{min-height:100vh;background:var(--bg);position:relative}
.comm-page::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:300px 300px;opacity:.018}
.comm-page::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(var(--w) 1px,transparent 1px),linear-gradient(90deg,var(--w) 1px,transparent 1px);
  background-size:80px 80px;opacity:.5}
.z1{position:relative;z-index:1}
.cx{max-width:1080px;margin:0 auto;padding:0 28px}

/* HERO */
.c-hero{padding:88px 0 60px}
.c-hero-layout{display:flex;align-items:flex-end;justify-content:space-between}
.c-hero-text{flex:1;min-width:0}
.c-hero-img-wrap{flex-shrink:0;position:relative;width:300px;margin-bottom:-60px;
  display:flex;align-items:flex-end;justify-content:center;pointer-events:none}
@media(max-width:760px){.c-hero-img-wrap{display:none}}
.c-hero-char{width:270px;height:auto;object-fit:contain;position:relative;z-index:2;
  filter:drop-shadow(0 32px 48px rgba(0,0,0,.75));animation:chfloat 4s ease-in-out infinite}
@keyframes chfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.c-hero-glow{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);
  width:160px;height:44px;border-radius:50%;background:rgba(0,136,204,.14);
  filter:blur(28px);z-index:1;animation:cgpulse 4s ease-in-out infinite}
@keyframes cgpulse{0%,100%{opacity:.5;transform:translateX(-50%) scaleX(1)}50%{opacity:.85;transform:translateX(-50%) scaleX(1.15)}}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--fm);font-size:10px;
  color:var(--t3);letter-spacing:.15em;text-transform:uppercase;margin-bottom:20px}
.eyebrow-line{width:22px;height:1px;background:var(--w3)}
.c-hero-h{font-family:var(--fh);font-size:clamp(38px,6vw,68px);font-weight:800;
  line-height:.94;letter-spacing:-.035em;margin-bottom:20px;color:var(--t1)}
.c-hero-h .dim{color:rgba(255,255,255,.12)}
.c-hero-p{font-size:14px;color:var(--t2);line-height:1.8;max-width:380px}

/* SECTION HEADER */
.sh{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:18px}
.sh-title{font-family:var(--fh);font-size:17px;font-weight:700;letter-spacing:-.015em}
.sh-sub{font-family:var(--fm);font-size:10px;color:var(--t3);margin-top:5px;letter-spacing:.06em}
.div{height:1px;background:var(--w);margin-bottom:26px}

/* SOCIAL CARDS */
.socials-list{display:flex;flex-direction:column;gap:10px;margin-bottom:60px}

.sc{
  background:var(--s1);
  border:1px solid var(--w);
  border-radius:14px;
  padding:26px 28px;
  display:flex;align-items:center;gap:22px;
  cursor:pointer;
  transition:border-color .25s,transform .3s cubic-bezier(.34,1.2,.64,1),background .2s;
  text-decoration:none;color:inherit;
  animation:sci .4s ease both;
}
.sc:hover{transform:translateY(-3px)}
@keyframes sci{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.sc-icon{
  width:52px;height:52px;border-radius:13px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  border:1px solid;
  transition:box-shadow .25s;
}
.sc:hover .sc-icon{box-shadow:0 0 20px var(--sc-shadow,transparent)}

.sc-content{flex:1;min-width:0}
.sc-top{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.sc-name{font-family:var(--fh);font-size:18px;font-weight:800;letter-spacing:-.02em}
.sc-handle{font-family:var(--fm);font-size:10px;letter-spacing:.08em;
  color:var(--t3);padding:2px 8px;background:var(--s2);border:1px solid var(--w);border-radius:4px}
.sc-desc{font-size:13px;color:var(--t2);line-height:1.65}

.sc-btn{
  flex-shrink:0;
  display:inline-flex;align-items:center;gap:7px;
  padding:10px 20px;border-radius:8px;
  font-family:var(--fb);font-size:13px;font-weight:600;
  border:1px solid;background:transparent;
  cursor:pointer;text-decoration:none;
  transition:opacity .2s,box-shadow .2s;
  white-space:nowrap;
}
.sc-btn:hover{opacity:.8}

@media(max-width:600px){.sc{flex-wrap:wrap}.sc-btn{width:100%;justify-content:center}}

/* SUPPORT CARD — special 2-col layout */
.support-card{
  background:var(--s1);
  border:1px solid var(--w);
  border-radius:14px;
  overflow:hidden;
  margin-bottom:80px;
  animation:sci .4s ease both;
  animation-delay:240ms;
}
.support-top-bar{height:1px;background:linear-gradient(90deg,rgba(100,180,255,.5),transparent)}
.support-inner{
  display:grid;grid-template-columns:1fr auto;
  align-items:center;gap:32px;
  padding:30px 32px;
}
@media(max-width:640px){.support-inner{grid-template-columns:1fr}}
.support-left{}
.support-chip{
  display:inline-flex;align-items:center;gap:5px;
  font-family:var(--fm);font-size:9px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--t3);border:1px solid var(--w2);border-radius:4px;
  padding:3px 9px;margin-bottom:13px;
}
.support-h{font-family:var(--fh);font-size:22px;font-weight:800;letter-spacing:-.025em;margin-bottom:8px}
.support-p{font-size:13px;color:var(--t2);line-height:1.7;margin-bottom:18px;max-width:420px}
.support-email{
  display:inline-flex;align-items:center;gap:8px;
  font-family:var(--fm);font-size:12px;
  color:var(--t2);
  background:var(--s2);border:1px solid var(--w);border-radius:6px;
  padding:7px 13px;text-decoration:none;
  transition:border-color .2s,color .2s;
}
.support-email:hover{border-color:var(--w2);color:var(--t1)}
.support-btns{display:flex;flex-direction:column;gap:8px;align-items:stretch;min-width:160px}
@media(max-width:640px){.support-btns{flex-direction:row;flex-wrap:wrap}}
.sup-btn{
  display:flex;align-items:center;justify-content:center;gap:7px;
  padding:11px 20px;border-radius:8px;
  font-family:var(--fb);font-size:13px;font-weight:600;
  border:1px solid;text-decoration:none;
  transition:opacity .2s;cursor:pointer;background:transparent;
}
.sup-btn:hover{opacity:.75}
`}</style>

    <div className="comm-page">
      <div className="z1">
        <div className="cx">
          {/* HERO */}
          <div className="c-hero">
            <div className="c-hero-layout">
              <div className="c-hero-text">
                <div className="eyebrow">
                  <div className="eyebrow-line" />
                  Community
                  <div className="eyebrow-line" />
                </div>
                <h1 className="c-hero-h">
                  Join the
                  <br />
                  <span className="dim">Pixel</span> Community
                </h1>
                <p className="c-hero-p">
                  News, announcements, and direct chat with the team. Follow us
                  to stay ahead of every update.
                </p>
              </div>
              <div className="c-hero-img-wrap">
                <div className="c-hero-glow" />
                <img
                  className="c-hero-char"
                  src="/img/herocomm.png"
                  alt="community hero"
                />
              </div>
            </div>
          </div>

          {/* SOCIAL PLATFORMS */}
          <div className="sh">
            <div>
              <div className="sh-title">Socials</div>
              <div className="sh-sub">
                // Stay connected across all platforms
              </div>
            </div>
          </div>
          <div className="div" />

          <div className="socials-list">
            {SOCIALS.map((s, idx) => (
              <a
                key={s.id}
                className="sc"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={
                  {
                    animationDelay: `${idx * 70}ms`,
                    "--sc-shadow": s.color + "30",
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    s.color + "44";
                  (e.currentTarget as HTMLElement).style.background = s.bg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--w)";
                  (e.currentTarget as HTMLElement).style.background =
                    "var(--s1)";
                }}
              >
                <div
                  className="sc-icon"
                  style={{
                    background: s.bg,
                    borderColor: s.border,
                    color: s.color,
                  }}
                >
                  {s.icon}
                </div>
                <div className="sc-content">
                  <div className="sc-top">
                    <span className="sc-name" style={{ color: s.color }}>
                      {s.name}
                    </span>
                    <span className="sc-handle">{s.handle}</span>
                  </div>
                  <div className="sc-desc">{s.desc}</div>
                </div>
                <div
                  className="sc-btn"
                  style={{
                    color: s.color,
                    borderColor: s.color + "40",
                    background: s.bg,
                  }}
                >
                  {s.label}
                  <ExternalLink size={12} />
                </div>
              </a>
            ))}
          </div>

          {/* SUPPORT CARD */}
          <div className="sh">
            <div>
              <div className="sh-title">Support</div>
              <div className="sh-sub">
                // Payment issues, reports & suggestions
              </div>
            </div>
          </div>
          <div className="div" />

          <div className="support-card">
            <div className="support-top-bar" />
            <div className="support-inner">
              <div className="support-left">
                <div className="support-chip">
                  <Mail size={9} />
                  24h Response Time
                </div>
                <div className="support-h">Get in Touch</div>
                <p className="support-p">
                  Payment issues, ban appeals, reports, and suggestions — our
                  team replies within 24 hours. Reach us via Telegram for the
                  fastest response.
                </p>
                <a href="mailto:pixelhytale@mail.ru" className="support-email">
                  <Mail size={13} />
                  pixelhytale@mail.ru
                </a>
              </div>
              <div className="support-btns">
                <a
                  href="https://t.me/AssistantForAll"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sup-btn"
                  style={{
                    color: "#0088cc",
                    borderColor: "rgba(0,136,204,.35)",
                    background: "rgba(0,136,204,.08)",
                  }}
                >
                  <Send size={13} />
                  Telegram Support
                </a>
                <a
                  href="mailto:pixelhytale@mail.ru"
                  className="sup-btn"
                  style={{
                    color: "var(--t2)",
                    borderColor: "var(--w)",
                    background: "var(--s2)",
                  }}
                >
                  <Mail size={13} />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
