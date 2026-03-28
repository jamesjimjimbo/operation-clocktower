import { useState, useEffect, useRef } from "react";
import Head from "next/head";

function fuzzyMatch(input, accepts) {
  const clean = input.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
  for (const a of accepts) {
    const ca = a.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
    if (clean === ca) return true;
    if (clean.includes(ca) || ca.includes(clean)) return true;
    if (ca.length > 4 && clean.length > 4) {
      let diff = 0;
      const shorter = clean.length < ca.length ? clean : ca;
      const longer = clean.length < ca.length ? ca : clean;
      if (Math.abs(clean.length - ca.length) <= 2) {
        for (let i = 0; i < shorter.length; i++) {
          if (shorter[i] !== longer[i]) diff++;
        }
        diff += longer.length - shorter.length;
        if (diff <= 2) return true;
      }
    }
  }
  return false;
}

const MISSION_CODE = "CLOCKTOWER";

const VERIFICATION_QUESTIONS = [
  {
    name: "Cade",
    question: "What is the animal mascot of your new school?",
    accept: ["griffin", "griffon", "gryphon", "griffins", "gryphons", "griffons", "a griffin", "the griffin", "the griffon", "the gryphon"],
  },
  {
    name: "Maggie",
    question: "What song are you learning to play in music class?",
    accept: ["seven nation army", "7 nation army", "seven nations army", "7 nations army", "seven nation army by the white stripes", "seven nation army white stripes"],
  },
];

const CAL_VERIFICATION = {
  name: "Callum",
  question: "Who did you come to London with?",
  accept: ["areeb", "areeb and dad", "dad and areeb", "areeb and daddy", "daddy and areeb", "with areeb"],
};

const CODENAMES = [
  { name: "Cade", codename: "JAGUAR", desc: "Silent. Sharp. The apex predator of codebreaking.", emoji: "\ud83d\udc06" },
  { name: "Maggie", codename: "OTTER", desc: "Quick, curious, and impossible to fool. Nothing escapes your notice.", emoji: "\ud83e\udda6" },
  { name: "Callum", codename: "STINGRAY", desc: "Glides under the radar. Strikes when no one expects it.", emoji: "\ud83e\udd88" },
];

const LOCATIONS = [
  { label: "The Elizabeth Tower (Big Ben)", icon: "\ud83d\udd70\ufe0f", color: "#3b82f6" },
  { label: "The Tower of London", icon: "\ud83c\udff0", color: "#ef4444" },
  { label: "St. Paul's Cathedral", icon: "\u26ea", color: "#a855f7" },
  { label: "Buckingham Palace", icon: "\ud83d\udc51", color: "#eab308" },
];

