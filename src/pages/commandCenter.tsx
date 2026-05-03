import { useMemo, useState } from "react";

type QuickCommand = {
  label: string;
  command: string;
};

type Activity = {
  icon: string;
  title: string;
  text: string;
};

const quickCommands: QuickCommand[] = [
  {
    label: "New App Idea",
    command: "Create a new app idea and add it to Projects",
  },
  {
    label: "Plan Launch",
    command: "Build a launch plan for our next app",
  },
  {
    label: "Check APIs",
    command: "Review API keys and services we need",
  },
  {
    label: "Money Tracker",
    command: "Track revenue goals and app monetization",
  },
];

const activities: Activity[] = [
  {
    icon: "✅",
    title: "Private mode active",
    text: "V-Stack is designed for you and your partner only.",
  },
  {
    icon: "🧠",
    title: "Command Center online",
    text: "Main dashboard is ready for project planning and AI routing.",
  },
  {
    icon: "🔐",
    title: "API Vault connected",
    text: "Secure area prepared for keys, services, and backend notes.",
  },
  {
    icon: "📊",
    title: "Analytics ready",
    text: "Tracking area prepared for downloads, traffic, revenue, and growth.",
  },
];

export default function AICommandCenter() {
  const [command, setCommand] = useState("");
  const [savedCommands, setSavedCommands] = useState<string[]>(() => {
    const stored = localStorage.getItem("vstack_commands");
    return stored ? JSON.parse(stored) : [];
  });

  const currentUser = localStorage.getItem("vstack_user") || "Wizard";

  const commandPreview = useMemo(() => {
    if (!command.trim()) {
      return "Waiting for your next move...";
    }

    return `Ready to process: "${command.trim()}"`;
  }, [command]);

  const saveCommand = () => {
    if (!command.trim()) return;

    const updated = [command.trim(), ...savedCommands].slice(0, 6);
    setSavedCommands(updated);
    localStorage.setItem("vstack_commands", JSON.stringify(updated));
    setCommand("");
  };

  const runQuickCommand = (value: string) => {
    setCommand(value);
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.kicker}>V-Stack by DigiScope LLC</p>
          <h1 style={styles.title}>AI Command Center</h1>
          <p style={styles.subtitle}>
            Private build control room for you and your partner. Manage app
            ideas, AI tools, APIs, analytics, launch plans, and business moves
            from one place.
          </p>

          <div style={styles.heroBadges}>
            <span style={styles.badge}>Private System</span>
            <span style={styles.badge}>2-Person Build Hub</span>
            <span style={styles.badge}>Internal Use Only</span>
          </div>
        </div>

        <div style={styles.coreBox}>
          <div style={styles.orb}>V</div>
          <p style={styles.coreTitle}>System Core</p>
          <p style={styles.coreStatus}>Operational</p>
          <p style={styles.userText}>Logged in: {currentUser}</p>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Active Builders</p>
          <h2 style={styles.statNumber}>2</h2>
          <p style={styles.statNote}>You + Partner</p>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Main Modules</p>
          <h2 style={styles.statNumber}>5</h2>
          <p style={styles.statNote}>Command, Lab, Projects, Analytics, Vault</p>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Build Mode</p>
          <h2 style={styles.statNumber}>V1</h2>
          <p style={styles.statNote}>Local-first system</p>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Access Level</p>
          <h2 style={styles.statNumber}>Locked</h2>
          <p style={styles.statNote}>Private dashboard</p>
        </div>
      </section>

      <section style={styles.commandBox}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Command Input</h2>
            <p style={styles.sectionText}>
              Type what you want V-Stack to help build, organize, track, or
              prepare.
            </p>
          </div>

          <span style={styles.livePill}>Live Console</span>
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Example: Create a launch plan for Vision Wizard..."
          />

          <button style={styles.button} onClick={saveCommand}>
            Save Command
          </button>
        </div>

        <p style={styles.preview}>{commandPreview}</p>

        <div style={styles.quickGrid}>
          {quickCommands.map((item) => (
            <button
              key={item.label}
              style={styles.quickBtn}
              onClick={() => runQuickCommand(item.command)}
            >
              <span style={styles.quickLabel}>{item.label}</span>
              <span style={styles.quickText}>{item.command}</span>
            </button>
          ))}
        </div>
      </section>

      <section style={styles.moduleGrid}>
        <div style={styles.moduleCard}>
          <div style={styles.moduleIcon}>🧠</div>
          <h3 style={styles.moduleTitle}>AI Lab</h3>
          <p style={styles.moduleText}>
            Test prompts, compare tools, plan AI features, and prepare model
            workflows.
          </p>
          <span style={styles.moduleStatus}>Ready</span>
        </div>

        <div style={styles.moduleCard}>
          <div style={styles.moduleIcon}>📁</div>
          <h3 style={styles.moduleTitle}>Projects</h3>
          <p style={styles.moduleText}>
            Store every app, idea, feature, release step, and build status in
            one system.
          </p>
          <span style={styles.moduleStatus}>Active</span>
        </div>

        <div style={styles.moduleCard}>
          <div style={styles.moduleIcon}>📊</div>
          <h3 style={styles.moduleTitle}>Analytics</h3>
          <p style={styles.moduleText}>
            Track app growth, traffic, revenue goals, downloads, testing, and
            launches.
          </p>
          <span style={styles.moduleStatus}>Online</span>
        </div>

        <div style={styles.moduleCard}>
          <div style={styles.moduleIcon}>🔐</div>
          <h3 style={styles.moduleTitle}>API Vault</h3>
          <p style={styles.moduleText}>
            Keep API services, key notes, backend routes, and connection plans
            organized.
          </p>
          <span style={styles.moduleStatus}>Secured</span>
        </div>
      </section>

      <section style={styles.bottomGrid}>
        <div style={styles.panel}>
          <h2 style={styles.sectionTitle}>Saved Commands</h2>

          {savedCommands.length === 0 ? (
            <p style={styles.emptyText}>No commands saved yet.</p>
          ) : (
            savedCommands.map((item, index) => (
              <div key={`${item}-${index}`} style={styles.savedItem}>
                <span style={styles.savedIndex}>#{index + 1}</span>
                <p style={styles.savedText}>{item}</p>
              </div>
            ))
          )}
        </div>

        <div style={styles.panel}>
          <h2 style={styles.sectionTitle}>System Activity</h2>

          {activities.map((activity) => (
            <div key={activity.title} style={styles.activityItem}>
              <span style={styles.activityIcon}>{activity.icon}</span>
              <div>
                <h4 style={styles.activityTitle}>{activity.title}</h4>
                <p style={styles.activityText}>{activity.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    color: "white",
    padding: "32px",
    background:
      "radial-gradient(circle at top left, rgba(250,204,21,0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(56,189,248,0.12), transparent 30%), linear-gradient(135deg, #030712, #050505 55%, #111827)",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 240px",
    gap: "24px",
    alignItems: "stretch",
    marginBottom: "24px",
  },

  heroContent: {
    padding: "30px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(250,204,21,0.25)",
    boxShadow: "0 0 40px rgba(250,204,21,0.08)",
  },

  kicker: {
    margin: "0 0 10px",
    color: "#facc15",
    fontWeight: 900,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    fontSize: "13px",
  },

  title: {
    margin: 0,
    fontSize: "48px",
    lineHeight: 1,
    fontWeight: 950,
  },

  subtitle: {
    marginTop: "18px",
    maxWidth: "780px",
    color: "#d1d5db",
    fontSize: "16px",
    lineHeight: 1.7,
  },

  heroBadges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "22px",
  },

  badge: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(250,204,21,0.12)",
    border: "1px solid rgba(250,204,21,0.3)",
    color: "#facc15",
    fontSize: "12px",
    fontWeight: 900,
  },

  coreBox: {
    padding: "24px",
    borderRadius: "28px",
    background:
      "linear-gradient(180deg, rgba(250,204,21,0.16), rgba(255,255,255,0.05))",
    border: "1px solid rgba(250,204,21,0.35)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  orb: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    margin: "0 auto 18px",
    display: "grid",
    placeItems: "center",
    fontSize: "42px",
    fontWeight: 950,
    color: "#111827",
    background: "linear-gradient(135deg, #facc15, #f59e0b)",
    boxShadow: "0 0 45px rgba(250,204,21,0.65)",
  },

  coreTitle: {
    margin: 0,
    fontWeight: 900,
    fontSize: "18px",
  },

  coreStatus: {
    margin: "8px 0 0",
    color: "#22c55e",
    fontWeight: 900,
  },

  userText: {
    margin: "14px 0 0",
    color: "#cbd5e1",
    fontSize: "13px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    padding: "22px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  statLabel: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "13px",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  statNumber: {
    margin: "10px 0 4px",
    color: "#facc15",
    fontSize: "30px",
    fontWeight: 950,
  },

  statNote: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "13px",
  },

  commandBox: {
    padding: "26px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.065)",
    border: "1px solid rgba(255,255,255,0.12)",
    marginBottom: "24px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
  },

  sectionTitle: {
    margin: "0 0 8px",
    fontSize: "24px",
    fontWeight: 950,
  },

  sectionText: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },

  livePill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.3)",
    color: "#86efac",
    fontWeight: 900,
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  inputRow: {
    display: "flex",
    gap: "12px",
    marginTop: "22px",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "260px",
    padding: "15px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#020617",
    color: "white",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    padding: "15px 20px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #facc15, #f59e0b)",
    color: "#111827",
    fontWeight: 950,
    cursor: "pointer",
  },

  preview: {
    margin: "14px 0 0",
    color: "#facc15",
    fontWeight: 800,
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },

  quickBtn: {
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid rgba(250,204,21,0.2)",
    background: "rgba(0,0,0,0.26)",
    color: "white",
    textAlign: "left",
    cursor: "pointer",
  },

  quickLabel: {
    display: "block",
    color: "#facc15",
    fontWeight: 950,
    marginBottom: "6px",
  },

  quickText: {
    display: "block",
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: 1.4,
  },

  moduleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  moduleCard: {
    padding: "22px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  moduleIcon: {
    fontSize: "30px",
    marginBottom: "14px",
  },

  moduleTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
    fontWeight: 950,
  },

  moduleText: {
    color: "#cbd5e1",
    lineHeight: 1.55,
    fontSize: "14px",
  },

  moduleStatus: {
    display: "inline-block",
    marginTop: "10px",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(250,204,21,0.12)",
    color: "#facc15",
    fontWeight: 900,
    fontSize: "12px",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  panel: {
    padding: "24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  emptyText: {
    color: "#9ca3af",
  },

  savedItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    padding: "12px 0",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  savedIndex: {
    color: "#facc15",
    fontWeight: 950,
    minWidth: "34px",
  },

  savedText: {
    margin: 0,
    color: "#e5e7eb",
    lineHeight: 1.45,
  },

  activityItem: {
    display: "flex",
    gap: "14px",
    padding: "14px 0",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  activityIcon: {
    fontSize: "22px",
  },

  activityTitle: {
    margin: "0 0 4px",
    fontSize: "15px",
    fontWeight: 950,
  },

  activityText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: 1.45,
  },
};