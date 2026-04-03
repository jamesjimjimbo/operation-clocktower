import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

/* ============ CONSTANTS ============ */
const IMG = "https://raw.githubusercontent.com/jamesjimjimbo/operation-clocktower/main/public/images";
const MC = "CITY SPIES";
const VQS = [
  { name: "Cade", q: "What is the animal mascot of your new school?", a: ["griffin","griffon","gryphon","griffins","gryphons","griffons","a griffin","the griffin"] },
  { name: "Maggie", q: "What song are you learning to play in music class?", a: ["seven nation army","7 nation army","seven nations army","7 nations army"] },
];
const AGENTS = [
  { name: "Cade", code: "JAGUAR", role: "The Codebreaker", desc: "Cracks puzzles and ciphers.", img: `${IMG}/Jaguar.png` },
  { name: "Maggie", code: "OTTER", role: "The Scout", desc: "Notices what others miss.", img: `${IMG}/Otter.png` },
  { name: "Callum", code: "STINGRAY", role: "The Charm", desc: "No one suspects him.", img: `${IMG}/Stingray.png` },
];
const LOCS = [
  { id: "bigben", label: "Big Ben", color: "#3b82f6", img: `${IMG}/bigben.jpg` },
  { id: "tower", label: "Tower of London", color: "#ef4444", img: `${IMG}/tower.jpg` },
  { id: "stpauls", label: "St. Paul's Cathedral", color: "#a855f7", img: `${IMG}/stpauls.jpg` },
  { id: "buckingham", label: "Buckingham Palace", color: "#eab308", img: `${IMG}/buckingham.jpg` },
  { id: "eye", label: "London Eye", color: "#06b6d4" },
];
const PARIS_LOCS = [
  { id: "louvre", label: "The Louvre", color: "#f97316", img: `${IMG}/Louvre.jpg` },
  { id: "chapelle", label: "Sainte-Chapelle", color: "#a855f7", img: `${IMG}/Sainte-Chapelle.jpg` },
  { id: "arcdetriomphe", label: "Arc de Triomphe", color: "#ec4899", img: `${IMG}/arc-de-triomphe.webp` },
  { id: "eiffel", label: "Eiffel Tower", color: "#facc15", img: `${IMG}/Eiffel-Tower.webp` },
];
const WORD_MAP = {
  stpauls: { word: "CROSS", from: "St. Paul's" },
  friend: { word: "ANT", from: "Friend's dinner" },
  eye: { word: "EYE", from: "London Eye" },
  buckingham: { word: "FELL", from: "Buckingham Palace" },
};
const BRIEFING = [
  { id: "b1", lines: [
    { t: "\u26a0 PRIORITY BRIEFING \u26a0", s: "warning" },{ t: "OPERATION CLOCKTOWER", s: "header" },{ t: "", s: "sp" },
    { t: "Over 100 years ago, a brilliant clockmaker named \u00c9mile Bellecourt built secret mechanisms into the great landmarks of the world.", s: "normal" },{ t: "", s: "sp" },
    { t: "Hidden inside each is a fragment of a master code \u2014 a code that would guide someone to his secret treasure.", s: "normal" },{ t: "", s: "sp" },
    { t: "For a century, no one knew.", s: "normal" },{ t: "", s: "sp" },{ t: "Now someone does.", s: "bold" },
  ]},
  { id: "b1b", lines: [
    { t: "We've received a tip about where to find some of the fragments.", s: "normal" },{ t: "", s: "sp" },
    { t: "Our usual team is busy on another mission, so we need you to get on a plane and head to...", s: "normal" },
  ]},
  { id: "london", special: "london" },
  { id: "b3", lines: [
    { t: "YOUR TEAM", s: "header" },{ t: "", s: "sp" },
    { t: "Your father \u2014 codename MOTHER \u2014 and your brother Callum are already en route to London.", s: "normal" },{ t: "", s: "sp" },
    { t: "Your mom \u2014 codename MONTY \u2014 is with you now. She'll get you there.", s: "normal" },{ t: "", s: "sp" },
    { t: "The Collector uses adult operatives. They watch for spies in suits.", s: "normal" },{ t: "", s: "sp" },
    { t: "They don't watch for kids.", s: "bold" },
  ]},
  { id: "b4", lines: [
    { t: "YOUR ROLES", s: "header" },{ t: "", s: "sp" },
    { t: "CADE \u2014 The Codebreaker", s: "role" },{ t: "The hardest clues are yours.", s: "roledesc" },{ t: "", s: "sp" },
    { t: "MAGGIE \u2014 The Scout", s: "role" },{ t: "Notice what others miss.", s: "roledesc" },{ t: "", s: "sp" },
    { t: "CALLUM \u2014 The Charm", s: "role" },{ t: "No one suspects him. That's his superpower.", s: "roledesc" },{ t: "", s: "sp" },
    { t: "Mother and Monty are your handlers.", s: "dim" },{ t: "The missions are yours.", s: "bold" },
  ]},
  { id: "howto", special: "howto" },
  { id: "b2", special: "collector" },
  { id: "b2b", lines: [
    { t: "Oh no \u2014 the Collector, one of Umbra's best operatives, must have intercepted the same clue.", s: "normal" },{ t: "", s: "sp" },
    { t: "You have to get to London quickly to beat him!", s: "bold" },
  ]},
  { id: "b6", lines: [
    { t: "WHAT TO DO NOW", s: "header" },{ t: "", s: "sp" },
    { t: "1. Get to London.", s: "normal" },{ t: "2. When your whole team is together, come back to this site.", s: "normal" },{ t: "3. I'll verify Callum and start the mission.", s: "normal" },{ t: "", s: "sp" },
    { t: "The Collector is already looking.", s: "normal" },{ t: "You need to be faster.", s: "bold" },{ t: "", s: "sp" },
    { t: "Good luck, agents. The clock is ticking.", s: "flash" },{ t: "", s: "sp" },{ t: "\u2014 Tru", s: "dim" },
  ]},
];
const STY = {
  header: { color: "#e0e0e0", fontSize: 18, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" },
  sub: { color: "#888", fontSize: 12, letterSpacing: 4, textTransform: "uppercase" },
  normal: { color: "#c8c8c8", fontSize: 14, lineHeight: 1.6 },
  bold: { color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.6 },
  dim: { color: "#777", fontSize: 13, lineHeight: 1.6, fontStyle: "italic" },
  flash: { color: "#facc15", fontSize: 16, fontWeight: 700, letterSpacing: 2 },
  warning: { color: "#f97316", fontSize: 13, letterSpacing: 3, fontWeight: 700 },
  villain: { color: "#ef4444", fontSize: 20, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", padding: "6px 0" },
  role: { color: "#facc15", fontSize: 15, fontWeight: 700, letterSpacing: 1 },
  roledesc: { color: "#aaa", fontSize: 13, lineHeight: 1.6, paddingLeft: 12 },
  sp: {},
};

/* ============ HELPERS ============ */
function fuzzy(input, accepts) {
  const c = input.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
  for (const a of accepts) { const ca = a.toLowerCase(); if (c === ca || c.includes(ca) || ca.includes(c)) return true; }
  return false;
}
function calOk(input) { return input.trim().toLowerCase().includes("areeb"); }
function usePersist(key, init) {
  const [v, setV] = useState(init);
  const ready = useRef(false);
  useEffect(() => { try { const s = window.localStorage.getItem(key); if (s) setV(JSON.parse(s)); } catch(e){} ready.current = true; }, []);
  useEffect(() => { if (ready.current) try { window.localStorage.setItem(key, JSON.stringify(v)); } catch(e){} }, [v]);
  return [v, setV];
}

/* ============ TYPED LINE ============ */
function TL({ text, style, onDone, skip }) {
  const [d, setD] = useState(null);
  const i = useRef(0);
  const iv = useRef(null);
  const doneFired = useRef(false);
  useEffect(() => {
    doneFired.current = false;
    if (style === "sp" || !text) { if (!doneFired.current) { doneFired.current = true; onDone?.(); } return; }
    i.current = 0; setD("");
    const sp = (style === "normal" || style === "roledesc" || style === "dim") ? 18 : 28;
    iv.current = setInterval(() => { i.current++; setD(text.slice(0, i.current)); if (i.current >= text.length) { clearInterval(iv.current); if (!doneFired.current) { doneFired.current = true; onDone?.(); } } }, sp);
    return () => clearInterval(iv.current);
  }, [text, style]);
  useEffect(() => {
    if (skip && text && !doneFired.current) { if (iv.current) clearInterval(iv.current); setD(text); doneFired.current = true; onDone?.(); }
  }, [skip]);
  if (style === "sp") return <div style={{ height: 14 }} />;
  if (d === null) return <div style={{ minHeight: 20 }} />;
  return <div style={{ ...STY[style], fontFamily: "'Courier New', monospace" }}>{d}<span style={{ opacity: d.length < (text||"").length ? 1 : 0, color: "#facc15" }}>{"\u2588"}</span></div>;
}

/* ============ TYPED SCREEN ============ */
function TS({ lines, onDone, id, extra }) {
  const [vis, setVis] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);
  const ref = useRef(null);
  const doneRef = useRef(false);
  useEffect(() => { setVis(0); setDone(false); setSkip(false); doneRef.current = false; setTimeout(() => setVis(1), 300); }, [id]);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vis]);
  const hd = useCallback((i) => {
    const dl = lines[i]?.delay || (lines[i]?.s === "sp" ? 0 : 120);
    if (i + 1 < lines.length) setTimeout(() => setVis(v => Math.max(v, i + 2)), skip ? 0 : dl);
    else if (!doneRef.current) { doneRef.current = true; setTimeout(() => setDone(true), 500); }
  }, [lines, skip]);
  const handleTap = () => {
    if (done) { onDone?.(); }
    else if (!skip) { setSkip(true); setVis(lines.length); }
  };
  return (
    <div onClick={handleTap} style={{ height: "100%", display: "flex", flexDirection: "column", cursor: "pointer", userSelect: "none" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
        {lines.slice(0, vis).map((l, i) => <TL key={`${id}-${i}`} text={l.t} style={l.s} onDone={() => hd(i)} skip={skip} />)}
        {done && extra}
      </div>
      <div style={{ padding: "14px 16px 20px", textAlign: "center" }}>
        <span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>
          {done ? "TAP TO CONTINUE \u25b8" : "TAP TO SKIP \u25b8"}
        </span>
      </div>
    </div>
  );
}

/* ============ INPUT SCREEN ============ */
function IS({ title, subtitle, prompt, placeholder, onSubmit, errMsg, buttonText, rk }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  useEffect(() => { setVal(""); setErr(false); }, [rk]);
  const go = () => { if (onSubmit(val)) { setVal(""); setErr(false); } else setErr(true); };
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 4, textAlign: "center" }}>{title}</div>
      {subtitle && <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, letterSpacing: 4, marginBottom: 32, textAlign: "center" }}>{subtitle}</div>}
      {prompt && <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 13, fontWeight: 700, marginBottom: 16, textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>{prompt.split("\n").map((l,i) => <div key={i} style={{ marginBottom: 6 }}>{l}</div>)}</div>}
      <input value={val} onChange={e => { setVal(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && go()} placeholder={placeholder} autoFocus
        style={{ width: "100%", maxWidth: 280, background: "#111", border: err ? "1px solid #ef4444" : "1px solid #333", borderRadius: 8, padding: "11px 14px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 15, outline: "none", textAlign: "center", marginBottom: 12 }} />
      <button onClick={go} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 28px", fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{buttonText || "SUBMIT"}</button>
      {err && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11, marginTop: 10 }}>{errMsg || "Try again."}</div>}
    </div>
  );
}

