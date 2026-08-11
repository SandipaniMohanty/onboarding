import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// ─────────────────────────────────────────────────────────────
// ONBOARDING COUNTDOWN — standalone, URL-driven build
// One hosted page. Fill it via URL query params, or open the
// "Edit details" panel, fill the fields, and hit "Copy link".
// Example:
//   index.html?n=Ananya%20Rao&role=SDE-2&loc=Virtual&date=2026-08-17T09:30
// Params override the sample DEFAULT; anything omitted falls back.
// ─────────────────────────────────────────────────────────────

const WELCOMES = [
  { w: "Welcome", f: "'Space Grotesk'", lang: "English" },
  { w: "स्वागत है", f: "'Noto Sans Devanagari'", lang: "हिन्दी" },
  { w: "স্বাগতম", f: "'Noto Sans Bengali'", lang: "বাংলা" },
  { w: "வரவேற்பு", f: "'Noto Sans Tamil'", lang: "தமிழ்" },
  { w: "స్వాగతం", f: "'Noto Sans Telugu'", lang: "తెలుగు" },
  { w: "ಸ್ವಾಗತ", f: "'Noto Sans Kannada'", lang: "ಕನ್ನಡ" },
  { w: "സ്വാഗതം", f: "'Noto Sans Malayalam'", lang: "മലയാളം" },
  { w: "સ્વાગત છે", f: "'Noto Sans Gujarati'", lang: "ગુજરાતી" },
  { w: "ਜੀ ਆਇਆਂ ਨੂੰ", f: "'Noto Sans Gurmukhi'", lang: "ਪੰਜਾਬੀ" },
];

const OFFICES = {
  Bengaluru: { commute: "Nearest metro + cab drop at the gate. Parking on-site if you drive.", address: "[Bengaluru office address — fill in]", mapUrl: "" },
  Gurgaon: { commute: "Nearest metro + cab drop at the gate. Parking on-site if you drive.", address: "[Gurgaon office address — fill in]", mapUrl: "" },
  Mumbai: { commute: "Nearest local station + cab drop at the gate. Parking is tight, cab is easier.", address: "[Mumbai office address — fill in]", mapUrl: "" },
};

const DEFAULT = {
  name: "Ananya Rao",
  role: "SDE-2, Live Core",
  team: "Live Core",
  manager: "Ravi",
  location: "Bengaluru", // Bengaluru | Gurgaon | Mumbai | Virtual
  startDate: nextMonday9am(),

  reportTime: "9:30 AM",
  carry: "A government photo ID. That's it.",
  dress: "Smart casual. Nobody's in a suit, don't stress it.",
  wifi: "We hand you your laptop on day 1. Guest wifi's ready till then.",
  lunch: "Sorted. You're eating with the team, not alone at your desk. 🍱",

  // recruiter = the text-me human (always you), listed first in "people expecting you"
  recruiterName: "Sandip",
  recruiterRole: "Your recruiter (that's me 👋)",
  recruiterIntro: "I hired you, and I'm your person till you're settled. Lost, wobbling, or second-guessing? I'm the first text, not the last resort.",
  recruiterEmail: "sandip@sharechat.co",
  recruiterPhone: "+91 90000 00000",
  recruiterLinkedin: "https://www.linkedin.com/in/",

  // buddy programme
  buddyName: "Meera",
  buddyIntro: "Your week-one buddy. First stop for any 'is this a dumb question' question. (It isn't.)",
  buddyLinkedin: "https://www.linkedin.com/in/",
  buddyPhone: "+91 90000 00001",

  // manager
  managerRole: "Your manager",
  managerIntro: "The one you'll actually build with. Already cleared your first week and told the team you're on the way.",
  managerLinkedin: "https://www.linkedin.com/in/",
  managerPhone: "+91 90000 00002",

  // optional per-hire overrides (else the office defaults in OFFICES are used)
  address: "",
  mapUrl: "",

  week: [
    { d: "Day 1", t: "Land softly", note: "Laptop, access, coffee. No real work. Meet the team, find the good chai spot. ☕" },
    { d: "Day 2", t: "Lay of the land", note: "Codebase walkthrough with Ravi. Skim the docs. Ask the dumb questions now, they're free this week." },
    { d: "Day 3", t: "First real thing", note: "A small, safe task you can actually ship. Meera pairs with you on the first PR." },
    { d: "Day 4", t: "Shadow", note: "Sit in on a Live Core standup and one incident review. See how the team thinks under pressure." },
    { d: "Day 5", t: "Ship + reflect", note: "Merge something small. Retro with Ravi: what's confusing, what's missing, what we owe you." },
  ],

  faq: [
    { q: "Wait, is this actually still happening? 😅", a: "Yes. You're on the roster, your seat's assigned, and this page counts down in real time. If anything ever changes, you hear it from me first. Never silence." },
    { q: "What do I actually do on day 1?", a: "Almost nothing. Land, get your laptop, meet people, find the chai. Zero real work expected. We mean it." },
    { q: "Are dumb questions okay? 🙋", a: "This week they're free. Ask everything now: the acronyms, the who's-who, the where's-the-washroom. It only gets pricier to ask later, so cash in early." },
    { q: "What if I get cold feet or something comes up?", a: "Text me. Before you go quiet. A counteroffer, a doubt, a family thing, whatever it is, we'd rather talk it through than watch you vanish." },
    { q: "Will my laptop and access be ready?", a: "Handled before you arrive. If something's not ready on day 1, tell me and I'll chase it, not you." },
  ],
};

