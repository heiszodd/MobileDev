# MobileDev — Mobile-First GitHub Codespaces Client

A touch-friendly web application that provides a mobile-optimized interface for GitHub Codespaces, featuring a terminal, code editor, and AI assistant—all designed for phones and tablets.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- GitHub account (for OAuth)

### 1. Clone and Install

```bash
cd apps/web
npm install

cd ../relay
npm install
```

### 2. Set Up Environment Variables

#### apps/web/.env.local
```bash
# GitHub OAuth — from https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_oauth_app_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_secret

# NextAuth secret — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000

# Google Gemini — from https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key

# Relay server
NEXT_PUBLIC_RELAY_URL=ws://localhost:3001

# Supabase (optional for now)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### apps/relay/.env
```bash
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000
GITHUB_API_URL=https://api.github.com
LOG_LEVEL=info
```

### 3. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Set:
   - **Application name:** MobileDev (local)
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:** http://localhost:3000/api/auth/callback/github
4. Copy the Client ID and Client Secret to `.env.local`

### 4. Run Locally

**Terminal 1 — Relay Server:**
```bash
cd apps/relay
npm install
npm start
# Should see: "Relay server listening on port 3001"
```

**Terminal 2 — Next.js App:**
```bash
cd apps/web
npm run dev
# Should see: "▲ Next.js 15.x ready on http://localhost:3000"
```

Visit http://localhost:3000 in your browser. On mobile, use your phone's browser or add to homescreen.

## 🏗️ Architecture

```
┌─ Your Phone ────────────────────┐
│  MobileDev Web App (Vercel)     │
│  • Terminal (xterm.js)          │
│  • Editor (CodeMirror 6)        │
│  • AI Chat (Gemini)             │
└──────────┬──────────────────────┘
           │ HTTPS + WebSocket
           ├──► GitHub API (REST)
           │    • List Codespaces
           │    • Start/stop
           │    • File ops
           │
           └──► Relay Server (Fly.io)
                • WebSocket ↔ SSH
                • Terminal I/O
                • Auth validation
                │
                └──► Your GitHub Codespace (SSH)
                     • Shell
                     • File system
```

## 📋 Build Order

Follow these steps in order:

1. **Next.js scaffold** — Done ✓
2. **Environment variables + Types** — Done ✓
3. **GitHub OAuth** — Done ✓
4. **Mobile layout components** — Done ✓
5. **Supabase connection** — Basic setup done, needs table schema
6. **Relay server (echo mode)** — Done ✓
7. **xterm.js integration** — Done ✓
8. **Mobile keyboard strip** — Done ✓
9. **SSH relay (real connection)** — Relay ready, needs testing
10. **Terminal resize + reconnect** — Implemented ✓
11. **GitHub Codespaces API** — Done ✓
12. **Dashboard page** — Done ✓
13. **Start/stop Codespaces** — API ready, UI pending
14. **Connect relay → specific Codespace** — Implemented ✓
15. **Session persistence** — Basic done, needs Supabase
16. **Gemini API setup** — Pending
17. **/api/ai streaming route** — Pending
18. **AI chat UI** — Pending
19. **Context injection** — Pending
20. **Code block copy** — Pending
21. **CodeMirror 6 setup** — Pending
22. **File tree** — Pending
23. **Open files in editor** — Pending
24. **Save files** — Pending
25. **PWA manifest** — Pending
26. **Error states** — Partially done
27. **Performance** — Pending
28. **Onboarding** — Pending

## 🧪 Testing Checklist

### Foundation
- [ ] `npm run dev` runs without errors
- [ ] App loads at http://localhost:3000
- [ ] GitHub login button works
- [ ] Redirect to /dashboard after login

### Terminal
- [ ] Relay connects to Codespace
- [ ] Terminal renders full screen
- [ ] Typing in terminal appears
- [ ] Mobile keyboard strip visible
- [ ] All escape sequence keys work
- [ ] Terminal survives page refresh

### Dashboard
- [ ] Lists all user's Codespaces
- [ ] Shows correct status (running/stopped)
- [ ] Connect button links to /editor/[id]
- [ ] Web button opens in GitHub

### Editor (Coming Soon)
- [ ] CodeMirror renders
- [ ] File tree loads
- [ ] Syntax highlighting works
- [ ] Save persists changes

## 📦 Deployment

### Deploy Relay to Fly.io

```bash
curl -L https://fly.io/install.sh | sh
fly auth login

