import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  ShieldOff,
  Globe,
  Lock,
  Scale,
  AlertTriangle,
  User,
  BookOpen,
} from "lucide-react";

const SITE = "https://pixelhytale.pages.dev";
const SUPPORT_EMAIL = "pixelhytale@mail.ru";
const OWNER_NAME = "Galuzo Artem Mikhailovich";
const OWNER_INN = "502505389890";
const EFFECTIVE_DATE = "01.06.2025";

const SECTIONS = [
  {
    id: "s1",
    num: "1",
    title: "Definitions",
    color: "#a78bfa",
    icon: <BookOpen size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "1.1",
        text: `Platform — the website and associated services operated by the Administration, accessible at ${SITE}.`,
      },
      {
        id: "1.2",
        text: "User — any individual who accesses, browses, or uses the Platform in any way.",
      },
      {
        id: "1.3",
        text: `Administration — self-employed individual ${OWNER_NAME} (INN: ${OWNER_INN}), the rights holder and lawful administrator of the Platform.`,
      },
      {
        id: "1.4",
        text: "Virtual Goods — intangible digital items including in-game ranks, privileges, cosmetics, starter packs, and any other non-physical products offered through the Platform.",
      },
      {
        id: "1.5",
        text: "Agreement — this User Agreement in its current published version, constituting a public offer pursuant to applicable law.",
      },
      { id: "1.6", text: "Parties — the User and the Administration jointly." },
    ],
  },
  {
    id: "s2",
    num: "2",
    title: "Acceptance & Scope",
    color: "#34d399",
    icon: <FileText size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "2.1",
        text: "This Agreement constitutes a public offer (публичная оферта) in accordance with Article 437 of the Civil Code of the Russian Federation. By accessing or using the Platform in any manner, the User automatically and unconditionally accepts all terms of this Agreement.",
      },
      {
        id: "2.2",
        text: "If the User does not agree with any provision of this Agreement, they must immediately cease all use of the Platform.",
      },
      {
        id: "2.3",
        text: "The Administration reserves the right to amend this Agreement at any time without prior notice. The updated version takes effect upon publication. The User is solely responsible for regularly reviewing this Agreement.",
      },
      {
        id: "2.4",
        text: "This Agreement applies globally. International Users acknowledge that local consumer protection laws of their jurisdiction may not apply and that this Agreement takes precedence to the maximum extent permitted by law.",
      },
      {
        id: "2.5",
        text: "The User confirms they are of legal age in their jurisdiction. If the User is a minor, they must obtain parental or guardian consent prior to any purchase. The Administration does not knowingly provide paid services to individuals under 14 years of age.",
      },
    ],
  },
  {
    id: "s3",
    num: "3",
    title: "Platform Purpose & Permitted Use",
    color: "#60a5fa",
    icon: <Globe size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "3.1",
        text: "The Platform provides Users with the ability to browse information about Virtual Goods, in-game services, server rules, and community content related to the Pixel Minecraft game project.",
      },
      {
        id: "3.2",
        text: "The User agrees to use the Platform solely for its intended personal, non-commercial purposes in full compliance with this Agreement, applicable law, and all published server rules.",
      },
      {
        id: "3.3",
        text: `The User must NOT: attempt unauthorized access to any part of the Platform or connected systems; use bots, scrapers, or automated tools; impersonate the Administration or other Users; perform DDoS attacks or any disruptive activity; circumvent security measures; use the Platform for commercial gain without written permission from the Administration.`,
      },
      {
        id: "3.4",
        text: "The Administration reserves the right to suspend, restrict, or terminate the User's access to the Platform at any time, for any reason or for no stated reason, without prior notice, without liability, and without compensation.",
      },
      {
        id: "3.5",
        text: "The Administration collects and stores IP addresses and technical session data for security, fraud prevention, and service improvement purposes in accordance with the Privacy Policy.",
      },
    ],
  },
  {
    id: "s4",
    num: "4",
    title: "User Obligations",
    color: "#fb923c",
    icon: <User size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "4.1",
        text: "The User agrees to provide accurate information when making purchases, including correct in-game nickname and server selection. The Administration bears no responsibility for errors attributable to the User.",
      },
      {
        id: "4.2",
        text: "The User agrees not to use the Platform for any purpose prohibited by applicable law, including but not limited to: fraud, money laundering, chargebacks for validly delivered services, or any other unlawful activity.",
      },
      {
        id: "4.3",
        text: "The User agrees to comply with all server rules and community guidelines published on the Platform. Violation of server rules may result in permanent suspension without refund.",
      },
      {
        id: "4.4",
        text: "The User agrees not to resell, transfer, share, or distribute purchased Virtual Goods or account access to third parties.",
      },
      {
        id: "4.5",
        text: "The User agrees not to initiate chargebacks or payment reversals for Services that were validly delivered. Such actions constitute a material breach of this Agreement, will result in immediate permanent suspension, and may result in legal action to recover damages.",
      },
      {
        id: "4.6",
        text: "The User agrees to indemnify and hold harmless the Administration from any claims, damages, or liabilities arising from the User's breach of this Agreement or misuse of the Platform.",
      },
    ],
  },
  {
    id: "s5",
    num: "5",
    title: "Intellectual Property",
    color: "#ec4899",
    icon: <Lock size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "5.1",
        text: "All content on the Platform — including design, graphics, text, logos, software, and Virtual Goods — is the intellectual property of the Administration and/or its licensors, protected under applicable intellectual property law.",
      },
      {
        id: "5.2",
        text: "The User receives no license, copyright, or other intellectual property rights in any Platform content through use of the Platform or purchase of Virtual Goods.",
      },
      {
        id: "5.3",
        text: "Purchased Virtual Goods constitute a limited, personal, non-exclusive, non-transferable, revocable license to access specific in-game features. This license may be revoked by the Administration at any time without compensation for violation of this Agreement or server rules.",
      },
      {
        id: "5.4",
        text: "The User must not copy, reproduce, distribute, modify, or create derivative works from any Platform content without prior written consent from the Administration.",
      },
    ],
  },
  {
    id: "s6",
    num: "6",
    title: "Liability & Disclaimers",
    color: "#f43f5e",
    icon: <ShieldOff size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "6.1",
        text: "The Platform and all Services are provided on an 'AS IS' and 'AS AVAILABLE' basis without warranties of any kind, express or implied.",
      },
      {
        id: "6.2",
        text: "The Administration does not warrant that: the Platform will operate without interruption or errors; Virtual Goods will retain any specific value, functionality, or feature set over time; game servers will be permanently available.",
      },
      {
        id: "6.3",
        text: "The Administration shall not be liable for any indirect, incidental, consequential, punitive, or exemplary damages, including lost profits, data loss, or loss of goodwill.",
      },
      {
        id: "6.4",
        text: "The Administration's total liability to any User under any circumstances is strictly limited to the amount paid by that User for the specific disputed Service in the 30 days preceding the claim.",
      },
      {
        id: "6.5",
        text: "The Administration is not liable for force majeure events including natural disasters, acts of war, epidemics, government actions, DDoS attacks, infrastructure failures, or events beyond the Administration's reasonable control.",
      },
      {
        id: "6.6",
        text: "The Administration is not responsible for the actions or omissions of third-party payment providers, internet service providers, or other third-party services.",
      },
      {
        id: "6.7",
        text: "The Administration shall have the absolute right to ban, suspend, or permanently remove any User for violations of server rules or at the Administration's sole discretion, without obligation to provide refunds for unused portions of purchased privileges.",
      },
      {
        id: "6.8",
        text: "The User accepts full personal responsibility for all risks associated with the use of the Platform and purchase of Virtual Goods, acknowledging the inherently transient nature of digital gaming products.",
      },
    ],
  },
  {
    id: "s7",
    num: "7",
    title: "Governing Law & Disputes",
    color: "#06b6d4",
    icon: <Scale size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "7.1",
        text: 'This Agreement is governed by and construed in accordance with the laws of the Russian Federation, including the Civil Code of the Russian Federation, Federal Law No. 149-FZ "On Information," and other applicable legislation.',
      },
      {
        id: "7.2",
        text: "All disputes shall first be subject to a mandatory 30-day pre-trial negotiation procedure. The User must submit a written claim to the Administration before initiating any legal proceedings.",
      },
      {
        id: "7.3",
        text: "If not resolved through negotiation, disputes shall be submitted to a court of general jurisdiction at the location of the Administration in the Russian Federation.",
      },
      {
        id: "7.4",
        text: "If any provision of this Agreement is found invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
      },
    ],
  },
  {
    id: "s8",
    num: "8",
    title: "Administration Details",
    color: "#8b5cf6",
    icon: <FileText size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "8.1",
        text: `Legal status: Self-Employed Individual (Самозанятый), registered under Federal Law No. 422-FZ`,
      },
      { id: "8.2", text: `Full name: ${OWNER_NAME}` },
      { id: "8.3", text: `INN (Tax Identification Number): ${OWNER_INN}` },
      { id: "8.4", text: `Platform: ${SITE}` },
      { id: "8.5", text: `Support & claims: ${SUPPORT_EMAIL}` },
      { id: "8.6", text: `Agreement effective date: ${EFFECTIVE_DATE}` },
    ],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;--w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);--w3:rgba(255,255,255,.18);--t1:#eaeaf4;--t2:#76769a;--t3:#40405a;--fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace;}