function nextMonday9am() {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  d.setHours(9, 0, 0, 0);
  return toLocalInput(d);
}
function toLocalInput(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

// short URL key  ->  state field
const PARAMS = {
  n: "name", role: "role", team: "team", mgr: "manager", loc: "location", date: "startDate",
  rt: "reportTime", carry: "carry", dress: "dress", wifi: "wifi", lunch: "lunch",
  addr: "address", map: "mapUrl",
  rec: "recruiterName", rmail: "recruiterEmail", rph: "recruiterPhone", rli: "recruiterLinkedin",
  bud: "buddyName", bin: "buddyIntro", bph: "buddyPhone", bli: "buddyLinkedin",
  min: "managerIntro", mph: "managerPhone", mli: "managerLinkedin",
};

function hydrateFromURL(base) {
  try {
    const q = new URLSearchParams(window.location.search);
    if (![...q.keys()].length) return base;
    const next = { ...base };
    for (const [short, field] of Object.entries(PARAMS)) {
      const v = q.get(short);
      if (v !== null && v !== "") next[field] = v;
    }
    return next;
  } catch { return base; }
}

function buildLink(hire) {
  const q = new URLSearchParams();
  for (const [short, field] of Object.entries(PARAMS)) {
    const v = hire[field];
    if (v !== undefined && v !== null && String(v).trim() !== "") q.set(short, v);
  }
  const base = window.location.origin + window.location.pathname;
  return `${base}?${q.toString()}`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+Devanagari&family=Noto+Sans+Bengali&family=Noto+Sans+Tamil&family=Noto+Sans+Telugu&family=Noto+Sans+Kannada&family=Noto+Sans+Malayalam&family=Noto+Sans+Gujarati&family=Noto+Sans+Gurmukhi&display=swap');

.ob-root{
  --ink:#0A0A0B; --panel:#141416; --panel2:#17171A;
  --line:#26262A; --line2:#343439;
  --paper:#EDEDE8; --muted:#8A8A8F; --muted2:#5A5A5F;
  --gold:#D9A441;
  font-family:'Space Grotesk',system-ui,sans-serif;
  background:var(--ink); color:var(--paper); min-height:100vh; width:100%;
  -webkit-font-smoothing:antialiased; overflow-x:hidden;
}
.ob-root *{box-sizing:border-box; margin:0; padding:0;}
.ob-mono{font-family:'IBM Plex Mono',monospace;}
.ob-wrap{max-width:940px; margin:0 auto; padding:0 24px;}

.ob-eyebrow{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--muted); display:flex; align-items:center; gap:10px; flex-wrap:wrap;}
.ob-dot{width:7px; height:7px; border-radius:50%; background:var(--muted2);}
.ob-dot.live{background:var(--gold); animation:pulse 2.4s infinite;}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(217,164,65,.5)}70%{box-shadow:0 0 0 8px rgba(217,164,65,0)}100%{box-shadow:0 0 0 0 rgba(217,164,65,0)}}