const SCREENS = [
  {
    id: "intro",
    lines: [
      { text: "OPERATION CLOCKTOWER", style: "header" },
      { text: "SECURE CHANNEL", style: "sub" },
      { text: "", style: "spacer" },
      { text: "Incoming transmission...", style: "dim", delay: 1000 },
      { text: "", style: "spacer" },
      { text: "Hello, agents.", style: "normal", delay: 600 },
      { text: "", style: "spacer" },
      { text: "My name is Tru.", style: "bold" },
      { text: "", style: "spacer" },
      { text: "Some of you may know me from the City Spies. I've worked with young agents before \u2014 some of the best I've ever trained, in fact.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Now I need a new team. And I think I've found one.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "But first \u2014 I need to make sure you are who I think you are.", style: "bold" },
    ],
  },
  {
    id: "mission",
    lines: [
      { text: "\u26a0 PRIORITY BRIEFING \u26a0", style: "warning" },
      { text: "OPERATION CLOCKTOWER", style: "header" },
      { text: "", style: "spacer" },
      { text: "Over 100 years ago, a brilliant clockmaker named \u00c9mile Bellecourt built secret mechanisms into the great landmarks of London \u2014 its clocks, towers, churches, and monuments.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Hidden inside each mechanism is a fragment of a master code \u2014 a code that unlocks a vault containing his greatest invention.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "For a century, no one knew.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Now someone does.", style: "bold" },
    ],
  },
  {
    id: "collector",
    lines: [
      { text: "An operative known only as", style: "normal" },
      { text: "THE COLLECTOR", style: "villain" },
      { text: "is hunting for the fragments.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "We don't know who he is.", style: "normal" },
      { text: "We don't know how close he is.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "But we know where he's heading.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "London.", style: "bold" },
    ],
  },
  {
    id: "team",
    lines: [
      { text: "YOUR TEAM", style: "header" },
      { text: "", style: "spacer" },
      { text: "Your father \u2014 codename MOTHER \u2014 and your brother Callum are already en route to London. They've been briefed.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Your mom \u2014 codename MONTY \u2014 is with you now. She'll get you there.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "The Collector uses adult operatives. They watch for spies in suits and sunglasses.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "They don't watch for kids.", style: "bold" },
    ],
  },
  {
    id: "roles",
    lines: [
      { text: "YOUR ROLES", style: "header" },
      { text: "", style: "spacer" },
      { text: "CADE \u2014 The Codebreaker", style: "role" },
      { text: "You decipher Bellecourt's journal entries and crack the puzzles he left behind. The hardest clues are yours.", style: "roledesc" },
      { text: "", style: "spacer" },
      { text: "MAGGIE \u2014 The Scout", style: "role" },
      { text: "You have the sharpest eyes and ears on the team. Your job is to notice what others miss \u2014 sounds, patterns, things that don't belong.", style: "roledesc" },
      { text: "", style: "spacer" },
      { text: "CALLUM \u2014 The Charm", style: "role" },
      { text: "He's five. No one suspects him of anything. That's his superpower.", style: "roledesc" },
      { text: "", style: "spacer" },
      { text: "Mother and Monty are your handlers. They get you where you need to go.", style: "dim" },
      { text: "The missions are yours.", style: "bold" },
    ],
  },
  {
    id: "howto",
    lines: [
      { text: "HOW THIS WORKS", style: "header" },
      { text: "", style: "spacer" },
      { text: "Your mom and dad will take you around London for a few days. You should act like tourists \u2014 check out the sites, eat good food, have fun.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "But when you find yourselves at landmarks \u2014 clocks, towers, churches, maybe other things \u2014 check in with me to see if there might be a clue to find.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Not every place will have one, and that's ok. The Collector is watching, so you need to blend in.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Here are some places I think you should check out:", style: "bold" },
    ],
  },
  {
    id: "locations",
    isLocationScreen: true,
    lines: [],
  },
  {
    id: "instructions",
    lines: [
      { text: "WHAT TO DO NOW", style: "header" },
      { text: "", style: "spacer" },
      { text: "1. Get to London.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "2. When your whole team is together, come back here and type:", style: "normal" },
      { text: "", style: "spacer" },
      { text: '"Tru, we have arrived."', style: "bold" },
      { text: "", style: "spacer" },
      { text: "3. I'll verify Callum, assign your codenames, and give you your first mission.", style: "normal" },
    ],
  },
  {
    id: "final",
    lines: [
      { text: "The Collector is already looking.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "You need to be faster.", style: "bold" },
      { text: "", style: "spacer" },
      { text: "", style: "spacer" },
      { text: "Good luck, agents.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "The clock is ticking.", style: "flash" },
      { text: "", style: "spacer" },
      { text: "\u2014 Tru", style: "dim" },
      { text: "   Operation Clocktower", style: "dim" },
    ],
  },
];

function TypedLine({ text, style, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    if (style === "spacer" || !text) { onDone?.(); return; }
    idx.current = 0;
    setDisplayed("");
    const speed = style === "dim" || style === "roledesc" ? 16 : style === "normal" ? 20 : 30;
    const iv = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) { clearInterval(iv); onDone?.(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  if (style === "spacer") return <div style={{ height: 16 }} />;
  const styles = {
    header: { color: "#e0e0e0", fontSize: 20, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" },
    sub: { color: "#888", fontSize: 13, letterSpacing: 4, textTransform: "uppercase" },
    normal: { color: "#c8c8c8", fontSize: 15, lineHeight: 1.6 },
    bold: { color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.6 },
    dim: { color: "#777", fontSize: 14, lineHeight: 1.6, fontStyle: "italic" },
    flash: { color: "#facc15", fontSize: 17, fontWeight: 700, letterSpacing: 2 },
    warning: { color: "#f97316", fontSize: 14, letterSpacing: 3, fontWeight: 700 },
    villain: { color: "#ef4444", fontSize: 22, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", padding: "8px 0" },
    role: { color: "#facc15", fontSize: 16, fontWeight: 700, letterSpacing: 1 },
    roledesc: { color: "#aaa", fontSize: 14, lineHeight: 1.6, paddingLeft: 12 },
  };
  return (
    <div style={{ ...styles[style], fontFamily: "'Courier New', monospace" }}>
      {displayed}
      <span style={{ opacity: displayed.length < text.length ? 1 : 0, color: "#facc15" }}>{"\u2588"}</span>
    </div>
  );
}

function PasscodeScreen({ onPass }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const check = () => {
    if (code.trim().toUpperCase() === MISSION_CODE) {
      onPass();
    } else {
      setError(true);
    }
  };
  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3, marginBottom: 4, textAlign: "center" }}>
        OPERATION CLOCKTOWER
      </div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, letterSpacing: 4, marginBottom: 40, textAlign: "center" }}>
        SECURE CHANNEL
      </div>
      <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
        ENTER MISSION CODE
      </div>
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 320 }}>
        <input
          value={code}
          onChange={e => { setCode(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="Mission code..."
          autoFocus
          style={{
            flex: 1, background: "#111", border: error ? "1px solid #ef4444" : "1px solid #333",
            borderRadius: 8, padding: "12px 14px", color: "#e0e0e0", fontFamily: "monospace",
            fontSize: 16, outline: "none", textAlign: "center", letterSpacing: 3, textTransform: "uppercase",
          }}
        />
      </div>
      <button onClick={check} style={{
        marginTop: 12, background: "#facc15", color: "#000", border: "none", borderRadius: 8,
        padding: "10px 32px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, cursor: "pointer",
      }}>
        ACCESS
      </button>
      {error && (
        <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 12, marginTop: 12 }}>
          {"\u2717"} Invalid mission code.
        </div>
      )}
    </div>
  );
}

function VerificationScreen({ onVerified }) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState([false, false]);
  const [showSuccess, setShowSuccess] = useState(false);
  const q = VERIFICATION_QUESTIONS[step];
  const check = () => {
    if (!q) return;
    if (fuzzyMatch(input, q.accept)) {
      setError(false); setInput("");
      const nv = [...verified]; nv[step] = true; setVerified(nv);
      if (step === 0) setStep(1);
      else { setShowSuccess(true); setTimeout(() => onVerified(), 2000); }
    } else setError(true);
  };
  if (showSuccess) {
    return (
      <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, textAlign: "center" }}>{"\u2713"} IDENTITY CONFIRMED</div>
        <div style={{ color: "#777", fontFamily: "monospace", fontSize: 13, marginTop: 12, letterSpacing: 2 }}>Welcome, Cade and Maggie.</div>
        <div style={{ color: "#333", fontFamily: "monospace", fontSize: 12, marginTop: 24, letterSpacing: 2 }}>DECRYPTING BRIEFING...</div>
      </div>
    );
  }
  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", padding: 24, overflowY: "auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>OPERATION CLOCKTOWER</div>
        <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, letterSpacing: 4, marginTop: 4 }}>SECURE CHANNEL</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>{"\u26a0"} IDENTITY VERIFICATION REQUIRED</div>
        <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          We need to confirm that you {"\u2014"} and not rival spies {"\u2014"} are reading this. Each agent must answer a question that only they would know.
        </div>
      </div>
      {verified[0] && <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 15, marginBottom: 16 }}>Cade McKenna {"\u2014"} {"\u2713"} VERIFIED</div>}
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, marginBottom: 8 }}>{q.name.toUpperCase()}, ANSWER THIS:</div>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{q.question}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => { setInput(e.target.value); setError(false); }} onKeyDown={e => e.key === "Enter" && check()}
            placeholder="Type your answer..." autoFocus
            style={{ flex: 1, background: "#111", border: error ? "1px solid #ef4444" : "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none" }} />
          <button onClick={check} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>VERIFY</button>
        </div>
        {error && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 12, marginTop: 8 }}>{"\u2717"} Verification failed. Try again, agent.</div>}
      </div>
      <div style={{ color: "#333", fontFamily: "monospace", fontSize: 11, letterSpacing: 1 }}>{verified[0] ? "1 of 2" : "0 of 2"} agents verified</div>
    </div>
  );
}

