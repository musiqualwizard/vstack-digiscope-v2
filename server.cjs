const express = require("express");
const cors = require("cors");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

let secureVault = {
  openai: null,
  elevenlabs: null,
  kling: null,
  vidu: null,
  firebase: null,
  googlecloud: null,
  stripe: null,
  custom: null,
};

let analytics = {
  projects: 0,
  aiCalls: 0,
  apiHits: 0,
  errors: 0,
};

const maskKey = (key) => {
  if (!key) return "";
  if (key.length <= 10) return "••••••••";
  return `${key.slice(0, 6)}••••••••••••${key.slice(-4)}`;
};

const normalizeProvider = (provider) => {
  return String(provider || "").toLowerCase().replace(/\s+/g, "");
};

app.get("/", (req, res) => {
  res.send("V-Stack backend is running");
});

app.get("/api/analytics", (req, res) => {
  res.json(analytics);
});

app.post("/api/analytics/track", (req, res) => {
  const { type } = req.body;

  if (type === "ai") analytics.aiCalls += 1;
  if (type === "api") analytics.apiHits += 1;
  if (type === "error") analytics.errors += 1;
  if (type === "project") analytics.projects += 1;

  res.json(analytics);
});

app.get("/api/vault/list", (req, res) => {
  const items = Object.entries(secureVault)
    .filter(([, value]) => Boolean(value))
    .map(([provider, key]) => ({
      provider,
      maskedKey: maskKey(key),
      status: "Active",
      savedAt: new Date().toLocaleString(),
    }));

  res.json({ items });
});

app.post("/api/vault/save", (req, res) => {
  const { provider, key } = req.body;

  if (!provider || !key) {
    analytics.errors += 1;
    return res.status(400).json({ message: "Missing provider or key." });
  }

  const cleanProvider = normalizeProvider(provider);
  secureVault[cleanProvider] = key;
  analytics.apiHits += 1;

  console.log(`🔐 Saved ${cleanProvider} key to backend vault`);

  res.json({
    message: "Key saved securely to backend vault.",
    provider: cleanProvider,
    maskedKey: maskKey(key),
    status: "Active",
    savedAt: new Date().toLocaleString(),
  });
});

app.delete("/api/vault/delete/:provider", (req, res) => {
  const provider = normalizeProvider(req.params.provider);

  if (!secureVault[provider]) {
    analytics.errors += 1;
    return res.status(404).json({ message: "Provider key not found." });
  }

  secureVault[provider] = null;
  analytics.apiHits += 1;

  res.json({ message: `${provider} key removed from vault.` });
});

app.post("/api/ai/run", async (req, res) => {
  const { prompt, mode } = req.body;
  const OPENAI_API_KEY = secureVault.openai;

  try {
    if (!prompt) {
      analytics.errors += 1;
      return res.status(400).json({ output: "Missing prompt." });
    }

    if (!OPENAI_API_KEY) {
      analytics.errors += 1;
      return res.status(400).json({
        output: "No OpenAI key found. Add your OpenAI key in API Vault first.",
      });
    }

    analytics.aiCalls += 1;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Nova, an elite ${
              mode || "General Assistant"
            } inside V-Stack by DigiScope LLC. Give clear, powerful, copy-and-paste-ready answers.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      analytics.errors += 1;
      return res.status(response.status).json({
        output: data.error?.message || "OpenAI request failed.",
      });
    }

    res.json({
      output: data.choices?.[0]?.message?.content || "No response from AI.",
    });
  } catch (err) {
    analytics.errors += 1;
    console.error("SERVER ERROR:", err);

    res.status(500).json({
      output: "Backend error. Check your terminal.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 V-Stack backend running on http://localhost:${PORT}`);
});