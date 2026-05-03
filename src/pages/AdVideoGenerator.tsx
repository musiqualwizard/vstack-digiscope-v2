import { useState } from "react";

export default function AdVideoGenerator() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState("");

  const generate = () => {
    const output = `AD VIDEO GENERATOR

Product / Offer:
${product}

Target Audience:
${audience}

Ad Script:
HOOK:
Stop scrolling — this was built for ${audience || "people who need a better solution"}.

PROBLEM:
Most people waste time trying to figure this out on their own.

SOLUTION:
That is where ${product || "this product"} comes in. It makes the process faster, cleaner, and easier.

PROOF / DEMO:
Show the product in action. Highlight the main benefit visually.

CTA:
Try it today and see why it changes the way you work.

Shot List:
1. Fast hook shot
2. Problem shot
3. Product reveal
4. Demo shot
5. Benefit text overlay
6. Final CTA screen`;

    setResult(output);
  };

  const saveToProjects = () => {
    const saved = JSON.parse(localStorage.getItem("vstack_projects") || "[]");
    saved.push({
      id: Date.now(),
      type: "Ad Video Generator",
      title: product || "Generated Ad Video",
      content: result,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("vstack_projects", JSON.stringify(saved));
    alert("Saved to Projects ✅");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Ad Video Generator</h1>
      <p style={styles.sub}>Create ad scripts, hooks, shot lists, captions, and CTAs.</p>

      <div style={styles.card}>
        <label style={styles.label}>Product / Offer</label>
        <input style={styles.input} value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Example: V-Stack private AI platform" />

        <label style={styles.label}>Target Audience</label>
        <input style={styles.input} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Example: app builders, creators, small business owners" />

        <button style={styles.button} onClick={generate}>Generate Ad Video</button>
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
  button: { marginTop: 20, padding: 15, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#ffd76a,#b8860b)", color: "#111", fontWeight: 900 },
  output: { marginTop: 24, padding: 24, borderRadius: 24, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,215,0,0.2)" },
  pre: { whiteSpace: "pre-wrap", color: "#eee" },
  save: { marginTop: 16, padding: 14, borderRadius: 14, border: "none", background: "#ffd76a", fontWeight: 900 },
};