/* HERO */
.ob-hero{padding:80px 0 56px; border-bottom:1px solid var(--line);}
.ob-name{font-size:clamp(44px,9vw,102px); font-weight:700; line-height:.96; letter-spacing:-.02em; margin:24px 0 18px; display:flex; flex-wrap:wrap;}
.ob-g{display:inline-block; transition:opacity .5s ease, transform .5s ease, color .5s ease;}
.ob-g.box{color:var(--muted2);}
.ob-g.sp{width:.28em;}
.ob-meta{font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--muted); letter-spacing:.04em; margin-bottom:22px;}
.ob-meta b{color:var(--paper); font-weight:500;}
.ob-lede{font-size:clamp(16px,2.1vw,20px); line-height:1.55; color:var(--muted); max-width:560px;}
.ob-lede b{color:var(--paper); font-weight:500;}
.ob-count{display:flex; gap:14px; margin:34px 0 8px; flex-wrap:wrap;}
.ob-unit{min-width:92px; padding:16px 18px 12px; background:var(--panel); border:1px solid var(--line); border-radius:4px; position:relative;}
.ob-unit .num{font-family:'IBM Plex Mono',monospace; font-size:38px; font-weight:600; line-height:1; font-variant-numeric:tabular-nums; letter-spacing:-.02em;}
.ob-unit .lab{font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted2); margin-top:10px;}
.ob-unit::after{content:""; position:absolute; left:18px; bottom:0; width:22px; height:2px; background:var(--gold); opacity:.7;}

/* MANIFESTO BAND */
.ob-band{padding:72px 0; border-bottom:1px solid var(--line); text-align:center;}
.ob-welcome{height:96px; display:flex; align-items:center; justify-content:center; margin-bottom:6px;}
.ob-welcome span{font-size:clamp(40px,8vw,80px); font-weight:600; line-height:1; color:var(--muted); transition:opacity .5s ease, color .6s ease;}
.ob-band.on .ob-welcome span{color:var(--gold);}
.ob-noto{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.1em; color:var(--muted2); margin-bottom:40px;}
.ob-tag{font-size:clamp(26px,5vw,52px); font-weight:700; letter-spacing:-.02em; line-height:1.05;}
.ob-tag .l1{color:var(--paper);}
.ob-tag .l2{color:var(--muted); transition:color .6s ease;}
.ob-band.on .ob-tag .l2{color:var(--gold);}
.ob-tagsub{font-size:15px; color:var(--muted); margin-top:20px;}

/* SECTIONS */
.ob-section{padding:56px 0; border-bottom:1px solid var(--line);}
.ob-h{font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:26px;}

/* TOFU */
.ob-tofu{padding:60px 0; border-bottom:1px solid var(--line); display:grid; grid-template-columns:160px 1fr; gap:40px; align-items:center;}
.ob-tofu-copy h3{font-size:clamp(22px,3.2vw,30px); font-weight:600; margin-bottom:14px; line-height:1.15;}
.ob-tofu-copy p{font-size:16px; line-height:1.65; color:var(--muted); max-width:520px;}
.ob-tofu-copy p b{color:var(--paper); font-weight:500;}

/* ESSENTIALS */
.ob-ess{display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--line); border:1px solid var(--line); border-radius:4px; overflow:hidden;}
.ob-item{background:var(--ink); padding:20px;}
.ob-item .ik{font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted2); margin-bottom:9px; display:flex; align-items:center; gap:8px;}
.ob-item .iv{font-size:16px; line-height:1.5;}
.ob-maplink{display:inline-block; margin-top:10px; font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--gold); text-decoration:none; border:1px solid var(--line2); padding:6px 11px; border-radius:4px;}
.ob-maplink:hover{border-color:var(--gold);}

