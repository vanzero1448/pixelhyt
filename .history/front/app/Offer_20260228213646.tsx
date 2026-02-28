import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  ShieldOff,
  CreditCard,
  Zap,
  AlertTriangle,
  Scale,
  RefreshCw,
} from "lucide-react";

const SITE = "https://pixelhytale.pages.dev";
const SUPPORT_EMAIL = "support@pixelhytale.pages.dev";
const OWNER_NAME = "Galuzo Artem Mikhailovich";
const OWNER_INN = "502505389890";
const EFFECTIVE_DATE = "01.06.2025";

const SECTIONS = [
  {
    id: "s1",
    num: "1",
    title: "Subject of Agreement",
    color: "#a78bfa",
    icon: <FileText size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "1.1",
        text: `This Public Offer (hereinafter — "the Offer") constitutes an official proposal by the self-employed individual ${OWNER_NAME} (INN: ${OWNER_INN}, hereinafter — "the Provider") to any capable individual (hereinafter — "the Customer") to enter into a Digital Services Agreement on the terms set forth herein. The Platform is accessible at: ${SITE}.`,
      },
      {
        id: "1.2",
        text: 'The Provider renders services consisting of granting access to digital content in the form of in-game privileges, ranks, cosmetic items, starter packs, and other virtual goods on the Pixel Minecraft game servers (hereinafter — "the Services" or "Virtual Goods").',
      },
      {
        id: "1.3",
        text: "Acceptance (акцепт) of this Offer is deemed to occur at the moment the Customer completes any payment directed at purchasing Services through the available payment methods on the Platform. No separate written agreement is required.",
      },
      {
        id: "1.4",
        text: "By accepting this Offer, the Customer confirms full acquaintance with and unconditional agreement to all terms herein. The Customer acknowledges that Virtual Goods are intangible digital products that do not constitute physical goods and are not subject to consumer protection regulations governing tangible property.",
      },
      {
        id: "1.5",
        text: `The Services are provided on an international basis via the Platform at ${SITE}. Customers located outside the Russian Federation accept that this Offer is governed by the laws of the Russian Federation and that local consumer protection laws of their jurisdiction may not apply.`,
      },
      {
        id: "1.6",
        text: 'The Provider acts as a self-employed individual (самозанятый) under Federal Law No. 422-FZ of 27.11.2018 "On Conducting an Experiment to Establish a Special Tax Regime." The Provider\'s activities are lawful and duly registered with the Federal Tax Service of the Russian Federation.',
      },
    ],
  },
  {
    id: "s2",
    num: "2",
    title: "Prices & Payment",
    color: "#34d399",
    icon: <CreditCard size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "2.1",
        text: `Prices for Services are displayed on the donate page of the Platform (${SITE}/donate) and may be denominated in USD or RUB at the Provider's discretion. The Provider may change prices at any time without prior notice. The price valid at the moment of payment initiation applies to that specific transaction.`,
      },
      {
        id: "2.2",
        text: "Payment is processed through Robokassa (Robofinance LLC, a licensed Russian payment operator) and other available payment systems. The Provider does not handle, store, or process payment card data. All payment processing is performed by the respective payment operator.",
      },
      {
        id: "2.3",
        text: "Prices displayed in USD are converted to RUB at the exchange rate of the Central Bank of the Russian Federation at the time of payment initiation. Actual charge in RUB may differ marginally due to exchange rate fluctuations between price display and payment confirmation. This difference is not grounds for a refund.",
      },
      {
        id: "2.4",
        text: "The Customer bears sole responsibility for all transaction fees, bank commissions, currency conversion fees, taxes, duties, and levies applicable in their country of residence in connection with the purchase.",
      },
      {
        id: "2.5",
        text: "The Provider reserves the right to modify pricing, introduce new tiers, discontinue packages, or apply promotional discounts at any time. Previously purchased Services are not subject to retroactive repricing.",
      },
      {
        id: "2.6",
        text: "Payment is considered successfully received upon confirmation from the payment processor. The Provider is not responsible for payment failures, declines, or delays caused by the Customer's bank, payment provider, or third-party systems.",
      },
    ],
  },
  {
    id: "s3",
    num: "3",
    title: "Service Delivery",
    color: "#60a5fa",
    icon: <Zap size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "3.1",
        text: "The Provider delivers Services by automatically activating in-game privileges on the selected game server upon confirmed receipt of payment, typically within 1–15 minutes. The Provider does not guarantee any specific activation timeframe.",
      },
      {
        id: "3.2",
        text: "The Customer must provide an accurate in-game nickname and select the correct server at the time of purchase. The Provider bears no responsibility for errors in the information specified by the Customer. No refund or re-activation is performed in cases of Customer error.",
      },
      {
        id: "3.3",
        text: "Services are deemed fully rendered from the moment of privilege activation on the game server. The service is delivered in digital/electronic form and no physical delivery is performed. The Customer expressly agrees to receive services in digital form and acknowledges receipt upon activation.",
      },
      {
        id: "3.4",
        text: "The Provider makes no guarantees regarding continuous availability of game servers, specific features, commands, or privileges. Game mechanics, commands, and features may be altered, limited, or removed at any time due to game updates, technical constraints, or administrative decisions, without compensation to the Customer.",
      },
      {
        id: "3.5",
        text: "The Provider reserves the right to modify, suspend, or permanently discontinue any Services, server features, game modes, or the Platform itself at any time, for any reason, without prior notice and without obligation to provide refunds.",
      },
      {
        id: "3.6",
        text: "Temporary unavailability of Services due to server maintenance, technical works, updates, or force majeure does not constitute grounds for a refund, provided the activation was previously completed.",
      },
    ],
  },
  {
    id: "s4",
    num: "4",
    title: "Rights & Obligations of the Parties",
    color: "#fb923c",
    icon: <Scale size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "4.1",
        text: "The Provider undertakes to: render Services upon confirmed payment; provide contact for support inquiries; maintain operation of the Platform to the extent reasonably possible.",
      },
      {
        id: "4.2",
        text: "The Provider reserves the right to: refuse service or cancel orders at its sole discretion; suspend or permanently terminate access for any Customer without stating reasons, including for violations of game rules, suspected fraud, chargebacks, or abusive behavior; modify service conditions, rank benefits, or game privileges at any time without compensation.",
      },
      {
        id: "4.3",
        text: "The Customer undertakes to: pay the full price for selected Services; provide accurate information (nickname, server) at purchase; use Services solely for lawful personal purposes; comply with all server rules published on the Platform.",
      },
      {
        id: "4.4",
        text: "The Customer acknowledges that purchased Services are strictly personal and non-transferable. Sharing, reselling, or transferring in-game privileges to third parties is prohibited and may result in permanent suspension without refund.",
      },
      {
        id: "4.5",
        text: "The Customer expressly waives any right to dispute, reverse, or chargeback any payment for Services that were successfully activated, regardless of subsequent changes to server features, rules, or availability.",
      },
      {
        id: "4.6",
        text: "The Customer is solely responsible for maintaining the security of their game account and login credentials. The Provider bears no responsibility for unauthorized access to the Customer's account by third parties.",
      },
    ],
  },
  {
    id: "s5",
    num: "5",
    title: "Liability & Disclaimers",
    color: "#f43f5e",
    icon: <ShieldOff size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "5.1",
        text: "The Provider shall not be liable for inability to use Services due to circumstances beyond the Provider's reasonable control, including: technical failures, third-party service outages, DDoS attacks, force majeure events, power outages, actions of third parties, or changes in applicable law.",
      },
      {
        id: "5.2",
        text: "The Provider shall not be liable for any data loss, game progress loss, in-game currency loss, or any other in-game loss resulting from server resets, updates, technical failures, or administrative decisions.",
      },
      {
        id: "5.3",
        text: "All Services are provided strictly on an 'AS IS' and 'AS AVAILABLE' basis, without warranties of any kind, either express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.",
      },
      {
        id: "5.4",
        text: "The Provider's total aggregate liability to any Customer under any circumstances shall not exceed the amount actually paid by that Customer for the specific disputed Service. Under no circumstances shall the Provider be liable for indirect, incidental, consequential, special, punitive, or exemplary damages.",
      },
      {
        id: "5.5",
        text: "The Provider shall not be liable for financial losses, lost profits, or any economic damage suffered by the Customer in connection with use or inability to use the Services.",
      },
      {
        id: "5.6",
        text: "The Provider shall have the absolute right to ban, mute, suspend, or permanently remove any Customer for violations of server rules or at the Provider's sole discretion, without obligation to refund any unused portion of purchased privileges.",
      },
      {
        id: "5.7",
        text: "The Customer agrees to indemnify, defend, and hold harmless the Provider from any claims, damages, liabilities, costs, or expenses arising from the Customer's use or misuse of the Services or violation of this Offer.",
      },
    ],
  },
  {
    id: "s6",
    num: "6",
    title: "Refund Policy",
    color: "#eab308",
    icon: <RefreshCw size={17} strokeWidth={1.8} />,
    items: [
      {
        id: "6.1",
        text: "All sales of digital Services are final. The Customer acknowledges that digital goods are provided instantly upon payment and the right of withdrawal is waived pursuant to applicable law governing digital content.",
      },
      {
        id: "6.2",
        text: "A refund may be considered exclusively where: (a) the Service was not activated within 72 hours of confirmed payment; AND (b) the failure was solely attributable to a technical fault on the Provider's side; AND (c) the Customer submits a written request with proof of payment within the 72-hour period.",
      },
      {
        id: "6.3",
        text: "No refunds will be issued for: incorrectly entered nicknames or server selections by the Customer; voluntary non-use of privileges; account bans due to rule violations; dissatisfaction with game features; changes to server mechanics; payment reversals after successful activation; or any reason not covered by clause 6.2.",
      },
      {
        id: "6.4",
        text: "Initiating a chargeback, payment dispute, or reversal through a payment provider for any Service that was successfully activated constitutes a material breach of this Offer and will result in immediate permanent suspension of all Customer accounts and may result in legal action to recover damages including the chargeback amount plus processing fees.",
      },
      {
        id: "6.5",
        text: `To request a refund under clause 6.2, the Customer must contact the Provider at: ${SUPPORT_EMAIL}, providing: full name, payment transaction ID, purchase details, and description of the technical issue. The Provider's decision on all refund requests is final and binding.`,
      },
      {
        id: "6.6",
        text: "Approved refunds (if any) are processed within 10 business days via the same payment method used for the original transaction, subject to the payment operator's terms.",
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
        text: 'This Offer and all relations arising from it are governed by the laws of the Russian Federation, including Federal Law No. 149-FZ "On Information," Federal Law No. 152-FZ "On Personal Data," and the Civil Code of the Russian Federation.',
      },
      {
        id: "7.2",
        text: "All disputes shall first be subject to a mandatory pre-trial negotiation procedure. The Customer must submit a written claim to the Provider and allow 30 calendar days for resolution before initiating any legal proceedings.",
      },
      {
        id: "7.3",
        text: "If resolution through negotiation is not achieved within 30 days, the dispute shall be submitted to a court of general jurisdiction at the location of the Provider in the Russian Federation.",
      },
      {
        id: "7.4",
        text: "International Customers acknowledge that by accepting this Offer they submit to the jurisdiction of Russian courts for any disputes arising from this Offer.",
      },
    ],
  },
  {
    id: "s8",
    num: "8",
    title: "Provider Details",
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
      { id: "8.6", text: `Offer effective date: ${EFFECTIVE_DATE}` },
    ],
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#07070b;--s1:#0b0b11;--s2:#0f0f16;
  --w:rgba(255,255,255,.055);--w2:rgba(255,255,255,.1);--w3:rgba(255,255,255,.18);
  --t1:#eaeaf4;--t2:#76769a;--t3:#40405a;
  --fh:'Oxanium',sans-serif;--fb:'DM Sans',sans-serif;--fm:'IBM Plex Mono',monospace;
}
html,body{background:var(--bg);color:var(--t1);font-family:var(--fb);-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--w2);border-radius:2px}
.lp{min-height:100vh;background:var(--bg);position:relative}
.lp::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:300px 300px;opacity:.018}
.lp::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(var(--w) 1px,transparent 1px),linear-gradient(90deg,var(--w) 1px,transparent 1px);
  background-size:80px 80px;opacity:.5}
