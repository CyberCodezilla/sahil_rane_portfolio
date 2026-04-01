# Portfolio (static site)

This repository contains a simple static portfolio site (index.html, styles.css, script.js) ready to push to GitHub and deploy on Vercel.

## Files
- `index.html`
- `styles.css`
- `script.js`

## Quick setup & push to GitHub
Run these commands locally from the project root to push these files into the remote repo `https://github.com/CyberCodezilla/sahil_rane_portfolio`:

```bash
# initialize (if not already a git repo)
git init
git add .
git commit -m "Initial commit: add portfolio site"
# ensure main branch
git branch -M main
# add the remote (replace URL if needed)
git remote add origin https://github.com/CyberCodezilla/sahil_rane_portfolio.git
# push
git push -u origin main
```

Note: If you already have a remote with a different name or branch, adjust the commands. You'll need appropriate GitHub permissions and to authenticate (via HTTPS credentials or SSH key).

## Deploy to Vercel
Option A — Use Vercel dashboard (recommended quick path):
1. Go to https://vercel.com/import
2. Select "Import Git Repository" and choose `CyberCodezilla/sahil_rane_portfolio` (or paste the repo URL).
3. Use default settings — Vercel will detect a static site and deploy.

Option B — Use Vercel CLI:

```bash
# install CLI if needed
npm i -g vercel
vercel login
# run from project root
vercel --prod
```

Vercel will publish the site and provide a production URL.

## Notes
- A minimal `vercel.json` is included to force static handling.
- `.gitignore` already excludes common local-only files such as `.vercel/`, `.env`, and `node_modules/`.
