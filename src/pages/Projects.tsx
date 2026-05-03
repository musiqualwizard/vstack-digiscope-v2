import { useEffect, useMemo, useState } from "react";

type ProjectStatus = "Planning" | "Building" | "Testing" | "Launched";
type ProjectPriority = "Low" | "Medium" | "High";

type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  createdAt: string;
};

const STORAGE_KEY = "vstack_projects";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ProjectStatus>("All");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Planning");
  const [priority, setPriority] = useState<ProjectPriority>("Medium");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem("vstack_project_count", String(projects.length));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const stats = {
    total: projects.length,
    planning: projects.filter((p) => p.status === "Planning").length,
    building: projects.filter((p) => p.status === "Building").length,
    testing: projects.filter((p) => p.status === "Testing").length,
    launched: projects.filter((p) => p.status === "Launched").length,
  };

  const createProject = () => {
    if (!name.trim()) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      status,
      priority,
      progress,
      createdAt: new Date().toLocaleDateString(),
    };

    setProjects([newProject, ...projects]);
    setName("");
    setDescription("");
    setStatus("Planning");
    setPriority("Medium");
    setProgress(0);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const updateStatus = (id: string, newStatus: ProjectStatus) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? {
              ...project,
              status: newStatus,
              progress:
                newStatus === "Planning"
                  ? 10
                  : newStatus === "Building"
                  ? 45
                  : newStatus === "Testing"
                  ? 75
                  : 100,
            }
          : project
      )
    );
  };

  const openInAILab = (project: Project) => {
    localStorage.setItem("vstack_selected_project", JSON.stringify(project));
    localStorage.setItem("vstack_open_page", "ailab");
    window.location.reload();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>V-Stack Project System</p>
          <h1 style={styles.title}>Projects Dashboard</h1>
          <p style={styles.subtitle}>
            Build, track, test, and launch every DigiScope project from one dashboard.
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Total Projects" value={stats.total} />
        <StatCard label="Planning" value={stats.planning} />
        <StatCard label="Building" value={stats.building} />
        <StatCard label="Testing" value={stats.testing} />
        <StatCard label="Launched" value={stats.launched} />
      </div>

      <div style={styles.mainGrid}>
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Create New Project</h2>

          <input
            style={styles.input}
            placeholder="Project name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Project description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={styles.row}>
            <select
              style={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            >
              <option>Planning</option>
              <option>Building</option>
              <option>Testing</option>
              <option>Launched</option>
            </select>

            <select
              style={styles.select}
              value={priority}
              onChange={(e) => setPriority(e.target.value as ProjectPriority)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <label style={styles.label}>Progress: {progress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
          />

          <button style={styles.primaryButton} onClick={createProject}>
            + Add Project
          </button>
        </section>

        <section style={styles.panel}>
          <div style={styles.toolbar}>
            <input
              style={styles.search}
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              style={styles.filter}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "All" | ProjectStatus)
              }
            >
              <option>All</option>
              <option>Planning</option>
              <option>Building</option>
              <option>Testing</option>
              <option>Launched</option>
            </select>
          </div>

          <div style={styles.projectList}>
            {filteredProjects.length === 0 ? (
              <div style={styles.empty}>
                <h3>No projects yet</h3>
                <p>Create your first V-Stack project on the left.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} style={styles.projectCard}>
                  <div style={styles.projectTop}>
                    <div>
                      <h3 style={styles.projectName}>{project.name}</h3>
                      <p style={styles.projectDescription}>
                        {project.description || "No description added."}
                      </p>
                    </div>

                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div style={styles.badges}>
                    <span style={styles.badge}>{project.status}</span>
                    <span style={styles.badge}>{project.priority} Priority</span>
                    <span style={styles.badge}>Created {project.createdAt}</span>
                  </div>

                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>

                  <p style={styles.progressText}>{project.progress}% Complete</p>

                  <div style={styles.actions}>
                    <button
                      style={styles.smallButton}
                      onClick={() => updateStatus(project.id, "Planning")}
                    >
                      Planning
                    </button>
                    <button
                      style={styles.smallButton}
                      onClick={() => updateStatus(project.id, "Building")}
                    >
                      Building
                    </button>
                    <button
                      style={styles.smallButton}
                      onClick={() => updateStatus(project.id, "Testing")}
                    >
                      Testing
                    </button>
                    <button
                      style={styles.smallButtonGold}
                      onClick={() => updateStatus(project.id, "Launched")}
                    >
                      Launch
                    </button>
                    <button
                      style={styles.aiButton}
                      onClick={() => openInAILab(project)}
                    >
                      Open in AI Lab
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,0.18), transparent 35%), #050505",
    color: "white",
    padding: 28,
    fontFamily: "Inter, Arial, sans-serif",
  },
  header: { marginBottom: 24 },
  kicker: {
    color: "#d4af37",
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "uppercase",
    margin: 0,
  },
  title: { fontSize: 42, margin: "8px 0" },
  subtitle: { color: "#b8b8b8", fontSize: 16, maxWidth: 760 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(140px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "linear-gradient(180deg, #151515, #0b0b0b)",
    border: "1px solid rgba(212,175,55,0.28)",
    borderRadius: 20,
    padding: 20,
  },
  statLabel: { color: "#b8b8b8", margin: 0, fontSize: 13 },
  statValue: { color: "#d4af37", fontSize: 34, margin: "8px 0 0" },
  mainGrid: { display: "grid", gridTemplateColumns: "380px 1fr", gap: 22 },
  panel: {
    background: "rgba(12,12,12,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 22,
  },
  panelTitle: { marginTop: 0 },
  input: {
    width: "100%",
    padding: 14,
    marginBottom: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    padding: 14,
    marginBottom: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
    resize: "vertical",
    boxSizing: "border-box",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  select: {
    padding: 13,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
  },
  label: {
    display: "block",
    color: "#d4af37",
    fontWeight: 800,
    marginBottom: 8,
  },
  primaryButton: {
    width: "100%",
    marginTop: 18,
    padding: 15,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #d4af37, #ffdf6b)",
    color: "#050505",
    fontWeight: 900,
    cursor: "pointer",
  },
  toolbar: { display: "flex", gap: 12, marginBottom: 18 },
  search: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
  },
  filter: {
    width: 160,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
  },
  projectList: { display: "grid", gap: 16 },
  empty: {
    textAlign: "center",
    padding: 60,
    color: "#aaa",
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: 20,
  },
  projectCard: {
    background: "linear-gradient(180deg, #111, #070707)",
    border: "1px solid rgba(212,175,55,0.18)",
    borderRadius: 22,
    padding: 20,
  },
  projectTop: { display: "flex", justifyContent: "space-between", gap: 20 },
  projectName: { margin: 0, fontSize: 22 },
  projectDescription: { color: "#b8b8b8", marginTop: 8 },
  deleteButton: {
    height: 38,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,80,80,0.4)",
    background: "rgba(255,80,80,0.08)",
    color: "#ff7777",
    cursor: "pointer",
  },
  badges: { display: "flex", flexWrap: "wrap", gap: 8, margin: "16px 0" },
  badge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.1)",
    border: "1px solid rgba(212,175,55,0.24)",
    color: "#f4d46b",
    fontSize: 12,
    fontWeight: 700,
  },
  progressBar: {
    height: 12,
    borderRadius: 999,
    background: "#202020",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #d4af37, #fff1a6)",
  },
  progressText: { color: "#d4af37", fontWeight: 800, fontSize: 13 },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 },
  smallButton: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#101010",
    color: "white",
    cursor: "pointer",
  },
  smallButtonGold: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#d4af37",
    color: "#050505",
    fontWeight: 900,
    cursor: "pointer",
  },
  aiButton: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(212,175,55,0.4)",
    background: "rgba(212,175,55,0.12)",
    color: "#ffdf6b",
    fontWeight: 900,
    cursor: "pointer",
  },
};