/* ============ COLLECTOR REVEAL ============ */
function CollectorReveal({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = [setTimeout(() => setPhase(1), 500), setTimeout(() => setPhase(2), 2000), setTimeout(() => setPhase(3), 3500), setTimeout(() => setPhase(4), 5500), setTimeout(() => setPhase(5), 8000)];
    return () => t.forEach(clearTimeout);
  }, []);
  return (
    <div onClick={() => phase >= 5 && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: phase >= 5 ? "pointer" : "default", userSelect: "none", position: "relative", overflow: "hidden" }}>
      {(phase >= 1 && phase < 3) && <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.03) 2px, rgba(239,68,68,0.03) 4px)", animation: "fadeIn 0.3s ease", zIndex: 2 }} />}
      {phase >= 1 && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11, letterSpacing: 4, marginBottom: 16, animation: "pulse 0.5s infinite", zIndex: 3 }}>{"\u26a0"} SIGNAL INTERCEPTED {"\u26a0"}</div>}
      {phase >= 2 && <div style={{ animation: "fadeIn 0.8s ease", zIndex: 3 }}><img src={`${IMG}/Collector.png`} alt="" style={{ width: 100, height: 100, borderRadius: 16, border: "2px solid #ef4444", boxShadow: "0 0 30px rgba(239,68,68,0.3)" }} /></div>}
      {phase >= 3 && <div style={{ marginTop: 16, textAlign: "center", animation: "fadeIn 0.6s ease", zIndex: 3, maxWidth: 300 }}><div style={{ color: "#ef4444", fontFamily: "'Courier New', monospace", fontSize: 22, fontWeight: 900, letterSpacing: 5, marginBottom: 12 }}>THE COLLECTOR</div><div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, fontStyle: "italic" }}>"You're not alone on this, City Spies... I'm hunting these same fragments for Umbra."</div></div>}
      {phase >= 4 && <div style={{ marginTop: 12, textAlign: "center", animation: "fadeIn 0.6s ease", zIndex: 3, maxWidth: 300 }}><div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, fontStyle: "italic" }}>"Good luck beating me to them... I'll always be a step ahead of you."</div></div>}
      {phase >= 5 && <div style={{ marginTop: 24, zIndex: 3 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
    </div>
  );
}

/* ============ COLLECTOR TAUNT ============ */
function CollectorTaunt({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = [setTimeout(() => setPhase(1), 400), setTimeout(() => setPhase(2), 1500), setTimeout(() => setPhase(3), 4000)];
    return () => t.forEach(clearTimeout);
  }, []);
  return (
    <div onClick={() => phase >= 3 && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: phase >= 3 ? "pointer" : "default", userSelect: "none", position: "relative", overflow: "hidden" }}>
      {phase >= 1 && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11, letterSpacing: 4, marginBottom: 16, animation: "pulse 0.5s infinite", zIndex: 3 }}>{"\u26a0"} SIGNAL INTERCEPTED {"\u26a0"}</div>}
      {phase >= 1 && <div style={{ animation: "fadeIn 0.8s ease", zIndex: 3 }}><img src={`${IMG}/Collector.png`} alt="" style={{ width: 80, height: 80, borderRadius: 14, border: "2px solid #ef4444", boxShadow: "0 0 20px rgba(239,68,68,0.3)" }} /></div>}
      {phase >= 2 && <div style={{ marginTop: 16, textAlign: "center", animation: "fadeIn 0.6s ease", zIndex: 3, maxWidth: 300 }}><div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, fontStyle: "italic" }}>"Oh, you finally solved the London clues? I'm already a step ahead of you, eating all the chocolate croissants so you don't get any."</div><div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, fontStyle: "italic", marginTop: 10 }}>"(Oh, and solving the puzzles too.)"</div><div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, fontStyle: "italic", marginTop: 10 }}>"You'll never beat me to the treasure..."</div></div>}
      {phase >= 3 && <div style={{ marginTop: 24, zIndex: 3 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
    </div>
  );
}

/* ============ LONDON REVEAL ============ */
function LondonReveal({ onDone }) {
  const [s, setS] = useState(false);
  useEffect(() => { setTimeout(() => setS(true), 400); }, []);
  return (
    <div onClick={() => s && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: s ? "pointer" : "default", userSelect: "none", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><img src={`${IMG}/london.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} /></div>
      {s && <><div style={{ position: "relative", zIndex: 1, color: "#fff", fontFamily: "'Courier New', monospace", fontSize: 48, fontWeight: 900, letterSpacing: 10, textShadow: "0 0 40px rgba(250,204,21,0.4)", animation: "fadeIn 1s ease" }}>LONDON</div><div style={{ position: "relative", zIndex: 1, marginTop: 30 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div></>}
    </div>
  );
}

/* ============ PARIS REVEAL ============ */
function ParisReveal({ onDone }) {
  const [s, setS] = useState(false);
  useEffect(() => { setTimeout(() => setS(true), 400); }, []);
  return (
    <div onClick={() => s && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: s ? "pointer" : "default", userSelect: "none", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><img src={`${IMG}/paris.webp`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} onError={e => { e.target.style.background = "#111"; }} /></div>
      {s && <><div style={{ position: "relative", zIndex: 1, color: "#fff", fontFamily: "'Courier New', monospace", fontSize: 48, fontWeight: 900, letterSpacing: 10, textShadow: "0 0 40px rgba(250,204,21,0.4)", animation: "fadeIn 1s ease" }}>PARIS</div><div style={{ position: "relative", zIndex: 1, marginTop: 30 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div></>}
    </div>
  );
}

/* ============ PARIS LOCATIONS PREVIEW ============ */
function ParisLocsPreview({ onDone }) {
  const [td, setTd] = useState(false);
  const [rev, setRev] = useState(0);
  const [ad, setAd] = useState(false);
  const lines = [
    { t: "YOU MUST GO TO PARIS NOW!", s: "header" },{ t: "", s: "sp" },
    { t: "Take the Eurostar to Paris. Same rules \u2014 act like tourists, check in at landmarks.", s: "normal" },{ t: "", s: "sp" },
    { t: "The Collector is already on his way. You need to beat him there.", s: "normal" },{ t: "", s: "sp" },
    { t: "Here are some places to investigate:", s: "bold" },
  ];
  const [vis, setVis] = useState(0);
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => setVis(1), 200); }, []);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vis, rev]);
  const hd = (i) => { const dl = lines[i].s === "sp" ? 0 : 120; if (i + 1 < lines.length) setTimeout(() => setVis(v => Math.max(v, i + 2)), dl); else setTimeout(() => setTd(true), 400); };
  useEffect(() => { if (!td) return; const t = setInterval(() => setRev(p => { if (p >= PARIS_LOCS.length) { clearInterval(t); return p; } return p + 1; }), 400); return () => clearInterval(t); }, [td]);
  useEffect(() => { if (rev >= PARIS_LOCS.length) setTimeout(() => setAd(true), 600); }, [rev]);
  return (
    <div onClick={() => ad && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", cursor: ad ? "pointer" : "default", userSelect: "none" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {lines.slice(0, vis).map((l, i) => <TL key={i} text={l.t} style={l.s} onDone={() => hd(i)} />)}
        {td && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          {PARIS_LOCS.slice(0, rev).map(loc => (
            <div key={loc.id} style={{ background: "#111", border: "1px solid #333", borderRadius: 10, overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
              <div style={{ width: "100%", height: 80, overflow: "hidden", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {loc.img ? <img src={loc.img} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} /> : <span style={{ color: "#333", fontFamily: "monospace", fontSize: 24 }}>?</span>}
              </div>
              <div style={{ padding: "6px 8px" }}><div style={{ color: loc.color, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{loc.label}</div></div>
            </div>
          ))}
        </div>}
      </div>
      {ad && <div style={{ padding: "14px 16px 20px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO BEGIN PARIS MISSION {"\u25b8"}</span></div>}
    </div>
  );
}

/* ============ HOWTO + LOCATIONS ============ */
function HowtoLocs({ onDone }) {
  const [td, setTd] = useState(false);
  const [rev, setRev] = useState(0);
  const [ad, setAd] = useState(false);
  const lines = [
    { t: "HOW THIS WORKS", s: "header" },{ t: "", s: "sp" },
    { t: "Act like tourists. Check out sites, eat good food, have fun.", s: "normal" },{ t: "", s: "sp" },
    { t: "But at landmarks \u2014 clocks, towers, churches \u2014 check in with me.", s: "normal" },{ t: "", s: "sp" },
    { t: "Not every place will have a clue. Blend in.", s: "normal" },{ t: "", s: "sp" },
    { t: "Here are some places to check out:", s: "bold" },
  ];
  const [vis, setVis] = useState(0);
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => setVis(1), 200); }, []);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vis, rev]);
  const hd = (i) => { const dl = lines[i].s === "sp" ? 0 : 120; if (i + 1 < lines.length) setTimeout(() => setVis(v => Math.max(v, i + 2)), dl); else setTimeout(() => setTd(true), 400); };
  const il = LOCS.filter(l => l.img);
  useEffect(() => { if (!td) return; const t = setInterval(() => setRev(p => { if (p >= il.length) { clearInterval(t); return p; } return p + 1; }), 400); return () => clearInterval(t); }, [td]);
  useEffect(() => { if (rev >= il.length) setTimeout(() => setAd(true), 600); }, [rev]);
  return (
    <div onClick={() => ad && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", cursor: ad ? "pointer" : "default", userSelect: "none" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {lines.slice(0, vis).map((l, i) => <TL key={i} text={l.t} style={l.s} onDone={() => hd(i)} />)}
        {td && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          {il.slice(0, rev).map(loc => (
            <div key={loc.id} style={{ background: "#111", border: "1px solid #333", borderRadius: 10, overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
              <div style={{ width: "100%", height: 80, overflow: "hidden", background: "#1a1a1a" }}><img src={loc.img} alt="" style={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} /></div>
              <div style={{ padding: "6px 8px" }}><div style={{ color: loc.color, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{loc.label}</div></div>
            </div>
          ))}
        </div>}
      </div>
      {ad && <div style={{ padding: "14px 16px 20px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
    </div>
  );
}

/* ============ CODENAME REVEAL ============ */
function CodenameReveal({ onDone }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setInterval(() => setStep(s => { if (s >= 3) { clearInterval(t); return s; } return s + 1; }), 1200); return () => clearInterval(t); }, []);
  useEffect(() => { if (step >= 3) setTimeout(() => setDone(true), 800); }, [step]);
  return (
    <div onClick={() => done && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", padding: 20, cursor: done ? "pointer" : "default", userSelect: "none", overflowY: "auto" }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 6 }}>CODENAME ASSIGNMENT</div>
      <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>I've given each of you a codename and avatar.</div>
      {AGENTS.slice(0, step).map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, background: "#111", border: "1px solid #facc15", borderRadius: 10, marginBottom: 12, animation: "fadeIn 0.5s ease" }}>
          <img src={a.img} alt="" style={{ width: 50, height: 50, borderRadius: 10 }} onError={e => { e.target.style.display = "none"; }} />
          <div>
            <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 12, marginBottom: 2 }}>{a.name}</div>
            <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 17, fontWeight: 900, letterSpacing: 3 }}>{a.code}</div>
            <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11 }}>{a.role} {"\u2014"} {a.desc}</div>
          </div>
        </div>
      ))}
      {done && <div style={{ padding: "14px 0 20px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO BEGIN MISSION {"\u25b8"}</span></div>}
    </div>
  );
}

/* ============ AGENT CARDS ============ */
function AgentCards() {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {AGENTS.map(a => (
        <div key={a.name} style={{ flex: 1, background: "#111", border: "1px solid #333", borderRadius: 10, padding: 10, textAlign: "center" }}>
          <img src={a.img} alt="" style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 6 }} onError={e => { e.target.style.display = "none"; }} />
          <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{a.code}</div>
          <div style={{ color: "#888", fontFamily: "monospace", fontSize: 9 }}>{a.role}</div>
        </div>
      ))}
    </div>
  );
}

/* ============ PROGRESS BAR ============ */
function ProgressBar({ label, current, total, color }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: "#888", fontFamily: "monospace", fontSize: 9, letterSpacing: 1 }}>{label}</span>
        <span style={{ color, fontFamily: "monospace", fontSize: 9, fontWeight: 700 }}>{current}/{total}</span>
      </div>
      <div style={{ height: 4, background: "#222", borderRadius: 2 }}>
        <div style={{ height: "100%", background: color, borderRadius: 2, width: `${(current/total)*100}%`, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

/* ============ CHAT BANNER ============ */
function ChatBanner({ type, value }) {
  const cfg = {
    location: { bg: "#0a2e1a", border: "#4ade80", color: "#4ade80", icon: "\ud83d\udccd", label: "NEW LOCATION" },
    fragment: { bg: "#0a1a2e", border: "#3b82f6", color: "#3b82f6", icon: "\ud83d\udd22", label: "FRAGMENT ACQUIRED" },
    word: { bg: "#2e2a0a", border: "#facc15", color: "#facc15", icon: "\ud83d\udd24", label: "WORD CLUE" },
    collector: { bg: "#2e0a0a", border: "#ef4444", color: "#ef4444", icon: "\u26a0", label: "INTERCEPTED BY THE COLLECTOR" },
  }[type] || {};
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: "8px 12px", margin: "4px 0", animation: "fadeIn 0.5s ease", textAlign: "center" }}>
      <div style={{ color: cfg.color, fontFamily: "monospace", fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>{cfg.icon} {cfg.label}</div>
      <div style={{ color: cfg.color, fontFamily: "monospace", fontSize: 16, fontWeight: 900, letterSpacing: 3, marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* ============ SPY MAP ============ */
function SpyMap({ visited, city }) {
  const LONDON_PINS = [
    { id: "buckingham", label: "BUCKINGHAM", x: 22, y: 52 },
    { id: "bigben", label: "BIG BEN", x: 35, y: 50 },
    { id: "eye", label: "LONDON EYE", x: 43, y: 45 },
    { id: "stpauls", label: "ST. PAUL'S", x: 58, y: 25 },
    { id: "tower", label: "TOWER", x: 78, y: 35 },
  ];
  const PARIS_PINS = [
    { id: "arcdetriomphe", label: "ARC DE TRIOMPHE", x: 18, y: 18 },
    { id: "eiffel", label: "EIFFEL TOWER", x: 22, y: 42 },
    { id: "louvre", label: "LOUVRE", x: 42, y: 38 },
    { id: "chapelle", label: "STE-CHAPELLE", x: 48, y: 50 },
  ];
  const pins = city === "london" ? LONDON_PINS : PARIS_PINS;
  const mapImg = city === "london" ? `${IMG}/London-map.png` : `${IMG}/paris-map-clean.png`;
  return (
    <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 14, border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", background: "#0d0d0d" }}>
        <span style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 8, letterSpacing: 2, fontWeight: 700 }}>FIELD MAP</span>
        <span style={{ color: "#333", fontFamily: "monospace", fontSize: 6, letterSpacing: 1 }}>{city === "london" ? "51.5074\u00b0 N" : "48.8566\u00b0 N"}</span>
      </div>
      <div style={{ position: "relative", width: "100%", paddingBottom: "55%", background: "#0d0d0d" }}>
        <img src={mapImg} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
        {pins.map(pin => {
          const v = visited.includes(pin.id);
          const col = v ? "#4ade80" : "#555";
          return (
            <div key={pin.id} style={{ position: "absolute", left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
              {v && <div style={{ position: "absolute", width: 50, height: 50, borderRadius: "50%", border: "1px solid #4ade80", opacity: 0.15, animation: "pulse 2s infinite", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />}
              <svg width="16" height="20" viewBox="0 0 16 20">
                <path d="M 8 0 C 3.6 0 0 3.6 0 8 C 0 12.4 8 20 8 20 S 16 12.4 16 8 C 16 3.6 12.4 0 8 0 Z" fill={col} />
                <circle cx="8" cy="8" r="3" fill={v ? "#fff" : "#333"} />
              </svg>
              <div style={{ marginTop: 1 }}>
                <span style={{ color: col, fontFamily: "monospace", fontSize: 6, fontWeight: 700, letterSpacing: 0.3 }}>{pin.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ LONDON DOSSIER ============ */
function LondonDossier({ visited, wordClues, fragments }) {
  const fragCount = fragments.slice(0,3).filter(f => f).length;
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
      <AgentCards />
      <div style={{ display: "flex", gap: 12, marginBottom: 18, padding: "10px 12px", background: "#111", borderRadius: 10, border: "1px solid #222" }}>
        <ProgressBar label="LOCATIONS" current={visited.length} total={5} color="#4ade80" />
        <ProgressBar label="FRAGMENTS" current={fragCount} total={3} color="#3b82f6" />
        <ProgressBar label="WORD CLUES" current={wordClues.length} total={4} color="#facc15" />
      </div>
      <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>LOCATIONS</div>
      {LOCS.map(loc => {
        const v = visited.includes(loc.id);
        return (
          <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v ? "#4ade80" : "#333" }} />
            <span style={{ color: v ? "#c8c8c8" : "#444", fontFamily: "monospace", fontSize: 13 }}>{loc.label}</span>
            <span style={{ marginLeft: "auto", color: v ? "#4ade80" : "#333", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>{v ? "INVESTIGATED" : "PENDING"}</span>
          </div>
        );
      })}
      <div style={{ color: "#3b82f6", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginTop: 18, marginBottom: 10 }}>CODE FRAGMENTS</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 44, height: 38, borderRadius: 6, background: fragments[i] ? "#111" : "#0a0a0a", border: fragments[i] ? "1px solid #3b82f6" : "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: fragments[i] ? "#3b82f6" : "#333", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>{fragments[i] || "??"}</span>
          </div>
        ))}
      </div>
      <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>WORD CLUES</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {wordClues.map((w, i) => (
          <div key={i} style={{ background: "#111", border: "1px solid #facc15", borderRadius: 8, padding: "6px 12px" }}>
            <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>{w.word}</div>
            <div style={{ color: "#666", fontFamily: "monospace", fontSize: 9 }}>{w.from}</div>
          </div>
        ))}
        {wordClues.length === 0 && <div style={{ color: "#333", fontFamily: "monospace", fontSize: 12 }}>No word clues yet.</div>}
      </div>
      <SpyMap visited={visited} city="london" />
    </div>
  );
}

/* ============ PARIS DOSSIER ============ */
function ParisDossier({ parisVisited, fragments }) {
  const fragCount = fragments.slice(3,6).filter(f => f).length;
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
      <AgentCards />
      <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 10, textAlign: "center" }}>PARIS</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, padding: "10px 12px", background: "#111", borderRadius: 10, border: "1px solid #222" }}>
        <ProgressBar label="LOCATIONS" current={parisVisited.length} total={4} color="#4ade80" />
        <ProgressBar label="FRAGMENTS" current={fragCount} total={3} color="#3b82f6" />
      </div>
      <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>LOCATIONS</div>
      {PARIS_LOCS.map(l => {
        const v = parisVisited.includes(l.id);
        return (
          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v ? "#4ade80" : "#333" }} />
            <span style={{ color: v ? "#c8c8c8" : "#888", fontFamily: "monospace", fontSize: 13 }}>{l.label}</span>
            <span style={{ marginLeft: "auto", color: v ? "#4ade80" : "#333", fontFamily: "monospace", fontSize: 10 }}>{v ? "INVESTIGATED" : "PENDING"}</span>
          </div>
        );
      })}
      <div style={{ color: "#3b82f6", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginTop: 18, marginBottom: 10 }}>CODE FRAGMENTS</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[3,4,5].map(i => (
          <div key={i} style={{ width: 44, height: 38, borderRadius: 6, background: fragments[i] ? "#111" : "#0a0a0a", border: fragments[i] ? "1px solid #3b82f6" : "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: fragments[i] ? "#3b82f6" : "#333", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>{fragments[i] || "??"}</span>
          </div>
        ))}
      </div>
      <SpyMap visited={parisVisited} city="paris" />
    </div>
  );
}

/* ============ PUZZLE ============ */
function Puzzle({ wordClues, onSolved, parisUnlocked }) {
  const [i1, setI1] = useState(""); const [i2, setI2] = useState("");
  const [s1, setS1] = useState(false); const [s2, setS2] = useState(false);
  const [e1, setE1] = useState(false); const [e2, setE2] = useState(false);
  const [ad, setAd] = useState(false);
  const [linger, setLinger] = useState(false);
  const p1 = wordClues.some(w => w.word === "CROSS") && wordClues.some(w => w.word === "ANT");
  const p2 = wordClues.some(w => w.word === "EYE") && wordClues.some(w => w.word === "FELL");
  useEffect(() => { if (s1 && s2 && !parisUnlocked) { setTimeout(() => setAd(true), 1500); setTimeout(() => setLinger(true), 3500); } }, [s1, s2]);
  const c1 = () => { if (i1.trim().toLowerCase() === "croissant") { setS1(true); setE1(false); } else setE1(true); };
  const c2 = () => { if (i2.trim().toLowerCase() === "eiffel") { setS2(true); setE2(false); } else setE2(true); };
  return (
    <div onClick={() => linger && onSolved()} style={{ height: "100%", padding: 20, overflowY: "auto", cursor: linger ? "pointer" : "default" }}>
      <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>PATTERN DETECTED</div>
      <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>I've been analyzing your word clues. Try combining them {"\u2014"} sound them out together.</div>
      {p1 && (
        <div style={{ background: "#111", border: s1 ? "1px solid #4ade80" : e1 ? "1px solid #ef4444" : "1px solid #333", borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: "center" }}>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "5px 10px", color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>CROSS</span>
            <span style={{ color: "#555", fontSize: 15, alignSelf: "center" }}>+</span>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "5px 10px", color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>ANT</span>
          </div>
          {!s1 ? (<><div style={{ display: "flex", gap: 8 }}>
            <input value={i1} onChange={e => { setI1(e.target.value); setE1(false); }} onKeyDown={e => e.key === "Enter" && c1()} placeholder="Sound it out..." style={{ flex: 1, background: "#0a0a0a", border: e1 ? "1px solid #ef4444" : "1px solid #333", borderRadius: 8, padding: "9px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none", textAlign: "center" }} />
            <button onClick={c1} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "9px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>SOLVE</button>
          </div>{e1 && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11, marginTop: 6, textAlign: "center" }}>Not quite. Try sounding it out again.</div>}</>) : <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 17, fontWeight: 700, textAlign: "center", letterSpacing: 3 }}>{"\u2713"} CROISSANT</div>}
        </div>
      )}
      {p2 && (
        <div style={{ background: "#111", border: s2 ? "1px solid #4ade80" : e2 ? "1px solid #ef4444" : "1px solid #333", borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: "center" }}>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "5px 10px", color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>EYE</span>
            <span style={{ color: "#555", fontSize: 15, alignSelf: "center" }}>+</span>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "5px 10px", color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>FELL</span>
          </div>
          {!s2 ? (<><div style={{ display: "flex", gap: 8 }}>
            <input value={i2} onChange={e => { setI2(e.target.value); setE2(false); }} onKeyDown={e => e.key === "Enter" && c2()} placeholder="Sound it out..." style={{ flex: 1, background: "#0a0a0a", border: e2 ? "1px solid #ef4444" : "1px solid #333", borderRadius: 8, padding: "9px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none", textAlign: "center" }} />
            <button onClick={c2} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "9px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>SOLVE</button>
          </div>{e2 && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11, marginTop: 6, textAlign: "center" }}>Not quite. Try sounding it out again.</div>}</>) : <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 17, fontWeight: 700, textAlign: "center", letterSpacing: 3 }}>{"\u2713"} EIFFEL</div>}
        </div>
      )}
      {ad && <div style={{ marginTop: 16, textAlign: "center", animation: "fadeIn 1s ease" }}><div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>THOSE ARE FRENCH.</div><div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 }}>Bellecourt must also have hidden codes in another city...</div></div>}
      {linger && <div style={{ marginTop: 20, textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
      {parisUnlocked && <div style={{ marginTop: 16, textAlign: "center" }}><div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>{"\u2713"} PUZZLE SOLVED</div><div style={{ color: "#fff", fontFamily: "monospace", fontSize: 36, fontWeight: 900, letterSpacing: 8, marginTop: 8, textShadow: "0 0 30px rgba(250,204,21,0.3)" }}>PARIS</div></div>}
    </div>
  );
}

/* ============ CHAT ============ */
function Chat({ visited, setVisited, wordClues, setWordClues, fragments, setFragments, msgs, setMsgs, parisVisited, setParisVisited, parisUnlocked }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const fileRef = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs, loading]);

  const detectLoc = (t) => {
    const l = t.toLowerCase();
    const pending = [];
    if ((l.includes("big ben") || l.includes("westminster")) && !visited.includes("bigben")) { setVisited(p => [...p, "bigben"]); pending.push({ type: "location", value: "Big Ben" }); }
    if (l.includes("tower of london") && !visited.includes("tower")) { setVisited(p => [...p, "tower"]); pending.push({ type: "location", value: "Tower of London" }); }
    if ((l.includes("st paul") || l.includes("saint paul")) && !visited.includes("stpauls")) { setVisited(p => [...p, "stpauls"]); pending.push({ type: "location", value: "St. Paul's Cathedral" }); if (!wordClues.some(w => w.word === "CROSS")) { setWordClues(p => [...p, WORD_MAP.stpauls]); } }
    if ((l.includes("buckingham") || l.includes("palace")) && !visited.includes("buckingham")) { setVisited(p => [...p, "buckingham"]); pending.push({ type: "location", value: "Buckingham Palace" }); if (!wordClues.some(w => w.word === "FELL")) { setWordClues(p => [...p, WORD_MAP.buckingham]); } }
    if (l.includes("london eye") && !visited.includes("eye")) { setVisited(p => [...p, "eye"]); pending.push({ type: "location", value: "London Eye" }); if (!wordClues.some(w => w.word === "EYE")) { setWordClues(p => [...p, WORD_MAP.eye]); } }
    if (parisUnlocked) {
      if (l.includes("louvre") && !parisVisited.includes("louvre")) { setParisVisited(p => [...p, "louvre"]); pending.push({ type: "location", value: "The Louvre" }); }
      if ((l.includes("sainte-chapelle") || l.includes("sainte chapelle") || l.includes("saint chapelle")) && !parisVisited.includes("chapelle")) { setParisVisited(p => [...p, "chapelle"]); pending.push({ type: "location", value: "Sainte-Chapelle" }); }
      if ((l.includes("arc de triomphe") || l.includes("triomphe") || l.includes("champs")) && !parisVisited.includes("arcdetriomphe")) { setParisVisited(p => [...p, "arcdetriomphe"]); pending.push({ type: "location", value: "Arc de Triomphe" }); }
      if (l.includes("eiffel") && !parisVisited.includes("eiffel")) { setParisVisited(p => [...p, "eiffel"]); pending.push({ type: "location", value: "Eiffel Tower" }); }
    }
    return pending;
  };

  const detectResp = (t) => {
    const l = t.toLowerCase();
    const pending = [];
    const frag = (num, idx) => {
      if (l.includes(num) && (l.includes("fragment") || l.includes("dossier") || l.includes("number"))) {
        setFragments(p => { if (p[idx] === num) return p; const n=[...p]; n[idx]=num; return n; });
        pending.push({ type: "fragment", value: num });
      }
    };
    frag("92", 0); frag("02", 1); frag("45", 2); frag("41", 3); frag("31", 4); frag("98", 5);
    if (l.includes("collector") && (l.includes("intercepted") || l.includes("took this") || l.includes("step ahead") || l.includes("got here first"))) {
      pending.push({ type: "collector", value: "\"I'm always a step ahead...\"" });
    }
    if (l.includes("ant") && (l.includes("strip") || (l.includes("word clue") && l.includes("ant")) || (l.includes("word is") && l.includes("ant")) || l.includes("ant is a word clue") || l.includes("ant. that's a word clue") || l.includes("the word ant"))) {
      if (!wordClues.some(w => w.word === "ANT")) { setWordClues(p => [...p, WORD_MAP.friend]); pending.push({ type: "word", value: "ANT" }); }
    }
    if (l.includes("word clue") || l.includes("word is")) {
      if (l.includes("cross") && !wordClues.some(w => w.word === "CROSS")) pending.push({ type: "word", value: "CROSS" });
      if (l.includes("eye") && !wordClues.some(w => w.word === "EYE")) pending.push({ type: "word", value: "EYE" });
      if (l.includes("fell") && !wordClues.some(w => w.word === "FELL")) pending.push({ type: "word", value: "FELL" });
    }
    return pending;
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      const nm = [...msgs, { role: "user", text: "[Photo uploaded]", image: url }];
      setMsgs(nm); setLoading(true);
      fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nm.map(m => ({ role: m.role === "spy" ? "assistant" : "user", content: m.text })) }) })
        .then(r => r.json()).then(d => {
          if (d.text) { const rb = detectResp(d.text); setMsgs(p => [...p, { role: "spy", text: d.text, banners: rb.length > 0 ? rb : undefined }]); }
          else setMsgs(p => [...p, { role: "spy", text: "Signal interference. Try again. \u2014 Tru" }]);
        })
        .catch(() => setMsgs(p => [...p, { role: "spy", text: "Channel disrupted. Try again. \u2014 Tru" }]))
        .finally(() => setLoading(false));
    };
    reader.readAsDataURL(file); e.target.value = "";
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput("");
    const lb = detectLoc(msg);
    const um = { role: "user", text: msg, banners: lb.length > 0 ? lb : undefined };
    const nm = [...msgs, um];
    setMsgs(nm); setLoading(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nm.map(m => ({ role: m.role === "spy" ? "assistant" : "user", content: m.text })) }) });
      const d = await r.json();
      if (d.text) { const rb = detectResp(d.text); setMsgs(p => [...p, { role: "spy", text: d.text, banners: rb.length > 0 ? rb : undefined }]); }
      else setMsgs(p => [...p, { role: "spy", text: "Signal interference. Try again. \u2014 Tru" }]);
    } catch { setMsgs(p => [...p, { role: "spy", text: "Channel disrupted. Try again. \u2014 Tru" }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={`m${i}`}>
            <div style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", marginLeft: m.role === "user" ? "auto" : 0 }}>
              {m.image && <img src={m.image} alt="" style={{ width: "100%", maxWidth: 200, borderRadius: 10, marginBottom: 4 }} />}
              <div style={{ background: m.role === "user" ? "#1e3a5f" : "#1a1a1a", border: m.role === "user" ? "1px solid #2563eb" : "1px solid #333", borderRadius: 12, padding: "10px 12px", color: m.role === "user" ? "#93c5fd" : "#c8c8c8", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div>
            </div>
            {m.banners && m.banners.map((b, bi) => <ChatBanner key={`b${i}-${bi}`} type={b.type} value={b.value} />)}
          </div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start" }}><div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, padding: "10px 12px" }}><span style={{ color: "#facc15", fontFamily: "monospace" }}>{"\u25cf"} {"\u25cf"} {"\u25cf"}</span></div></div>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: "none" }} />
      <div style={{ padding: "10px 14px", borderTop: "1px solid #222", display: "flex", gap: 8 }}>
        <button onClick={() => fileRef.current?.click()} style={{ background: "#222", border: "1px solid #444", borderRadius: 8, padding: "10px 12px", color: "#888", fontSize: 16, cursor: "pointer" }}>{"\ud83d\udcf7"}</button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Report to Tru..."
          style={{ flex: 1, background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 13, outline: "none" }} />
        <button onClick={send} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>SEND</button>
      </div>
    </div>
  );
}

/* ============ TAB BAR ============ */
function TabBar({ view, setView, visited, wordClues, fragments, parisUnlocked, parisVisited }) {
  const lf = fragments.slice(0,3).filter(f=>f).length;
  const pf = fragments.slice(3,6).filter(f=>f).length;
  const showPuzzle = wordClues.length >= 4;
  const lb = (<span style={{ fontSize: 7 }}><span style={{ color: "#4ade80" }}>{visited.length}/5</span>{" \u00b7 "}<span style={{ color: "#3b82f6" }}>{lf}/3</span>{" \u00b7 "}<span style={{ color: "#facc15" }}>{wordClues.length}/4</span></span>);
  const pb = (<span style={{ fontSize: 7 }}><span style={{ color: "#4ade80" }}>{parisVisited.length}/4</span>{" \u00b7 "}<span style={{ color: "#3b82f6" }}>{pf}/3</span></span>);
  const tab = (id, label, color, badge, extra) => (
    <button key={id} onClick={() => setView(id)} style={{ flex: 1, padding: "8px 2px", background: view === id ? "#111" : "transparent", border: "none", borderBottom: view === id ? `2px solid ${color}` : "2px solid transparent", color: view === id ? color : "#555", fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, ...(extra || {}) }}>
      <span>{label}</span>{badge}
    </button>
  );
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #222", flexShrink: 0 }}>
      {tab("chat", "\ud83d\udfe2 TRU", "#4ade80", null)}
      {tab("london", "LONDON", "#facc15", lb)}
      {showPuzzle && tab("puzzle", "\u26a0 PUZZLE", "#ef4444", parisUnlocked ? <span style={{ fontSize: 7, color: "#4ade80" }}>SOLVED</span> : null, !parisUnlocked ? { animation: "pulse 1.5s infinite" } : {})}
      {parisUnlocked && tab("paris", "PARIS", "#f97316", pb)}
    </div>
  );
}

/* ============ MAIN APP ============ */
export default function Home() {
  const [phase, setPhase] = usePersist("oct_p", "passcode");
  const [briefIdx, setBriefIdx] = usePersist("oct_bi", 0);
  const [vStep, setVStep] = useState(0);
  const [visited, setVisited] = usePersist("oct_v", []);
  const [wordClues, setWordClues] = usePersist("oct_w", []);
  const [fragments, setFragments] = usePersist("oct_f", ["","","","","",""]);
  const [parisUnlocked, setParisUnlocked] = usePersist("oct_pu", false);
  const [parisVisited, setParisVisited] = usePersist("oct_pv", []);
  const [view, setView] = useState("chat");
  const [msgs, setMsgs] = usePersist("oct_m", []);
  const [parisRevealDone, setParisRevealDone] = usePersist("oct_prd", false);
  const [puzzleNudgeSent, setPuzzleNudgeSent] = usePersist("oct_pns", false);

  useEffect(() => {
    const londonFragsDone = fragments.slice(0,3).every(f => f);
    if (wordClues.length >= 4 && londonFragsDone && !puzzleNudgeSent && phase === "active") {
      setPuzzleNudgeSent(true);
      setTimeout(() => { setMsgs(p => [...p, { role: "spy", text: "Agents \u2014 I've been studying these word clues. There's a pattern. Check the PUZZLE tab \u2014 try combining them. Sound them out.\n\n\u2014 Tru" }]); }, 2000);
    }
  }, [wordClues.length, fragments, phase, puzzleNudgeSent]);

  useEffect(() => {
    if (parisUnlocked && !parisRevealDone && phase === "active") { setPhase("parisreveal"); }
  }, [parisUnlocked]);

  useEffect(() => {
    if (phase === "active" && msgs.length === 0) {
      setMsgs([{ role: "spy", text: "JAGUAR. OTTER. STINGRAY.\n\nYou're officially active.\n\nAct like tourists \u2014 check out the sites, eat good food. But at landmarks, check in with me.\n\nTell me where you are.\n\n\u2014 Tru" }]);
    }
  }, [phase]);

  const head = (<><Head><title>Operation Clocktower</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></Head><style jsx global>{`*{margin:0;padding:0;box-sizing:border-box}html,body,#__next{height:100%;background:#0a0a0a}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style></>);
  const wrap = c => <>{head}<div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>{c}</div></>;

  if (phase === "passcode") return wrap(<IS rk="pass" title="OPERATION CLOCKTOWER" subtitle="SECURE CHANNEL" prompt="ENTER MISSION CODE" placeholder="Mission code..." buttonText="ACCESS" errMsg="Invalid mission code." onSubmit={v => { if (v.trim().toUpperCase() === MC) { setPhase("intro"); return true; } return false; }} />);

  if (phase === "intro") return wrap(<TS id="intro" lines={[{t:"OPERATION CLOCKTOWER",s:"header"},{t:"SECURE CHANNEL",s:"sub"},{t:"",s:"sp"},{t:"Incoming transmission...",s:"dim",delay:800},{t:"",s:"sp"},{t:"Hello, agents.",s:"normal",delay:500},{t:"",s:"sp"},{t:"My name is Tru.",s:"bold"},{t:"",s:"sp"},{t:"Some of you may know me from the City Spies.",s:"normal"},{t:"",s:"sp"},{t:"Now I need a new team.",s:"normal"},{t:"",s:"sp"},{t:"But first \u2014 I need to make sure you are who I think you are.",s:"bold"}]} onDone={() => setPhase("verify")} />);

  if (phase === "verify") { const q = VQS[vStep]; return wrap(<IS rk={`v${vStep}`} title="OPERATION CLOCKTOWER" subtitle="IDENTITY CHECK" prompt={`${q.name.toUpperCase()}, ANSWER THIS:\n${q.q}`} placeholder="Type your answer..." buttonText="VERIFY" errMsg="Verification failed." onSubmit={v => { if (fuzzy(v, q.a)) { setPhase(vStep === 0 ? "vc" : "vm"); if (vStep === 0) setVStep(1); return true; } return false; }} />); }

  if (phase === "vc") return wrap(
    <div onClick={() => setPhase("verify")} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, cursor: "pointer", userSelect: "none" }}>
      <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>{"\u2713"} VERIFIED</div>
      <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 14, textAlign: "center", maxWidth: 300 }}>Welcome aboard, Cade.</div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, textAlign: "center", maxWidth: 300, marginTop: 8 }}>Enjoy Mark Day next year.</div>
      <div style={{ marginTop: 30 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>
    </div>
  );

  if (phase === "vm") return wrap(
    <div onClick={() => setPhase("briefing")} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, cursor: "pointer", userSelect: "none" }}>
      <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>{"\u2713"} VERIFIED</div>
      <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 14, textAlign: "center", maxWidth: 300 }}>Welcome aboard, Maggie.</div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, textAlign: "center", maxWidth: 300, marginTop: 8 }}>Keep working hard with Trish.</div>
      <div style={{ color: "#777", fontFamily: "monospace", fontSize: 12, marginTop: 16 }}>Both agents confirmed.</div>
      <div style={{ marginTop: 30 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>
    </div>
  );

  if (phase === "briefing") {
    if (briefIdx >= BRIEFING.length) { setPhase("arrived"); return null; }
    const b = BRIEFING[briefIdx];
    if (b.special === "collector") return wrap(<CollectorReveal onDone={() => setBriefIdx(i => i + 1)} />);
    if (b.special === "london") return wrap(<LondonReveal onDone={() => setBriefIdx(i => i + 1)} />);
    if (b.special === "howto") return wrap(<HowtoLocs onDone={() => setBriefIdx(i => i + 1)} />);
    return wrap(<TS id={b.id} lines={b.lines} onDone={() => setBriefIdx(i => i + 1)} />);
  }

  if (phase === "arrived") return wrap(
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 4, textAlign: "center" }}>OPERATION CLOCKTOWER</div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, letterSpacing: 4, marginBottom: 32, textAlign: "center" }}>SECURE CHANNEL</div>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 12px #4ade80", marginBottom: 24 }} />
      <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, textAlign: "center", maxWidth: 300, marginBottom: 24 }}>When you're with Callum, tap below to verify him. It's something only he'll know.</div>
      <button onClick={() => setPhase("calverify")} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "12px 32px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>VERIFY CALLUM</button>
    </div>
  );

  if (phase === "calverify") return wrap(<IS rk="cal" title="AGENT VERIFICATION" subtitle="ONE MORE AGENT TO CONFIRM" prompt={"CALLUM, ANSWER THIS:\nWho did you fly to London with?"} placeholder="Type your answer..." buttonText="VERIFY" errMsg="That's not right. Try again, agent." onSubmit={v => { if (calOk(v)) { setPhase("calok"); return true; } return false; }} />);

  if (phase === "calok") return wrap(
    <div onClick={() => setPhase("codenames")} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, cursor: "pointer", userSelect: "none" }}>
      <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>{"\u2713"} ALL AGENTS VERIFIED</div>
      <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 14, textAlign: "center", maxWidth: 300 }}>Welcome aboard, Callum.</div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, textAlign: "center", maxWidth: 300, marginTop: 8 }}>Good job beating Areeb in cards.</div>
      <div style={{ color: "#777", fontFamily: "monospace", fontSize: 12, marginTop: 16 }}>The team is complete.</div>
      <div style={{ marginTop: 30 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>
    </div>
  );

  if (phase === "codenames") return wrap(<CodenameReveal onDone={() => setPhase("active")} />);

  if (phase === "parisreveal") return wrap(<ParisReveal onDone={() => setPhase("collectortaunt")} />);
  if (phase === "collectortaunt") return wrap(<CollectorTaunt onDone={() => setPhase("parislocs")} />);
  if (phase === "parislocs") return wrap(<ParisLocsPreview onDone={() => { setParisRevealDone(true); setPhase("active"); setView("chat"); }} />);

  if (phase === "active") return (<>{head}
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <TabBar view={view} setView={setView} visited={visited} wordClues={wordClues} fragments={fragments} parisUnlocked={parisUnlocked} parisVisited={parisVisited} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        {view === "chat" && <Chat visited={visited} setVisited={setVisited} wordClues={wordClues} setWordClues={setWordClues} fragments={fragments} setFragments={setFragments} msgs={msgs} setMsgs={setMsgs} parisVisited={parisVisited} setParisVisited={setParisVisited} parisUnlocked={parisUnlocked} />}
        {view === "london" && <LondonDossier visited={visited} wordClues={wordClues} fragments={fragments} />}
        {view === "puzzle" && <Puzzle wordClues={wordClues} onSolved={() => setParisUnlocked(true)} parisUnlocked={parisUnlocked} />}
        {view === "paris" && <ParisDossier parisVisited={parisVisited} fragments={fragments} />}
      </div>
    </div>
  </>);

  return null;
}