cd apps/relay
fly launch --name mobiledev-relay --region lax

# Set secrets
fly secrets set ALLOWED_ORIGINS=https://yourdomain.com
fly secrets set GITHUB_API_URL=https://api.github.com

fly deploy
```

Get your relay URL from Fly:
```bash
fly status
# Copy the URL and update NEXT_PUBLIC_RELAY_URL
```

### Deploy Web to Vercel

```bash
cd apps/web

# Connect to Vercel
vercel

# Set environment variables in Vercel dashboard:
# - GITHUB_CLIENT_ID
# - GITHUB_CLIENT_SECRET
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL (your Vercel domain)
# - GEMINI_API_KEY
# - NEXT_PUBLIC_RELAY_URL (your Fly.io relay)
```

## 🔑 Environment Variables Reference

| Variable | Where | Purpose | Example |
|---|---|---|---|
| `GITHUB_CLIENT_ID` | .env.local | OAuth app ID | `abc123def456` |
| `GITHUB_CLIENT_SECRET` | .env.local | OAuth app secret | `ghu_...` |
| `NEXTAUTH_SECRET` | .env.local | Session encryption | `base64string` |
| `NEXTAUTH_URL` | .env.local | App URL for OAuth callback | `http://localhost:3000` |
| `GEMINI_API_KEY` | .env.local | Google Gemini API key | `AIza...` |
| `NEXT_PUBLIC_RELAY_URL` | .env.local | WebSocket relay address | `ws://localhost:3001` |
| `NEXT_PUBLIC_SUPABASE_URL` | .env.local | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | .env.local | Supabase anonymous key | `eyJhbG...` |
| `PORT` | .env (relay) | Relay listen port | `3001` |
| `ALLOWED_ORIGINS` | .env (relay) | CORS whitelist | `http://localhost:3000` |
| `LOG_LEVEL` | .env (relay) | Logging verbosity | `info` |

## 🚫 Common Issues

### "Failed to connect to relay"
- Check if relay server is running on port 3001
- Verify `NEXT_PUBLIC_RELAY_URL` matches relay address
- Check browser console for WebSocket errors

### "Invalid GitHub token"
- Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env.local
- Make sure token has `codespace` scope
- Sign out and sign back in

### xterm.js errors in Next.js
- These components use `dynamic()` with `ssr: false`
- Check that imports use absolute paths from `@/`

### Terminal not responsive
- Check that relay is connected (green dot should appear)
- Look at relay logs: `fly logs -a mobiledev-relay`
- Try reloading the page

## 🛠️ Development Commands

```bash
# Web app
cd apps/web
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm start          # Run production build
npm run lint       # Check code quality

# Relay server
cd apps/relay
npm start          # Start relay (port 3001)
npm run dev        # Start with nodemon

# Full stack (from root)
# In one terminal:
(cd apps/relay && npm start)
# In another:
(cd apps/web && npm run dev)
```

## 📱 Mobile Testing

### iPhone
1. Open Safari
2. Visit http://your-local-ip:3000
3. Share → Add to Home Screen
4. Launch app
5. Test on WiFi first, then 4G/5G

### Android
1. Open Chrome
2. Visit http://your-local-ip:3000
3. Menu → Install app
4. Launch app

Note: WebSocket may not work on cellular. Use WiFi for development.

## 🔒 Security Notes

- **GitHub tokens** never leave the server. They stay in NextAuth sessions.
- **User code** is never stored. Only preferences stored in Supabase (optional).
- **Terminal output** is NOT logged or stored anywhere.
- **SSH connections** are direct from relay to GitHub's infrastructure.

## 🤝 Contributing

This is a personal project, but if you find bugs or have suggestions, feel free to open an issue on GitHub.

## 📄 License

MIT

---

**Built with:**
- Next.js 14 | TypeScript | Tailwind CSS
- xterm.js | CodeMirror 6 | NextAuth.js
- Vercel | Fly.io | Supabase
- Google Gemini | GitHub APIs

**Questions?** Check the `.github/copilot-instructions.md` for detailed architecture docs.