function CalVerificationScreen({ onVerified }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const check = () => {
    if (fuzzyMatch(input, CAL_VERIFICATION.accept)) { setError(false); setSuccess(true); setTimeout(() => onVerified(), 2000); }
    else setError(true);
  };
  if (success) {
    return (
      <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, textAlign: "center" }}>{"\u2713"} ALL AGENTS VERIFIED</div>
        <div style={{ color: "#777", fontFamily: "monospace", fontSize: 13, marginTop: 12, letterSpacing: 2, textAlign: "center" }}>The team is complete.</div>
      </div>
    );
  }
  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>AGENT VERIFICATION</div>
        <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, letterSpacing: 4, marginTop: 4 }}>ONE MORE AGENT TO CONFIRM</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 15, marginBottom: 4 }}>Cade McKenna {"\u2014"} {"\u2713"} VERIFIED</div>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 15, marginBottom: 4 }}>Maggie McKenna {"\u2014"} {"\u2713"} VERIFIED</div>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 15, marginBottom: 16 }}>Callum McKenna {"\u2014"} AWAITING VERIFICATION</div>
      </div>
      <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        We've confirmed Cade and Maggie. Now we need to verify Callum. Only the real Callum would know the answer to this.
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, marginBottom: 8 }}>CALLUM, ANSWER THIS:</div>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{CAL_VERIFICATION.question}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => { setInput(e.target.value); setError(false); }} onKeyDown={e => e.key === "Enter" && check()}
            placeholder="Type your answer..." autoFocus
            style={{ flex: 1, background: "#111", border: error ? "1px solid #ef4444" : "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none" }} />
          <button onClick={check} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>VERIFY</button>
        </div>
        {error && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 12, marginTop: 8 }}>{"\u2717"} That's not right. Try again, agent.</div>}
      </div>
    </div>
  );
}

function CodenameScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState([false, false, false]);
  const [editing, setEditing] = useState(-1);
  const [customName, setCustomName] = useState("");
  const [names, setNames] = useState(CODENAMES.map(c => c.codename));

  const confirm = (i) => {
    const nc = [...confirmed]; nc[i] = true; setConfirmed(nc);
    if (i < 2) setTimeout(() => setStep(i + 1), 600);
    else setTimeout(() => onComplete(names), 1500);
  };

  const startEdit = (i) => { setEditing(i); setCustomName(""); };
  const saveEdit = (i) => {
    if (customName.trim()) {
      const nn = [...names]; nn[i] = customName.trim().toUpperCase(); setNames(nn);
    }
    setEditing(-1);
  };

  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", padding: 24, overflowY: "auto" }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>CODENAME ASSIGNMENT</div>
      <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        I've selected codenames for each of you based on your skills. If a name doesn't feel right, you can change it.
      </div>
      {CODENAMES.map((a, i) => (
        <div key={a.name} style={{
          marginBottom: 16, padding: 16, background: i <= step ? "#111" : "#0a0a0a",
          border: confirmed[i] ? "1px solid #4ade80" : i === step ? "1px solid #facc15" : "1px solid #222",
          borderRadius: 10, opacity: i <= step ? 1 : 0.3, transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>{a.emoji} {a.name}</span>
            {confirmed[i] && <span style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 12 }}>{"\u2713"} CONFIRMED</span>}
          </div>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 18, fontWeight: 900, letterSpacing: 3, marginBottom: 6 }}>
            {i <= step ? names[i] : "???"}
          </div>
          {i <= step && !confirmed[i] && editing !== i && (
            <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{a.desc}</div>
          )}
          {editing === i && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10, marginTop: 8 }}>
              <input value={customName} onChange={e => setCustomName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit(i)}
                placeholder="New codename..." autoFocus
                style={{ flex: 1, background: "#0a0a0a", border: "1px solid #facc15", borderRadius: 8, padding: "8px 12px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none", textTransform: "uppercase", letterSpacing: 2 }} />
              <button onClick={() => saveEdit(i)} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "8px 14px", fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>SET</button>
            </div>
          )}
          {i === step && !confirmed[i] && editing !== i && (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => confirm(i)} style={{
                background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "8px 20px",
                fontFamily: "monospace", fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}>
                {a.name === "Callum" ? "CONFIRM (Cal, tap here!)" : "ACCEPT CODENAME"}
              </button>
              <button onClick={() => startEdit(i)} style={{
                background: "transparent", color: "#888", border: "1px solid #444", borderRadius: 8, padding: "8px 14px",
                fontFamily: "monospace", fontSize: 12, cursor: "pointer",
              }}>
                CHANGE
              </button>
            </div>
          )}
        </div>
      ))}
      {confirmed[2] && (
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 15, fontWeight: 700, textAlign: "center", marginTop: 16, letterSpacing: 2, animation: "pulse 2s infinite" }}>
          ALL AGENTS CONFIRMED. STANDBY...
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}

