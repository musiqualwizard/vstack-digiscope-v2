import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { allowedUsers } from "./allowedUsers";
import Login from "./pages/Login";

import AILab from "./pages/AiLab";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import APIVault from "./pages/APIVault";
import AICommandCenter from "./pages/AICommandCenter";

type PageKey = "command" | "ailab" | "projects" | "analytics" | "vault";

export default function App() {
  const [page, setPage] = useState<PageKey>("command");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || !allowedUsers.includes(user.email || "")) {
        if (user) await signOut(auth);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      setCheckingAuth(false);
    });

    return () => unsub();
  }, []);

  const renderPage = () => {
    switch (page) {
      case "ailab":
        return <AILab />;
      case "projects":
        return <Projects />;
      case "analytics":
        return <Analytics />;
      case "vault":
        return <APIVault />;
      case "command":
      default:
        return <AICommandCenter />;
    }
  };

  if (checkingAuth) {
    return (
      <div style={styles.loadingPage}>
        <h1 style={styles.loadingTitle}>V-Stack</h1>
        <p style={styles.loadingText}>Checking secure access...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>V-Stack</h2>
          <p style={styles.logoSub}>by DigiScope</p>
        </div>

        <nav style={styles.nav}>
          <button style={navBtn(page === "command")} onClick={() => setPage("command")}>
            Command Center
          </button>
          <button style={navBtn(page === "ailab")} onClick={() => setPage("ailab")}>
            AI Lab
          </button>
          <button style={navBtn(page === "projects")} onClick={() => setPage("projects")}>
            Projects
          </button>
          <button style={navBtn(page === "analytics")} onClick={() => setPage("analytics")}>
            Analytics
          </button>
          <button style={navBtn(page === "vault")} onClick={() => setPage("vault")}>
            API Vault
          </button>
        </nav>

        <button
          style={styles.logout}
          onClick={async () => {
            await signOut(auth);
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
      </aside>

      <main style={styles.main}>{renderPage()}</main>
    </div>
  );
}

const navBtn = (active: boolean): React.CSSProperties => ({
  width: "100%",
  textAlign: "left",
  padding: "13px 14px",
  borderRadius: 14,
  border: active ? "1px solid rgba(255, 215, 0, 0.5)" : "1px solid transparent",
  background: active ? "rgba(255, 215, 0, 0.12)" : "transparent",
  color: active ? "#ffd76a" : "#cfcfcf",
  cursor: "pointer",
  fontWeight: 800,
  marginBottom: 8,
});

const styles: { [key: string]: React.CSSProperties } = {
  loadingPage: {
    minHeight: "100vh",
    background: "#050505",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  loadingTitle: {
    color: "#ffd76a",
    fontSize: 42,
    margin: 0,
  },

  loadingText: {
    color: "#aaa",
  },

  app: {
    minHeight: "100vh",
    background: "#070707",
    color: "white",
    display: "flex",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  sidebar: {
    width: 260,
    background: "#050505",
    borderRight: "1px solid #1d1d1d",
    padding: 22,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    margin: 0,
    color: "#ffd76a",
    fontSize: 28,
    fontWeight: 900,
  },

  logoSub: {
    marginTop: 4,
    color: "#999",
    fontSize: 13,
  },

  nav: {
    marginTop: 34,
  },

  logout: {
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },

  main: {
    flex: 1,
    padding: 28,
    overflowY: "auto",
  },
};