# Deploying Kairo.ai — Free & Live

This guide covers deploying Kairo.ai fully for free using:

- **Render** — for the WebSocket server (supports persistent connections on free tier)
- **Vercel** — for the Next.js frontend (best-in-class Next.js hosting, free tier)

---

## Architecture in Production

```
User Browser
     │
     ├── HTTPS ──────────► Vercel (Next.js frontend)
     │                          │
     └── WSS (WebSocket) ──► Render (Node.js WebSocket server)
                                    │
                                    └── Google Gemini API
```

> In production, WebSocket connections use `wss://` (secure) instead of `ws://`.

---

## Part 1 — Deploy the Server on Render

### Why Render?
Render's free tier supports long-running Node.js processes with persistent WebSocket connections. No cold-start killing your sockets.

### Steps

**1. Push your code to GitHub** (already done at `github.com/rajneeshverma1/Kairo.ai`)

**2. Go to [render.com](https://render.com) and sign up / log in**

**3. Create a new Web Service**
- Click **New → Web Service**
- Connect your GitHub account and select the `Kairo.ai` repo

**4. Configure the service**

| Setting | Value |
|---|---|
| Name | `kairo-server` |
| Root Directory | `server` |
| Runtime | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Instance Type | `Free` |

**5. Add environment variable**
- Go to **Environment** tab
- Add: `GEMINI_API_KEY` = `your_gemini_api_key_here`
- Render automatically injects `PORT` — your server already reads it

**6. Click Deploy**

Once deployed, Render gives you a URL like:
```
https://kairo-server.onrender.com
```

Your WebSocket URL will be:
```
wss://kairo-server.onrender.com
```

> Save this URL — you'll need it for the frontend.

---

## Part 2 — Deploy the Frontend on Vercel

### Why Vercel?
Vercel is built for Next.js. Zero config, instant deploys, free tier is generous.

### Steps

**1. Go to [vercel.com](https://vercel.com) and sign up / log in with GitHub**

**2. Import your project**
- Click **Add New → Project**
- Select the `Kairo.ai` repo

**3. Configure the project**

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Framework Preset | `Next.js` (auto-detected) |
| Build Command | `npm run build` |
| Output Directory | `.next` (default) |

**4. Add environment variable**
- Go to **Environment Variables**
- Add: `NEXT_PUBLIC_WS_URL` = `wss://kairo-server.onrender.com`
  *(replace with your actual Render URL from Part 1)*

**5. Click Deploy**

Vercel gives you a live URL like:
```
https://kairo-ai.vercel.app
```

---

## Part 3 — Final Check

Once both are deployed:

1. Open your Vercel URL in the browser
2. The status dot in the header should turn **orange** (connected)
3. Type a message — you should get a streaming response from Gemini

---

## Troubleshooting

**Status dot stays red (not connecting)**
- Double-check `NEXT_PUBLIC_WS_URL` in Vercel env vars — must start with `wss://` not `ws://`
- Make sure the Render service is running (check Render dashboard logs)
- Render free tier sleeps after 15 min of inactivity — first connection may take ~30s to wake up

**Render server sleeping**
- Free tier on Render spins down after 15 minutes of no traffic
- First user after idle will wait ~30 seconds for it to wake
- To avoid this: upgrade to Render's $7/mo paid tier, or use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your server URL every 10 minutes

**AI not responding**
- Check your `GEMINI_API_KEY` is set correctly in Render environment variables
- Check Render logs for any 429 (quota exceeded) errors

**Vercel build failing**
- Make sure Root Directory is set to `client` in Vercel project settings
- Run `npm run build` locally inside `client/` first to catch any build errors

---

## Summary

| Service | Platform | URL format | Cost |
|---|---|---|---|
| WebSocket Server | Render | `wss://your-app.onrender.com` | Free |
| Next.js Frontend | Vercel | `https://your-app.vercel.app` | Free |