function LocationScreen({ onComplete }) {
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setRevealed(p => { if (p >= LOCATIONS.length) { clearInterval(t); return p; } return p + 1; });
    }, 500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (revealed >= LOCATIONS.length) setTimeout(() => onComplete?.(), 800); }, [revealed]);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {LOCATIONS.slice(0, revealed).map((loc) => (
          <div key={loc.label} style={{
            background: "#111", border: "1px solid #333", borderRadius: 12, padding: 16,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            aspectRatio: "1", animation: "fadeIn 0.4s ease", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{loc.icon}</div>
            <div style={{ color: loc.color, fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, letterSpacing: 1, lineHeight: 1.4 }}>
              {loc.label}
            </div>
          </div>
        ))}
      </div>
      {revealed >= LOCATIONS.length && (
        <div style={{ color: "#c8c8c8", fontFamily: "'Courier New', monospace", fontSize: 14, lineHeight: 1.6, marginTop: 20, textAlign: "center" }}>
          Check in with me when you visit any of these. I'll tell you what to look for.
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}

function Screen({ screen, onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef(null);
  useEffect(() => { setVisibleLines(0); setTimeout(() => setVisibleLines(1), 200); }, [screen.id]);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [visibleLines]);
  const handleDone = (i) => {
    const d = screen.lines[i].delay || (screen.lines[i].style === "spacer" ? 0 : 150);
    if (i + 1 < screen.lines.length) setTimeout(() => setVisibleLines(i + 2), d);
    else setTimeout(() => onComplete?.(), 600);
  };
  return (
    <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
      {screen.lines.slice(0, visibleLines).map((l, i) => (
        <TypedLine key={`${screen.id}-${i}`} text={l.text} style={l.style} onDone={() => handleDone(i)} />
      ))}
    </div>
  );
}

function ChatInterface({ codenames }) {
  const cadeCode = codenames?.[0] || "JAGUAR";
  const maggieCode = codenames?.[1] || "OTTER";
  const calCode = codenames?.[2] || "STINGRAY";

  const [msgs, setMsgs] = useState([{
    role: "spy",
    text: `${cadeCode}. ${maggieCode}. ${calCode}.\n\nYou're officially active.\n\nYour mom and dad will take you around London for a few days. Act like tourists \u2014 check out the sites, eat good food, have fun.\n\nBut when you find yourselves at landmarks \u2014 clocks, towers, churches, maybe other things \u2014 check in with me here. I'll let you know if there are any clues to find.\n\nNot every place will have something, and that's ok. You need to blend in. The Collector is watching.\n\nWhen you get somewhere interesting, just tell me where you are.\n\n\u2014 Tru`
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs, loading]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput(""); setMsgs(p => [...p, { role: "user", text: userMsg }]); setLoading(true);
    setTimeout(() => {
      let r;
      const l = userMsg.toLowerCase();
      if (l.includes("tower of london") || l.includes("tower of")) {
        r = `The Tower of London. Excellent.\n\nBellecourt visited this fortress in 1891. He was obsessed with its clocks.\n\nHere's your mission:\n\n\ud83d\udd0d ${maggieCode}: Find the oldest inscription you can see on any wall near you. What year is carved into it?\n\n\ud83e\udde9 ${cadeCode}: Somewhere nearby is a plaque that mentions a famous prisoner. Find their name \u2014 the first letter is part of our code.\n\n\ud83c\udfad ${calCode}: The Collector's cameras are everywhere. To scramble them, I need ${calCode} to stand like a palace guard for 10 seconds without smiling. Can he do it?\n\nReport back when you've completed all three.\n\n\u2014 Tru`;
      } else if (l.includes("big ben") || l.includes("westminster") || l.includes("parliament")) {
        r = `You're standing in front of Bellecourt's masterwork.\n\nThe Elizabeth Tower \u2014 most people call it Big Ben, but Big Ben is actually just the bell inside. Bellecourt knew that.\n\n\ud83d\udcf8 PHOTO CHALLENGE: All three agents pose in front of Big Ben. Each holds up fingers showing a different number:\n- The current hour in London\n- The current hour in San Francisco\n- The difference between them\n\nGet it right and you've unlocked Fragment 1.\n\n\ud83d\udd0d ${maggieCode}: Can you hear any street performers nearby? The Collector sometimes hides messages in music. Report what you hear.\n\nGo.\n\n\u2014 Tru`;
      } else if (l.includes("st pancras") || l.includes("king's cross") || l.includes("train station")) {
        r = `Good, you're here.\n\nLook up. See the great clock hanging at the top of the glass ceiling? That was made by Dent of London \u2014 the same company that built the clock inside Big Ben. Bellecourt knew the Dent clockmakers personally.\n\nTell me: what time does the clock show right now?`;
      } else {
        r = `Copy that, agents. Stay alert and keep your eyes open.\n\nTell me where you are or what you see. I'll let you know if there's anything worth investigating.\n\nRemember \u2014 blend in. The Collector could be anywhere.\n\n\u2014 Tru`;
      }
      setMsgs(p => [...p, { role: "spy", text: r }]); setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0a0a0a" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
        <span style={{ color: "#888", fontFamily: "monospace", fontSize: 13, letterSpacing: 2 }}>TRU {"\u2014"} SECURE CHANNEL</span>
      </div>
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div style={{
              background: m.role === "user" ? "#1e3a5f" : "#1a1a1a",
              border: m.role === "user" ? "1px solid #2563eb" : "1px solid #333",
              borderRadius: 12, padding: "10px 14px",
              color: m.role === "user" ? "#93c5fd" : "#c8c8c8",
              fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap",
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start" }}>
            <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, padding: "10px 14px" }}>
              <span style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14 }}>{"\u25cf"} {"\u25cf"} {"\u25cf"}</span>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #222", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Report to Tru..."
          style={{ flex: 1, background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#e0e0e0", fontFamily: "monospace", fontSize: 14, outline: "none" }} />
        <button onClick={send} style={{ background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>SEND</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState("passcode");
  const [screenIdx, setScreenIdx] = useState(0);
  const [screenDone, setScreenDone] = useState(false);
  const [codenames, setCodenames] = useState(null);
  const cur = SCREENS[screenIdx];

  const advance = () => {
    if (!screenDone) return;
    if (screenIdx + 1 < SCREENS.length) { setScreenIdx(s => s + 1); setScreenDone(false); }
    else setPhase("calverify");
  };

  const head = (t) => (
    <>
      <Head><title>{t}</title><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /></Head>
      <style jsx global>{`* { margin: 0; padding: 0; box-sizing: border-box; } html, body, #__next { height: 100%; background: #0a0a0a; }`}</style>
    </>
  );

  if (phase === "passcode") return <>{head("Operation Clocktower")}<PasscodeScreen onPass={() => setPhase("verify")} /></>;
  if (phase === "verify") return <>{head("Operation Clocktower")}<VerificationScreen onVerified={() => setPhase("briefing")} /></>;
  if (phase === "calverify") return <>{head("Agent Verification")}<CalVerificationScreen onVerified={() => setPhase("codenames")} /></>;
  if (phase === "codenames") return <>{head("Codename Assignment")}<CodenameScreen onComplete={(n) => { setCodenames(n); setPhase("chat"); }} /></>;
  if (phase === "chat") return <>{head("Tru \u2014 Secure Channel")}<div style={{ height: "100vh", background: "#0a0a0a" }}><ChatInterface codenames={codenames} /></div></>;

  // briefing
  if (cur.isLocationScreen) {
    return (
      <>{head("Operation Clocktower")}
        <div onClick={() => screenDone && advance()} style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", cursor: screenDone ? "pointer" : "default", userSelect: "none", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#222" }}>
            <div style={{ height: "100%", background: "#facc15", width: `${((screenIdx + 1) / SCREENS.length) * 100}%`, transition: "width 0.5s ease" }} />
          </div>
          <LocationScreen onComplete={() => setScreenDone(true)} />
          {screenDone && <div style={{ padding: "16px 20px 24px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 12, letterSpacing: 2, animation: "pulse 2s infinite" }}>TAP TO CONTINUE {"\u25b8"}</span></div>}
          <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>{head("Operation Clocktower")}
      <div onClick={advance} style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", cursor: screenDone ? "pointer" : "default", userSelect: "none", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#222" }}>
          <div style={{ height: "100%", background: "#facc15", width: `${((screenIdx + 1) / SCREENS.length) * 100}%`, transition: "width 0.5s ease" }} />
        </div>
        <Screen key={screenIdx} screen={cur} onComplete={() => setScreenDone(true)} />
        {screenDone && <div style={{ padding: "16px 20px 24px", textAlign: "center" }}><span style={{ color: "#555", fontFamily: "monospace", fontSize: 12, letterSpacing: 2, animation: "pulse 2s infinite" }}>{screenIdx + 1 < SCREENS.length ? "TAP TO CONTINUE \u25b8" : "TAP TO BEGIN MISSION \u25b8"}</span></div>}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      </div>
    </>
  );
}
