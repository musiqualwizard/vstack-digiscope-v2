import { useEffect, useMemo, useState } from "react";

type ApiStatus = "Active" | "Testing" | "Disabled";
type ApiCategory = "AI" | "Video" | "Voice" | "Database" | "Payments" | "Other";

type ApiKeyItem = {
  id: string;
  provider: string;
  label: string;
  apiKey: string;
  category: ApiCategory;
  status: ApiStatus;
  createdAt: string;
};

const STORAGE_KEY = "vstack_api_vault";

export default function APIVault() {
  const [items, setItems] = useState<ApiKeyItem[]>([]);
  const [provider, setProvider] = useState("OpenAI");
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [category, setCategory] = useState<ApiCategory>("AI");
  const [status, setStatus] = useState<ApiStatus>("Testing");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | ApiCategory>("All");
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem("vstack_api_count", String(items.length));
    localStorage.setItem(
      "vstack_active_api_count",
      String(items.filter((i) => i.status === "Active").length)
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.provider.toLowerCase().includes(search.toLowerCase()) ||
        item.label.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || item.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  const stats = {
    total: items.length,
    active: items.filter((i) => i.status === "Active").length,
    testing: items.filter((i) => i.status === "Testing").length,
    disabled: items.filter((i) => i.status === "Disabled").length,
  };

  const track = (key: string) => {
    const current = Number(localStorage.getItem(key) || 0);
    localStorage.setItem(key, String(current + 1));
  };

  const saveKeyToBackend = async (providerName: string, key: string) => {
    const backendProvider =
      providerName.toLowerCase() === "openai" ? "openai" : providerName.toLowerCase();

    const res = await fetch("http://localhost:5000/api/vault/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: backendProvider,
        key,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to save key to backend.");
    }

    return data;
  };

  const addApiKey = async () => {
    if (!provider.trim() || !apiKey.trim()) return;

    setMessage("Saving API key...");

    try {
      await saveKeyToBackend(provider, apiKey);
      track("vstack_api_calls");

      const newItem: ApiKeyItem = {
        id: crypto.randomUUID(),
        provider,
        label: label || `${provider} Key`,
        apiKey,
        category,
        status: "Active",
        createdAt: new Date().toLocaleString(),
      };

      setItems([newItem, ...items]);

      setProvider("OpenAI");
      setLabel("");
      setApiKey("");
      setCategory("AI");
      setStatus("Testing");
      setMessage("API key saved to backend vault successfully.");
    } catch (error) {
      track("vstack_errors");
      setMessage(
        "Could not save key to backend. Make sure backend is running on localhost:5000."
      );
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateStatus = (id: string, newStatus: ApiStatus) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const testApi = async (item: ApiKeyItem) => {
    try {
      await saveKeyToBackend(item.provider, item.apiKey);
      track("vstack_api_calls");

      setItems(
        items.map((api) =>
          api.id === item.id ? { ...api, status: "Active" } : api
        )
      );

      setMessage(`${item.provider} key connected to backend successfully.`);
    } catch (error) {
      track("vstack_errors");
      setMessage("API test failed. Check backend terminal.");
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return `${key.slice(0, 4)}••••••••••••${key.slice(-4)}`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>V-Stack Secure Layer</p>
          <h1 style={styles.title}>API Vault</h1>
          <p style={styles.subtitle}>
            Store, organize, test, and connect every API key used inside DigiScope V-Stack.
          </p>
        </div>

        <div style={styles.statusBox}>
          <span style={styles.statusDot}></span>
          Backend Vault Ready
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Total APIs" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Testing" value={stats.testing} />
        <StatCard label="Disabled" value={stats.disabled} />
      </div>

      {message && <div style={styles.messageBox}>{message}</div>}

      <div style={styles.mainGrid}>
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Add API Key</h2>

          <label style={styles.label}>Provider</label>
          <select
            style={styles.input}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option>OpenAI</option>
            <option>ElevenLabs</option>
            <option>Kling</option>
            <option>Vidu</option>
            <option>Firebase</option>
            <option>Google Cloud</option>
            <option>Stripe</option>
            <option>Custom</option>
          </select>

          <label style={styles.label}>Label</label>
          <input
            style={styles.input}
            placeholder="Example: Main OpenAI Key"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <label style={styles.label}>API Key</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Paste API key here..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <div style={styles.row}>
            <div>
              <label style={styles.label}>Category</label>
              <select
                style={styles.input}
                value={category}
                onChange={(e) => setCategory(e.target.value as ApiCategory)}
              >
                <option>AI</option>
                <option>Video</option>
                <option>Voice</option>
                <option>Database</option>
                <option>Payments</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>Status</label>
              <select
                style={styles.input}
                value={status}
                onChange={(e) => setStatus(e.target.value as ApiStatus)}
              >
                <option>Testing</option>
                <option>Active</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>

          <button style={styles.primaryButton} onClick={addApiKey}>
            + Save API Key To Vault
          </button>

          <p style={styles.warning}>
            This connects the key to your backend while also saving a local dashboard copy.
            Next upgrade will encrypt and save it in a database.
          </p>
        </section>

        <section style={styles.panel}>
          <div style={styles.toolbar}>
            <input
              style={styles.search}
              placeholder="Search APIs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              style={styles.filter}
              value={filter}
              onChange={(e) => setFilter(e.target.value as "All" | ApiCategory)}
            >
              <option>All</option>
              <option>AI</option>
              <option>Video</option>
              <option>Voice</option>
              <option>Database</option>
              <option>Payments</option>
              <option>Other</option>
            </select>
          </div>

          <div style={styles.list}>
            {filteredItems.length === 0 ? (
              <div style={styles.empty}>
                <h3>No API keys saved yet</h3>
                <p>Add your OpenAI key on the left, then AI Lab can use it.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.apiName}>{item.provider}</h3>
                      <p style={styles.apiLabel}>{item.label}</p>
                    </div>

                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div style={styles.keyBox}>
                    <span>
                      {visibleKeys[item.id] ? item.apiKey : maskKey(item.apiKey)}
                    </span>

                    <button
                      style={styles.smallButton}
                      onClick={() =>
                        setVisibleKeys({
                          ...visibleKeys,
                          [item.id]: !visibleKeys[item.id],
                        })
                      }
                    >
                      {visibleKeys[item.id] ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div style={styles.badges}>
                    <span style={styles.badge}>{item.category}</span>
                    <span style={styles.badge}>{item.status}</span>
                    <span style={styles.badge}>Created {item.createdAt}</span>
                  </div>

                  <div style={styles.actions}>
                    <button
                      style={styles.smallButton}
                      onClick={() => updateStatus(item.id, "Testing")}
                    >
                      Testing
                    </button>

                    <button
                      style={styles.smallButtonGold}
                      onClick={() => updateStatus(item.id, "Active")}
                    >
                      Active
                    </button>

                    <button
                      style={styles.smallButton}
                      onClick={() => updateStatus(item.id, "Disabled")}
                    >
                      Disable
                    </button>

                    <button
                      style={styles.smallButtonGold}
                      onClick={() => testApi(item)}
                    >
                      Connect To Backend
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

  header: {
    marginBottom: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
  },

  kicker: {
    color: "#d4af37",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: 0,
  },

  title: {
    fontSize: 42,
    margin: "8px 0",
  },

  subtitle: {
    color: "#b8b8b8",
    fontSize: 16,
    maxWidth: 780,
  },

  statusBox: {
    padding: "12px 16px",
    borderRadius: 999,
    background: "rgba(12,12,12,0.9)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#d4af37",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: 10,
    whiteSpace: "nowrap",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#31ff7a",
    boxShadow: "0 0 14px #31ff7a",
  },

  messageBox: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 16,
    background: "rgba(212,175,55,0.1)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#ffdf6b",
    fontWeight: 800,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(140px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },

  statCard: {
    background: "linear-gradient(180deg, #151515, #0b0b0b)",
    border: "1px solid rgba(212,175,55,0.28)",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 0 28px rgba(212,175,55,0.08)",
  },

  statLabel: {
    color: "#b8b8b8",
    margin: 0,
    fontSize: 13,
  },

  statValue: {
    color: "#d4af37",
    fontSize: 34,
    margin: "8px 0 0",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "390px 1fr",
    gap: 22,
  },

  panel: {
    background: "rgba(12,12,12,0.92)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },

  panelTitle: {
    marginTop: 0,
    color: "#f5f5f5",
  },

  label: {
    display: "block",
    color: "#d4af37",
    fontWeight: 800,
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },

  primaryButton: {
    width: "100%",
    marginTop: 20,
    padding: 15,
    borderRadius: 16,
    border: "none",
    background: "linear-gradient(135deg, #d4af37, #ffdf6b)",
    color: "#050505",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 15,
  },

  warning: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 1.5,
  },

  toolbar: {
    display: "flex",
    gap: 12,
    marginBottom: 18,
  },

  search: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
    outline: "none",
  },

  filter: {
    width: 160,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#080808",
    color: "white",
  },

  list: {
    display: "grid",
    gap: 16,
  },

  empty: {
    textAlign: "center",
    padding: 60,
    color: "#aaa",
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: 20,
  },

  card: {
    background: "linear-gradient(180deg, #111, #070707)",
    border: "1px solid rgba(212,175,55,0.18)",
    borderRadius: 22,
    padding: 20,
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
  },

  apiName: {
    margin: 0,
    fontSize: 22,
  },

  apiLabel: {
    color: "#b8b8b8",
    marginTop: 6,
  },

  deleteButton: {
    height: 38,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,80,80,0.4)",
    background: "rgba(255,80,80,0.08)",
    color: "#ff7777",
    cursor: "pointer",
  },

  keyBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    background: "#050505",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#e8e8e8",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    wordBreak: "break-all",
  },

  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "16px 0",
  },

  badge: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.1)",
    border: "1px solid rgba(212,175,55,0.24)",
    color: "#f4d46b",
    fontSize: 12,
    fontWeight: 700,
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },

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
};