/* WEEK */
.ob-day{display:grid; grid-template-columns:110px 1fr; gap:20px; padding:22px 0; border-top:1px solid var(--line); align-items:baseline;}
.ob-day:first-child{border-top:none;}
.ob-day .idx{font-family:'IBM Plex Mono',monospace; font-size:13px; color:var(--gold); letter-spacing:.04em;}
.ob-day .dt{font-size:19px; font-weight:600; margin-bottom:6px;}
.ob-day .dn{font-size:15px; line-height:1.55; color:var(--muted);}

/* BUDDY */
.ob-buddy{background:var(--panel); border:1px solid var(--line2); border-radius:6px; padding:26px; display:grid; grid-template-columns:56px 1fr; gap:20px; margin-bottom:20px;}
.ob-buddy .bav{width:56px; height:56px; border-radius:6px; border:1px solid var(--gold); display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:600; color:var(--gold);}
.ob-buddy .bn{font-size:20px; font-weight:600;}
.ob-buddy .btag{font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); margin:3px 0 10px;}
.ob-buddy .bi{font-size:15px; line-height:1.55; color:var(--muted); margin-bottom:16px;}
.ob-btns{display:flex; gap:10px; flex-wrap:wrap;}
.ob-btn{font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--paper); text-decoration:none; border:1px solid var(--line2); padding:9px 14px; border-radius:4px; transition:all .2s ease;}
.ob-btn:hover{border-color:var(--gold); color:var(--gold);}

.ob-people{display:grid; grid-template-columns:repeat(3,1fr); gap:14px;}
.ob-person{background:var(--panel); border:1px solid var(--line); border-radius:4px; padding:20px; transition:border-color .2s ease, transform .2s ease;}
.ob-person:hover{border-color:var(--line2); transform:translateY(-2px);}
.ob-pav{width:42px; height:42px; border-radius:4px; border:1px solid var(--line2); display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:17px; font-weight:600; margin-bottom:14px;}
.ob-person .pn{font-size:16px; font-weight:600;}
.ob-person .pr{font-size:13px; color:var(--muted); margin-top:4px;}

/* FAQ */
.ob-faq{border:1px solid var(--line); border-radius:4px; overflow:hidden;}
.ob-q{border-top:1px solid var(--line);}
.ob-q:first-child{border-top:none;}
.ob-qbtn{width:100%; text-align:left; background:transparent; border:none; color:var(--paper); padding:20px; font-size:17px; font-weight:500; cursor:pointer; display:flex; justify-content:space-between; gap:16px; align-items:center; font-family:'Space Grotesk',sans-serif;}
.ob-qbtn:hover{color:var(--gold);}
.ob-plus{font-family:'IBM Plex Mono',monospace; color:var(--gold); font-size:20px; flex-shrink:0; transition:transform .2s ease;}
.ob-plus.open{transform:rotate(45deg);}
.ob-a{padding:0 20px 20px; font-size:15px; line-height:1.65; color:var(--muted); max-width:640px;}

/* FOOTER */
.ob-foot{padding:56px 0 90px;}
.ob-foot .big{font-size:clamp(20px,3vw,26px); font-weight:500; line-height:1.4; max-width:660px; margin-bottom:24px;}
.ob-foot .big b{color:var(--gold); font-weight:600;}
.ob-foot-btns{display:flex; gap:12px; flex-wrap:wrap;}
.ob-reply{font-family:'IBM Plex Mono',monospace; font-size:14px; color:var(--paper); border:1px solid var(--line2); border-radius:4px; padding:12px 16px; text-decoration:none;}
.ob-reply:hover{border-color:var(--gold); color:var(--gold);}
.ob-sig{margin-top:40px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted2);}

