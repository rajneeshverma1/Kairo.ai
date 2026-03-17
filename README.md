<p align="center">
  <img src="https://img.shields.io/badge/Kairo.ai-WebSocket%20%2B%20Gemini-orange?style=for-the-badge" alt="Kairo.ai" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Node.js-WebSocket-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

<h1 align="center">Kairo.ai</h1>
<p align="center">A real-time AI chat interface powered by Google Gemini, built with Next.js and WebSockets.</p>

---

## Overview

Kairo.ai is a minimal, fast, real-time chat application where every message streams directly from Google Gemini to your browser over a persistent WebSocket connection. No polling, no REST — just raw bidirectional communication.

The UI is built with a terminal/system aesthetic — dark by default, with smooth streaming animations and multi-session tab support.

---

## Features

- **Real-time streaming** — AI responses stream token by token as they're generated
- **Multi-session tabs** — open multiple independent chat sessions simultaneously
- **Interrupt & resume** — send a new message mid-stream to interrupt the AI
- **Auto-reconnect** — client automatically reconnects if the WebSocket drops
- **Dark / Light / System theme** — persistent theme switcher built in
- **Idle detection** — server pings after 30s of inactivity

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, TypeScript, `ws` WebSocket server |
| AI | Google Gemini API (`@google/genai`) |
| Styling | Tailwind CSS, Radix UI, Lucide Icons |

---

## Project Structure

```
Kairo.ai/
├── client/               # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # UI components (ChatWindow, MessageBubble, etc.)
│   ├── hooks/            # useWebSocket hook
│   └── types/            # Shared TypeScript types
│
└── server/               # Node.js WebSocket server
    └── src/
        ├── index.ts      # WebSocket server entry
        ├── ai.ts         # Gemini API streaming integration
        ├── types.ts      # Message types
        └── utils/        # ConversationManager
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/rajneeshverma1/Kairo.ai.git
cd Kairo.ai
```

### 2. Server setup

```bash
cd server
npm install
cp .env.example .env
# Add your Gemini API key to .env:
# GEMINI_API_KEY=your_key_here
npm run dev
```

Server starts on `ws://localhost:8081`.

### 3. Client setup

```bash
cd client
npm install
npm run dev
```

Client starts on `http://localhost:3000`.

---

## Environment Variables

Create `server/.env` based on `server/.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## License

MIT © [Rajneesh Verma](https://github.com/rajneeshverma1)
