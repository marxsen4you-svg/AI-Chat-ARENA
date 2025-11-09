import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic validation logs (for debugging OpenRouter issues)
console.log("[boot] NODE_ENV =", process.env.NODE_ENV || "development");
if (!process.env.OPENROUTER_API_KEY) {
  console.warn("[boot] Warning: OPENROUTER_API_KEY is not set. API calls will fail until configured.");
}

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// POST /api/chat
// Body: { messages: [...], model: "model-id" }
app.post("/api/chat", async (req, res) => {
  const { messages, model } = req.body || {};

  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: "messages array is required" });
  }
  if (!model) {
    return res.status(400).json({ error: "model is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
        "HTTP-Referer": "http://localhost:" + PORT,
        "X-Title": "OpenRouter Multi-Model Debate",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 512,
        temperature: 0.9
      })
    });

    const data = await response.json();

    // Logging for debugging likely failure sources
    console.log("[openrouter] status", response.status);
    if (!response.ok) {
      console.error("[openrouter] error response", data);
      return res.status(response.status).json({ error: "OpenRouter error", detail: data });
    }

    res.json(data);
  } catch (err) {
    console.error("[server] Error calling OpenRouter:", err);
    res.status(500).json({ error: "Server error contacting OpenRouter" });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
});