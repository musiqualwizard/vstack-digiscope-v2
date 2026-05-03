import { useEffect, useState } from "react";
import { auth } from "../firebase";

type SettingsData = {
  ownerName: string;
  companyName: string;
  workspaceName: string;
  teamEmails: string;
  themeMode: string;
  defaultPage: string;
  firebaseStatus: string;
};

const defaultSettings: SettingsData = {
  ownerName: "",
  companyName: "DigiScope",
  workspaceName: "V-Stack",
  teamEmails: "",
  themeMode: "Dark Gold",
  defaultPage: "Command Center",
  firebaseStatus: "Connected",
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("vstack_advanced_settings");

    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateField = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess("");

      localStorage.setItem("vstack_advanced_settings", JSON.stringify(settings));

      await new Promise((res) => setTimeout(res, 700));

      setSuccess("Settings saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const userEmail = auth.currentUser?.email || "Signed-in team member";

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.badge}>WORKSPACE CONTROL</p>
          <h1 style={styles.title}>Advanced Settings</h1>
          <p style={styles.subtitle}>
            Manage your private V-Stack workspace, team access, interface,
            and production status.
          </p>
        </div>

        <div style={styles.userBox}>
          <span style={styles.statusDot}></span>
          <div>
            <strong>Signed In</strong>
            <p style={styles.userEmail}>{userEmail}</p>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Workspace Profile</h2>
              <p style={styles.cardText}>Name your workspace and company identity.</p>
            </div>
            <span style={styles.cardIcon}>🏢</span>
          </div>

          <label style={styles.label}>Workspace Name</label>
          <input
            style={styles.input}
            value={settings.workspaceName}
            onChange={(e) => updateField("workspaceName", e.target.value)}
            placeholder="V-Stack"
          />

          <label style={styles.label}>Owner Name</label>
          <input
            style={styles.input}
            value={settings.ownerName}
            onChange={(e) => updateField("ownerName", e.target.value)}
            placeholder="Enter owner name"
          />

          <label style={styles.label}>Company Name</label>
          <input
            style={styles.input}
            value={settings.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="DigiScope"
          />
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Team Access</h2>
              <p style={styles.cardText}>Track approved emails for your private team.</p>
            </div>
            <span style={styles.cardIcon}>👥</span>
          </div>

          <label style={styles.label}>Approved Team Emails</label>
          <textarea
            style={styles.textarea}
            value={settings.teamEmails}
            onChange={(e) => updateField("teamEmails", e.target.value)}
            placeholder={"you@email.com\npartner@email.com\nteam@email.com"}
          />

          <div style={styles.noteBox}>
            Access is still controlled by <b>allowedUsers.ts</b>. This section
            is for workspace records until we connect full Firebase team invites.
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Interface Preferences</h2>
              <p style={styles.cardText}>Control the default dashboard experience.</p>
            </div>
            <span style={styles.cardIcon}>🎨</span>
          </div>

          <label style={styles.label}>Theme Mode</label>
          <select
            style={styles.input}
            value={settings.themeMode}
            onChange={(e) => updateField("themeMode", e.target.value)}
          >
            <option>Dark Gold</option>
            <option>Midnight Blue</option>
            <option>Clean SaaS</option>
            <option>Neon Lab</option>
          </select>

          <label style={styles.label}>Default Landing Page</label>
          <select
            style={styles.input}
            value={settings.defaultPage}
            onChange={(e) => updateField("defaultPage", e.target.value)}
          >
            <option>Command Center</option>
            <option>AI Lab</option>
            <option>Build Lab</option>
            <option>Projects</option>
            <option>Analytics</option>
          </select>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>System Status</h2>
              <p style={styles.cardText}>Monitor the core services powering V-Stack.</p>
            </div>
            <span style={styles.cardIcon}>🧠</span>
          </div>

          <div style={styles.statusRow}>
            <span>Firebase Auth</span>
            <strong style={styles.connected}>Connected</strong>
          </div>

          <div style={styles.statusRow}>
            <span>Firestore Database</span>
            <strong style={styles.connected}>{settings.firebaseStatus}</strong>
          </div>

          <div style={styles.statusRow}>
            <span>API Vault</span>
            <strong style={styles.warning}>Local Mode</strong>
          </div>

          <div style={styles.statusRow}>
            <span>AI Backend</span>
            <strong style={styles.warning}>Needs Render Deploy</strong>
          </div>
        </section>

        <section style={{ ...styles.card, ...styles.fullCard }}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Production Checklist</h2>
              <p style={styles.cardText}>What is live now and what needs upgrading next.</p>
            </div>
            <span style={styles.cardIcon}>🚀</span>
          </div>

          <div style={styles.checkGrid}>
            <div style={styles.checkItem}>
              <span style={styles.checkGood}>✓</span>
              <div>
                <strong>Live Frontend</strong>
                <p>V-Stack is deployed on Vercel.</p>
              </div>
            </div>

            <div style={styles.checkItem}>
              <span style={styles.checkGood}>✓</span>
              <div>
                <strong>Private Login</strong>
                <p>Firebase Auth is protecting the app.</p>
              </div>
            </div>

            <div style={styles.checkItem}>
              <span style={styles.checkGood}>✓</span>
              <div>
                <strong>Team Allow List</strong>
                <p>Only approved emails can enter.</p>
              </div>
            </div>

            <div style={styles.checkItem}>
              <span style={styles.checkWarn}>!</span>
              <div>
                <strong>Backend API</strong>
                <p>Deploy server.cjs to Render next.</p>
              </div>
            </div>

            <div style={styles.checkItem}>
              <span style={styles.checkWarn}>!</span>
              <div>
                <strong>Cloud Projects</strong>
                <p>Move projects from local storage to Firestore.</p>
              </div>
            </div>

            <div style={styles.checkItem}>
              <span style={styles.checkWarn}>!</span>
              <div>
                <strong>Team Invites</strong>
                <p>Add admin invite controls later.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {success && <div style={styles.success}>{success}</div>}

      <div style={styles.saveBar}>
        <div>
          <strong>Ready to save changes?</strong>
          <p>Your settings are currently saved to this browser.</p>
        </div>

        <button onClick={handleSave} disabled={saving} style={styles.saveButton}>
          {saving ? "Saving..." : "Save Advanced Settings"}
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: "100%",
    maxWidth: 1600,
    margin: "0 auto",
    paddingBottom: 40,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "stretch",
    marginBottom: 26,
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
    margin: "8px 0",
    fontSize: "clamp(34px, 4vw, 56px)",
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: -1.5,
  },

  subtitle: {
    color: "#bdbdbd",
    maxWidth: 850,
    lineHeight: 1.6,
    margin: 0,
    fontSize: 16,
  },

  userBox: {
    minWidth: 280,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  userEmail: {
    margin: "4px 0 0",
    color: "#aaa",
    fontSize: 13,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#19f58a",
    boxShadow: "0 0 16px rgba(25,245,138,0.8)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
    gap: 24,
    width: "100%",
  },

  card: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 26,
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
    padding: 26,
    boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
  },

  fullCard: {
    gridColumn: "1 / -1",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "flex-start",
    marginBottom: 18,
  },

  cardTitle: {
    margin: 0,
    fontSize: 23,
    fontWeight: 900,
  },

  cardText: {
    margin: "6px 0 0",
    color: "#bdbdbd",
    lineHeight: 1.5,
  },

  cardIcon: {
    fontSize: 30,
  },

  label: {
    display: "block",
    marginTop: 14,
    marginBottom: 8,
    color: "#eaeaea",
    fontWeight: 800,
    fontSize: 14,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.32)",
    color: "#fff",
    outline: "none",
    fontSize: 15,
  },

  textarea: {
    width: "100%",
    minHeight: 145,
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.32)",
    color: "#fff",
    outline: "none",
    fontSize: 15,
    resize: "vertical",
  },

  noteBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    background: "rgba(255,215,0,0.08)",
    border: "1px solid rgba(255,215,0,0.18)",
    color: "#e9d28b",
    lineHeight: 1.5,
    fontSize: 13,
  },

  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontSize: 16,
  },

  connected: {
    color: "#7CFFB2",
  },

  warning: {
    color: "#ffd76a",
  },

  checkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },

  checkItem: {
    display: "flex",
    gap: 14,
    padding: 18,
    borderRadius: 18,
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  checkGood: {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: "50%",
    background: "rgba(25,245,138,0.16)",
    color: "#7CFFB2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  checkWarn: {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: "50%",
    background: "rgba(255,215,0,0.16)",
    color: "#ffd76a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  success: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    background: "rgba(25,245,138,0.1)",
    border: "1px solid rgba(25,245,138,0.28)",
    color: "#7CFFB2",
    fontWeight: 800,
  },

  saveBar: {
    marginTop: 22,
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    padding: 22,
    borderRadius: 24,
    border: "1px solid rgba(255,215,0,0.18)",
    background:
      "linear-gradient(135deg, rgba(255,215,0,0.11), rgba(255,255,255,0.035))",
    flexWrap: "wrap",
  },

  saveButton: {
    minWidth: 250,
    padding: "15px 18px",
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #ffd76a, #b8860b)",
    color: "#111",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(255,215,0,0.18)",
  },
};