# ToolBox DZ

ToolBox DZ is a fast, bilingual (Arabic/English) collection of everyday browser tools built with Node.js, Express, HTML5, CSS3 and Vanilla JavaScript.

## Requirements

- Node.js 18+ recommended
- npm

## Run locally

1. Download or clone the project.
2. Open Terminal in the `toolbox-dz` folder.
3. Run:

```bash
npm install
```

4. Start:

```bash
npm start
```

5. Open:

`http://localhost:3000`

The server prints:

`ToolBox DZ running on port 3000`

## Project structure

- `server.js` — Express server and SPA fallback.
- `public/index.html` — HTML shell and SEO metadata.
- `public/style.css` — responsive UI.
- `public/app.js` — translations, router, tool logic and local settings.
- `public/manifest.json` — PWA manifest.
- `public/sw.js` — service worker.
- `robots.txt` and `sitemap.xml` are served by Express.

## Privacy

Most tools are client-side. Images, text, passwords, calculators, TTS and similar operations do not need a backend API. Passwords are generated in the browser and are not sent to the server.

The service worker caches the main application so core client-side tools can work offline after the app has been opened at least once.

## Contact email

There is no real email configured. The Contact page contains `YOUR_EMAIL@example.com` as a value you should replace in `public/app.js` with an address you actually own.

## GitHub

GitHub is for storing/versioning your source code. It is not, by itself, a Node.js server that runs `npm start`.

Typical commands:

```bash
git init
git add .
git commit -m "Initial ToolBox DZ"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit `node_modules` or secrets.

## Deploying to Node.js hosting

Upload the repository to a Node.js-compatible host, install dependencies with `npm install`, and configure the host to run:

```bash
npm start
```

The server uses:

```js
const PORT = process.env.PORT || 3000;
```

so hosting platforms can provide their own `PORT`.

No paid API key is required for the included core tools.

## Notes

- QR generation in this build is a local visual QR-style generator with deterministic modules. For production QR interoperability with arbitrary scanners, replace it with a well-tested QR encoding library and keep it bundled locally.
- The Gaming/FPS tool is explicitly an advice guide and does not claim to measure real FPS.
- Sensitivity conversion uses a user-supplied ratio and does not claim an official cross-game conversion.
- BMI is a general indicator, not a medical diagnosis.
