import { useEffect, useState } from "react";

type PageKey = "command" | "build" | "ailab" | "projects" | "analytics" | "vault";

type AnalyticsData = {
  projects: number;
  aiCalls: number;
  apiHits: number;
  errors: number;
};

export default function AICommandCenter({
  setPage,
}: {
  setPage: (page: PageKey) => void;
}) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    projects: 0,
    aiCalls: 0,
    apiHits: 0,
    errors: 0,
  });

  const loadAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analytics");
      const json = await res.json();

      setAnalytics({
        projects: json.projects || 0,
        aiCalls: json.aiCalls || 0,
        apiHits: json.apiHits || 0,
        errors: json.errors || 0,
      });
    } catch (error) {
      console.error("Command Center analytics error:", error);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const timer = setInterval(loadAnalytics, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <p style={styles.kicker}>DigiScope Command OS</p>
          <h1 style={styles.title}>Build. Launch. Track. Grow.</h1>
          <p style={styles.subtitle}>
            Your private AI platform for building apps, tools, analytics, and launches.
          </p>
        </div>
      </div>

      <div style={styles.actionGrid}>
        <button style={styles.actionCard} onClick={() => setPage("build")}>
          <span style={styles.icon}>🚀</span>
          <strong>Start New App</strong>
          <small>Open Build Lab</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("ailab")}>
          <span style={styles.icon}>⚡</span>
          <strong>Generate AI Tool</strong>
          <small>Use Nova Brain</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("projects")}>
          <span style={styles.icon}>📁</span>
          <strong>Manage Projects</strong>
          <small>Track your builds</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("analytics")}>
          <span style={styles.icon}>📊</span>
          <strong>View Analytics</strong>
          <small>Live growth data</small>
        </button>
      </div>

      <div style={styles.grid}>
        <Metric title="Active Builds" value={String(analytics.projects)} />
        <Metric title="AI Runs" value={String(analytics.aiCalls)} />
        <Metric title="API Calls" value={String(analytics.apiHits)} />
        <Metric title="Errors" value={String(analytics.errors)} />
      </div>

      <div style={styles.bottomGrid}>
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Platform Roadmap</h2>
          <div style={styles.listItem}>✅ Local Nova Brain online</div>
          <div style={styles.listItem}>✅ Analytics connected</div>
          <div style={styles.listItem}>🟡 Build Lab expansion</div>
          <div style={styles.listItem}>🟡 Project memory system</div>
          <div style={styles.listItem}>🔜 Offline LLM upgrade</div>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Nova Status</h2>
          <div style={styles.statusBubble}>
            {analytics.errors === 0 ? "ONLINE" : "CHECK ERRORS"}
          </div>
          <p style={styles.statusText}>
            V-Stack is running locally and ready to build with DigiScope.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div style={styles.metric}>
      <div style={styles.metricValue}>{value}</div>
      <div style={styles.metricTitle}>{title}</div>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    boxSizing: "border-box" as const,
  },
  hero: {
    width: "100%",
    minHeight: "220px",
    borderRadius: "28px",
    padding: "36px",
    boxSizing: "border-box" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.95), rgba(124,58,237,0.75), rgba(2,6,23,0.85))",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 25px 80px rgba(37,99,235,0.28)",
    marginBottom: "26px",
  },
  kicker: {
    margin: 0,
    color: "#facc15",
    fontWeight: 900,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
  },
  title: {
    margin: "10px 0",
    fontSize: "46px",
    lineHeight: 1,
    fontWeight: 950,
  },
  subtitle: {
    maxWidth: "720px",
    margin: 0,
    fontSize: "17px",
    color: "rgba(255,255,255,0.78)",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  actionCard: {
    minHeight: "140px",
    padding: "22px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    textAlign: "left" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.28)",
  },
  icon: {
    fontSize: "26px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  metric: {
    padding: "26px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.22)",
  },
  metricValue: {
    fontSize: "42px",
    fontWeight: 950,
    color: "#38bdf8",
  },
  metricTitle: {
    marginTop: "8px",
    opacity: 0.75,
    fontWeight: 800,
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "18px",
  },
  panel: {
    padding: "28px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.22)",
  },
  panelTitle: {
    marginTop: 0,
  },
  listItem: {
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontWeight: 700,
    color: "rgba(255,255,255,0.82)",
  },
  statusBubble: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    background: "rgba(34,197,94,0.18)",
    border: "1px solid rgba(34,197,94,0.45)",
    color: "#4ade80",
    fontWeight: 950,
    letterSpacing: "1px",
  },
  statusText: {
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.75)",
  },
};