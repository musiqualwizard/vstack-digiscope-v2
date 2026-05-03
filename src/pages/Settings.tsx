import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

type Theme = "dark" | "light";
type Model = "gpt-4o-mini" | "gpt-4o";

export default function Settings() {
  const user = auth.currentUser;

  const [theme, setTheme] = useState<Theme>("dark");
  const [defaultModel, setDefaultModel] = useState<Model>("gpt-4o-mini");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("Owner");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setLoading(true);

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setTheme(data.theme || "dark");
          setDefaultModel(data.defaultModel || "gpt-4o-mini");
          setDisplayName(data.displayName || "");
          setRole(data.role || "Owner");
        } else {
          await setDoc(ref, {
            email: user.email,
            displayName: "",
            role: "Owner",
            theme: "dark",
            defaultModel: "gpt-4o-mini",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch {
        setMessage("Could not load Firebase settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName,
          role,
          theme,
          defaultModel,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      localStorage.setItem("vstack_theme", theme);
      localStorage.setItem("vstack_model", defaultModel);

      setMessage("Settings saved to Firebase.");
    } catch {
      setMessage("Save failed. Check Firebase rules.");
    } finally {
      setLoading(false);
    }
  };

  const resetLocalOnly = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.kicker}>V-Stack User System</p>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>
          Firebase-synced settings for your V-Stack account.
        </p>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.grid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Profile</h2>

          <label style={styles.label}>Email</label>
          <input style={styles.input} value={user?.email || ""} disabled />

          <label style={styles.label}>Display Name</label>
          <input
            style={styles.input}
            placeholder="Wizard"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <label style={styles.label}>Role</label>
          <select
            style={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Owner</option>
            <option>Partner</option>
            <option>Builder</option>
          </select>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>Preferences</h2>

          <label style={styles.label}>Theme</label>
          <select
            style={styles.input}
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>

          <label style={styles.label}>Default AI Model</label>
          <select
            style={styles.input}
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value as Model)}
          >
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </section>

        <section style={styles.dangerCard}>
          <h2 style={styles.cardTitle}>Danger Zone</h2>
          <p style={styles.warning}>
            This only clears browser data. Firebase account data stays saved.
          </p>

          <button style={styles.resetButton} onClick={resetLocalOnly}>
            Reset Local Data
          </button>
        </section>
      </div>

      <button style={styles.saveButton} onClick={saveSettings} disabled={loading}>
        {loading ? "Saving..." : "Save Firebase Settings"}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 28,
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,0.18), transparent 35%), #050505",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: {
    marginBottom: 24,
  },
  kicker: {
    color: "#d4af37",
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "uppercase",
    margin: 0,
  },
  title: {
    fontSize: 42,
    margin: "8px 0",
  },
  subtitle: {
    color: "#b8b8b8",
  },
  message: {
    padding: 14,
    borderRadius: 16,
    background: "rgba(212,175,55,0.1)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#ffdf6b",
    fontWeight: 800,
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    background: "rgba(12,12,12,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 22,
  },
  dangerCard: {
    background: "rgba(80,10,10,0.35)",
    border: "1px solid rgba(255,80,80,0.35)",
    borderRadius: 24,
    padding: 22,
  },
  cardTitle: {
    marginTop: 0,
  },
  label: {
    display: "block",
    marginTop: 14,
    marginBottom: 8,
    color: "#d4af37",
    fontWeight: 800,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
    boxSizing: "border-box",
  },
  warning: {
    color: "#ffaaaa",
    lineHeight: 1.5,
  },
  resetButton: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,80,80,0.45)",
    background: "rgba(255,80,80,0.12)",
    color: "#ff7777",
    fontWeight: 900,
    cursor: "pointer",
  },
  saveButton: {
    width: "100%",
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(135deg, #d4af37, #ffdf6b)",
    color: "#050505",
    fontWeight: 900,
    cursor: "pointer",
  },
};