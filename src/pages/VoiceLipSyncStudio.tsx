import { useState } from "react";

export default function VoiceLipSyncStudio() {
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("Male energetic");
  const [character, setCharacter] = useState("");
  const [result, setResult] = useState("");

  const generate = () => {
    const output = `VOICEOVER + LIP SYNC STUDIO

Character:
${character}

Voice Style:
${voice}

Voiceover Script:
${script}

Voice Direction:
Record this in a ${voice} tone. Use clear pronunciation, natural emotion, strong pacing, and professional delivery.

Lip Sync Direction:
Use the voiceover script to animate ${character || "the character"} with accurate mouth movement, expressive facial motion, natural eye movement, and believable head gestures. Keep the character locked to the voice timing and emotion.

Production Notes:
- Add pauses where emotion is needed.
- Match mouth movement to each word.
- Keep expressions natural.
- Use clean studio-quality audio.
- Export for social media or AI video tools.`;

    setResult(output);
  };

  const saveToProjects = () => {
    const saved = JSON.parse(localStorage.getItem("vstack_projects") || "[]");
    saved.push({
      id: Date.now(),
      type: "Voiceover + Lip Sync",
      title: character || "Generated Voice/Lip Sync Plan",
      content: result,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("vstack_projects", JSON.stringify(saved));
    alert("Saved to Projects ✅");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Voiceover + Lip Sync Studio</h1>
      <p style={styles.sub}>Create voice direction, scripts, character delivery, and lip-sync instructions.</p>

      <div style={styles.card}>
        <label style={styles.label}>Character Name</label>
        <input style={styles.input} value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="Example: Gangsta Dad, Thugger, Nova..." />

        <label style={styles.label}>Voice Style</label>
        <select style={styles.input} value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option>Male energetic</option>
          <option>Male deep cinematic</option>
          <option>Female warm narrator</option>
          <option>Funny cartoon voice</option>
          <option>Commercial ad voice</option>
          <option>Emotional storyteller</option>
        </select>

        <label style={styles.label}>Script</label>
        <textarea style={styles.textarea} value={script} onChange={(e) => setScript(e.target.value)} placeholder="Paste your voiceover script here..." />

        <button style={styles.button} onClick={generate}>Generate Voice + Lip Sync Plan</button>
      </div>

      {result && (
        <div style={styles.output}>
          <pre style={styles.pre}>{result}</pre>
          <button style={styles.save} onClick={saveToProjects}>Save to Projects</button>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: { width: "100%" },
  title: { fontSize: 42, fontWeight: 950, margin: 0 },
  sub: { color: "#aaa", marginBottom: 24 },
  card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24 },
  label: { display: "block", marginTop: 14, marginBottom: 8, fontWeight: 800 },
  input: { width: "100%", padding: 14, borderRadius: 14, background: "#111", color: "#fff", border: "1px solid #333" },
  textarea: { width: "100%", minHeight: 160, padding: 14, borderRadius: 14, background: "#111", color: "#fff", border: "1px solid #333" },
  button: { marginTop: 20, padding: 15, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#ffd76a,#b8860b)", color: "#111", fontWeight: 900 },
  output: { marginTop: 24, padding: 24, borderRadius: 24, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,215,0,0.2)" },
  pre: { whiteSpace: "pre-wrap", color: "#eee" },
  save: { marginTop: 16, padding: 14, borderRadius: 14, border: "none", background: "#ffd76a", fontWeight: 900 },
};