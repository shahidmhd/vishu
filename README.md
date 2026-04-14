# 🌸 Vishu Festival — Interactive Greeting Website

A visually rich, interactive Vishu festival greeting built with **Next.js 16** (App Router), **Tailwind CSS**, and **Framer Motion**.

## ✨ Features

- **Kerala-themed dark background** with starfield, Nilavilakku lamps, and hanging Konna flower branches
- **Interactive gift box** — click to trigger a burst animation and reveal the greeting
- **Canvas-based burst particles** — stars, petals, and circles explode out on open
- **Floating petals** ambient animation (always on)
- **Festive melody** via Web Audio API (no audio file needed) — toggle with the music button
- **Shimmer gold text** reveal with CSS animations
- **Framer Motion** spring animations throughout
- **Replay button** to re-open the gift
- Fully **responsive** (mobile + desktop)
- **Static export** — ready for GitHub Pages

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → Open http://localhost:3000
```

## 📦 Build for Production

```bash
npm run build
# Output is in ./out/ — a fully static site
```

## 🌐 Deploy to GitHub Pages

### Option A — GitHub Actions (recommended)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set **Source** to `GitHub Actions`
4. The `.github/workflows/deploy.yml` workflow will build and deploy automatically on every push to `main`

### Option B — Manual deploy

```bash
npm run build                    # generates ./out
npx gh-pages -d out             # push out/ to gh-pages branch
```
Then in GitHub Settings → Pages, set Source to `gh-pages` branch / root.

### ⚠️ If deploying to a project repo (not user root)

Uncomment these lines in `next.config.js` and set your repo name:

```js
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name/',
```

---

## 📁 Project Structure

```
vishu/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   ├── globals.css         # Tailwind + custom animations
│   └── components/
│       ├── Background.tsx  # Stars, Konna branches, lamps, arch
│       ├── GiftBox.tsx     # Interactive gift box + reveal message
│       ├── Particles.tsx   # Canvas burst + ambient floating petals
│       └── MusicToggle.tsx # Web Audio API festive melody
├── public/
│   └── .nojekyll           # GitHub Pages: disable Jekyll processing
├── .github/workflows/
│   └── deploy.yml          # CI/CD → GitHub Pages
├── next.config.js          # output: 'export' config
├── tailwind.config.ts
└── package.json
```

---

## 🎨 Customisation

| What | Where |
|---|---|
| Change recipient name | `app/components/GiftBox.tsx` — edit `"Happy Vishu Shanu 💛"` |
| Change greeting message | `GiftBox.tsx` — edit the `<motion.p>` paragraph |
| Adjust colors | `tailwind.config.ts` → `kerala` color palette |
| Background intensity | `Background.tsx` — star count, glow opacity |
| Particle count | `GiftBox.tsx` → `<BurstParticles count={100} />` |
| Melody notes | `MusicToggle.tsx` → `MELODY_NOTES` array |

---

Made with ❤️ for Vishu
