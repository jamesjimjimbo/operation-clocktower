import { useState, useEffect, useRef } from "react";
import Head from "next/head";

function fuzzyMatch(input, accepts) {
  const clean = input.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
  for (const a of accepts) {
    const ca = a.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
    if (clean === ca || clean.includes(ca) || ca.includes(clean)) return true;
  }
  return false;
}
function calMatch(input) { return input.trim().toLowerCase().includes("areeb"); }

const MISSION_CODE = "CITY SPIES";
const VERIFY_QS = [
  { name: "Cade", q: "What is the animal mascot of your new school?", accept: ["griffin","griffon","gryphon","griffins","gryphons","griffons","a griffin","the griffin"] },
  { name: "Maggie", q: "What song are you learning to play in music class?", accept: ["seven nation army","7 nation army","seven nations army","7 nations army"] },
];

const CODENAMES = [
  { name: "Cade", code: "JAGUAR", desc: "Silent. Sharp. The apex predator of codebreaking.", img: "/images/jaguar.png" },
  { name: "Maggie", code: "OTTER", desc: "Quick, curious, and impossible to fool.", img: "/images/otter.png" },
  { name: "Callum", code: "STINGRAY", desc: "Glides under the radar. Strikes when no one expects it.", img: "/images/stingray.png" },
];

const LONDON_LOCATIONS = [
  { id: "bigben", label: "Big Ben", color: "#3b82f6", img: "/images/bigben.jpg" },
  { id: "tower", label: "Tower of London", color: "#ef4444", img: "/images/tower.jpg" },
  { id: "stpauls", label: "St. Paul's Cathedral", color: "#a855f7", img: "/images/stpauls.jpg" },
  { id: "buckingham", label: "Buckingham Palace", color: "#eab308", img: "/images/buckingham.jpg" },
  { id: "eye", label: "London Eye", color: "#06b6d4" },
];

const WORD_CLUES_DEF = [
  { word: "CROSS", from: "St. Paul's Cathedral" },
  { word: "ANT", from: "Friend's dinner" },
  { word: "EYE", from: "London Eye" },
  { word: "FELL", from: "Tower of London" },
];

function saveState(state) { try { if (typeof window !== "undefined") window.localStorage?.setItem?.("oct_state", JSON.stringify(state)); } catch(e){} }
function loadState() { try { if (typeof window !== "undefined") { const s = window.localStorage?.getItem?.("oct_state"); return s ? JSON.parse(s) : null; } } catch(e){} return null; }

function TypedLine({ text, style, onDone }) {
  const [d, setD] = useState("");
  const i = useRef(0);
  useEffect(() => {
    if (style === "spacer" || !text) { onDone?.(); return; }
    i.current = 0; setD("");
    const sp = style === "normal" || style === "roledesc" || style === "dim" ? 18 : 28;
    const iv = setInterval(() => { i.current++; setD(text.slice(0, i.current)); if (i.current >= text.length) { clearInterval(iv); onDone?.(); } }, sp);
    return () => clearInterval(iv);
  }, [text]);
  if (style === "spacer") return <div style={{ height: 14 }} />;
  const S = {
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
  };
  return <div style={{ ...S[style], fontFamily: "'Courier New', monospace" }}>{d}<span style={{ opacity: d.length < text.length ? 1 : 0, color: "#facc15" }}>{"\u2588"}</span></div>;
}

