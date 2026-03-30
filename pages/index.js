import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

const IMG = "https://raw.githubusercontent.com/jamesjimjimbo/operation-clocktower/main/public/images";

function fuzzyMatch(input, accepts) {
  const c = input.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
  for (const a of accepts) {
    const ca = a.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
    if (c === ca || c.includes(ca) || ca.includes(c)) return true;
  }
  return false;
}
function calMatch(input) { return input.trim().toLowerCase().includes("areeb"); }

function usePersist(key, initial) {
  const [val, setVal] = useState(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const s = typeof window !== "undefined" && window.localStorage.getItem(key);
      if (s) { setVal(JSON.parse(s)); }
    } catch(e) {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { typeof window !== "undefined" && window.localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }, [val]);
  return [val, setVal];
}

const MC = "CITY SPIES";
const VQS = [
  { name: "Cade", q: "What is the animal mascot of your new school?", a: ["griffin","griffon","gryphon","griffins","gryphons","griffons","a griffin","the griffin"] },
  { name: "Maggie", q: "What song are you learning to play in music class?", a: ["seven nation army","7 nation army","seven nations army","7 nations army"] },
];
const CNS = [
  { name: "Cade", code: "JAGUAR", desc: "Silent. Sharp. The apex predator of codebreaking.", img: `${IMG}/jaguar.png` },
  { name: "Maggie", code: "OTTER", desc: "Quick, curious, and impossible to fool.", img: `${IMG}/otter.png` },
  { name: "Callum", code: "STINGRAY", desc: "Glides under the radar. Strikes when no one expects it.", img: `${IMG}/stingray.png` },
];
const LOCS = [
  { id: "bigben", label: "Big Ben", color: "#3b82f6", img: `${IMG}/bigben.jpg` },
  { id: "tower", label: "Tower of London", color: "#ef4444", img: `${IMG}/tower.jpg` },
  { id: "stpauls", label: "St. Paul's Cathedral", color: "#a855f7", img: `${IMG}/stpauls.jpg` },
  { id: "buckingham", label: "Buckingham Palace", color: "#eab308", img: `${IMG}/buckingham.jpg` },
  { id: "eye", label: "London Eye", color: "#06b6d4" },
];

const BRIEFING = [
  { id: "b1", lines: [
    { t: "\u26a0 PRIORITY BRIEFING \u26a0", s: "warning" }, { t: "OPERATION CLOCKTOWER", s: "header" }, { t: "", s: "sp" },
    { t: "Over 100 years ago, a brilliant clockmaker named \u00c9mile Bellecourt built secret mechanisms into the great landmarks of London.", s: "normal" }, { t: "", s: "sp" },
    { t: "Hidden inside each is a fragment of a master code \u2014 a code that unlocks a vault containing his greatest invention.", s: "normal" }, { t: "", s: "sp" },
    { t: "For a century, no one knew.", s: "normal" }, { t: "", s: "sp" }, { t: "Now someone does.", s: "bold" },
  ]},
  { id: "b2", lines: [
    { t: "An operative known only as", s: "normal" }, { t: "THE COLLECTOR", s: "villain" }, { t: "is hunting for the fragments.", s: "normal" }, { t: "", s: "sp" },
    { t: "We don't know who he is.", s: "normal" }, { t: "We don't know how close he is.", s: "normal" }, { t: "", s: "sp" },
    { t: "But we know where he's heading.", s: "bold" },
  ]},
  { id: "london", special: "london" },
  { id: "b3", lines: [
    { t: "YOUR TEAM", s: "header" }, { t: "", s: "sp" },
    { t: "Your father \u2014 codename MOTHER \u2014 and your brother Callum are already en route to London.", s: "normal" }, { t: "", s: "sp" },
    { t: "Your mom \u2014 codename MONTY \u2014 is with you now. She'll get you there.", s: "normal" }, { t: "", s: "sp" },
    { t: "The Collector uses adult operatives. They watch for spies in suits and sunglasses.", s: "normal" }, { t: "", s: "sp" },
    { t: "They don't watch for kids.", s: "bold" },
  ]},
  { id: "b4", lines: [
    { t: "YOUR ROLES", s: "header" }, { t: "", s: "sp" },
    { t: "CADE \u2014 The Codebreaker", s: "role" }, { t: "The hardest clues are yours.", s: "roledesc" }, { t: "", s: "sp" },
    { t: "MAGGIE \u2014 The Scout", s: "role" }, { t: "Notice what others miss.", s: "roledesc" }, { t: "", s: "sp" },
    { t: "CALLUM \u2014 The Charm", s: "role" }, { t: "No one suspects him. That's his superpower.", s: "roledesc" }, { t: "", s: "sp" },
    { t: "Mother and Monty are your handlers.", s: "dim" }, { t: "The missions are yours.", s: "bold" },
  ]},
  { id: "b5", special: "howto" },
  { id: "b6", lines: [
    { t: "WHAT TO DO NOW", s: "header" }, { t: "", s: "sp" },
    { t: "1. Get to London.", s: "normal" }, { t: "", s: "sp" },
    { t: "2. When your whole team is together, come back to this site.", s: "normal" }, { t: "", s: "sp" },
    { t: "3. I'll verify Callum, assign your codenames, and give you your first mission.", s: "normal" },
  ]},
  { id: "b7", lines: [
    { t: "The Collector is already looking.", s: "normal" }, { t: "", s: "sp" },
    { t: "You need to be faster.", s: "bold" }, { t: "", s: "sp" }, { t: "", s: "sp" },
    { t: "Good luck, agents.", s: "normal" }, { t: "", s: "sp" },
    { t: "The clock is ticking.", s: "flash" }, { t: "", s: "sp" },
    { t: "\u2014 Tru", s: "dim" },
  ]},
];

