import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { allowedUsers } from "../allowedUsers";

type LoginProps = {
  onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        mode === "login"
          ? await signInWithEmailAndPassword(auth, email, password)
          : await createUserWithEmailAndPassword(auth, email, password);

      const userEmail = userCredential.user.email || "";

      if (!allowedUsers.includes(userEmail)) {
        await signOut(auth);
        setError("Access denied. This email is not approved for V-Stack.");
        setLoading(false);
        return;
      }

      onLogin();
    } catch (err: any) {
      console.error(err);

      if (err.code === "auth/invalid-credential") {
        setError("Wrong email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email already has an account. Try logging in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Login failed. Check your info and try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <div style={styles.card}>
        <div style={styles.badge}>PRIVATE TEAM ACCESS</div>

        <h1 style={styles.title}>V-Stack</h1>
        <p style={styles.subtitle}>by DigiScope</p>

        <p style={styles.description}>
          Your private AI command center for builds, projects, automation,
          analytics, and API tools.
        </p>

        <div style={styles.toggleBox}>
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            style={{
              ...styles.toggleButton,
              ...(mode === "login" ? styles.toggleActive : {}),
            }}
          >
            Login
          </button>

          <button
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            style={{
              ...styles.toggleButton,
              ...(mode === "signup" ? styles.toggleActive : {}),
            }}
          >
            Create Account
          </button>
        </div>

        <label style={styles.label}>Email Address</label>
        <input
          style={styles.input}
          type="email"
          placeholder="team@digiscope.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <div style={styles.passwordBox}>
          <input
            style={styles.passwordInput}
            type={showPass ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAuth();
            }}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={styles.showButton}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button onClick={handleAuth} disabled={loading} style={styles.mainBtn}>
          {loading
            ? "Checking Access..."
            : mode === "login"
            ? "Enter V-Stack"
            : "Create Team Account"}
        </button>

        <p style={styles.note}>
          Only approved DigiScope team emails can access this platform.
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #3b2a05 0%, #050505 35%, #000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: 20,
  },

  glowOne: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "rgba(255, 193, 7, 0.18)",
    filter: "blur(80px)",
    top: -120,
    left: -100,
  },

  glowTwo: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: "50%",
    background: "rgba(255, 215, 0, 0.12)",
    filter: "blur(90px)",
    bottom: -120,
    right: -100,
  },

  card: {
    width: "100%",
    maxWidth: 460,
    background: "rgba(10, 10, 10, 0.88)",
    border: "1px solid rgba(255, 215, 0, 0.25)",
    borderRadius: 28,
    padding: 34,
    boxShadow: "0 0 60px rgba(255, 193, 7, 0.13)",
    backdropFilter: "blur(18px)",
    zIndex: 2,
  },

  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255, 215, 0, 0.1)",
    border: "1px solid rgba(255, 215, 0, 0.3)",
    color: "#ffd76a",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    marginBottom: 18,
  },

  title: {
    margin: 0,
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: -1,
    color: "#fff",
  },

  subtitle: {
    marginTop: 4,
    color: "#f5c84b",
    fontWeight: 700,
    fontSize: 17,
  },

  description: {
    color: "#cfcfcf",
    lineHeight: 1.6,
    marginBottom: 24,
  },

  toggleBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    background: "#111",
    padding: 6,
    borderRadius: 16,
    marginBottom: 24,
    border: "1px solid #222",
  },

  toggleButton: {
    border: "none",
    borderRadius: 12,
    padding: "12px 10px",
    background: "transparent",
    color: "#aaa",
    cursor: "pointer",
    fontWeight: 800,
  },

  toggleActive: {
    background: "linear-gradient(135deg, #f5c84b, #b8860b)",
    color: "#111",
    boxShadow: "0 8px 22px rgba(245, 200, 75, 0.22)",
  },

  label: {
    display: "block",
    marginBottom: 8,
    marginTop: 14,
    color: "#e9e9e9",
    fontSize: 14,
    fontWeight: 700,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: 14,
    border: "1px solid #2c2c2c",
    background: "#0b0b0b",
    color: "#fff",
    outline: "none",
    fontSize: 15,
  },

  passwordBox: {
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    borderRadius: 14,
    border: "1px solid #2c2c2c",
    background: "#0b0b0b",
    overflow: "hidden",
  },

  passwordInput: {
    flex: 1,
    padding: "15px 16px",
    border: "none",
    background: "transparent",
    color: "#fff",
    outline: "none",
    fontSize: 15,
  },

  showButton: {
    border: "none",
    background: "transparent",
    color: "#f5c84b",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: 800,
  },

  error: {
    marginTop: 16,
    background: "rgba(255, 60, 60, 0.12)",
    border: "1px solid rgba(255, 60, 60, 0.35)",
    color: "#ff9a9a",
    padding: 12,
    borderRadius: 14,
    fontSize: 14,
  },

  mainBtn: {
    width: "100%",
    marginTop: 22,
    padding: "16px 18px",
    borderRadius: 16,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #ffd76a, #b8860b)",
    color: "#111",
    fontSize: 16,
    fontWeight: 900,
    boxShadow: "0 12px 28px rgba(255, 215, 0, 0.18)",
  },

  note: {
    textAlign: "center",
    color: "#8e8e8e",
    marginTop: 18,
    fontSize: 13,
  },
};