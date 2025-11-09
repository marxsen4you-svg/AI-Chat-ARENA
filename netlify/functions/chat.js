import fetch from "node-fetch";

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { messages, model } = JSON.parse(event.body);

    if (!Array.isArray(messages) || !messages.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "messages array is required" })
      };
    }
    if (!model) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "model is required" })
      };
    }

    // Get API key from header
    const apiKey = event.headers["x-api-key"] || "";

    if (!apiKey) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "API key required. Please provide your OpenRouter API key." })
      };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": event.headers.origin || event.headers.referer || "https://ai-chat-arena.netlify.app",
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

    if (!response.ok) {
      console.error("[openrouter] error response", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "OpenRouter error", detail: data })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error("[function] Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error contacting OpenRouter" })
    };
  }
}