.z1{position:relative;z-index:1}
.cx{max-width:900px;margin:0 auto;padding:0 28px}
.hero{padding:80px 0 52px}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--fm);font-size:10px;
  color:var(--t3);letter-spacing:.15em;text-transform:uppercase;margin-bottom:18px}
.eyebrow-line{width:22px;height:1px;background:var(--w3)}
.hero-h{font-family:var(--fh);font-size:clamp(32px,5.5vw,58px);font-weight:800;
  line-height:.96;letter-spacing:-.03em;margin-bottom:16px;color:var(--t1)}
.hero-h .dim{color:rgba(255,255,255,.12)}
.hero-p{font-size:13px;color:var(--t2);line-height:1.75;max-width:520px;margin-bottom:28px}
.meta{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:6px;font-family:var(--fm);font-size:9px;
  letter-spacing:.12em;text-transform:uppercase;color:var(--t3);
  border:1px solid var(--w2);border-radius:5px;padding:4px 10px;background:var(--s2)}
.sh-t{font-family:var(--fh);font-size:16px;font-weight:700;letter-spacing:-.015em}
.sh-s{font-family:var(--fm);font-size:10px;color:var(--t3);margin-top:4px;letter-spacing:.06em}
.divider{height:1px;background:var(--w);margin-bottom:24px}
.secs{display:flex;flex-direction:column;gap:8px;margin-bottom:80px}
.sec{background:var(--s1);border:1px solid var(--w);border-radius:12px;overflow:hidden;
  transition:border-color .25s;animation:si .35s ease both}