const ST = {
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

function TL({ text, style, onDone }) {
  const [d, setD] = useState("");
  const i = useRef(0);
  useEffect(() => {
    if (style === "sp" || !text) { onDone?.(); return; }
    i.current = 0; setD("");
    const sp = (style === "normal" || style === "roledesc" || style === "dim") ? 18 : 28;
    const iv = setInterval(() => { i.current++; setD(text.slice(0, i.current)); if (i.current >= text.length) { clearInterval(iv); onDone?.(); } }, sp);
    return () => clearInterval(iv);
  }, [text, style]);
  if (style === "sp") return <div style={{ height: 14 }} />;
  return <div style={{ ...ST[style], fontFamily: "'Courier New', monospace" }}>{d}<span style={{ opacity: d.length < (text||"").length ? 1 : 0, color: "#facc15" }}>{"\u2588"}</span></div>;
}

function TS({ lines, onDone, id }) {
  const [vis, setVis] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setVis(0); setDone(false); const t = setTimeout(() => setVis(1), 300); return () => clearTimeout(t); }, [id]);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vis]);
  const hd = useCallback((i) => {
    const dl = lines[i]?.delay || (lines[i]?.s === "sp" ? 0 : 120);
    if (i + 1 < lines.length) setTimeout(() => setVis(v => Math.max(v, i + 2)), dl);
    else setTimeout(() => setDone(true), 500);
  }, [lines]);
  return (
    <div onClick={() => done && onDone?.()} style={{ height: "100%", display: "flex", flexDirection: "column", cursor: done ? "pointer" : "default", userSelect: "none" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
        {lines.slice(0, vis).map((l, i) => <TL key={`${id}-${i}`} text={l.t} style={l.s} onDone={() => hd(i)} />)}
      </div>
      {done && <div style={{ padding: "14px 16px 20px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
    </div>
  );
}

function IS({ title, subtitle, prompt, placeholder, onSubmit, errMsg, buttonText, key2 }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  useEffect(() => { setVal(""); setErr(false); }, [key2]);
  const check = () => { if (onSubmit(val)) { setVal(""); setErr(false); } else setErr(true); };
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 4, textAlign: "center" }}>{title}</div>
      {subtitle && <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, letterSpacing: 4, marginBottom: 32, textAlign: "center" }}>{subtitle}</div>}
      {prompt && <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 16, textAlign: "center", maxWidth: 300, lineHeight: 1.6, whiteSpace: "pre-line" }}>{prompt}</div>}
      <input value={val} onChange={e => { setVal(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && check()} placeholder={placeholder} autoFocus
        style={{ width: "100%", maxWidth: 280, background: "#111", border: err ? "1px solid #ef4444" : "1px solid #333", borderRadius: 8, padding: "11px 14px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 15, outline: "none", textAlign: "center", marginBottom: 12 }} />
      <button onClick={check} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 28px", fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{buttonText || "SUBMIT"}</button>
      {err && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11, marginTop: 10 }}>{errMsg || "Try again."}</div>}
    </div>
  );
}

