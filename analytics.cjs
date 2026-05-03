const express = require("express");
const router = express.Router();

let analytics = {
  projects: 0,
  aiCalls: 0,
  apiHits: 0,
  errors: 0,
};

router.get("/", (req, res) => {
  res.json(analytics);
});

router.post("/project", (req, res) => {
  analytics.projects += 1;
  res.json({ success: true, analytics });
});

router.post("/ai", (req, res) => {
  analytics.aiCalls += 1;
  res.json({ success: true, analytics });
});

router.post("/api", (req, res) => {
  analytics.apiHits += 1;
  res.json({ success: true, analytics });
});

router.post("/error", (req, res) => {
  analytics.errors += 1;
  res.json({ success: true, analytics });
});

module.exports = router;