html,body{background:var(--bg);color:var(--t1);font-family:var(--fb);-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--w2);border-radius:2px}
.lp{min-height:100vh;background:var(--bg);position:relative}
.lp::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");background-size:300px 300px;opacity:.018}
.lp::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(var(--w) 1px,transparent 1px),linear-gradient(90deg,var(--w) 1px,transparent 1px);background-size:80px 80px;opacity:.5}
.z1{position:relative;z-index:1}.cx{max-width:900px;margin:0 auto;padding:0 28px}
.hero{padding:80px 0 52px}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--fm);font-size:10px;color:var(--t3);letter-spacing:.15em;text-transform:uppercase;margin-bottom:18px}
.eyebrow-line{width:22px;height:1px;background:var(--w3)}
.hero-h{font-family:var(--fh);font-size:clamp(32px,5.5vw,58px);font-weight:800;line-height:.96;letter-spacing:-.03em;margin-bottom:16px;color:var(--t1)}
.hero-h .dim{color:rgba(255,255,255,.12)}
.hero-p{font-size:13px;color:var(--t2);line-height:1.75;max-width:520px;margin-bottom:28px}
.meta{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:6px;font-family:var(--fm);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);border:1px solid var(--w2);border-radius:5px;padding:4px 10px;background:var(--s2)}
.sh-t{font-family:var(--fh);font-size:16px;font-weight:700;letter-spacing:-.015em}
.sh-s{font-family:var(--fm);font-size:10px;color:var(--t3);margin-top:4px;letter-spacing:.06em}
.divider{height:1px;background:var(--w);margin-bottom:24px}
.secs{display:flex;flex-direction:column;gap:8px;margin-bottom:80px}
.sec{background:var(--s1);border:1px solid var(--w);border-radius:12px;overflow:hidden;transition:border-color .25s;animation:si .35s ease both}
@keyframes si{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
.sec.open{border-color:var(--lc)}
.sec-bar{height:1px;transition:background .3s}
.sec-head{display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;transition:background .2s;user-select:none}
.sec-head:hover{background:var(--s2)}
.sec-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid;transition:box-shadow .25s}
.sec.open .sec-icon{box-shadow:0 0 14px var(--ls)}
.sec-num{font-family:var(--fm);font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);margin-bottom:2px}
.sec-title{font-family:var(--fh);font-size:14px;font-weight:800;letter-spacing:-.015em}
.sec-cnt{font-family:var(--fm);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);border:1px solid var(--w);background:var(--s2);padding:2px 7px;border-radius:4px;margin-left:auto;flex-shrink:0}
.sec-chev{color:var(--t3);flex-shrink:0;transition:transform .3s cubic-bezier(.34,1.2,.64,1)}
.sec.open .sec-chev{transform:rotate(180deg)}
.sec-body{overflow:hidden;max-height:0;transition:max-height .45s cubic-bezier(.4,0,.2,1)}
.sec.open .sec-body{max-height:4000px}
.items{border-top:1px solid var(--w)}
.item{display:flex;gap:14px;padding:14px 20px;border-bottom:1px solid var(--w);transition:background .15s}
.item:last-child{border-bottom:none}
.item:hover{background:var(--s2)}
.item-id{font-family:var(--fm);font-size:11px;font-weight:600;letter-spacing:.04em;flex-shrink:0;margin-top:2px;min-width:28px}
.item-text{font-size:13px;color:var(--t2);line-height:1.75}
`;

export const Terms: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen(open === id ? null : id);

  return (
    <>
      <style>{CSS}</style>
      <div className="lp">
        <div className="z1">
          <div className="cx">
            <div className="hero">
              <div className="eyebrow">
                <div className="eyebrow-line" />
                Legal
                <div className="eyebrow-line" />
              </div>
              <h1 className="hero-h">
                Terms of <span className="dim">Service</span>
              </h1>
              <p className="hero-p">
                User Agreement governing access to and use of the Pixel Platform
                at {SITE}. By using this site in any way you unconditionally
                accept every clause of this Agreement.
              </p>
              <div className="meta">
                <span className="chip">
                  <AlertTriangle size={9} />
                  Legally binding
                </span>
                <span className="chip">Administration: {OWNER_NAME}</span>
                <span className="chip">INN {OWNER_INN}</span>
                <span className="chip">Global · English</span>
                <span className="chip">Effective: {EFFECTIVE_DATE}</span>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div className="sh-t">Agreement Sections</div>
              <div className="sh-s">// Applies to all users worldwide</div>
            </div>
            <div className="divider" />

            <div className="secs">
              {SECTIONS.map((sec, idx) => {
                const isOpen = open === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`sec${isOpen ? " open" : ""}`}
                    style={
                      {
                        "--lc": sec.color + "44",
                        "--ls": sec.color + "35",
                        animationDelay: `${idx * 45}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className="sec-bar"
                      style={{
                        background: isOpen
                          ? `linear-gradient(90deg,${sec.color}70,transparent)`
                          : "transparent",
                      }}
                    />
                    <div className="sec-head" onClick={() => toggle(sec.id)}>
                      <div
                        className="sec-icon"
                        style={{
                          background: sec.color + "10",
                          borderColor: sec.color + "30",
                          color: sec.color,
                        }}
                      >
                        {sec.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="sec-num">Section {sec.num}</div>
                        <div className="sec-title">{sec.title}</div>
                      </div>
                      <div className="sec-cnt">{sec.items.length} clauses</div>
                      <div className="sec-chev">
                        <ChevronDown size={15} />
                      </div>
                    </div>
                    <div className="sec-body">
                      <div className="items">
                        {sec.items.map((item) => (
                          <div key={item.id} className="item">
                            <span
                              className="item-id"
                              style={{ color: sec.color }}
                            >
                              {item.id}
                            </span>
                            <span className="item-text">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
