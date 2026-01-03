# i.AM Vault - Setup Guide

## What Is This?

i.AM Vault is your **Design Library + Visual Token Editor** - a PWA (Progressive Web App) that lets you:
- Store design screenshots and code
- Edit design tokens visually
- Track projects
- Deploy designs with one click

## Quick Start

### 1. Install Dependencies ✅ (Already Done)
```bash
npm install --legacy-peer-deps
```

### 2. Add Your Gemini API Key
Edit `.env.local`:
```bash
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 3. Run Locally
```bash
npm run dev
```

Opens at: http://localhost:3000

### 4. Install as PWA
- **Chrome/Edge:**
  1. Click the install icon (⊕) in the address bar
  2. Click "Install"

- **Safari (Mac):**
  1. File → Add to Dock
  2. Or share → Add to Home Screen (iOS)

- **Mobile:**
  1. Open in browser
  2. "Add to Home Screen"

---

## PWA Features ✨

### Offline Mode
- Works without internet (after first load)
- Caches Gemini AI responses
- Stores designs locally

### Installable
- Appears like a native app
- On desktop dock/Start menu
- On mobile home screen

### Auto-Updates
- New versions install automatically
- Always stays current

---

## Project Structure

```
i.am-vault/
├── components/         # React components
├── index.html         # Main HTML (single page)
├── index.tsx          # React entry point
├── vite.config.ts     # Vite + PWA config
├── .env.local         # API keys (NEVER commit)
└── package.json       # Dependencies
```

---

## Integration with i.AM Mail

### Connect Projects
1. Run i.AM Vault
2. Add "i.AM Mail" as a project
3. Link to:
   - Repository: `/Users/sabiqahmed/Downloads/iam_mail`
   - Design tokens: `/iam_mail/client/src/design-tokens.ts`
   - Deployment: https://iammail-a2c4d.web.app

### Workflow
```
Design in Vault → Export tokens → 
Update i.AM Mail design-tokens.ts →
Run one-click-deploy.sh → Live!
```

---

## Build for Production

```bash
# Build PWA
npm run build

# Preview build
npm run preview

# Deploy to Firebase
firebase init hosting
firebase deploy --only hosting
```

---

## PWA Configuration

**Configured in `vite.config.ts`:**

- ✅ Auto-updates when new version available
- ✅ Caches all assets (JS, CSS, images)
- ✅ Caches Gemini API responses (24 hours)
- ✅ Offline-first for speed
- ✅ Custom icons (192x192, 512x512)
- ✅ Dark theme (#0f0f23 background)
- ✅ Light blue accent (#89b4fa)

---

## Next Steps

1. **Test the app**: `npm run dev`
2. **Add your Gemini API key** in `.env.local`
3. **Install it as PWA** (click install icon)
4. **Upload first design** (screenshot + code)
5. **Create i.AM Mail project** in the tracker

---

## Troubleshooting

**"PWA not installing"**
- Must be HTTPS (or localhost)
- Try: Firefox, Chrome, or Edge
- Check browser console for errors

**"Gemini API not working"**
- Verify API key in `.env.local`
- Check API key has permissions enabled
- Restart dev server after changing .env

**"App not loading"**
- Check port 3000 is available
- Try: `npm run dev -- --port 3001`
- Clear browser cache

---

**Status: Ready to run!** 🚀

Run: `npm run dev` and open http://localhost:3000
