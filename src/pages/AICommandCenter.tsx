import React from "react";
import type { PageKey } from "../App";

type Props = {
  setPage: (page: PageKey) => void;
};

export default function AICommandCenter({ setPage }: Props) {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <p style={styles.badge}>PRIVATE AI OPERATING SYSTEM</p>
          <h1 style={styles.title}>Build. Launch. Create. Grow.</h1>
          <p style={styles.subtitle}>
            Your private one-stop AI platform for app builds, automation,
            image creation, video planning, ad generation, voiceovers,
            lip-sync workflows, analytics, and secure API tools.
          </p>

          <div style={styles.heroActions}>
            <button style={styles.primaryBtn} onClick={() => setPage("adgen")}>
              Create Ad Campaign
            </button>
            <button style={styles.secondaryBtn} onClick={() => setPage("buildlab")}>
              Start New Build
            </button>
          </div>
        </div>

        <div style={styles.heroPanel}>
          <p style={styles.panelLabel}>Creative Pipeline</p>
          <div style={styles.pipelineItem}>🎨 Image Assets</div>
          <div style={styles.pipelineItem}>🎬 Video Scenes</div>
          <div style={styles.pipelineItem}>📢 Ad Scripts</div>
          <div style={styles.pipelineItem}>🎙️ Voice + Lip Sync</div>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Core Command Tools</h2>

      <div style={styles.quickGrid}>
        <button style={styles.actionCard} onClick={() => setPage("buildlab")}>
          <span style={styles.icon}>🚀</span>
          <strong>Start New App</strong>
          <small>Open Build Lab and generate app systems.</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("ailab")}>
          <span style={styles.icon}>⚡</span>
          <strong>Generate AI Tool</strong>
          <small>Use Nova Brain for code, ideas, and systems.</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("automation")}>
          <span style={styles.icon}>🤖</span>
          <strong>Automation Lab</strong>
          <small>Auto content, ads, workflows, and builds.</small>
        </button>

        <button style={styles.actionCard} onClick={() => setPage("projects")}>
          <span style={styles.icon}>📁</span>
          <strong>Manage Projects</strong>
          <small>Save and track all generated work.</small>
        </button>
      </div>

      <h2 style={styles.sectionTitle}>Creative Studio</h2>

      <div style={styles.creativeGrid}>
        <button style={styles.creativeCard} onClick={() => setPage("imagegen")}>
          <span style={styles.bigIcon}>🎨</span>
          <div>
            <strong>Image Generator</strong>
            <small>
              Create image prompts for characters, thumbnails, icons, covers,
              product visuals, and social graphics.
            </small>
          </div>
        </button>

        <button style={styles.creativeCard} onClick={() => setPage("videogen")}>
          <span style={styles.bigIcon}>🎬</span>
          <div>
            <strong>Video Generator</strong>
            <small>
              Build video concepts, scenes, shot lists, AI video prompts,
              and cinematic production plans.
            </small>
          </div>
        </button>

        <button style={styles.creativeCard} onClick={() => setPage("adgen")}>
          <span style={styles.bigIcon}>📢</span>
          <div>
            <strong>Ad Video Generator</strong>
            <small>
              Generate hooks, scripts, captions, CTAs, shot lists, and platform
              ad formats.
            </small>
          </div>
        </button>

        <button style={styles.creativeCard} onClick={() => setPage("voicegen")}>
          <span style={styles.bigIcon}>🎙️</span>
          <div>
            <strong>Voiceover + Lip Sync</strong>
            <small>
              Create voice directions, narration scripts, character delivery,
              and lip-sync production prompts.
            </small>
          </div>
        </button>
      </div>

      <h2 style={styles.sectionTitle}>Workspace Overview</h2>

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
          <p>Generated Assets</p>
        </div>

        <div style={styles.statCard}>
          <h2>0</h2>
          <p>Ad Campaigns</p>
        </div>

        <div style={styles.statCard}>
          <h2>0</h2>
          <p>API Calls</p>
        </div>
      </div>

      <div style={styles.bottomGrid}>
        <button style={styles.wideCard} onClick={() => setPage("analytics")}>
          <span style={styles.icon}>📊</span>
          <strong>View Analytics</strong>
          <small>Track activity, growth, AI usage, API calls, and errors.</small>
        </button>

        <button style={styles.wideCard} onClick={() => setPage("vault")}>
          <span style={styles.icon}>🔐</span>
          <strong>API Vault</strong>
          <small>Manage API keys for AI, image, video, voice, and automation tools.</small>
        </button>

        <button style={styles.wideCard} onClick={() => setPage("settings")}>
          <span style={styles.icon}>⚙️</span>
          <strong>Settings</strong>
          <small>Manage workspace, team access, and production settings.</small>
        </button>
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
    minHeight: 270,
    borderRadius: 32,
    padding: 36,
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, rgba(79,70,229,0.95), rgba(17,24,39,0.97)), radial-gradient(circle at top right, rgba(255,215,0,0.35), transparent 35%)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
    marginBottom: 30,
    display: "flex",
    justifyContent: "space-between",
    gap: 26,
    alignItems: "stretch",
    flexWrap: "wrap",
  },

  badge: {
    margin: 0,
    color: "#ffd76a",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
  },

  title: {
    margin: "10px 0 12px",
    fontSize: "clamp(42px, 5vw, 78px)",
    lineHeight: 0.95,
    fontWeight: 950,
    letterSpacing: -2,
    color: "#ffffff",
    maxWidth: 900,
  },

  subtitle: {
    maxWidth: 860,
    color: "#d6d6ff",
    fontSize: 17,
    lineHeight: 1.6,
    margin: 0,
    fontWeight: 600,
  },

  heroActions: {
    display: "flex",
    gap: 14,
    marginTop: 24,
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "15px 20px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #ffd76a, #b8860b)",
    color: "#111",
    fontWeight: 950,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "15px 20px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },

  heroPanel: {
    minWidth: 280,
    flex: "0 0 320px",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.2)",
    padding: 20,
  },

  panelLabel: {
    margin: "0 0 14px",
    color: "#ffd76a",
    fontWeight: 900,
    fontSize: 13,
  },

  pipelineItem: {
    padding: "13px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 10,
    fontWeight: 800,
  },

  sectionTitle: {
    margin: "30px 0 16px",
    fontSize: 24,
    fontWeight: 950,
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },

  creativeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
    gap: 18,
  },

  actionCard: {
    minHeight: 135,
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
  },

  creativeCard: {
    minHeight: 170,
    borderRadius: 26,
    border: "1px solid rgba(255,215,0,0.14)",
    background:
      "linear-gradient(135deg, rgba(255,215,0,0.09), rgba(255,255,255,0.04))",
    color: "#fff",
    padding: 24,
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
    display: "flex",
    gap: 18,
    alignItems: "flex-start",
  },

  icon: {
    fontSize: 28,
    marginBottom: 12,
  },

  bigIcon: {
    fontSize: 38,
    lineHeight: 1,
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

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 18,
    marginTop: 26,
  },

  wideCard: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
    color: "#fff",
    padding: 24,
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
  },
};