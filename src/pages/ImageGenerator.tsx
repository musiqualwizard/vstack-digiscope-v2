import { useState } from "react";

export default function ImageGenerator() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("3D Pixar-style");
  const [result, setResult] = useState("");

  const generate = () => {
    const output = `IMAGE GENERATOR PROMPT

Concept:
${idea}

Style:
${style}

Prompt:
Create a high-quality ${style} image based on this idea: "${idea}". Use cinematic lighting, sharp detail, premium composition, strong contrast, and professional visual polish. Make it suitable for app branding, ads, thumbnails, product visuals, or social media.`;

    setResult(output);
  };

  const saveToProjects = () => {
    const saved = JSON.parse(localStorage.getItem("vstack_projects") || "[]");
    saved.push({
      id: Date.now(),
      type: "Image Generator",
      title: idea || "Generated Image Prompt",
      content: result,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("vstack_projects", JSON.stringify(saved));
    alert("Saved to Projects ✅");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Image Generator</h1>
      <p style={styles.sub}>Create prompts for icons, characters, thumbnails, ads, and brand visuals.</p>

      <div style={styles.card}>
        <label style={styles.label}>Image Idea</label>
        <textarea style={styles.textarea} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Example: black and gold AI command center logo..." />

        <label style={styles.label}>Style</label>
        <select style={styles.input} value={style} onChange={(e) => setStyle(e.target.value)}>
          <option>3D Pixar-style</option>
          <option>Realistic cinematic</option>
          <option>Anime</option>
          <option>Luxury black and gold</option>
          <option>Product ad style</option>
          <option>YouTube thumbnail style</option>
        </select>

        <button style={styles.button} onClick={generate}>Generate Image Prompt</button>
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