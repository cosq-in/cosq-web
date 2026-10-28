# CosQ Builds (builds.cosq.in)

A static, dependency-free site: `index.html`, `styles.css`, `main.js` and `icon.png`.
No build step.

## Deploy on Vercel (builds.cosq.in)

1. New Project, import `cosq-in/cosq-web`.
2. **Root Directory:** `builds`
3. **Framework Preset:** Other. Leave Build Command and Output Directory empty.
4. Settings, Domains: add `builds.cosq.in` (CNAME to `cname.vercel-dns.com`).

This is a separate Vercel project from the main cosq.in one, which keeps building the React app at the repo root.

## Run locally

```
cd builds
python3 -m http.server 8080
```