/* EDIT PANEL */
.ob-edit-btn{position:fixed; top:16px; right:16px; z-index:40; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.1em; background:var(--panel); color:var(--muted); border:1px solid var(--line2); padding:9px 13px; border-radius:4px; cursor:pointer; text-transform:uppercase;}
.ob-edit-btn:hover{color:var(--paper); border-color:var(--gold);}
.ob-panel{position:fixed; top:0; right:0; height:100%; width:min(380px,92vw); background:var(--panel2); border-left:1px solid var(--line2); z-index:50; padding:26px 22px; overflow-y:auto; box-shadow:-20px 0 60px rgba(0,0,0,.5);}
.ob-panel h4{font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--paper); margin:22px 0 14px;}
.ob-panel h4:first-child{margin-top:0;}
.ob-copy{width:100%; background:var(--gold); color:#111; border:none; font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; letter-spacing:.04em; padding:12px; border-radius:4px; cursor:pointer; margin-bottom:10px;}
.ob-copy:hover{filter:brightness(1.08);}
.ob-copy-note{font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--muted2); line-height:1.6; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid var(--line);}
.ob-field{margin-bottom:13px;}
.ob-field label{display:block; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted2); margin-bottom:6px;}
.ob-field input,.ob-field select{width:100%; background:var(--ink); border:1px solid var(--line2); color:var(--paper); font-family:'IBM Plex Mono',monospace; font-size:13px; padding:9px 11px; border-radius:4px;}
.ob-field input:focus,.ob-field select:focus{outline:none; border-color:var(--gold);}
.ob-close{background:transparent; border:none; color:var(--muted); font-size:20px; cursor:pointer; float:right; line-height:1;}
.ob-hint{font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--muted2); line-height:1.6; margin-top:18px; padding-top:16px; border-top:1px solid var(--line);}

