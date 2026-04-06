export default function Debug() {
  const set = (mode) => {
    if (mode === "reset") {
      localStorage.clear();
    } else if (mode === "briefing") {
      localStorage.setItem("oct_p", JSON.stringify("briefing"));
      localStorage.setItem("oct_bi", JSON.stringify(0));
      localStorage.setItem("oct_v", JSON.stringify([]));
      localStorage.setItem("oct_w", JSON.stringify([]));
      localStorage.setItem("oct_f", JSON.stringify(["","","","","",""]));
      localStorage.setItem("oct_pu", JSON.stringify(false));
      localStorage.setItem("oct_pv", JSON.stringify([]));
      localStorage.setItem("oct_bn", JSON.stringify([]));
      localStorage.setItem("oct_prd", JSON.stringify(false));
      localStorage.setItem("oct_pns", JSON.stringify(false));
      localStorage.setItem("oct_m", JSON.stringify([]));
    } else if (mode === "london") {
      localStorage.setItem("oct_p", JSON.stringify("active"));
      localStorage.setItem("oct_bi", JSON.stringify(99));
      localStorage.setItem("oct_v", JSON.stringify([]));
      localStorage.setItem("oct_w", JSON.stringify([]));
      localStorage.setItem("oct_f", JSON.stringify(["","","","","",""]));
      localStorage.setItem("oct_pu", JSON.stringify(false));
      localStorage.setItem("oct_pv", JSON.stringify([]));
      localStorage.setItem("oct_bn", JSON.stringify([]));
      localStorage.setItem("oct_prd", JSON.stringify(false));
      localStorage.setItem("oct_pns", JSON.stringify(false));
      localStorage.setItem("oct_m", JSON.stringify([{role:"spy",text:"JAGUAR. OTTER. STINGRAY.\n\nYou're officially active.\n\nAct like tourists. Check in at landmarks.\n\n— Tru"}]));
    } else if (mode === "londonmid") {
      localStorage.setItem("oct_p", JSON.stringify("active"));
      localStorage.setItem("oct_bi", JSON.stringify(99));
      localStorage.setItem("oct_v", JSON.stringify(["bigben","tower","stpauls"]));
      localStorage.setItem("oct_w", JSON.stringify([{word:"CROSS",from:"St. Paul's"}]));
      localStorage.setItem("oct_f", JSON.stringify(["92","02","45","","",""]));
      localStorage.setItem("oct_pu", JSON.stringify(false));
      localStorage.setItem("oct_pv", JSON.stringify([]));
      localStorage.setItem("oct_bn", JSON.stringify([]));
      localStorage.setItem("oct_prd", JSON.stringify(false));
      localStorage.setItem("oct_pns", JSON.stringify(false));
      localStorage.setItem("oct_m", JSON.stringify([{role:"spy",text:"Three fragments collected and one word clue. Keep going, agents. Bellecourt's trail continues.\n\n— Tru"}]));
    } else if (mode === "puzzle") {
      localStorage.setItem("oct_p", JSON.stringify("active"));
      localStorage.setItem("oct_bi", JSON.stringify(99));
      localStorage.setItem("oct_v", JSON.stringify(["bigben","tower","stpauls","buckingham","eye"]));
      localStorage.setItem("oct_w", JSON.stringify([{word:"CROSS",from:"St. Paul's"},{word:"AUNT",from:"Friend's dinner"},{word:"EYE",from:"London Eye"},{word:"FELL",from:"Buckingham Palace"}]));
      localStorage.setItem("oct_f", JSON.stringify(["92","02","45","","",""]));
      localStorage.setItem("oct_pu", JSON.stringify(false));
      localStorage.setItem("oct_pv", JSON.stringify([]));
      localStorage.setItem("oct_bn", JSON.stringify([]));
      localStorage.setItem("oct_prd", JSON.stringify(false));
      localStorage.setItem("oct_pns", JSON.stringify(true));
      localStorage.setItem("oct_m", JSON.stringify([{role:"spy",text:"Agents — I've been studying these word clues. There's a pattern. Check the PUZZLE tab — try combining them. Sound them out.\n\n— Tru"}]));
    } else if (mode === "paris") {
      localStorage.setItem("oct_p", JSON.stringify("active"));
      localStorage.setItem("oct_bi", JSON.stringify(99));
      localStorage.setItem("oct_v", JSON.stringify(["bigben","tower","stpauls","buckingham","eye"]));
      localStorage.setItem("oct_w", JSON.stringify([{word:"CROSS",from:"St. Paul's"},{word:"AUNT",from:"Friend's dinner"},{word:"EYE",from:"London Eye"},{word:"FELL",from:"Buckingham Palace"}]));
      localStorage.setItem("oct_f", JSON.stringify(["92","02","45","","",""]));
      localStorage.setItem("oct_pu", JSON.stringify(true));
      localStorage.setItem("oct_pv", JSON.stringify([]));
      localStorage.setItem("oct_bn", JSON.stringify([]));
      localStorage.setItem("oct_prd", JSON.stringify(true));
      localStorage.setItem("oct_pns", JSON.stringify(true));
      localStorage.setItem("oct_m", JSON.stringify([{role:"spy",text:"JAGUAR. OTTER. STINGRAY.\n\nWelcome to Paris. The Collector is here too. Tell me where you are.\n\n— Tru"}]));
    } else if (mode === "parismid") {
      localStorage.setItem("oct_p", JSON.stringify("active"));
      localStorage.setItem("oct_bi", JSON.stringify(99));
      localStorage.setItem("oct_v", JSON.stringify(["bigben","tower","stpauls","buckingham","eye"]));
      localStorage.setItem("oct_w", JSON.stringify([{word:"CROSS",from:"St. Paul's"},{word:"AUNT",from:"Friend's dinner"},{word:"EYE",from:"London Eye"},{word:"FELL",from:"Buckingham Palace"}]));
      localStorage.setItem("oct_f", JSON.stringify(["92","02","45","41","31",""]));
      localStorage.setItem("oct_pu", JSON.stringify(true));
      localStorage.setItem("oct_pv", JSON.stringify(["louvre","chapelle"]));
      localStorage.setItem("oct_bn", JSON.stringify([]));
      localStorage.setItem("oct_prd", JSON.stringify(true));
      localStorage.setItem("oct_pns", JSON.stringify(true));
      localStorage.setItem("oct_m", JSON.stringify([{role:"spy",text:"Two fragments down in Paris. One to go. The Collector is close — I can feel it.\n\n— Tru"}]));
    } else if (mode === "vault") {
      localStorage.setItem("oct_p", JSON.stringify("active"));
      localStorage.setItem("oct_bi", JSON.stringify(99));
      localStorage.setItem("oct_v", JSON.stringify(["bigben","tower","stpauls","buckingham","eye"]));
      localStorage.setItem("oct_w", JSON.stringify([{word:"CROSS",from:"St. Paul's"},{word:"AUNT",from:"Friend's dinner"},{word:"EYE",from:"London Eye"},{word:"FELL",from:"Buckingham Palace"}]));
      localStorage.setItem("oct_f", JSON.stringify(["92","02","45","41","31","98"]));
      localStorage.setItem("oct_pu", JSON.stringify(true));
      localStorage.setItem("oct_pv", JSON.stringify(["louvre","chapelle","arcdetriomphe","eiffel"]));
      localStorage.setItem("oct_bn", JSON.stringify([]));
      localStorage.setItem("oct_prd", JSON.stringify(true));
      localStorage.setItem("oct_pns", JSON.stringify(true));
      localStorage.setItem("oct_m", JSON.stringify([{role:"spy",text:"All fragments collected. I've traced The Collector to his final position. 11 Rue des Gravilliers. Get there and see what you find.\n\n— Tru"}]));
    }
    window.location.href = "/";
  };

  const s = { background: "#facc15", color: "#000", border: "none", borderRadius: 8, padding: "12px 24px", fontFamily: "monospace", fontWeight: 700, fontSize: 14, cursor: "pointer", margin: 8 };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ color: "#e0e0e0", fontFamily: "monospace", fontSize: 20, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>DEBUG MENU</div>
      <div style={{ color: "#888", fontFamily: "monospace", fontSize: 12, marginBottom: 32 }}>Tap a button, then you'll be redirected to the main site.</div>
      <button style={s} onClick={() => set("reset")}>RESET</button>
      <button style={s} onClick={() => set("briefing")}>SKIP TO BRIEFING</button>
      <button style={s} onClick={() => set("london")}>SKIP TO LONDON</button>
      <button style={{...s, fontSize: 11}} onClick={() => set("londonmid")}>LONDON (3 locations)</button>
      <button style={s} onClick={() => set("puzzle")}>SKIP TO PUZZLE</button>
      <button style={s} onClick={() => set("paris")}>SKIP TO PARIS (start)</button>
      <button style={s} onClick={() => set("parismid")}>SKIP TO PARIS (midway)</button>
      <button style={s} onClick={() => set("vault")}>SKIP TO VAULT</button>
    </div>
  );
}
