# i.AM Vault - Quick Deploy Guide

## Deploy to Firebase Hosting (On-the-Go Access)

### One-Time Setup

```bash
cd /Users/sabiqahmed/Downloads/iam_mail/i.am-vault

# Initialize Firebase
firebase login  # If not already logged in
firebase init hosting

# When prompted:
# - Use existing project: iammail-a2c4d
# - Public directory: . (current directory)
# - Single-page app: Yes
# - Set up automatic builds: No
# - Overwrite index.html: No
```

### Deploy

```bash
firebase deploy --only hosting
```

**Your app will be live at:**
- https://iammail-a2c4d.web.app/vault (or subdomain)

### Install as PWA

Once deployed:
1. **On Phone**: Visit the URL → "Add to Home Screen"
2. **On Desktop**: Visit URL → Click install icon (⊕) in address bar

### Update Gemini API Key

The API key is currently in the HTML. For security, you might want to use environment variables, but for a personal app it's fine as-is.

---

## Alternative: Vercel (Even Easier)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /Users/sabiqahmed/Downloads/iam_mail/i.am-vault
vercel

# Follow prompts:
# - Set up new project: Yes
# - Name: i-am-vault
# - Deploy: Yes
```

**Live in 30 seconds!** Vercel gives you a URL like: `i-am-vault.vercel.app`

---

## Super Quick: GitHub Pages

1. Create repo: `github.com/rayzenfzc/i-am-vault`
2. Push code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```
3. Enable GitHub Pages in repo settings
4. Live at: `rayzenfzc.github.io/i-am-vault`

---

**Recommended:** Use Vercel for fastest deployment!
