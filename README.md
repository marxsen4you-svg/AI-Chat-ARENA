# OpenRouter Multi-Model Infinite Debate

Web app that lets you:
- Select multiple OpenRouter models.
- Assign each model a persona.
- Pick a subject.
- Watch them debate it continuously via a minimal Node/Express proxy.

## Features

- Multi-participant debate loop (infinite until you press Stop).
- Per-participant:
  - Model selection (pre-filled popular OpenRouter routes).
  - Persona label.
- Subject + optional global system prompt.
- Adjustable delay between turns.
- Backend proxy for OpenRouter:
  - Keeps your `OPENROUTER_API_KEY` on the server (not exposed to browser).
  - Logs status codes and error payloads for debugging.
- Debug panel in the UI to inspect:
  - `/api/chat` status and response body.
  - Loop control events.
  - Common failure modes.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in the project root:

   ```bash
   OPENROUTER_API_KEY=your_api_key_here
   PORT=3000
   ```

3. Run the server:

   ```bash
   npm run dev
   ```

4. Open:

   - http://localhost:3000

## How It Works

- Frontend (`public/index.html`):
  - Renders controls for:
    - Subject
    - System prompt
    - Participant list (model + persona)
    - Loop delay
    - Start / Stop
    - Debug logs toggle
  - Maintains:
    - `state.participants`
    - `state.history` (recent turns)
    - `state.running` and `state.inFlight` (prevents overlapping calls)
  - Each loop:
    - Picks next participant round-robin.
    - Builds messages:
      - System message (rules + subject).
      - Condensed history.
      - A short system hint targeting the current participant/persona.
    - Calls `POST /api/chat` with `{ model, messages }`.
    - Appends response to UI and history.
    - Schedules next turn after configured delay.

- Backend (`server.js`):
  - Serves static frontend from `public/`.
  - Exposes `POST /api/chat`:
    - Uses `OPENROUTER_API_KEY` from `.env`.
    - Forwards to `https://openrouter.ai/api/v1/chat/completions`.
    - Returns JSON response or structured error.
    - Logs:
      - Boot-time env info.
      - OpenRouter HTTP status and error payloads.

## Notes

- This is intentionally simple: no database, no auth.
- To change available models:
  - Edit the `DEFAULT_MODELS` array in `public/index.html`.
- To prevent runaway API cost:
  - Use a larger delay between turns.
  - Or stop the debate manually with the Stop button.# AI-Chat-ARENA
