<div align="center">

# Kairo.ai

**A real-time AI chat app built with Next.js, WebSockets, and Google Gemini.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-WebSocket-green?logo=node.js)](https://nodejs.org)

</div>

---

## What is Kairo.ai?

Kairo.ai is a clean, minimal chat interface where you talk to Google Gemini in real time. Messages stream in token by token — no waiting for the full response. You can run multiple chat sessions at once, interrupt the AI mid-response, and switch between dark and light mode.

---

## Features

- Token-by-token streaming responses from Gemini
- Multiple chat sessions in one window
- Interrupt the AI anytime by sending a new message
- Auto-reconnects if the connection drops
- Dark / Light / System theme switcher

---

## Tech Stack

- **Frontend** — Next.js 16, React 19, Tailwind CSS, Framer Motion
- **Backend** — Node.js, TypeScript, WebSocket (`ws`)
- **AI** — Google Gemini API (`gemini-2.0-flash`)

---

## Quick Start

You need **Node.js 18+** and a **Gemini API key** from [aistudio.google.com](https://aistudio.google.com/apikey).

**1. Clone**
```bash
git clone https://github.com/rajneeshverma1/Kairo.ai.git
cd Kairo.ai
```

**2. Start the server**
```bash
cd server
npm install
cp .env.example .env        # then add your GEMINI_API_KEY inside .env
npm run build
npm start
```

**3. Start the client** *(new terminal)*
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000` and start chatting.

> For a detailed setup guide see [GETTING_STARTED.md](./GETTING_STARTED.md)

---

## Project Structure

```
Kairo.ai/
├── client/          # Next.js frontend
└── server/          # Node.js WebSocket + Gemini backend
```

---

## License

MIT © [Rajneesh Verma](https://github.com/rajneeshverma1)