@keyframes si{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
.sec.open{border-color:var(--lc)}
.sec-bar{height:1px;transition:background .3s}
.sec-head{display:flex;align-items:center;gap:14px;padding:16px 20px;cursor:pointer;
  transition:background .2s;user-select:none}
.sec-head:hover{background:var(--s2)}
.sec-icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;
  justify-content:center;flex-shrink:0;border:1px solid;transition:box-shadow .25s}
.sec.open .sec-icon{box-shadow:0 0 14px var(--ls)}
.sec-num{font-family:var(--fm);font-size:9px;font-weight:600;letter-spacing:.14em;
  text-transform:uppercase;color:var(--t3);margin-bottom:2px}
.sec-title{font-family:var(--fh);font-size:14px;font-weight:800;letter-spacing:-.015em}
.sec-cnt{font-family:var(--fm);font-size:9px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--t3);border:1px solid var(--w);background:var(--s2);padding:2px 7px;
  border-radius:4px;margin-left:auto;flex-shrink:0}
.sec-chev{color:var(--t3);flex-shrink:0;transition:transform .3s cubic-bezier(.34,1.2,.64,1)}
.sec.open .sec-chev{transform:rotate(180deg)}
.sec-body{overflow:hidden;max-height:0;transition:max-height .45s cubic-bezier(.4,0,.2,1)}
.sec.open .sec-body{max-height:4000px}
.items{border-top:1px solid var(--w)}
.item{display:flex;gap:14px;padding:14px 20px;border-bottom:1px solid var(--w);transition:background .15s}
.item:last-child{border-bottom:none}
.item:hover{background:var(--s2)}
.item-id{font-family:var(--fm);font-size:11px;font-weight:600;letter-spacing:.04em;
  flex-shrink:0;margin-top:2px;min-width:28px}
.item-text{font-size:13px;color:var(--t2);line-height:1.75}
`;

export const Offer: React.FC = () => {
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
                Public <span className="dim">Offer</span>
                <br />
                Agreement
              </h1>
              <p className="hero-p">
                Digital Services Agreement governing the purchase of in-game
                privileges and virtual goods on the Pixel platform. Payment
                constitutes unconditional acceptance of all terms herein.
              </p>
              <div className="meta">
                <span className="chip">
                  <AlertTriangle size={9} />
                  Legally binding
                </span>
                <span className="chip">Self-employed: {OWNER_NAME}</span>
                <span className="chip">INN {OWNER_INN}</span>
                <span className="chip">Robokassa · Multi-currency</span>
                <span className="chip">Effective: {EFFECTIVE_DATE}</span>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div className="sh-t">Agreement Sections</div>
              <div className="sh-s">
                // Read carefully before making a purchase
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
