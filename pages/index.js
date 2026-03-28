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

const LOCATION_DATA = [
  {
    key: "bigben",
    label: "The Elizabeth Tower (Big Ben)",
    img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&h=300&fit=crop",
  },
  {
    key: "tower",
    label: "The Tower of London",
    img: "https://images.unsplash.com/photo-1574002280743-6b7f67ef1744?w=600&h=300&fit=crop",
  },
  {
    key: "stpauls",
    label: "St. Paul's Cathedral",
    img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=300&fit=crop",
  },
  {
    key: "buckingham",
    label: "Buckingham Palace",
    img: "https://images.unsplash.com/photo-1596386461350-326ccb383831?w=600&h=300&fit=crop",
  },
];

const SCREENS = [
  {
    id: "intro",
    lines: [
      { text: "CLOCKTOWER OPERATIONS", style: "header" },
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
      { text: "Over 100 years ago, a brilliant clockmaker named \u00c9mile Bellecourt built secret mechanisms into the great clocks and towers of London.", style: "normal" },
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
      { text: "Your mom and dad will take you around London. As you go to different places, check back in here with me to see if there might be clues to find.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Not every area will have a clue \u2014 that's ok. You need to act like tourists to blend in. The Collector is watching.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Check with me as you go around the city and I'll point out if there are any clues you might want to look out for.", style: "normal" },
      { text: "", style: "spacer" },
      { text: "Here are some places I think you should check out:", style: "bold" },
    ],
  },
  {
    id: "clocks",
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
      { text: "   Clocktower Operations", style: "dim" },
    ],
  },
];

function TypedLine({ text, style, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (style === "spacer") { onDone?.(); return; }
    if (!text) { onDone?.(); return; }
    idx.current = 0;
    setDisplayed("");
    const speed = style === "dim" || style === "roledesc" ? 16 : style === "normal" ? 20 : style === "clue" ? 25 : 30;
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
    green: { color: "#4ade80", fontSize: 15, fontFamily: "monospace" },
    flash: { color: "#facc15", fontSize: 17, fontWeight: 700, letterSpacing: 2 },
    warning: { color: "#f97316", fontSize: 14, letterSpacing: 3, fontWeight: 700 },
    villain: { color: "#ef4444", fontSize: 22, fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", padding: "8px 0" },
    role: { color: "#facc15", fontSize: 16, fontWeight: 700, letterSpacing: 1 },
    roledesc: { color: "#aaa", fontSize: 14, lineHeight: 1.6, paddingLeft: 12 },
    clue: { color: "#93c5fd", fontSize: 15, lineHeight: 1.8, paddingLeft: 8 },
  };

  return (
    <div style={{ ...styles[style], fontFamily: "'Courier New', monospace" }}>
      {displayed}
      <span style={{ opacity: displayed.length < text.length ? 1 : 0, color: "#facc15" }}>{"\u2588"}</span>
    </div>
  );
}

function LocationScreen({ onComplete }) {
  const [loaded, setLoaded] = useState({});
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setRevealed(p => {
        if (p >= LOCATION_DATA.length) { clearInterval(t); return p; }
        return p + 1;
      });
    }, 600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (revealed >= LOCATION_DATA.length) {
      setTimeout(() => onComplete?.(), 800);
    }
  }, [revealed]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {LOCATION_DATA.slice(0, revealed).map((loc) => (
          <div key={loc.key} style={{
            background: "#111",
            border: "1px solid #333",
            borderRadius: 10,
            overflow: "hidden",
            animation: "fadeIn 0.5s ease",
          }}>
            <div style={{ width: "100%", height: 140, overflow: "hidden", position: "relative", background: "#0a0a0a" }}>
              <img
                src={loc.img}
                alt={loc.label}
                onLoad={() => setLoaded(p => ({ ...p, [loc.key]: true }))}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: loaded[loc.key] ? 1 : 0,
                  transition: "opacity 0.4s",
                }}
              />
              {!loaded[loc.key] && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#333", fontFamily: "monospace", fontSize: 12 }}>Loading intel...</span>
                </div>
              )}
            </div>
            <div style={{ padding: "10px 14px" }}>
              <span style={{ color: "#93c5fd", fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 600 }}>
                {"\ud83d\udd50"} {loc.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Screen({ screen, onComplete }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    setVisibleLines(0);
    const t = setTimeout(() => setVisibleLines(1), 200);
    return () => clearTimeout(t);
  }, [screen.id]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [visibleLines]);

  const handleLineDone = (i) => {
    const line = screen.lines[i];
    const delay = line.delay || (line.style === "spacer" ? 0 : 150);
    if (i + 1 < screen.lines.length) {
      setTimeout(() => setVisibleLines(i + 2), delay);
    } else {
      setTimeout(() => onComplete?.(), 600);
    }
  };

  return (
    <div ref={containerRef} style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
      {screen.lines.slice(0, visibleLines).map((line, i) => (
        <TypedLine key={`${screen.id}-${i}`} text={line.text} style={line.style} onDone={() => handleLineDone(i)} />
      ))}
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
      setError(false);
      setInput("");
      const nv = [...verified];
      nv[step] = true;
      setVerified(nv);
      if (step === 0) {
        setStep(1);
      } else {
        setShowSuccess(true);
        setTimeout(() => onVerified(), 2000);
      }
    } else {
      setError(true);
    }
  };

  if (showSuccess) {
    return (
      <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, textAlign: "center" }}>
          {"\u2713"} IDENTITY CONFIRMED
        </div>
        <div style={{ color: "#777", fontFamily: "monospace", fontSize: 13, marginTop: 12, letterSpacing: 2, textAlign: "center" }}>
          Welcome, Cade and Maggie.
        </div>
        <div style={{ color: "#333", fontFamily: "monospace", fontSize: 12, marginTop: 24, letterSpacing: 2 }}>
          DECRYPTING BRIEFING...
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", padding: 24, overflowY: "auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>
          CLOCKTOWER OPERATIONS
        </div>
        <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, letterSpacing: 4, marginTop: 4 }}>
          SECURE CHANNEL
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
          {"\u26a0"} IDENTITY VERIFICATION REQUIRED
        </div>
        <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          We need to confirm that you {"\u2014"} and not rival spies {"\u2014"} are reading this. Each agent must answer a question that only they would know.
        </div>
      </div>

      {verified[0] && (
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 15, marginBottom: 16 }}>
          Cade McKenna {"\u2014"} {"\u2713"} VERIFIED
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, marginBottom: 8 }}>
          {q.name.toUpperCase()}, ANSWER THIS:
        </div>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
          {q.question}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="Type your answer..."
            autoFocus
            style={{
              flex: 1,
              background: "#111",
              border: error ? "1px solid #ef4444" : "1px solid #333",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#e0e0e0",
              fontFamily: "monospace",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={check}
            style={{
              background: "#facc15",
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            VERIFY
          </button>
        </div>
        {error && (
          <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 12, marginTop: 8 }}>
            {"\u2717"} Verification failed. Try again, agent.
          </div>
        )}
      </div>

      <div style={{ color: "#333", fontFamily: "monospace", fontSize: 11, letterSpacing: 1 }}>
        {verified[0] ? "1 of 2" : "0 of 2"} agents verified
      </div>
    </div>
  );
}

