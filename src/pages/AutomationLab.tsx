import { useMemo, useState } from "react";

type ToolType = "content" | "ads" | "builds";

type SavedAutomation = {
  id: string;
  type: ToolType;
  title: string;
  input: string;
  output: string;
  createdAt: string;
};

type ProjectItem = {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
  source: string;
  content: string;
};

const API_URL = "http://localhost:5000";

export default function AutomationLab() {
  const [tool, setTool] = useState<ToolType>("content");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [saved, setSaved] = useState<SavedAutomation[]>(() => {
    const data = localStorage.getItem("vstack_automation_history");
    return data ? JSON.parse(data) : [];
  });

  const toolInfo = useMemo(() => {
    if (tool === "content") {
      return {
        title: "Auto Content Generator",
        subtitle: "Create captions, hashtags, posts, scripts, and content ideas.",
        placeholder: "Example: Create content for Vision Wizard Coloring App...",
        button: "Generate Content",
      };
    }

    if (tool === "ads") {
      return {
        title: "Auto Ad Generator",
        subtitle: "Create UGC ads, hooks, CTAs, voiceovers, and video prompts.",
        placeholder: "Example: Make a TikTok ad for TriLink digital business cards...",
        button: "Generate Ads",
      };
    }

    return {
      title: "Auto Build Generator",
      subtitle: "Create app plans, features, folder structures, and build steps.",
      placeholder: "Example: Build a SaaS dashboard for app creators...",
      button: "Generate Build Plan",
    };
  }, [tool]);

  const buildPrompt = () => {
    if (tool === "content") {
      return `
You are V-Stack Auto Content Generator.

Create content for:
${input}

Return:
1. 10 viral hooks
2. 5 TikTok captions
3. 5 Instagram captions
4. 5 YouTube Shorts titles
5. 25 hashtags
6. 3 short video scripts
7. 1 content posting strategy

Make it clear, punchy, and ready to copy.
`;
    }

    if (tool === "ads") {
      return `
You are V-Stack Auto Ad Generator.

Create ads for:
${input}

Return:
1. 10 scroll-stopping hooks
2. 3 UGC-style ad scripts
3. 3 professional brand ad scripts
4. 5 call-to-action lines
5. 3 Kling/Vidu video prompts
6. 1 voiceover script
7. 1 simple shot list

Make it high-converting and easy to film.
`;
    }

    return `
You are V-Stack Auto Build Generator.

Create a full build plan for:
${input}

Return:
1. App/SaaS idea summary
2. Core features
3. Tech stack
4. Folder structure
5. Pages/components needed
6. Backend routes needed
7. Database structure
8. Step-by-step build order
9. Starter code notes
10. MVP launch plan

Make it copy/paste friendly for a beginner.
`;
  };

  const saveHistory = (newOutput: string) => {
    const item: SavedAutomation = {
      id: crypto.randomUUID(),
      type: tool,
      title: input.slice(0, 45) || toolInfo.title,
      input,
      output: newOutput,
      createdAt: new Date().toLocaleString(),
    };

    const updated = [item, ...saved].slice(0, 20);
    setSaved(updated);
    localStorage.setItem("vstack_automation_history", JSON.stringify(updated));
  };

  const saveToProjects = () => {
    if (!output.trim()) {
      alert("Generate something first before saving to Projects.");
      return;
    }

    const existingProjects = localStorage.getItem("vstack_projects");
    const projects: ProjectItem[] = existingProjects ? JSON.parse(existingProjects) : [];

    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      name: input.slice(0, 55) || toolInfo.title,
      description: `${toolInfo.title} result saved from Automation Lab.`,
      type: tool === "content" ? "Auto Content" : tool === "ads" ? "Auto Ad" : "Auto Build",
      status: "Saved",
      createdAt: new Date().toLocaleString(),
      source: "Automation Lab",
      content: output,
    };

    const updatedProjects = [newProject, ...projects];

    localStorage.setItem("vstack_projects", JSON.stringify(updatedProjects));

    alert("Saved to Projects.");
  };

  const trackAnalytics = async () => {
    try {
      await fetch(`${API_URL}/analytics/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "automationRun", tool }),
      });
    } catch {
      // App still works even if analytics route is not added yet
    }
  };

  const runAutomation = async () => {
    if (!input.trim()) {
      setOutput("Type what you want V-Stack to generate first.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(`${API_URL}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: buildPrompt(),
        }),
      });

      const data = await res.json();
      const result = data.result || data.message || "No response from AI.";

      setOutput(result);
      saveHistory(result);
      trackAnalytics();
    } catch {
      setOutput("Error connecting to backend. Make sure your Node server is running on localhost:5000.");
    }

    setLoading(false);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    alert("Copied to clipboard.");
  };

  const downloadOutput = () => {
    if (!output) return;

    const file = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");

    a.href = url;
    a.download = `vstack-${tool}-result.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const loadSaved = (item: SavedAutomation) => {
    setTool(item.type);
    setInput(item.input);
    setOutput(item.output);
  };

  const clearHistory = () => {
    localStorage.removeItem("vstack_automation_history");
    setSaved([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>V-Stack by Digiscope</p>
          <h1 style={styles.title}>🤖 Automation Lab</h1>
          <p style={styles.subtitle}>
            Auto content, auto ads, auto builds — and now save results directly into Projects.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.mainCard}>
          <div style={styles.tabs}>
            <button style={styles.tab(tool === "content")} onClick={() => setTool("content")}>
              Auto Content
            </button>
            <button style={styles.tab(tool === "ads")} onClick={() => setTool("ads")}>
              Auto Ads
            </button>
            <button style={styles.tab(tool === "builds")} onClick={() => setTool("builds")}>
              Auto Builds
            </button>
          </div>

          <div style={styles.toolHeader}>
            <h2 style={styles.cardTitle}>{toolInfo.title}</h2>
            <p style={styles.cardText}>{toolInfo.subtitle}</p>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={toolInfo.placeholder}
            style={styles.textarea}
          />

          <div style={styles.actions}>
            <button style={styles.primaryBtn} onClick={runAutomation} disabled={loading}>
              {loading ? "Generating..." : toolInfo.button}
            </button>

            <button style={styles.goldOutlineBtn} onClick={saveToProjects}>
              Save to Projects
            </button>

            <button style={styles.secondaryBtn} onClick={copyOutput}>
              Copy
            </button>

            <button style={styles.secondaryBtn} onClick={downloadOutput}>
              Download
            </button>
          </div>

          <div style={styles.outputBox}>
            <div style={styles.outputTop}>
              <strong>Result</strong>
              <span>{loading ? "AI is working..." : output ? "Ready to save" : "Waiting"}</span>
            </div>

            <pre style={styles.outputText}>
              {output || "Your generated result will appear here."}
            </pre>
          </div>
        </section>

        <aside style={styles.sideCard}>
          <div style={styles.sideTop}>
            <h2 style={styles.cardTitle}>Saved Runs</h2>
            <button style={styles.clearBtn} onClick={clearHistory}>
              Clear
            </button>
          </div>

          {saved.length === 0 ? (
            <p style={styles.cardText}>No saved automation runs yet.</p>
          ) : (
            <div style={styles.historyList}>
              {saved.map((item) => (
                <button key={item.id} style={styles.historyItem} onClick={() => loadSaved(item)}>
                  <strong>{item.title}</strong>
                  <span>
                    {item.type.toUpperCase()} • {item.createdAt}
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    color: "#fff",
    background:
      "radial-gradient(circle at top left, rgba(255,215,0,0.16), transparent 35%), #050505",
  },
  header: {
    marginBottom: "24px",
  },
  kicker: {
    color: "#d6b24c",
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    margin: 0,
  },
  title: {
    fontSize: "36px",
    margin: "8px 0",
  },
  subtitle: {
    color: "#aaa",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "22px",
  },
  mainCard: {
    background: "rgba(15,15,15,0.96)",
    border: "1px solid rgba(255,215,0,0.22)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 0 35px rgba(255,215,0,0.08)",
  },
  sideCard: {
    background: "rgba(15,15,15,0.96)",
    border: "1px solid rgba(255,215,0,0.18)",
    borderRadius: "18px",
    padding: "20px",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },
  tab: (active: boolean) => ({
    padding: "11px 15px",
    borderRadius: "999px",
    border: active ? "1px solid #ffd700" : "1px solid #333",
    background: active ? "linear-gradient(135deg, #ffd700, #a67c00)" : "#111",
    color: active ? "#000" : "#ddd",
    cursor: "pointer",
    fontWeight: 800,
  }),
  toolHeader: {
    marginBottom: "16px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "22px",
  },
  cardText: {
    color: "#aaa",
    lineHeight: 1.6,
  },
  textarea: {
    width: "100%",
    height: "150px",
    background: "#080808",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "14px",
    padding: "14px",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    gap: "10px",
    margin: "16px 0",
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #ffd700, #b88700)",
    color: "#000",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  goldOutlineBtn: {
    background: "rgba(255,215,0,0.08)",
    color: "#ffd700",
    border: "1px solid rgba(255,215,0,0.55)",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#151515",
    color: "#fff",
    border: "1px solid #333",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
  },
  outputBox: {
    background: "#070707",
    border: "1px solid #2b2b2b",
    borderRadius: "16px",
    padding: "16px",
    minHeight: "280px",
  },
  outputTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#d6b24c",
    marginBottom: "12px",
  },
  outputText: {
    whiteSpace: "pre-wrap",
    color: "#eee",
    fontFamily: "inherit",
    lineHeight: 1.6,
    margin: 0,
  },
  sideTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  clearBtn: {
    background: "#220000",
    color: "#ff9c9c",
    border: "1px solid #551111",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  historyItem: {
    textAlign: "left",
    background: "#0a0a0a",
    color: "#fff",
    border: "1px solid #282828",
    borderRadius: "12px",
    padding: "12px",
    cursor: "pointer",
  },
};