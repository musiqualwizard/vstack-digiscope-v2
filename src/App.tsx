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
import BuildLab from "./pages/BuildLab";
import AutomationLab from "./pages/AutomationLab";
import Settings from "./pages/Settings";

import ImageGenerator from "./pages/ImageGenerator";
import VideoGenerator from "./pages/VideoGenerator";
import AdVideoGenerator from "./pages/AdVideoGenerator";
import VoiceLipSyncStudio from "./pages/VoiceLipSyncStudio";

export type PageKey =
  | "command"
  | "ailab"
  | "buildlab"
  | "automation"
  | "imagegen"
  | "videogen"
  | "adgen"
  | "voicegen"
  | "projects"
  | "analytics"
  | "vault"
  | "settings";

export default function App() {
  const [page, setPage] = useState<PageKey>("command");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      const email = user?.email || "";

      if (!user || !allowedUsers.includes(email)) {
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
      case "buildlab":
        return <BuildLab />;
      case "automation":
        return <AutomationLab />;
      case "imagegen":
        return <ImageGenerator />;
      case "videogen":
        return <VideoGenerator />;
      case "adgen":
        return <AdVideoGenerator />;
      case "voicegen":
        return <VoiceLipSyncStudio />;
      case "projects":
        return <Projects />;
      case "analytics":
        return <Analytics />;
      case "vault":
        return <APIVault />;
      case "settings":
        return <Settings />;
      case "command":
      default:
        return <AICommandCenter setPage={setPage} />;
    }
  };

  if (checkingAuth) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <h1 style={styles.loadingTitle}>V-Stack</h1>
          <p style={styles.loadingText}>Checking secure access...</p>
        </div>
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
          <div style={styles.brandBox}>
            <h2 style={styles.logo}>V-Stack</h2>
            <p style={styles.logoSub}>by DigiScope</p>
          </div>

          <nav style={styles.nav}>
            <button style={navBtn(page === "command")} onClick={() => setPage("command")}>
              🧠 Command Center
            </button>

            <button style={navBtn(page === "ailab")} onClick={() => setPage("ailab")}>
              ⚡ AI Lab
            </button>

            <button style={navBtn(page === "buildlab")} onClick={() => setPage("buildlab")}>
              🏗️ Build Lab
            </button>

            <button style={navBtn(page === "automation")} onClick={() => setPage("automation")}>
              🤖 Automation Lab
            </button>

            <div style={styles.navSection}>Creative Studio</div>

            <button style={navBtn(page === "imagegen")} onClick={() => setPage("imagegen")}>
              🎨 Image Generator
            </button>

            <button style={navBtn(page === "videogen")} onClick={() => setPage("videogen")}>
              🎬 Video Generator
            </button>

            <button style={navBtn(page === "adgen")} onClick={() => setPage("adgen")}>
              📢 Ad Video Generator
            </button>

            <button style={navBtn(page === "voicegen")} onClick={() => setPage("voicegen")}>
              🎙️ Voice + Lip Sync
            </button>

            <div style={styles.navSection}>Workspace</div>

            <button style={navBtn(page === "projects")} onClick={() => setPage("projects")}>
              📁 Projects
            </button>

            <button style={navBtn(page === "analytics")} onClick={() => setPage("analytics")}>
              📊 Analytics
            </button>

            <button style={navBtn(page === "vault")} onClick={() => setPage("vault")}>
              🔐 API Vault
            </button>

            <button style={navBtn(page === "settings")} onClick={() => setPage("settings")}>
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <div style={styles.bottomBox}>
          <div style={styles.statusBox}>
            <span style={styles.statusDot}></span>
            <span>Private Team Mode</span>
          </div>

          <button
            style={styles.logout}
            onClick={async () => {
              await signOut(auth);
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.pageShell}>{renderPage()}</div>
      </main>
    </div>
  );
}

const navBtn = (active: boolean): React.CSSProperties => ({
  width: "100%",
  textAlign: "left",
  padding: "14px 15px",
  borderRadius: 16,
  border: active
    ? "1px solid rgba(255, 215, 0, 0.55)"
    : "1px solid rgba(255,255,255,0.04)",
  background: active
    ? "linear-gradient(135deg, rgba(255,215,0,0.18), rgba(255,215,0,0.05))"
    : "rgba(255,255,255,0.03)",
  color: active ? "#ffd76a" : "#d6d6d6",
  cursor: "pointer",
  fontWeight: 800,
  marginBottom: 10,
  fontSize: 14,
  boxShadow: active ? "0 0 22px rgba(255, 215, 0, 0.12)" : "none",
});

const styles: { [key: string]: React.CSSProperties } = {
  loadingPage: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #2a2105 0%, #060606 45%, #000 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  loadingCard: {
    padding: 40,
    borderRadius: 28,
    border: "1px solid rgba(255,215,0,0.22)",
    background: "rgba(10,10,10,0.75)",
    boxShadow: "0 0 60px rgba(255,215,0,0.12)",
    textAlign: "center",
  },

  loadingTitle: {
    color: "#ffd76a",
    fontSize: 46,
    margin: 0,
    fontWeight: 900,
  },

  loadingText: {
    color: "#aaa",
    marginTop: 10,
  },

  app: {
    width: "100%",
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(48,42,100,0.45), transparent 35%), #070707",
    color: "white",
    display: "flex",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    overflow: "hidden",
  },

  sidebar: {
    width: 300,
    minWidth: 300,
    height: "100vh",
    background:
      "linear-gradient(180deg, rgba(8,8,8,0.98), rgba(4,4,4,0.98))",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    padding: 22,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    overflowY: "auto",
  },

  brandBox: {
    padding: "14px 12px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  logo: {
    margin: 0,
    color: "#ffd76a",
    fontSize: 31,
    fontWeight: 950,
    letterSpacing: -0.8,
  },

  logoSub: {
    marginTop: 4,
    color: "#999",
    fontSize: 13,
    fontWeight: 700,
  },

  nav: {
    marginTop: 24,
  },

  navSection: {
    margin: "18px 0 10px",
    color: "#777",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  bottomBox: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 16,
    marginTop: 20,
  },

  statusBox: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    color: "#a9a9a9",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 14,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "#19f58a",
    boxShadow: "0 0 12px rgba(25,245,138,0.8)",
  },

  logout: {
    width: "100%",
    padding: "14px 15px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  },

  main: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "32px 42px",
    boxSizing: "border-box",
  },

  pageShell: {
    width: "100%",
    maxWidth: 1600,
    margin: "0 auto",
  },
};