function LondonReveal({ onDone }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 400); }, []);
  return (
    <div onClick={() => show && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: show ? "pointer" : "default", userSelect: "none", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><img src={`${IMG}/london.jpg`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} /></div>
      {show && <>
        <div style={{ position: "relative", zIndex: 1, color: "#fff", fontFamily: "'Courier New', monospace", fontSize: 48, fontWeight: 900, letterSpacing: 10, textShadow: "0 0 40px rgba(250,204,21,0.4)", animation: "fadeIn 1s ease" }}>LONDON</div>
        <div style={{ position: "relative", zIndex: 1, marginTop: 30 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>
      </>}
    </div>
  );
}

function HowtoLocs({ onDone }) {
  const [textDone, setTextDone] = useState(false);
  const [rev, setRev] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const lines = [
    { t: "HOW THIS WORKS", s: "header" }, { t: "", s: "sp" },
    { t: "Act like tourists. Check out sites, eat good food, have fun.", s: "normal" }, { t: "", s: "sp" },
    { t: "But at landmarks \u2014 clocks, towers, churches \u2014 check in with me to see if there's a clue.", s: "normal" }, { t: "", s: "sp" },
    { t: "Not every place will have one. Blend in. The Collector is watching.", s: "normal" }, { t: "", s: "sp" },
    { t: "Here are some places to check out:", s: "bold" },
  ];
  const [vis, setVis] = useState(0);
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => setVis(1), 200); }, []);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vis, rev]);
  const hd = (i) => {
    const dl = lines[i].s === "sp" ? 0 : 120;
    if (i + 1 < lines.length) setTimeout(() => setVis(v => Math.max(v, i + 2)), dl);
    else setTimeout(() => setTextDone(true), 400);
  };
  useEffect(() => { if (!textDone) return; const t = setInterval(() => setRev(p => { if (p >= 4) { clearInterval(t); return p; } return p + 1; }), 400); return () => clearInterval(t); }, [textDone]);
  useEffect(() => { if (rev >= 4) setTimeout(() => setAllDone(true), 600); }, [rev]);
  const locsWithImg = LOCS.filter(l => l.img);
  return (
    <div onClick={() => allDone && onDone()} style={{ height: "100%", display: "flex", flexDirection: "column", cursor: allDone ? "pointer" : "default", userSelect: "none" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {lines.slice(0, vis).map((l, i) => <TL key={i} text={l.t} style={l.s} onDone={() => hd(i)} />)}
        {textDone && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {locsWithImg.slice(0, rev).map(loc => (
              <div key={loc.id} style={{ background: "#111", border: "1px solid #333", borderRadius: 10, overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
                <div style={{ width: "100%", height: 80, overflow: "hidden", background: "#1a1a1a" }}>
                  <img src={loc.img} alt={loc.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "6px 8px" }}>
                  <div style={{ color: loc.color, fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{loc.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {allDone && <div style={{ padding: "14px 16px 20px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
    </div>
  );
}

function Dossier({ visited, wordClues, parisUnlocked, fragments }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 16 }}>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>LOCATIONS</div>
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
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginTop: 20, marginBottom: 12 }}>FRAGMENTS</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width: 44, height: 44, borderRadius: 8, background: fragments[i] ? "#111" : "#0a0a0a", border: fragments[i] ? "1px solid #4ade80" : "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: fragments[i] ? "#4ade80" : "#333", fontFamily: "monospace", fontSize: 18, fontWeight: 700 }}>{fragments[i] || "?"}</span>
          </div>
        ))}
      </div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>WORD CLUES</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {wordClues.map((w, i) => (
          <div key={i} style={{ background: "#111", border: "1px solid #facc15", borderRadius: 8, padding: "8px 14px" }}>
            <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>{w.word}</div>
            <div style={{ color: "#666", fontFamily: "monospace", fontSize: 10 }}>{w.from}</div>
          </div>
        ))}
        {wordClues.length === 0 && <div style={{ color: "#333", fontFamily: "monospace", fontSize: 12 }}>No word clues yet.</div>}
      </div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>THE COLLECTOR</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#111", borderRadius: 10, border: "1px solid #333" }}>
        <img src={`${IMG}/collector.png`} alt="" style={{ width: 40, height: 40, borderRadius: 8 }} onError={e => { e.target.style.display = "none"; }} />
        <div>
          <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>THE COLLECTOR</div>
          <div style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>Status: {parisUnlocked ? "Fled to Paris" : visited.length > 2 ? "Active in London" : "Location unknown"}</div>
        </div>
      </div>
      {parisUnlocked && (<>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginTop: 24, marginBottom: 8, textAlign: "center" }}>PARIS UNLOCKED</div>
        <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, textAlign: "center", marginBottom: 16 }}>The last fragments are hidden in Paris.</div>
        {["The Louvre", "Sainte-Chapelle", "Sacr\u00e9-C\u0153ur", "Eiffel Tower"].map(loc => (
          <div key={loc} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
            <span style={{ color: "#888", fontFamily: "monospace", fontSize: 13 }}>{loc}</span>
            <span style={{ marginLeft: "auto", color: "#333", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>PENDING</span>
          </div>
        ))}
      </>)}
    </div>
  );
}

function Puzzle({ wordClues, onSolved }) {
  const [i1, setI1] = useState("");
  const [i2, setI2] = useState("");
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const p1 = wordClues.some(w => w.word === "CROSS") && wordClues.some(w => w.word === "ANT");
  const p2 = wordClues.some(w => w.word === "EYE") && wordClues.some(w => w.word === "FELL");
  useEffect(() => { if (s1 && (s2 || !p2)) { setTimeout(() => setAllDone(true), 1500); setTimeout(() => onSolved(), 3000); } }, [s1, s2]);
  const c1 = () => { if (i1.trim().toLowerCase() === "croissant") setS1(true); };
  const c2 = () => { if (i2.trim().toLowerCase() === "eiffel") setS2(true); };
  return (
    <div style={{ height: "100%", padding: 20, overflowY: "auto" }}>
      <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>PATTERN DETECTED</div>
      <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>I've been analyzing the word clues you collected. There's a pattern {"\u2014"} but I can't crack it. Can you combine them into real words?</div>
      {p1 && (
        <div style={{ background: "#111", border: s1 ? "1px solid #4ade80" : "1px solid #333", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: "center" }}>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>CROSS</span>
            <span style={{ color: "#555", fontSize: 16, alignSelf: "center" }}>+</span>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>ANT</span>
          </div>
          {!s1 ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input value={i1} onChange={e => setI1(e.target.value)} onKeyDown={e => e.key === "Enter" && c1()} placeholder="What word?"
                style={{ flex: 1, background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "10px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none", textAlign: "center" }} />
              <button onClick={c1} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>SOLVE</button>
            </div>
          ) : <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, textAlign: "center", letterSpacing: 3 }}>{"\u2713"} CROISSANT</div>}
        </div>
      )}
      {p2 && (
        <div style={{ background: "#111", border: s2 ? "1px solid #4ade80" : "1px solid #333", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: "center" }}>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>EYE</span>
            <span style={{ color: "#555", fontSize: 16, alignSelf: "center" }}>+</span>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>FELL</span>
          </div>
          {!s2 ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input value={i2} onChange={e => setI2(e.target.value)} onKeyDown={e => e.key === "Enter" && c2()} placeholder="What word?"
                style={{ flex: 1, background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "10px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none", textAlign: "center" }} />
              <button onClick={c2} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>SOLVE</button>
            </div>
          ) : <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, textAlign: "center", letterSpacing: 3 }}>{"\u2713"} EIFFEL</div>}
        </div>
      )}
      {allDone && (
        <div style={{ marginTop: 16, textAlign: "center", animation: "fadeIn 1s ease" }}>
          <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>THOSE ARE FRENCH.</div>
          <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6 }}>He must have worked outside of London too. He's heading to...</div>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 36, fontWeight: 900, letterSpacing: 8, marginTop: 12, textShadow: "0 0 30px rgba(250,204,21,0.3)" }}>PARIS</div>
        </div>
      )}
    </div>
  );
}