function CalVerificationScreen({ onVerified }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const check = () => {
    if (fuzzyMatch(input, CAL_VERIFICATION.accept)) {
      setError(false);
      setSuccess(true);
      setTimeout(() => onVerified(), 2000);
    } else {
      setError(true);
    }
  };

  if (success) {
    return (
      <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: 3, textAlign: "center" }}>
          {"\u2713"} ALL AGENTS VERIFIED
        </div>
        <div style={{ color: "#777", fontFamily: "monospace", fontSize: 13, marginTop: 12, letterSpacing: 2, textAlign: "center" }}>
          The team is complete.
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>
          AGENT VERIFICATION
        </div>
        <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, letterSpacing: 4, marginTop: 4 }}>
          ONE MORE AGENT TO CONFIRM
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 15, marginBottom: 4 }}>
          Cade McKenna {"\u2014"} {"\u2713"} VERIFIED
        </div>
        <div style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 15, marginBottom: 4 }}>
          Maggie McKenna {"\u2014"} {"\u2713"} VERIFIED
        </div>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 15, marginBottom: 16 }}>
          Callum McKenna {"\u2014"} AWAITING VERIFICATION
        </div>
      </div>

      <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        We've confirmed Cade and Maggie. Now we need to verify Callum. Only the real Callum would know the answer to this.
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ color: "#facc15", fontFamily: "monospace", fontSize: 14, marginBottom: 8 }}>
          CALLUM, ANSWER THIS:
        </div>
        <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
          {CAL_VERIFICATION.question}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="Type your answer..."
            autoFocus
            style={{
              flex: 1,
              background: "#111",
              border: error ? "1px solid #ef4444" : "1px solid #333",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#e0e0e0",
              fontFamily: "monospace",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            onClick={check}
            style={{
              background: "#facc15",
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            VERIFY
          </button>
        </div>
        {error && (
          <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: 12, marginTop: 8 }}>
            {"\u2717"} That's not right. Try again, agent.
          </div>
        )}
      </div>
    </div>
  );
}

function CodenameScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState([false, false, false]);
  const agents = [
    { name: "Cade", codename: "JAGUAR", desc: "Silent. Sharp. The apex predator of codebreaking." },
    { name: "Maggie", codename: "OTTER", desc: "Quick, curious, and impossible to fool. Nothing escapes your notice." },
    { name: "Callum", codename: "STINGRAY", desc: "Glides under the radar. Strikes when no one expects it." },
  ];

  const confirm = () => {
    const nc = [...confirmed];
    nc[step] = true;
    setConfirmed(nc);
    if (step < 2) {
      setTimeout(() => setStep(step + 1), 600);
    } else {
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <div style={{ height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", padding: 24, overflowY: "auto" }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>
        CODENAME ASSIGNMENT
      </div>
      <div style={{ color: "#aaa", fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
        I've selected codenames for each of you based on your skills. From this point forward, these are your identities.
      </div>

      {agents.map((a, i) => (
        <div key={a.name} style={{
          marginBottom: 16,
          padding: 16,
          background: i <= step ? "#111" : "#0a0a0a",
          border: confirmed[i] ? "1px solid #4ade80" : i === step ? "1px solid #facc15" : "1px solid #222",
          borderRadius: 10,
          opacity: i <= step ? 1 : 0.3,
          transition: "all 0.4s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: "#facc15", fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>
              {a.name}
            </span>
            {confirmed[i] && (
              <span style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 12 }}>{"\u2713"} CONFIRMED</span>
            )}
          </div>
          <div style={{ color: "#fff", fontFamily: "monospace", fontSize: 18, fontWeight: 900, letterSpacing: 3, marginBottom: 6 }}>
            {i <= step ? a.codename : "???"}
          </div>
          {i <= step && (
            <div style={{ color: "#888", fontFamily: "monospace", fontSize: 13, lineHeight: 1.5 }}>
              {a.desc}
            </div>
          )}
          {i === step && !confirmed[i] && (
            <button
              onClick={confirm}
              style={{
                marginTop: 12,
                background: "#facc15",
                color: "#000",
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {a.name === "Callum" ? "CONFIRM (Cal, tap here!)" : `CONFIRM \u2014 ${a.name}, accept your codename`}
            </button>
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

function ChatInterface() {
  const [msgs, setMsgs] = useState([{
    role: "spy",
    text: "Jaguar. Otter. Stingray.\n\nYou're officially active.\n\nYour mom and dad will take you around London today. As you visit different places, check in with me here. I'll let you know if there are any clues worth looking for.\n\nNot every location will have something \u2014 that's ok. You need to act like tourists to blend in. The Collector is watching, and he can't know we're onto him.\n\nWhen you get somewhere, just tell me where you are. I'll take it from there.\n\nStay sharp, agents.\n\n\u2014 Tru"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, loading]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(p => [...p, { role: "user", text: userMsg }]);
    setLoading(true);

    setTimeout(() => {
      let response;
      const lower = userMsg.toLowerCase();
      if (lower.includes("tower of london") || lower.includes("tower of")) {
        response = "The Tower of London. Excellent.\n\nBellecourt visited this fortress in 1891. He was obsessed with its clocks \u2014 particularly the mechanism in the Waterloo Block.\n\nHere's your mission:\n\n\ud83d\udd0d OTTER: Find the oldest inscription you can see on any wall near you. What year is carved into it?\n\n\ud83e\udde9 JAGUAR: Somewhere nearby is a plaque that mentions a famous prisoner. Find their name \u2014 the first letter is part of our code.\n\n\ud83c\udfad STINGRAY: The Collector's surveillance cameras are everywhere. To scramble them, I need Stingray to stand like a palace guard for 10 seconds without smiling. Can he do it?\n\nReport back when you've completed all three tasks.\n\n\u2014 Tru";
      } else if (lower.includes("big ben") || lower.includes("westminster") || lower.includes("parliament")) {
        response = "You're standing in front of Bellecourt's masterwork.\n\nThe Elizabeth Tower \u2014 most people call it Big Ben, but Big Ben is actually just the bell inside. Bellecourt knew that. He hid his first fragment in the clock's design itself.\n\nHere's your mission:\n\n\ud83d\udcf8 PHOTO CHALLENGE: All three agents must pose in front of Big Ben. Each agent holds up fingers showing a different number:\n- The current hour in London\n- The current hour in San Francisco\n- The difference between them\n\nGet it right, and you've unlocked Fragment 1.\n\n\ud83d\udd0d OTTER: While you're here \u2014 can you hear any street performers nearby? The Collector sometimes hides messages in music. Report what you hear.\n\nGo.\n\n\u2014 Tru";
      } else if (lower.includes("st pancras") || lower.includes("king's cross") || lower.includes("train station")) {
        response = "Agents \u2014 stop.\n\nI've just intercepted a transmission from The Collector. He's not in London anymore.\n\nHe left this morning. By train.\n\nI'm tracing the signal now... it's pointing south. Across the Channel.\n\nAgents, look at the departure boards. Do you see any trains heading to Paris?\n\nBellecourt didn't just work in London. He spent the last years of his life in Paris. That's where the final fragments must be.\n\nGrab your bags. We need to follow The Collector. Now.\n\n\u2014 Tru";
      } else {
        response = "Copy that, agents. Stay alert and keep your eyes open.\n\nTell me where you are, what you see, or ask me anything about the mission. I'm monitoring your position.\n\nRemember \u2014 The Collector could be anywhere.\n\n\u2014 Tru";
      }
      setMsgs(p => [...p, { role: "spy", text: response }]);
      setLoading(false);
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
              borderRadius: 12,
              padding: "10px 14px",
              color: m.role === "user" ? "#93c5fd" : "#c8c8c8",
              fontFamily: "monospace",
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}>
              {m.text}
            </div>
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
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Report to Tru..."
          style={{
            flex: 1,
            background: "#111",
            border: "1px solid #333",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#e0e0e0",
            fontFamily: "monospace",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            background: "#facc15",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  // phases: verify -> briefing -> calverify -> codenames -> chat
  const [phase, setPhase] = useState("verify");
  const [screenIdx, setScreenIdx] = useState(0);
  const [screenDone, setScreenDone] = useState(false);

  const currentScreen = SCREENS[screenIdx];

  const advance = () => {
    if (!screenDone) return;
    if (screenIdx + 1 < SCREENS.length) {
      setScreenIdx(s => s + 1);
      setScreenDone(false);
    } else {
      setPhase("calverify");
    }
  };

  const pageHead = (title) => (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #__next { height: 100%; background: #0a0a0a; }
      `}</style>
    </>
  );

  if (phase === "verify") {
    return (
      <>
        {pageHead("Clocktower Operations")}
        <VerificationScreen onVerified={() => setPhase("briefing")} />
      </>
    );
  }

  if (phase === "calverify") {
    return (
      <>
        {pageHead("Agent Verification")}
        <CalVerificationScreen onVerified={() => setPhase("codenames")} />
      </>
    );
  }

  if (phase === "codenames") {
    return (
      <>
        {pageHead("Codename Assignment")}
        <CodenameScreen onComplete={() => setPhase("chat")} />
      </>
    );
  }

  if (phase === "chat") {
    return (
      <>
        {pageHead("Tru \u2014 Secure Channel")}
        <div style={{ height: "100vh", background: "#0a0a0a" }}>
          <ChatInterface />
        </div>
      </>
    );
  }

  // Briefing phase
  if (currentScreen.isLocationScreen) {
    return (
      <>
        {pageHead("Clocktower Operations")}
        <div
          onClick={() => { if (screenDone) advance(); }}
          style={{
            height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column",
            cursor: screenDone ? "pointer" : "default", userSelect: "none", position: "relative",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#222" }}>
            <div style={{ height: "100%", background: "#facc15", width: `${((screenIdx + 1) / SCREENS.length) * 100}%`, transition: "width 0.5s ease" }} />
          </div>
          <LocationScreen onComplete={() => setScreenDone(true)} />
          {screenDone && (
            <div style={{ padding: "16px 20px 24px", textAlign: "center" }}>
              <span style={{ color: "#555", fontFamily: "monospace", fontSize: 12, letterSpacing: 2, animation: "pulse 2s infinite" }}>
                TAP TO CONTINUE {"\u25b8"}
              </span>
            </div>
          )}
          <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>
      {pageHead("Clocktower Operations")}
      <div
        onClick={advance}
        style={{
          height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column",
          cursor: screenDone ? "pointer" : "default", userSelect: "none", position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#222" }}>
          <div style={{ height: "100%", background: "#facc15", width: `${((screenIdx + 1) / SCREENS.length) * 100}%`, transition: "width 0.5s ease" }} />
        </div>

        <Screen key={screenIdx} screen={currentScreen} onComplete={() => setScreenDone(true)} />

        {screenDone && (
          <div style={{ padding: "16px 20px 24px", textAlign: "center" }}>
            <span style={{ color: "#555", fontFamily: "monospace", fontSize: 12, letterSpacing: 2, animation: "pulse 2s infinite" }}>
              {screenIdx + 1 < SCREENS.length ? "TAP TO CONTINUE \u25b8" : "TAP TO BEGIN MISSION \u25b8"}
            </span>
          </div>
        )}

        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      </div>
    </>
  );
}
