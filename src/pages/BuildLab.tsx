import { useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
  type: string;
  description: string;
  createdAt: string;
};

export default function BuildLab() {
  const [appName, setAppName] = useState("");
  const [appType, setAppType] = useState("AI Tool");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("vstack_projects");
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const createProject = async () => {
    if (!appName.trim()) {
      setMessage("Add an app name first.");
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      name: appName.trim(),
      type: appType,
      description: description.trim() || "No description yet.",
      createdAt: new Date().toLocaleString(),
    };

    const updatedProjects = [newProject, ...projects];

    localStorage.setItem("vstack_projects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);

    try {
      await fetch("http://localhost:5000/api/analytics/project", {
        method: "POST",
      });
    } catch (error) {
      console.error("BuildLab analytics error:", error);

      await fetch("http://localhost:5000/api/analytics/error", {
        method: "POST",
      });
    }

    setAppName("");
    setDescription("");
    setAppType("AI Tool");
    setMessage("Project created and analytics updated.");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.kicker}>Build Lab</p>
        <h1 style={styles.title}>Create a new V-Stack project</h1>
        <p style={styles.subtitle}>
          Start apps, tools, dashboards, and automation builds from one place.
        </p>
      </div>

      <div style={styles.layout}>
        <div style={styles.formCard}>
          <h2 style={styles.cardTitle}>New Build</h2>

          <label style={styles.label}>App / Tool Name</label>
          <input
            style={styles.input}
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="Example: Social Media Ad Generator"
          />

          <label style={styles.label}>Build Type</label>
          <select
            style={styles.input}
            value={appType}
            onChange={(e) => setAppType(e.target.value)}
          >
            <option>AI Tool</option>
            <option>Mobile App</option>
            <option>Web App</option>
            <option>Dashboard</option>
            <option>Automation</option>
            <option>Marketing Tool</option>
            <option>Internal System</option>
          </select>

          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this project do?"
          />

          <button style={styles.button} onClick={createProject}>
            🚀 Create Project
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </div>

        <div style={styles.previewCard}>
          <h2 style={styles.cardTitle}>Latest Builds</h2>

          {projects.length === 0 ? (
            <p style={styles.empty}>No projects yet. Create your first build.</p>
          ) : (
            <div style={styles.projectList}>
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} style={styles.projectItem}>
                  <div>
                    <strong style={styles.projectName}>{project.name}</strong>
                    <p style={styles.projectMeta}>
                      {project.type} • {project.createdAt}
                    </p>
                    <p style={styles.projectDesc}>{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box" as const,
  },
  header: {
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
    margin: "8px 0",
    fontSize: "42px",
    lineHeight: 1,
    fontWeight: 950,
  },
  subtitle: {
    margin: 0,
    maxWidth: "720px",
    color: "rgba(255,255,255,0.72)",
    fontSize: "16px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 460px) 1fr",
    gap: "24px",
  },
  formCard: {
    padding: "28px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 20px 55px rgba(0,0,0,0.28)",
  },
  previewCard: {
    padding: "28px",
    borderRadius: "26px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.14), rgba(124,58,237,0.12), rgba(255,255,255,0.06))",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 20px 55px rgba(0,0,0,0.28)",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "24px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "16px",
    fontWeight: 800,
    color: "rgba(255,255,255,0.82)",
  },
  input: {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(2,6,23,0.55)",
    color: "white",
    outline: "none",
    fontWeight: 700,
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    minHeight: "140px",
    padding: "15px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(2,6,23,0.55)",
    color: "white",
    outline: "none",
    resize: "vertical" as const,
    fontWeight: 700,
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    marginTop: "22px",
    padding: "16px",
    borderRadius: "18px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #38bdf8, #7c3aed)",
    color: "white",
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 0 28px rgba(56,189,248,0.35)",
  },
  message: {
    marginTop: "14px",
    color: "#4ade80",
    fontWeight: 800,
  },
  empty: {
    color: "rgba(255,255,255,0.65)",
  },
  projectList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  projectItem: {
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  projectName: {
    fontSize: "18px",
    color: "#38bdf8",
  },
  projectMeta: {
    margin: "6px 0",
    fontSize: "13px",
    color: "rgba(255,255,255,0.58)",
  },
  projectDesc: {
    margin: 0,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.5,
  },
};