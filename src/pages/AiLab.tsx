import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  mode: string;
  prompt: string;
  response: string;
  createdAt: string;
};

export default function AiLab() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("App Builder");

  useEffect(() => {
    const savedProject = localStorage.getItem("vstack_selected_project");

    if (savedProject) {
      const project = JSON.parse(savedProject);

      setMode("App Builder");
      setPrompt(
        `Build or improve this V-Stack project:

Project Name: ${project.name}
Description: ${project.description || "No description added."}
Status: ${project.status}
Priority: ${project.priority}
Progress: ${project.progress}%

Give me the next best build step, code structure, and what should be improved.`
      );

      localStorage.removeItem("vstack_selected_project");
    }
  }, []);

  const track = (key: string) => {
    const current = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(current + 1));
  };

  const runAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");

    try {
      track("vstack_ai_calls");

      const res = await fetch("http://localhost:5000/api/ai/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          prompt,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      const output = data.output || data.result || "No response returned.";

      setResult(output);

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        mode,
        prompt,
        response: output,
        createdAt: new Date().toLocaleString(),
      };

      setHistory((prev) => [newItem, ...prev]);
    } catch (error) {
      track("vstack_errors");
      setResult(
        "Error connecting to the backend. Make sure your backend is running on http://localhost:5000"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearLab = () => {
    setPrompt("");
    setResult("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>V-Stack AI Engine</p>
          <h1 style={styles.title}>AI Lab</h1>
          <p style={styles.subtitle}>
            Run prompts, improve projects, generate code, and track every AI run.
          </p>
        </div>

        <div style={styles.statusBox}>
          <span style={styles.statusDot}></span>
          Backend: localhost:5000
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Run AI Command</h2>

          <label style={styles.label}>AI Mode</label>
          <select
            style={styles.select}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option>App Builder</option>
            <option>Code Fixer</option>
            <option>Marketing Writer</option>
            <option>Business Strategist</option>
            <option>UI Designer</option>
            <option>General Assistant</option>
          </select>

          <label style={styles.label}>Prompt</label>
          <textarea
            style={styles.textarea}
            placeholder="Example: Build me a React dashboard for a project management app..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div style={styles.buttonRow}>
            <button style={styles.primaryButton} onClick={runAI} disabled={loading}>
              {loading ? "Running AI..." : "Run AI"}
            </button>

            <button style={styles.secondaryButton} onClick={clearLab}>
              Clear
            </button>
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>AI Output</h2>

          <div style={styles.outputBox}>
            {result ? (
              <pre style={styles.outputText}>{result}</pre>
            ) : (
              <div style={styles.emptyOutput}>
                <h3>No output yet</h3>
                <p>Run an AI command or open a project from Projects.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section style={styles.historyPanel}>
        <div style={styles.historyHeader}>
          <div>
            <h2 style={styles.panelTitle}>Prompt History</h2>
            <p style={styles.historySub}>Your AI runs during this session.</p>
          </div>

          <button style={styles.secondaryButton} onClick={clearHistory}>
            Clear History
          </button>
        </div>

        {history.length === 0 ? (
          <div style={styles.emptyHistory}>No prompt history yet.</div>
        ) : (
          <div style={styles.historyList}>
            {history.map((item) => (
              <div key={item.id} style={styles.historyCard}>
                <div style={styles.historyTop}>
                  <strong>{item.createdAt}</strong>
                  <span style={styles.modeBadge}>{item.mode}</span>
                </div>

                <p style={styles.historyPrompt}>{item.prompt}</p>

                <pre style={styles.historyResponse}>{item.response}</pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,0.18), transparent 35%), #050505",
    color: "white",
    padding: 28,
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 24,
  },
  kicker: {
    color: "#d4af37",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: 0,
  },
  title: { fontSize: 42, margin: "8px 0" },
  subtitle: { color: "#b8b8b8", fontSize: 16, maxWidth: 780 },
  statusBox: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(12,12,12,0.9)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#d4af37",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 10,
    whiteSpace: "nowrap",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#31ff7a",
    boxShadow: "0 0 14px #31ff7a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "420px 1fr",
    gap: 22,
    marginBottom: 24,
  },
  panel: {
    background: "rgba(12,12,12,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 22,
  },
  panelTitle: { marginTop: 0, marginBottom: 16 },
  label: {
    display: "block",
    color: "#d4af37",
    fontWeight: 800,
    marginBottom: 8,
    marginTop: 14,
  },
  select: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: 230,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: 1.5,
  },
  buttonRow: { display: "flex", gap: 12, marginTop: 18 },
  primaryButton: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #d4af37, #ffdf6b)",
    color: "#050505",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "14px 18px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#101010",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  outputBox: {
    minHeight: 390,
    background: "#070707",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 18,
    overflow: "auto",
  },
  outputText: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#f1f1f1",
    fontFamily: "Consolas, monospace",
    fontSize: 14,
    lineHeight: 1.55,
    margin: 0,
  },
  emptyOutput: {
    height: 330,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#999",
  },
  historyPanel: {
    background: "rgba(12,12,12,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 22,
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  historySub: { color: "#999", marginTop: -8 },
  emptyHistory: {
    padding: 30,
    color: "#999",
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: 18,
    textAlign: "center",
  },
  historyList: { display: "grid", gap: 14, marginTop: 18 },
  historyCard: {
    background: "linear-gradient(180deg, #111, #070707)",
    border: "1px solid rgba(212,175,55,0.16)",
    borderRadius: 18,
    padding: 16,
  },
  historyTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#d4af37",
    marginBottom: 8,
  },
  modeBadge: {
    padding: "5px 10px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.1)",
    border: "1px solid rgba(212,175,55,0.25)",
    fontSize: 12,
  },
  historyPrompt: { color: "#e8e8e8", marginBottom: 12 },
  historyResponse: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "#bdbdbd",
    background: "#050505",
    borderRadius: 14,
    padding: 14,
    fontSize: 13,
    lineHeight: 1.5,
  },
};