@media (max-width:720px){
  .ob-ess{grid-template-columns:1fr;}
  .ob-people{grid-template-columns:1fr;}
  .ob-tofu{grid-template-columns:1fr; gap:24px;}
  .ob-buddy{grid-template-columns:1fr; gap:14px;}
  .ob-day{grid-template-columns:1fr; gap:6px;}
}
@media (prefers-reduced-motion:reduce){
  .ob-g,.ob-welcome span,.ob-tag .l2{transition:none !important;}
  .ob-dot.live{animation:none !important;}
}
`;

function Tofu({ on }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label="Tofu, the missing glyph mascot">
      <rect x="14" y="14" width="92" height="92" rx="10" fill={on ? "rgba(217,164,65,0.12)" : "transparent"} stroke={on ? "#D9A441" : "#5A5A5F"} strokeWidth="2.5" style={{ transition: "all .7s ease" }} />
      <rect x="40" y="48" width="9" height="14" rx="3" fill={on ? "#D9A441" : "#8A8A8F"} style={{ transition: "fill .7s ease" }} />
      <rect x="71" y="48" width="9" height="14" rx="3" fill={on ? "#D9A441" : "#8A8A8F"} style={{ transition: "fill .7s ease" }} />
      {on
        ? <path d="M46 76 Q60 88 74 76" fill="none" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" />
        : <line x1="47" y1="78" x2="73" y2="78" stroke="#8A8A8F" strokeWidth="2.5" strokeLinecap="round" />}
    </svg>
  );
}

function useCountdown(startDate) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, new Date(startDate).getTime() - now);
  return {
    reached: diff <= 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

function GlyphName({ name }) {
  const chars = name.split("");
  const [revealed, setRevealed] = useState(() => chars.map(() => false));
  useEffect(() => {
    setRevealed(chars.map(() => false));
    const t = chars.map((_, i) => setTimeout(() => setRevealed((r) => { const n = [...r]; n[i] = true; return n; }), 220 + i * 85));
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
  return (
    <h1 className="ob-name">
      {chars.map((ch, i) => ch === " "
        ? <span key={i} className="ob-g sp" />
        : <span key={i} className={"ob-g" + (revealed[i] ? "" : " box")} style={{ transform: revealed[i] ? "translateY(0)" : "translateY(2px)" }}>{revealed[i] ? ch : "\u25AF"}</span>)}
    </h1>
  );
}

function WelcomeCycle() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((v) => (v + 1) % WELCOMES.length), 1700); return () => clearInterval(id); }, []);
  const cur = WELCOMES[i];
  return (
    <div className="ob-welcome">
      <span style={{ fontFamily: cur.f }}>{cur.w}</span>
    </div>
  );
}

function Onboarding() {
  const [hire, setHire] = useState(() => hydrateFromURL({ ...DEFAULT, ...(typeof window !== "undefined" && window.__HIRE__ ? window.__HIRE__ : {}) }));
  const [panel, setPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openQ, setOpenQ] = useState(0);
  const cd = useCountdown(hire.startDate);
  const on = true; // always lit: the black + yellow render state, no toggle
  const isVirtual = hire.location === "Virtual";

  const startPretty = (() => {
    try { return new Date(hire.startDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); }
    catch { return hire.startDate; }
  })();

  const set = (k, v) => setHire((h) => ({ ...h, [k]: v }));
  const pad = (n) => String(n).padStart(2, "0");
  const office = OFFICES[hire.location];
  const firstName = hire.name.split(" ")[0];

  const copyLink = async () => {
    const link = buildLink(hire);
    try { await navigator.clipboard.writeText(link); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = link; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // order: recruiter (me) → buddy → manager
  const contacts = [
    { name: hire.recruiterName, role: hire.recruiterRole, intro: hire.recruiterIntro, linkedin: hire.recruiterLinkedin, phone: hire.recruiterPhone },
    { name: hire.buddyName, role: "Your buddy", intro: hire.buddyIntro, linkedin: hire.buddyLinkedin, phone: hire.buddyPhone },
    { name: hire.manager, role: hire.managerRole, intro: hire.managerIntro, linkedin: hire.managerLinkedin, phone: hire.managerPhone },
  ];

  const essentials = isVirtual
    ? [
        { icon: "🕘", k: "Log in by", v: hire.reportTime },
        { icon: "💻", k: "Your setup", v: "Your shipped laptop. Charge it the night before, keep camera-on." },
        { icon: "🪪", k: "Keep handy", v: hire.carry },
        { icon: "👕", k: "Dress code", v: "Camera-on smart casual. From the waist up counts. 😄" },
        { icon: "🍱", k: "Lunch", v: "Grab your own. We'll do a virtual welcome over chai. ☕" },
        { icon: "🎁", k: "Swag box", v: "On its way to your doorstep. Watch for it before day 1. 🎁" },
      ]
    : [
        { icon: "🕘", k: "Reporting time", v: hire.reportTime },
        { icon: "📍", k: "Where", v: (hire.address || (office && office.address) || hire.location) + (office ? ", " + hire.location : ""), map: hire.mapUrl || (office && office.mapUrl) },
        { icon: "🪪", k: "Carry", v: hire.carry },
        { icon: "🚇", k: "Getting there", v: office ? office.commute : "Cab drop at the gate is easiest." },
        { icon: "👕", k: "Dress code", v: hire.dress },
        { icon: "💻", k: "Laptop & wifi", v: hire.wifi },
        { icon: "🍱", k: "Lunch", v: hire.lunch },
        { icon: "🎁", k: "Swag box", v: "Waiting at your desk when you arrive. 🎁" },
      ];

  return (
    <div className="ob-root">
      <style>{CSS}</style>
      <button className="ob-edit-btn" onClick={() => setPanel(true)}>Edit details</button>

      <div className="ob-wrap">
        {/* HERO */}
        <header className="ob-hero">
          <div className="ob-eyebrow">
            <span className="ob-dot live" />
            Status: rendering…
          </div>

          <GlyphName name={hire.name} />

          <div className="ob-meta">
            <b>{hire.role}</b> · {hire.team} · reports to {hire.manager} · {isVirtual ? "Virtual onboarding" : hire.location}
          </div>

          <p className="ob-lede">
            Right now you're a <b>tofu box</b>, the little box a screen shows when it hasn't loaded the
            character yet. Though in a parallel world, <b>TOFU</b> also means Top Of the Funnel, and no wonder,
            you were the top of ours. 😌 On <b>{startPretty}</b> you render in. Here's the seat we saved you. 🪑
          </p>

          <div className="ob-count">
            {[["Days", cd.days], ["Hrs", cd.hours], ["Min", cd.mins], ["Sec", cd.secs]].map(([l, n]) => (
              <div className="ob-unit" key={l}><div className="num">{pad(n)}</div><div className="lab">{l}</div></div>
            ))}
          </div>
        </header>

        {/* MANIFESTO BAND */}
        <section className={"ob-band" + (on ? " on" : "")}>
          <WelcomeCycle />
          <div className="ob-noto">rendered in Noto · the one font that supports every language, the way ShareChat does</div>
          <div className="ob-tag">
            <span className="l1">Built on language. </span><span className="l2">Powered by Culture.</span>
          </div>
          <div className="ob-tagsub">You're the newest character in the set, {firstName}. 🎬</div>
        </section>

        {/* TOFU */}
        <section className="ob-tofu">
          <div style={{ width: 140, maxWidth: "42vw" }}><Tofu on={on} /></div>
          <div className="ob-tofu-copy">
            <h3>Meet Tofu. 👋</h3>
            <p>
              Tofu is the glyph that went missing in localization, the box you see when a system can't render
              a character yet. <b>Tofu knows exactly how day one feels</b>: everyone else already has the context and
              you don't. So Tofu saved you a seat and will be around all week. When you render in, so does Tofu.
            </p>
          </div>
        </section>

        {/* ESSENTIALS */}
        <section className="ob-section">
          <div className="ob-h">// day 1 essentials {isVirtual ? "· virtual" : "· " + hire.location.toLowerCase()}</div>
          <div className="ob-ess">
            {essentials.map((e, i) => (
              <div className="ob-item" key={i}>
                <div className="ik"><span>{e.icon}</span>{e.k}</div>
                <div className="iv">{e.v}</div>
                {e.map ? <a className="ob-maplink" href={e.map} target="_blank" rel="noreferrer">Open in Maps →</a> : null}
              </div>
            ))}
          </div>
        </section>

        {/* WEEK */}
        <section className="ob-section">
          <div className="ob-h">// your first five days</div>
          {hire.week.map((w, i) => (
            <div className="ob-day" key={i}>
              <div className="idx">{w.d}</div>
              <div><div className="dt">{w.t}</div><div className="dn">{w.note}</div></div>
            </div>
          ))}
        </section>

        {/* PEOPLE */}
        <section className="ob-section">
          <div className="ob-h">// people expecting you</div>
          {contacts.map((c, i) => (
            <div className="ob-buddy" key={i}>
              <div className="bav">{(c.name || "?").charAt(0)}</div>
              <div>
                <div className="bn">{c.name}</div>
                <div className="btag">{c.role}</div>
                {c.intro ? <div className="bi">{c.intro}</div> : null}
                {(c.linkedin || c.phone) && (
                  <div className="ob-btns">
                    {c.linkedin ? <a className="ob-btn" href={c.linkedin} target="_blank" rel="noreferrer">LinkedIn →</a> : null}
                    {c.phone ? <a className="ob-btn" href={`tel:${c.phone.replace(/\s/g, "")}`}>Call {c.name} →</a> : null}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="ob-section">
          <div className="ob-h">// stuff you're probably wondering</div>
          <div className="ob-faq">
            {hire.faq.map((f, i) => (
              <div className="ob-q" key={i}>
                <button className="ob-qbtn" onClick={() => setOpenQ(openQ === i ? -1 : i)}>
                  {f.q}<span className={"ob-plus" + (openQ === i ? " open" : "")}>+</span>
                </button>
                {openQ === i && <div className="ob-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ob-foot">
          <div className="big">
            Between now and day one, life happens. Cold feet, a counteroffer, a question too small to ask.
            <b> Talk to me before you disappear.</b> We'd much rather sort it out than watch a box we were excited
            about never render. 🙌
          </div>
          <div className="ob-foot-btns">
            <a className="ob-reply" href={`mailto:${hire.recruiterEmail}`}>Email {hire.recruiterName} →</a>
            <a className="ob-reply" href={`tel:${hire.recruiterPhone.replace(/\s/g, "")}`}>Text / call {hire.recruiterName} →</a>
          </div>
          <div className="ob-sig">Saved you a seat · {hire.team} · ShareChat</div>
        </footer>
      </div>

      {/* EDIT PANEL */}
      {panel && (
        <div className="ob-panel">
          <button className="ob-close" onClick={() => setPanel(false)}>×</button>
          <button className="ob-copy" onClick={copyLink}>{copied ? "✓ Link copied" : "Copy shareable link"}</button>
          <div className="ob-copy-note">Fill the fields, copy the link, send it to the candidate. Opening that link shows them this page with their details.</div>
          <h4>The hire</h4>
          <div className="ob-field"><label>Name</label><input value={hire.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="ob-field"><label>Role</label><input value={hire.role} onChange={(e) => set("role", e.target.value)} /></div>
          <div className="ob-field"><label>Team</label><input value={hire.team} onChange={(e) => set("team", e.target.value)} /></div>
          <div className="ob-field"><label>Manager</label><input value={hire.manager} onChange={(e) => set("manager", e.target.value)} /></div>
          <div className="ob-field"><label>Start date &amp; time</label><input type="datetime-local" value={hire.startDate} onChange={(e) => set("startDate", e.target.value)} /></div>
          <div className="ob-field"><label>Location</label>
            <select value={hire.location} onChange={(e) => set("location", e.target.value)}>
              <option>Bengaluru</option><option>Gurgaon</option><option>Mumbai</option><option>Virtual</option>
            </select>
          </div>
          {!isVirtual && <div className="ob-field"><label>Office address (overrides default)</label><input value={hire.address} onChange={(e) => set("address", e.target.value)} placeholder="e.g. ShareChat, Bagmane, Bengaluru" /></div>}
          {!isVirtual && <div className="ob-field"><label>Maps URL</label><input value={hire.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} placeholder="https://maps.google.com/..." /></div>}

          <h4>Day 1 essentials</h4>
          <div className="ob-field"><label>{isVirtual ? "Log in by" : "Reporting time"}</label><input value={hire.reportTime} onChange={(e) => set("reportTime", e.target.value)} /></div>
          <div className="ob-field"><label>Carry / keep handy</label><input value={hire.carry} onChange={(e) => set("carry", e.target.value)} /></div>
          {!isVirtual && <div className="ob-field"><label>Dress code</label><input value={hire.dress} onChange={(e) => set("dress", e.target.value)} /></div>}
          {!isVirtual && <div className="ob-field"><label>Laptop &amp; wifi</label><input value={hire.wifi} onChange={(e) => set("wifi", e.target.value)} /></div>}
          {!isVirtual && <div className="ob-field"><label>Lunch</label><input value={hire.lunch} onChange={(e) => set("lunch", e.target.value)} /></div>}

          <h4>Your buddy</h4>
          <div className="ob-field"><label>Name</label><input value={hire.buddyName} onChange={(e) => set("buddyName", e.target.value)} /></div>
          <div className="ob-field"><label>One-line intro</label><input value={hire.buddyIntro} onChange={(e) => set("buddyIntro", e.target.value)} /></div>
          <div className="ob-field"><label>LinkedIn URL</label><input value={hire.buddyLinkedin} onChange={(e) => set("buddyLinkedin", e.target.value)} /></div>
          <div className="ob-field"><label>Phone</label><input value={hire.buddyPhone} onChange={(e) => set("buddyPhone", e.target.value)} /></div>

          <h4>You (the text-me human)</h4>
          <div className="ob-field"><label>Name</label><input value={hire.recruiterName} onChange={(e) => set("recruiterName", e.target.value)} /></div>
          <div className="ob-field"><label>Email</label><input value={hire.recruiterEmail} onChange={(e) => set("recruiterEmail", e.target.value)} /></div>
          <div className="ob-field"><label>Phone</label><input value={hire.recruiterPhone} onChange={(e) => set("recruiterPhone", e.target.value)} /></div>
          <div className="ob-field"><label>LinkedIn URL</label><input value={hire.recruiterLinkedin} onChange={(e) => set("recruiterLinkedin", e.target.value)} /></div>

          <h4>Manager</h4>
          <div className="ob-field"><label>LinkedIn URL</label><input value={hire.managerLinkedin} onChange={(e) => set("managerLinkedin", e.target.value)} /></div>
          <div className="ob-field"><label>Phone</label><input value={hire.managerPhone} onChange={(e) => set("managerPhone", e.target.value)} /></div>

          <div className="ob-hint">
            Office addresses live in OFFICES, and the five-day plan + FAQ live in DEFAULT (in the code). Panel
            edits are live for preview but reset on reload, so hardcode DEFAULT before you publish a per-hire link.
          </div>
        </div>
      )}
    </div>
  );
}


const root = createRoot(document.getElementById("root"));
root.render(<Onboarding />);
