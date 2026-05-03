import { useState } from "react";

export default function VideoGenerator() {
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState("TikTok / Reels / Shorts");
  const [result, setResult] = useState("");

  const generate = () => {
    const output = `VIDEO GENERATOR PLAN

Idea:
${idea}

Platform:
${platform}

Scene Plan:
1. Opening hook: Start with a visually striking moment.
2. Main setup: Show the problem or concept clearly.
3. Action sequence: Add movement, emotion, camera motion, and energy.
4. Payoff: Reveal the result, transformation, product, or story moment.
5. Ending CTA: Tell viewers what to do next.

Visual Prompt:
Create a cinematic short-form video for "${idea}". Use dynamic camera movement, expressive characters, dramatic lighting, clean composition, and high-energy pacing. Format it for ${platform}.`;

    setResult(output);
  };

  const saveToProjects = () => {
    const saved = JSON.parse(localStorage.getItem("vstack_projects") || "[]");
    saved.push({
      id: Date.now(),
      type: "Video Generator",
      title: idea || "Generated Video Plan",
      content: result,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("vstack_projects", JSON.stringify(saved));
    alert("Saved to Projects ✅");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Video Generator</h1>
      <p style={styles.sub}>Create video concepts, scenes, and AI video prompts.</p>

      <div style={styles.card}>
        <label style={styles.label}>Video Idea</label>
        <textarea style={styles.textarea} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Example: superhero dad protects his family at the beach..." />

        <label style={styles.label}>Platform</label>
        <select style={styles.input} value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option>TikTok / Reels / Shorts</option>
          <option>YouTube Long Form</option>
          <option>Commercial Ad</option>
          <option>Movie Trailer</option>
          <option>Animated Skit</option>
        </select>

        <button style={styles.button} onClick={generate}>Generate Video Plan</button>
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
  textarea: { width: "100%", minHeight: 140, padding: 14, borderRadius: 14, background: "#111", color: "#fff", border: "1px solid #333" },
  input: { width: "100%", padding: 14, borderRadius: 14, background: "#111", color: "#fff", border: "1px solid #333" },
  button: { marginTop: 20, padding: 15, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#ffd76a,#b8860b)", color: "#111", fontWeight: 900 },
  output: { marginTop: 24, padding: 24, borderRadius: 24, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,215,0,0.2)" },
  pre: { whiteSpace: "pre-wrap", color: "#eee" },
  save: { marginTop: 16, padding: 14, borderRadius: 14, border: "none", background: "#ffd76a", fontWeight: 900 },
};