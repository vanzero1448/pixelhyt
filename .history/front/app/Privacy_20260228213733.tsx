import React, { useState } from "react";
import {
  Shield,
  ChevronDown,
  Eye,
  Lock,
  Database,
  Globe,
  UserCheck,
  AlertTriangle,
  RefreshCw,
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
    icon: <Shield size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "1.1",
        text: `Operator — self-employed individual ${OWNER_NAME} (INN: ${OWNER_INN}), acting as the personal data operator for the Platform (${SITE}) in accordance with Federal Law No. 152-FZ of 27.07.2006 "On Personal Data."`,
      },
      {
        id: "1.2",
        text: "Personal Data — any information that directly or indirectly identifies or can identify a natural person (data subject), as defined by Federal Law No. 152-FZ.",
      },
      {
        id: "1.3",
        text: "Processing — any operation or set of operations performed on Personal Data, whether automated or manual, including collection, recording, organization, accumulation, storage, clarification, retrieval, use, transfer, anonymization, blocking, deletion, or destruction.",
      },
      {
        id: "1.4",
        text: `User — any individual who accesses or uses the Platform at ${SITE} in any manner.`,
      },
      {
        id: "1.5",
        text: "Cookies — small text files stored on the User's device by the browser upon visiting the Platform, used to maintain session state and collect analytics.",
      },
    ],
  },
  {
    id: "s2",
    num: "2",
    title: "General Provisions",
    color: "#34d399",
    icon: <Eye size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "2.1",
        text: 'This Privacy Policy (hereinafter — Policy) governs the collection, use, storage, and protection of Personal Data of Users of the Platform in accordance with the requirements of Federal Law No. 152-FZ "On Personal Data" and GDPR principles.',
      },
      {
        id: "2.2",
        text: "By accessing or using the Platform in any manner, the User gives informed and voluntary consent to the collection and processing of their Personal Data as described in this Policy. Consent is given for the purposes, methods, and terms described herein.",
      },
      {
        id: "2.3",
        text: "If the User does not consent to this Policy, they must immediately cease all use of the Platform and may request deletion of previously collected data as provided in Section 7.",
      },
      {
        id: "2.4",
        text: "This Policy applies globally to all Users regardless of country of residence. International Users acknowledge that data may be processed in the Russian Federation under Russian data protection legislation.",
      },
      {
        id: "2.5",
        text: "The Operator reserves the right to amend this Policy at any time. The updated Policy takes effect upon publication at the Platform URL. Continued use constitutes acceptance of the updated Policy.",
      },
    ],
  },
  {
    id: "s3",
    num: "3",
    title: "Data We Collect",
    color: "#60a5fa",
    icon: <Database size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "3.1",
        text: "Upon purchase, the Operator collects: in-game nickname (Minecraft username); payment transaction identifiers provided by the payment processor (not full card data — card processing is handled exclusively by Robokassa/payment operator); purchase history and selected products.",
      },
      {
        id: "3.2",
        text: "Automatically upon visiting the Platform, the Operator may collect: IP address; browser type and version; operating system; pages visited and time spent; referral sources; device type; anonymized session identifiers; cookie data.",
      },
      {
        id: "3.3",
        text: "The Operator does NOT collect: full payment card numbers or CVV codes; government-issued ID documents; biometric data; health information; political or religious beliefs; data from individuals known to be under 14 years of age.",
      },
      {
        id: "3.4",
        text: "Cookies are used for: session state maintenance; anonymized analytics (page views, visit duration); fraud and abuse prevention; Platform functionality improvements. No advertising or cross-site tracking cookies are used.",
      },
      {
        id: "3.5",
        text: "The User may disable cookies in browser settings at any time. Disabling session-essential cookies may impair or prevent Platform functionality, including the purchase flow.",
      },
    ],
  },
  {
    id: "s4",
    num: "4",
    title: "Purpose & Legal Basis of Processing",
    color: "#fb923c",
    icon: <UserCheck size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "4.1",
        text: "Personal Data is processed exclusively for the following purposes: (a) identifying Users to fulfil purchase orders; (b) activating and managing in-game privileges; (c) providing customer support and responding to claims; (d) preventing fraud, abuse, and unauthorized access; (e) improving Platform functionality; (f) complying with applicable legal obligations.",
      },
      {
        id: "4.2",
        text: "Legal bases for processing under Russian law and GDPR: (a) performance of a contract (order fulfilment); (b) legitimate interests of the Operator (security, fraud prevention); (c) compliance with legal obligations; (d) User's consent as provided in Section 2.",
      },
      {
        id: "4.3",
        text: "The Operator will not use Personal Data for purposes beyond those stated in this Policy without obtaining additional explicit consent from the User.",
      },
      {
        id: "4.4",
        text: "Data minimization principle: the Operator collects only the minimum data necessary to fulfil the stated purposes.",
      },
    ],
  },
  {
    id: "s5",
    num: "5",
    title: "Data Storage & Security",
    color: "#f43f5e",
    icon: <Lock size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "5.1",
        text: "Personal Data is stored for the period necessary to fulfil the purposes described, but no longer than: 3 years from the last purchase for transaction-related data; 1 year from the last visit for analytics data; or as required by applicable law, whichever is longer.",
      },
      {
        id: "5.2",
        text: "The Operator implements reasonable technical and organizational security measures including: access controls and authentication; encrypted data transmission (HTTPS/TLS); separation of payment processing from Platform data (Robokassa handles all card data under PCI DSS).",
      },
      {
        id: "5.3",
        text: "No internet transmission or electronic storage is 100% secure. The Operator cannot guarantee absolute security of Personal Data against unauthorized access beyond its reasonable control.",
      },
      {
        id: "5.4",
        text: "In the event of a data security incident materially affecting Users, the Operator will take steps to notify affected Users within the timeframes required by applicable law.",
      },
      {
        id: "5.5",
        text: "The User is responsible for maintaining the confidentiality of their game account credentials. The Operator bears no liability for unauthorized access to the Customer's account resulting from the Customer's negligence.",
      },
    ],
  },
  {
    id: "s6",
    num: "6",
    title: "Data Sharing & Third Parties",
    color: "#eab308",
    icon: <Globe size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "6.1",
        text: "The Operator does NOT sell, rent, or trade Personal Data to third parties for commercial, marketing, or any other purposes.",
      },
      {
        id: "6.2",
        text: "Personal Data may be shared only with: (a) payment processors (Robokassa/Robofinance LLC) for transaction processing — only data necessary for payment; (b) hosting and infrastructure providers for Platform operation; (c) game server infrastructure for privilege activation (nickname only).",
      },
      {
        id: "6.3",
        text: "Personal Data will be disclosed to state authorities upon lawful written request in accordance with Russian Federation law. The Operator will notify the User of such disclosure where legally permitted.",
      },
      {
        id: "6.4",
        text: "All third-party service providers are bound by confidentiality obligations and may only use data for the specific operational purpose for which it was shared.",
      },
      {
        id: "6.5",
        text: "Cookie and analytics data are not shared with advertising networks, social media platforms, or data brokers.",
      },
    ],
  },
  {
    id: "s7",
    num: "7",
    title: "User Rights",
    color: "#06b6d4",
    icon: <UserCheck size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "7.1",
        text: "In accordance with Federal Law No. 152-FZ and applicable data protection principles, Users have the right to: (a) request confirmation of whether their Personal Data is being processed; (b) access a copy of their Personal Data held by the Operator; (c) request correction of inaccurate data; (d) request deletion of data (right to erasure, subject to legal retention requirements); (e) withdraw consent to processing (does not affect lawfulness of prior processing).",
      },
      {
        id: "7.2",
        text: `To exercise any of these rights, the User must submit a written request to: ${SUPPORT_EMAIL}, identifying themselves and specifying the requested action.`,
      },
      {
        id: "7.3",
        text: "The Operator will respond to valid, verifiable requests within 30 calendar days. The Operator reserves the right to verify the identity of the requestor before fulfilling any data request.",
      },
      {
        id: "7.4",
        text: "Certain data may be retained after a deletion request where required by law (e.g., financial records) or for legitimate purposes such as fraud prevention and dispute resolution.",
      },
    ],
  },
  {
    id: "s8",
    num: "8",
    title: "Cookies & Analytics",
    color: "#ec4899",
    icon: <Eye size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "8.1",
        text: "The Platform uses cookies and similar technologies to maintain functionality and collect anonymized usage data. No personally identifying information is stored in cookies.",
      },
      {
        id: "8.2",
        text: "Cookie categories: (a) Strictly necessary — required for Platform operation and purchase flow; (b) Functional — session state and User preferences; (c) Analytics — anonymized page view statistics and performance monitoring.",
      },
      {
        id: "8.3",
        text: "No advertising, retargeting, or cross-site tracking cookies are used on the Platform.",
      },
      {
        id: "8.4",
        text: "Users can manage or disable cookies via browser settings at any time. Disabling strictly necessary cookies will prevent use of the purchase functionality.",
      },
    ],
  },
  {
    id: "s9",
    num: "9",
    title: "Amendments & Contact",
    color: "#8b5cf6",
    icon: <RefreshCw size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "9.1",
        text: `This Policy is effective from ${EFFECTIVE_DATE} and published at ${SITE}/privacy. The Operator may update this Policy at any time; the updated version takes effect upon publication.`,
      },
      {
        id: "9.2",
        text: `For questions, requests, or complaints regarding this Policy or Personal Data processing, contact: ${SUPPORT_EMAIL}`,
      },
      {
        id: "9.3",
        text: `Operator: ${OWNER_NAME}, self-employed individual, INN: ${OWNER_INN}`,
      },
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

export const Privacy: React.FC = () => {
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
                Privacy <span className="dim">Policy</span>
              </h1>
              <p className="hero-p">
                This Policy explains how the Pixel Platform collects, processes,
                stores, and protects your personal data in accordance with
                Federal Law No. 152-FZ and GDPR principles. Using the Platform
                constitutes acceptance of this Policy.
              </p>
              <div className="meta">
                <span className="chip">
                  <AlertTriangle size={9} />
                  152-FZ compliant
                </span>
                <span className="chip">GDPR-aware</span>
                <span className="chip">Operator: {OWNER_NAME}</span>
                <span className="chip">INN {OWNER_INN}</span>
                <span className="chip">Effective: {EFFECTIVE_DATE}</span>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div className="sh-t">Policy Sections</div>
              <div className="sh-s">
                // Your data rights and our obligations
              </div>
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
                        animationDelay: `${idx * 40}ms`,
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