function Chat({ codenames, visited, setVisited, wordClues, setWordClues, fragments, setFragments, msgs, setMsgs }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs, loading]);

  const detectLoc = (t) => {
    const l = t.toLowerCase();
    if ((l.includes("big ben") || l.includes("westminster")) && !visited.includes("bigben")) setVisited(p => [...p, "bigben"]);
    if (l.includes("tower of london") && !visited.includes("tower")) setVisited(p => [...p, "tower"]);
    if ((l.includes("st paul") || l.includes("saint paul")) && !visited.includes("stpauls")) setVisited(p => [...p, "stpauls"]);
    if ((l.includes("buckingham") || l.includes("palace")) && !visited.includes("buckingham")) setVisited(p => [...p, "buckingham"]);
    if (l.includes("london eye") && !visited.includes("eye")) setVisited(p => [...p, "eye"]);
  };

  const detectClues = (t) => {
    const l = t.toLowerCase();
    if (l.includes("fragment 1") || (l.includes("fragment") && l.includes("number is 7"))) setFragments(p => { const n=[...p]; n[0]="7"; return n; });
    if (l.includes("fragment 2") || (l.includes("fragment") && l.includes("number is 3"))) setFragments(p => { const n=[...p]; n[1]="3"; return n; });
    if (l.includes("fragment 3") || (l.includes("fragment") && l.includes("number is 1"))) setFragments(p => { const n=[...p]; n[2]="1"; return n; });
    if (l.includes("fragment 4") || (l.includes("fragment") && l.includes("number is 9"))) setFragments(p => { const n=[...p]; n[3]="9"; return n; });
    if (l.includes("fragment 5") || (l.includes("fragment") && l.includes("number is 4"))) setFragments(p => { const n=[...p]; n[4]="4"; return n; });
    if (l.includes("cross") && (l.includes("word") || l.includes("clue") || l.includes("remember"))) setWordClues(p => p.some(w => w.word==="CROSS") ? p : [...p, {word:"CROSS",from:"St. Paul's"}]);
    if (l.includes("ant") && (l.includes("word") || l.includes("clue") || l.includes("remember") || l.includes("strip"))) setWordClues(p => p.some(w => w.word==="ANT") ? p : [...p, {word:"ANT",from:"Friend's dinner"}]);
    if (l.includes("eye") && (l.includes("word") || l.includes("clue") || l.includes("remember"))) setWordClues(p => p.some(w => w.word==="EYE") ? p : [...p, {word:"EYE",from:"London Eye"}]);
    if (l.includes("fell") && (l.includes("word") || l.includes("clue") || l.includes("remember"))) setWordClues(p => p.some(w => w.word==="FELL") ? p : [...p, {word:"FELL",from:"Tower of London"}]);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput("");
    const newMsgs = [...msgs, { role: "user", text: msg }];
    setMsgs(newMsgs); setLoading(true);
    detectLoc(msg);
    try {
      const apiMsgs = newMsgs.map(m => ({ role: m.role === "spy" ? "assistant" : "user", content: m.text }));
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMsgs }) });
      const data = await res.json();
      if (data.text) {
        detectClues(data.text);
        setMsgs(p => [...p, { role: "spy", text: data.text }]);
      } else {
        setMsgs(p => [...p, { role: "spy", text: "Signal interference. Try again in a moment. \u2014 Tru" }]);
      }
    } catch (err) {
      setMsgs(p => [...p, { role: "spy", text: "Secure channel disrupted. Check connection. \u2014 Tru" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div style={{ background: m.role === "user" ? "#1e3a5f" : "#1a1a1a", border: m.role === "user" ? "1px solid #2563eb" : "1px solid #333", borderRadius: 12, padding: "10px 12px", color: m.role === "user" ? "#93c5fd" : "#c8c8c8", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start" }}><div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, padding: "10px 12px" }}><span style={{ color: "#facc15", fontFamily: "monospace" }}>{"\u25cf \u25cf \u25cf"}</span></div></div>}
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid #222", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Report to Tru..."
          style={{ flex: 1, background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 13, outline: "none" }} />
        <button onClick={send} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>SEND</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = usePersist("oct_phase", "passcode");
  const [briefIdx, setBriefIdx] = usePersist("oct_bidx", 0);
  const [vStep, setVStep] = useState(0);
  const [codenames, setCodenames] = usePersist("oct_cn", ["JAGUAR", "OTTER", "STINGRAY"]);
  const [cnStep, setCnStep] = useState(0);
  const [cnConf, setCnConf] = useState([false, false, false]);
  const [visited, setVisited] = usePersist("oct_vis", []);
  const [wordClues, setWordClues] = usePersist("oct_wc", []);
  const [fragments, setFragments] = usePersist("oct_frag", ["","","","",""]);
  const [parisUnlocked, setParisUnlocked] = usePersist("oct_paris", false);
  const [view, setView] = useState("chat");
  const [msgs, setMsgs] = usePersist("oct_msgs", []);

  const c0 = codenames[0], c1 = codenames[1], c2 = codenames[2];

  useEffect(() => {
    if (phase === "active" && msgs.length === 0) {
      setMsgs([{ role: "spy", text: `${c0}. ${c1}. ${c2}.\n\nYou're officially active.\n\nYour mom and dad will take you around London for a few days. Act like tourists \u2014 check out the sites, eat good food, have fun.\n\nBut when you find yourselves at landmarks \u2014 clocks, towers, churches, maybe other things \u2014 check in with me here.\n\nWhen you get somewhere, just tell me where you are.\n\n\u2014 Tru` }]);
    }
  }, [phase]);

  const head = (
    <>
      <Head><title>Operation Clocktower</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></Head>
      <style jsx global>{`* { margin: 0; padding: 0; box-sizing: border-box; } html, body, #__next { height: 100%; background: #0a0a0a; } @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );

  const wrap = (c) => <>{head}<div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>{c}</div></>;

  if (phase === "passcode") return wrap(
    <IS title="OPERATION CLOCKTOWER" subtitle="SECURE CHANNEL" prompt="ENTER MISSION CODE" placeholder="Mission code..." buttonText="ACCESS" errMsg="Invalid mission code." key2="pass"
      onSubmit={v => { if (v.trim().toUpperCase() === MC) { setPhase("intro"); return true; } return false; }} />
  );

  if (phase === "intro") return wrap(
    <TS id="intro" lines={[
      { t: "OPERATION CLOCKTOWER", s: "header" }, { t: "SECURE CHANNEL", s: "sub" }, { t: "", s: "sp" },
      { t: "Incoming transmission...", s: "dim", delay: 800 }, { t: "", s: "sp" },
      { t: "Hello, agents.", s: "normal", delay: 500 }, { t: "", s: "sp" },
      { t: "My name is Tru.", s: "bold" }, { t: "", s: "sp" },
      { t: "Some of you may know me from the City Spies.", s: "normal" }, { t: "", s: "sp" },
      { t: "Now I need a new team.", s: "normal" }, { t: "", s: "sp" },
      { t: "But first \u2014 I need to make sure you are who I think you are.", s: "bold" },
    ]} onDone={() => setPhase("verify")} />
  );

  if (phase === "verify") {
    const q = VQS[vStep];
    return wrap(
      <IS key2={`v${vStep}`} title="OPERATION CLOCKTOWER" subtitle="IDENTITY CHECK"
        prompt={`${q.name.toUpperCase()}, ANSWER THIS:\n${q.q}`}
        placeholder="Type your answer..." buttonText="VERIFY" errMsg="Verification failed. Try again."
        onSubmit={v => { if (fuzzyMatch(v, q.a)) { if (vStep === 0) { setVStep(1); return true; } else { setPhase("briefing"); return true; } } return false; }} />
    );
  }

  if (phase === "briefing") {
    if (briefIdx >= BRIEFING.length) { setPhase("arrived"); return null; }
    const b = BRIEFING[briefIdx];
    if (b.special === "london") return wrap(<LondonReveal onDone={() => setBriefIdx(i => i + 1)} />);
    if (b.special === "howto") return wrap(<HowtoLocs onDone={() => setBriefIdx(i => i + 1)} />);
    return wrap(<TS id={b.id} lines={b.lines} onDone={() => setBriefIdx(i => i + 1)} />);
  }

  if (phase === "arrived") return wrap(
    <IS key2="arr" title="OPERATION CLOCKTOWER" subtitle="SECURE CHANNEL"
      prompt={'When your whole team is together in London, report in:\n"Tru, we have arrived."'}
      placeholder="Type your message..." buttonText="SEND" errMsg="Tru is waiting for your arrival report."
      onSubmit={v => { const l = v.toLowerCase(); if (l.includes("arrived") || l.includes("here") || l.includes("london") || l.includes("made it")) { setPhase("calverify"); return true; } return false; }} />
  );

  if (phase === "calverify") return wrap(
    <IS key2="cal" title="AGENT VERIFICATION" subtitle="ONE MORE AGENT TO CONFIRM"
      prompt="CALLUM, ANSWER THIS:\nWho did you fly to London with?"
      placeholder="Type your answer..." buttonText="VERIFY" errMsg="That's not right. Try again, agent."
      onSubmit={v => { if (calMatch(v)) { setPhase("codenames"); return true; } return false; }} />
  );

  if (phase === "codenames") return wrap(
    <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 6 }}>CODENAME ASSIGNMENT</div>
      <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>Your codenames based on your skills:</div>
      {CNS.map((a, i) => (
        <div key={i} style={{ marginBottom: 14, padding: 14, background: i <= cnStep ? "#111" : "#0a0a0a", border: cnConf[i] ? "1px solid #4ade80" : i === cnStep ? "1px solid #facc15" : "1px solid #222", borderRadius: 10, opacity: i <= cnStep ? 1 : 0.3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700 }}>{a.name}</span>
            {cnConf[i] && <span style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 11 }}>{"\u2713"}</span>}
          </div>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 17, fontWeight: 900, letterSpacing: 3, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            {i <= cnStep && <img src={a.img} alt="" style={{ width: 36, height: 36, borderRadius: 8 }} onError={e => { e.target.style.display="none"; }} />}
            {i <= cnStep ? codenames[i] : "???"}
          </div>
          {i <= cnStep && !cnConf[i] && <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, marginBottom: 8 }}>{a.desc}</div>}
          {i === cnStep && !cnConf[i] && (
            <button onClick={() => {
              const nc=[...cnConf]; nc[i]=true; setCnConf(nc);
              if (i < 2) setTimeout(() => setCnStep(i+1), 500);
              else setTimeout(() => setPhase("active"), 1000);
            }} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              {a.name === "Callum" ? "CONFIRM (Cal, tap!)" : "ACCEPT"}
            </button>
          )}
        </div>
      ))}
    </div>
  );

  if (phase === "puzzle") return wrap(
    <Puzzle wordClues={wordClues} onSolved={() => { setParisUnlocked(true); setPhase("active"); setView("dossier"); }} />
  );

  if (phase === "active") return (
    <>{head}
      <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #222", flexShrink: 0 }}>
          <button onClick={() => setView("chat")} style={{ flex: 1, padding: "10px", background: view === "chat" ? "#111" : "transparent", border: "none", borderBottom: view === "chat" ? "2px solid #4ade80" : "2px solid transparent", color: view === "chat" ? "#4ade80" : "#555", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: view === "chat" ? "0 0 6px #4ade80" : "none" }} /> TRU
          </button>
          <button onClick={() => setView("dossier")} style={{ flex: 1, padding: "10px", background: view === "dossier" ? "#111" : "transparent", border: "none", borderBottom: view === "dossier" ? "2px solid #facc15" : "2px solid transparent", color: view === "dossier" ? "#facc15" : "#555", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}>
            DOSSIER {wordClues.length > 0 && !parisUnlocked && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 8, padding: "1px 5px", fontSize: 9, marginLeft: 4 }}>{wordClues.length}</span>}
          </button>
          {wordClues.length >= 2 && !parisUnlocked && (
            <button onClick={() => setPhase("puzzle")} style={{ padding: "10px 14px", background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "#ef4444", fontFamily: "monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", animation: "pulse 1.5s infinite" }}>
              {"\u26a0"} PUZZLE
            </button>
          )}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          {view === "chat" && <Chat codenames={codenames} visited={visited} setVisited={setVisited} wordClues={wordClues} setWordClues={setWordClues} fragments={fragments} setFragments={setFragments} msgs={msgs} setMsgs={setMsgs} />}
          {view === "dossier" && <Dossier visited={visited} wordClues={wordClues} parisUnlocked={parisUnlocked} fragments={fragments} />}
        </div>
      </div>
    </>
  );

  return null;
}