function TypedScreen({ lines, onDone }) {
  const [vis, setVis] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setVis(0); setDone(false); setTimeout(() => setVis(1), 300); }, []);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [vis]);
  const hd = (i) => {
    const dl = lines[i].delay || (lines[i].style === "spacer" ? 0 : 120);
    if (i + 1 < lines.length) setTimeout(() => setVis(i + 2), dl);
    else setTimeout(() => setDone(true), 500);
  };
  return (
    <div onClick={() => done && onDone?.()} style={{ height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column", cursor: done ? "pointer" : "default", userSelect: "none" }}>
      <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
        {lines.slice(0, vis).map((l, i) => <TypedLine key={i} text={l.text} style={l.style} onDone={() => hd(i)} />)}
      </div>
      {done && <div style={{ padding: "14px 16px 20px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
    </div>
  );
}

function InputScreen({ title, subtitle, prompt, placeholder, onSubmit, errMsg, buttonText }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const check = () => { if (onSubmit(val)) { setVal(""); setErr(false); } else setErr(true); };
  return (
    <div style={{ height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 4, textAlign: "center" }}>{title}</div>
      {subtitle && <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, letterSpacing: 4, marginBottom: 32, textAlign: "center" }}>{subtitle}</div>}
      {prompt && <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 16, textAlign: "center", maxWidth: 300, lineHeight: 1.6, whiteSpace: "pre-line" }}>{prompt}</div>}
      <input value={val} onChange={e => { setVal(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && check()} placeholder={placeholder} autoFocus
        style={{ width: "100%", maxWidth: 280, background: "#111", border: err ? "1px solid #ef4444" : "1px solid #333", borderRadius: 8, padding: "11px 14px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 15, outline: "none", textAlign: "center", marginBottom: 12 }} />
      <button onClick={check} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 28px", fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{buttonText || "SUBMIT"}</button>
      {err && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11, marginTop: 10 }}>{errMsg || "Try again, agent."}</div>}
    </div>
  );
}

function Dossier({ visited, wordClues, parisUnlocked, fragments, tab, setTab }) {
  return (
    <div style={{ height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #222" }}>
        <button onClick={() => setTab("london")} style={{ flex: 1, padding: "10px 8px", background: tab === "london" ? "#111" : "transparent", border: "none", borderBottom: tab === "london" ? "2px solid #facc15" : "2px solid transparent", color: tab === "london" ? "#facc15" : "#555", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: "pointer" }}>LONDON</button>
        <button onClick={() => parisUnlocked && setTab("paris")} style={{ flex: 1, padding: "10px 8px", background: tab === "paris" ? "#111" : "transparent", border: "none", borderBottom: tab === "paris" ? "2px solid #facc15" : "2px solid transparent", color: parisUnlocked ? (tab === "paris" ? "#facc15" : "#555") : "#222", fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: 2, cursor: parisUnlocked ? "pointer" : "default" }}>
          {parisUnlocked ? "PARIS" : "\ud83d\udd12 CLASSIFIED"}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {tab === "london" && (<>
          <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>LOCATIONS</div>
          {LONDON_LOCATIONS.map(loc => {
            const v = visited.includes(loc.id);
            return (
              <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #1a1a1a" }}>
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {wordClues.map((w, i) => (
              <div key={i} style={{ background: "#111", border: "1px solid #facc15", borderRadius: 8, padding: "8px 14px" }}>
                <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>{w.word}</div>
                <div style={{ color: "#666", fontFamily: "monospace", fontSize: 10 }}>{w.from}</div>
              </div>
            ))}
            {wordClues.length === 0 && <div style={{ color: "#333", fontFamily: "monospace", fontSize: 12 }}>No word clues collected yet.</div>}
          </div>
          <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginTop: 20, marginBottom: 12 }}>THE COLLECTOR</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#111", borderRadius: 10, border: "1px solid #333" }}>
            <img src="/images/collector.png" alt="The Collector" style={{ width: 40, height: 40, borderRadius: 8 }} onError={e => { e.target.style.display = "none"; }} />
            <div>
              <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>THE COLLECTOR</div>
              <div style={{ color: "#666", fontFamily: "monospace", fontSize: 11 }}>Status: {parisUnlocked ? "Fled to Paris" : visited.length > 2 ? "Active in London" : "Location unknown"}</div>
            </div>
          </div>
        </>)}
        {tab === "paris" && parisUnlocked && (<>
          <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 8, textAlign: "center" }}>PARIS UNLOCKED</div>
          <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, textAlign: "center", marginBottom: 20 }}>Bellecourt spent his final years here. The last fragments are hidden in the city.</div>
          <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>LOCATIONS TO INVESTIGATE</div>
          {["The Louvre", "Sainte-Chapelle", "Sacr\u00e9-C\u0153ur", "Eiffel Tower"].map(loc => (
            <div key={loc} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #1a1a1a" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
              <span style={{ color: "#888", fontFamily: "monospace", fontSize: 13 }}>{loc}</span>
              <span style={{ marginLeft: "auto", color: "#333", fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>PENDING</span>
            </div>
          ))}
          <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginTop: 20, marginBottom: 12 }}>THE COLLECTOR</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#111", borderRadius: 10, border: "1px solid #ef4444" }}>
            <img src="/images/collector.png" alt="" style={{ width: 40, height: 40, borderRadius: 8 }} onError={e => { e.target.style.display = "none"; }} />
            <div>
              <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>THE COLLECTOR</div>
              <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 11 }}>Status: IN PARIS {"\u2014"} CLOSE</div>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}

function ParisPuzzle({ wordClues, onSolved }) {
  const [i1, setI1] = useState("");
  const [i2, setI2] = useState("");
  const [s1, setS1] = useState(false);
  const [s2, setS2] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const hasPair1 = wordClues.some(w => w.word === "CROSS") && wordClues.some(w => w.word === "ANT");
  const hasPair2 = wordClues.some(w => w.word === "EYE") && wordClues.some(w => w.word === "FELL");
  useEffect(() => { if (s1 && (s2 || !hasPair2)) { setTimeout(() => setAllDone(true), 1500); setTimeout(() => onSolved(), 3000); } }, [s1, s2]);
  return (
    <div style={{ height: "100%", background: "#0a0a0a", display: "flex", flexDirection: "column", padding: 20, overflowY: "auto" }}>
      <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>PATTERN DETECTED</div>
      <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>I've been analyzing the word clues you collected. There's a pattern {"\u2014"} but I can't crack it. Can you combine them into real words?</div>
      {hasPair1 && (
        <div style={{ background: "#111", border: s1 ? "1px solid #4ade80" : "1px solid #333", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: "center" }}>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>CROSS</span>
            <span style={{ color: "#555", fontFamily: "monospace", fontSize: 16, alignSelf: "center" }}>+</span>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>ANT</span>
          </div>
          {!s1 ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input value={i1} onChange={e => setI1(e.target.value)} onKeyDown={e => e.key === "Enter" && i1.trim().toLowerCase() === "croissant" && setS1(true)} placeholder="What word?"
                style={{ flex: 1, background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none", textAlign: "center" }} />
              <button onClick={() => i1.trim().toLowerCase() === "croissant" && setS1(true)} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>SOLVE</button>
            </div>
          ) : <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, textAlign: "center", letterSpacing: 3 }}>{"\u2713"} CROISSANT</div>}
        </div>
      )}
      {hasPair2 && (
        <div style={{ background: "#111", border: s2 ? "1px solid #4ade80" : "1px solid #333", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, justifyContent: "center" }}>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>EYE</span>
            <span style={{ color: "#555", fontFamily: "monospace", fontSize: 16, alignSelf: "center" }}>+</span>
            <span style={{ background: "#1a1a1a", border: "1px solid #facc15", borderRadius: 6, padding: "6px 12px", color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>FELL</span>
          </div>
          {!s2 ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input value={i2} onChange={e => setI2(e.target.value)} onKeyDown={e => e.key === "Enter" && i2.trim().toLowerCase() === "eiffel" && setS2(true)} placeholder="What word?"
                style={{ flex: 1, background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none", textAlign: "center" }} />
              <button onClick={() => i2.trim().toLowerCase() === "eiffel" && setS2(true)} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>SOLVE</button>
            </div>
          ) : <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, textAlign: "center", letterSpacing: 3 }}>{"\u2713"} EIFFEL</div>}
        </div>
      )}
      {allDone && (
        <div style={{ marginTop: 16, textAlign: "center", animation: "fadeIn 1s ease" }}>
          <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 16, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>THOSE ARE FRENCH.</div>
          <div style={{ color: "#c8c8c8", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6 }}>He's not just leaving London. He must have worked outside of London too. He's going to...</div>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 36, fontWeight: 900, letterSpacing: 8, marginTop: 12, textShadow: "0 0 30px rgba(250,204,21,0.3)" }}>PARIS</div>
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

function ChatInterface({ codenames, visited, setVisited, wordClues, setWordClues, fragments, setFragments }) {
  const c0 = codenames[0], c1 = codenames[1], c2 = codenames[2];
  const [msgs, setMsgs] = useState([{
    role: "spy",
    text: `${c0}. ${c1}. ${c2}.\n\nYou're officially active.\n\nYour mom and dad will take you around London for a few days. Act like tourists \u2014 check out the sites, eat good food, have fun.\n\nBut when you find yourselves at landmarks \u2014 clocks, towers, churches, maybe other things \u2014 check in with me here.\n\nWhen you get somewhere, just tell me where you are.\n\n\u2014 Tru`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs, loading]);

  const detectAndTrack = (text) => {
    const l = text.toLowerCase();
    if (l.includes("fragment 1") || l.includes("fragment 1")) { setFragments(p => { const n = [...p]; n[0] = "7"; return n; }); }
    if (l.includes("fragment 2")) { setFragments(p => { const n = [...p]; n[1] = "3"; return n; }); }
    if (l.includes("fragment 3")) { setFragments(p => { const n = [...p]; n[2] = "1"; return n; }); }
    if (l.includes("fragment 4")) { setFragments(p => { const n = [...p]; n[3] = "9"; return n; }); }
    if (l.includes("fragment 5")) { setFragments(p => { const n = [...p]; n[4] = "4"; return n; }); }
    if (l.includes("word") && l.includes("cross")) { setWordClues(p => p.some(w => w.word === "CROSS") ? p : [...p, { word: "CROSS", from: "St. Paul's" }]); }
    if (l.includes("word") && l.includes("ant")) { setWordClues(p => p.some(w => w.word === "ANT") ? p : [...p, { word: "ANT", from: "Friend's dinner" }]); }
    if (l.includes("word") && l.includes("eye")) { setWordClues(p => p.some(w => w.word === "EYE") ? p : [...p, { word: "EYE", from: "London Eye" }]); }
    if (l.includes("word") && l.includes("fell")) { setWordClues(p => p.some(w => w.word === "FELL") ? p : [...p, { word: "FELL", from: "Tower of London" }]); }
  };

  const detectLocation = (text) => {
    const l = text.toLowerCase();
    if (l.includes("big ben") || l.includes("westminster")) { if (!visited.includes("bigben")) setVisited(p => [...p, "bigben"]); }
    if (l.includes("tower of london")) { if (!visited.includes("tower")) setVisited(p => [...p, "tower"]); }
    if (l.includes("st paul") || l.includes("saint paul")) { if (!visited.includes("stpauls")) setVisited(p => [...p, "stpauls"]); }
    if (l.includes("buckingham") || l.includes("palace")) { if (!visited.includes("buckingham")) setVisited(p => [...p, "buckingham"]); }
    if (l.includes("london eye")) { if (!visited.includes("eye")) setVisited(p => [...p, "eye"]); }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput("");
    const newMsgs = [...msgs, { role: "user", text: msg }];
    setMsgs(newMsgs); setLoading(true);
    detectLocation(msg);
    try {
      const apiMessages = newMsgs.map(m => ({ role: m.role === "spy" ? "assistant" : "user", content: m.text }));
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMessages }) });
      const data = await res.json();
      if (data.text) {
        detectAndTrack(data.text);
        setMsgs(prev => [...prev, { role: "spy", text: data.text }]);
      } else {
        setMsgs(prev => [...prev, { role: "spy", text: "Signal interference. Try again in a moment. \u2014 Tru" }]);
      }
    } catch (err) {
      setMsgs(prev => [...prev, { role: "spy", text: "Secure channel disrupted. Check connection and try again. \u2014 Tru" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0a0a0a" }}>
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

const BRIEFING = [
  { id: "mission", lines: [
    { text: "\u26a0 PRIORITY BRIEFING \u26a0", style: "warning" }, { text: "OPERATION CLOCKTOWER", style: "header" }, { text: "", style: "spacer" },
    { text: "Over 100 years ago, a brilliant clockmaker named \u00c9mile Bellecourt built secret mechanisms into the great landmarks of London.", style: "normal" }, { text: "", style: "spacer" },
    { text: "Hidden inside each is a fragment of a master code \u2014 a code that unlocks a vault containing his greatest invention.", style: "normal" }, { text: "", style: "spacer" },
    { text: "For a century, no one knew.", style: "normal" }, { text: "", style: "spacer" }, { text: "Now someone does.", style: "bold" },
  ]},
  { id: "collector", lines: [
    { text: "An operative known only as", style: "normal" }, { text: "THE COLLECTOR", style: "villain" }, { text: "is hunting for the fragments.", style: "normal" }, { text: "", style: "spacer" },
    { text: "We don't know who he is.", style: "normal" }, { text: "We don't know how close he is.", style: "normal" }, { text: "", style: "spacer" },
    { text: "But we know where he's heading.", style: "bold" },
  ]},
  { id: "team", lines: [
    { text: "YOUR TEAM", style: "header" }, { text: "", style: "spacer" },
    { text: "Your father \u2014 codename MOTHER \u2014 and your brother Callum are already en route to London.", style: "normal" }, { text: "", style: "spacer" },
    { text: "Your mom \u2014 codename MONTY \u2014 is with you now. She'll get you there.", style: "normal" }, { text: "", style: "spacer" },
    { text: "They don't watch for kids.", style: "bold" },
  ]},
  { id: "roles", lines: [
    { text: "YOUR ROLES", style: "header" }, { text: "", style: "spacer" },
    { text: "CADE \u2014 The Codebreaker", style: "role" }, { text: "The hardest clues are yours.", style: "roledesc" }, { text: "", style: "spacer" },
    { text: "MAGGIE \u2014 The Scout", style: "role" }, { text: "Notice what others miss.", style: "roledesc" }, { text: "", style: "spacer" },
    { text: "CALLUM \u2014 The Charm", style: "role" }, { text: "No one suspects him. That's his superpower.", style: "roledesc" }, { text: "", style: "spacer" },
    { text: "Mother and Monty are your handlers.", style: "dim" }, { text: "The missions are yours.", style: "bold" },
  ]},
  { id: "howto", lines: [
    { text: "HOW THIS WORKS", style: "header" }, { text: "", style: "spacer" },
    { text: "Act like tourists. Check out sites, eat good food, have fun.", style: "normal" }, { text: "", style: "spacer" },
    { text: "But at landmarks \u2014 clocks, towers, churches \u2014 check in with me to see if there's a clue to find.", style: "normal" }, { text: "", style: "spacer" },
    { text: "Not every place will have one. Blend in. The Collector is watching.", style: "normal" },
  ]},
  { id: "final", lines: [
    { text: "The Collector is already looking.", style: "normal" }, { text: "", style: "spacer" },
    { text: "You need to be faster.", style: "bold" }, { text: "", style: "spacer" }, { text: "", style: "spacer" },
    { text: "Good luck, agents.", style: "normal" }, { text: "", style: "spacer" },
    { text: "The clock is ticking.", style: "flash" }, { text: "", style: "spacer" },
    { text: "\u2014 Tru", style: "dim" },
  ]},
];

export default function Home() {
  const [phase, setPhase] = useState("passcode");
  const [briefIdx, setBriefIdx] = useState(0);
  const [verifyStep, setVerifyStep] = useState(0);
  const [verified, setVerified] = useState([false, false]);
  const [codenames, setCodenames] = useState(["JAGUAR", "OTTER", "STINGRAY"]);
  const [cnStep, setCnStep] = useState(0);
  const [cnConfirmed, setCnConfirmed] = useState([false, false, false]);
  const [visited, setVisited] = useState([]);
  const [wordClues, setWordClues] = useState([]);
  const [fragments, setFragments] = useState(["","","","",""]);
  const [parisUnlocked, setParisUnlocked] = useState(false);
  const [view, setView] = useState("chat");
  const [dossierTab, setDossierTab] = useState("london");

  const head = (
    <>
      <Head><title>Operation Clocktower</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></Head>
      <style jsx global>{`* { margin: 0; padding: 0; box-sizing: border-box; } html, body, #__next { height: 100%; background: #0a0a0a; } @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );

  const wrap = (c) => <>{head}<div style={{ height: "100vh", background: "#0a0a0a" }}>{c}</div></>;

  if (phase === "passcode") return wrap(
    <InputScreen title="OPERATION CLOCKTOWER" subtitle="SECURE CHANNEL" prompt="ENTER MISSION CODE" placeholder="Mission code..." buttonText="ACCESS" errMsg="Invalid mission code."
      onSubmit={v => { if (v.trim().toUpperCase() === MISSION_CODE) { setPhase("intro"); return true; } return false; }} />
  );

  if (phase === "intro") return wrap(
    <TypedScreen lines={[
      { text: "OPERATION CLOCKTOWER", style: "header" }, { text: "SECURE CHANNEL", style: "sub" }, { text: "", style: "spacer" },
      { text: "Incoming transmission...", style: "dim", delay: 800 }, { text: "", style: "spacer" },
      { text: "Hello, agents.", style: "normal", delay: 500 }, { text: "", style: "spacer" },
      { text: "My name is Tru.", style: "bold" }, { text: "", style: "spacer" },
      { text: "Some of you may know me from the City Spies.", style: "normal" }, { text: "", style: "spacer" },
      { text: "Now I need a new team.", style: "normal" }, { text: "", style: "spacer" },
      { text: "But first \u2014 I need to make sure you are who I think you are.", style: "bold" },
    ]} onDone={() => setPhase("verify")} />
  );

  if (phase === "verify") {
    const q = VERIFY_QS[verifyStep];
    return wrap(
      <InputScreen title="OPERATION CLOCKTOWER" subtitle="IDENTITY CHECK"
        prompt={`${q.name.toUpperCase()}, ANSWER THIS:\n${q.q}`}
        placeholder="Type your answer..." buttonText="VERIFY" errMsg="Verification failed. Try again."
        onSubmit={v => {
          if (fuzzyMatch(v, q.accept)) {
            const nv = [...verified]; nv[verifyStep] = true; setVerified(nv);
            if (verifyStep === 0) { setVerifyStep(1); return true; }
            else { setPhase("briefing"); return true; }
          } return false;
        }} />
    );
  }

  if (phase === "briefing") {
    if (briefIdx >= BRIEFING.length) { setPhase("arrived"); return null; }
    if (BRIEFING[briefIdx].id === "collector") {
      return wrap(<TypedScreen lines={BRIEFING[briefIdx].lines} onDone={() => setPhase("london_reveal")} />);
    }
    return wrap(<TypedScreen lines={BRIEFING[briefIdx].lines} onDone={() => setBriefIdx(i => i + 1)} />);
  }

  if (phase === "london_reveal") return wrap(
    <div onClick={() => { setPhase("briefing"); setBriefIdx(i => i + 1); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", userSelect: "none", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}><img src="/images/london.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, filter: "blur(2px)" }} /></div>
      <div style={{ position: "relative", zIndex: 1, color: "#fff", fontFamily: "'Courier New', monospace", fontSize: 48, fontWeight: 900, letterSpacing: 10, textShadow: "0 0 40px rgba(250,204,21,0.4)", animation: "fadeIn 1s ease" }}>LONDON</div>
      <div style={{ position: "relative", zIndex: 1, marginTop: 30 }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>
    </div>
  );

  if (phase === "arrived") return wrap(
    <InputScreen title="OPERATION CLOCKTOWER" subtitle="SECURE CHANNEL"
      prompt={'When your whole team is together in London, report in:\n"Tru, we have arrived."'}
      placeholder="Type your message..." buttonText="SEND" errMsg="Tru is waiting for your arrival report."
      onSubmit={v => { const l = v.toLowerCase(); if (l.includes("arrived") || l.includes("here") || l.includes("london") || l.includes("made it")) { setPhase("calverify"); return true; } return false; }} />
  );

  if (phase === "calverify") return wrap(
    <InputScreen title="AGENT VERIFICATION" subtitle="ONE MORE AGENT TO CONFIRM"
      prompt="CALLUM, ANSWER THIS:\nWho did you fly to London with?"
      placeholder="Type your answer..." buttonText="VERIFY" errMsg="That's not right. Try again, agent."
      onSubmit={v => { if (calMatch(v)) { setPhase("codenames"); return true; } return false; }} />
  );

  if (phase === "codenames") return wrap(
    <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 6 }}>CODENAME ASSIGNMENT</div>
      <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>Your codenames based on your skills:</div>
      {CODENAMES.map((a, i) => (
        <div key={i} style={{ marginBottom: 14, padding: 14, background: i <= cnStep ? "#111" : "#0a0a0a", border: cnConfirmed[i] ? "1px solid #4ade80" : i === cnStep ? "1px solid #facc15" : "1px solid #222", borderRadius: 10, opacity: i <= cnStep ? 1 : 0.3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700 }}>{a.name}</span>
            {cnConfirmed[i] && <span style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 11 }}>{"\u2713"}</span>}
          </div>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 17, fontWeight: 900, letterSpacing: 3, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            {i <= cnStep && <img src={a.img} alt="" style={{ width: 36, height: 36, borderRadius: 8 }} onError={e => { e.target.style.display = "none"; }} />}
            {i <= cnStep ? codenames[i] : "???"}
          </div>
          {i <= cnStep && !cnConfirmed[i] && <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, marginBottom: 8 }}>{a.desc}</div>}
          {i === cnStep && !cnConfirmed[i] && (
            <button onClick={() => {
              const nc = [...cnConfirmed]; nc[i] = true; setCnConfirmed(nc);
              if (i < 2) setTimeout(() => setCnStep(i + 1), 500);
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
    <ParisPuzzle wordClues={wordClues} onSolved={() => { setParisUnlocked(true); setPhase("active"); setView("dossier"); setDossierTab("paris"); }} />
  );

  if (phase === "active") return (
    <>{head}
      <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #222" }}>
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
          {view === "chat" && <ChatInterface codenames={codenames} visited={visited} setVisited={setVisited} wordClues={wordClues} setWordClues={setWordClues} fragments={fragments} setFragments={setFragments} />}
          {view === "dossier" && <Dossier visited={visited} wordClues={wordClues} parisUnlocked={parisUnlocked} fragments={fragments} tab={dossierTab} setTab={setDossierTab} />}
        </div>
      </div>
    </>
  );

  return null;
}
