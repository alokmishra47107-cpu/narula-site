# Narula Website (GitHub-ready)

This repo includes:
- `index.html`, `style.css` (frontend)
- `server.js` (Node/Express server)
- `assets/` (put images/videos here)

## Run locally (before deploying)
1) Install Node.js (LTS)
2) In this folder:
```bash
npm install
npm start
```
Open: http://localhost:3000

## Deploy FREE (recommended): GitHub + Render
GitHub will store code. Render will run the Node server for free.

### A) Upload to GitHub
1) Create a new repo on GitHub (example name: `narula-site`)
2) In terminal inside this folder:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/narula-site.git
git push -u origin main
```

### B) Make it live on Render (free subdomain)
1) Go to Render -> New -> Web Service
2) Connect your GitHub, choose `narula-site`
3) Settings:
   - Build command: `npm install`
   - Start command: `npm start`
4) Add Environment Variables:
   - `SMTP_USER` = your Gmail address
   - `SMTP_PASS` = Gmail App Password (not your normal password)
   - `TO_EMAIL`  = where to receive messages (optional)

Then Render gives you a live URL like:
`https://narula-site.onrender.com`
