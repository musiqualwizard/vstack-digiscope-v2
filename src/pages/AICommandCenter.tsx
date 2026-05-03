import React from "react";

type PageKey =
  | "command"
  | "ailab"
  | "buildlab"
  | "automation"
  | "projects"
  | "analytics"
  | "vault"
  | "settings";

type Props = {
  setPage: (page: PageKey) => void;
};

export default function AICommandCenter({ setPage }: Props) {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <p style={styles.badge}>PRIVATE AI OPERATING SYSTEM</p>
          <h1 style={styles.title}>Build. Launch. Track. Grow.</h1>
          <p style={styles.subtitle}>
            Your private AI platform for building apps, tools, analytics, automations,
            and launch systems.
          </p>
        </div>
      </div>

      <div style={styles.quickGrid}>
        <button style={styles.actionCard} onClick={() => setPage("buildlab")}>
          <span style={styles.icon}>🚀</span>
          <strong>Start New App</strong>
          <small>Open Build Lab</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("ailab")}>
          <span style={styles.icon}>⚡</span>
          <strong>Generate AI Tool</strong>
          <small>Use Nova Brain</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("automation")}>
          <span style={styles.icon}>🤖</span>
          <strong>Automation Lab</strong>
          <small>Auto content, ads, and builds</small>
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

        <button style={styles.actionCard} onClick={() => setPage("vault")}>
          <span style={styles.icon}>🔐</span>
          <strong>API Vault</strong>
          <small>Manage API keys</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("settings")}>
          <span style={styles.icon}>⚙️</span>
          <strong>Settings</strong>
          <small>Control your workspace</small>
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h2>0</h2>
          <p>Active Builds</p>
        </div>

        <div style={styles.statCard}>
          <h2>0</h2>
          <p>AI Runs</p>
        </div>

        <div style={styles.statCard}>
          <h2>0</h2>
          <p>API Calls</p>
        </div>

        <div style={styles.statCard}>
          <h2>0</h2>
          <p>Automations</p>
        </div>

        <div style={styles.statCard}>
          <h2>0</h2>
          <p>Errors</p>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: "100%",
  },

  hero: {
    width: "100%",
    minHeight: 190,
    borderRadius: 30,
    padding: 34,
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, rgba(79,70,229,0.95), rgba(17,24,39,0.95)), radial-gradient(circle at top right, rgba(255,215,0,0.35), transparent 35%)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
    marginBottom: 26,
  },

  badge: {
    margin: 0,
    color: "#ffd76a",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
  },

  title: {
    margin: "10px 0 8px",
    fontSize: "clamp(38px, 5vw, 72px)",
    lineHeight: 0.95,
    fontWeight: 950,
    letterSpacing: -2,
    color: "#ffffff",
  },

  subtitle: {
    maxWidth: 760,
    color: "#d6d6ff",
    fontSize: 17,
    lineHeight: 1.6,
    margin: 0,
    fontWeight: 600,
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
    marginBottom: 26,
  },

  actionCard: {
    minHeight: 128,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
    color: "#fff",
    padding: 22,
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "transform 0.15s ease, border 0.15s ease",
  },

  icon: {
    fontSize: 26,
    marginBottom: 12,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 18,
  },

  statCard: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
    padding: 24,
    textAlign: "center",
    boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
  },

  h2: {},

  statNumber: {},

  strong: {},

  small: {},

  statText: {},
};