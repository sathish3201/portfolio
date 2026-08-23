// Pre-renders the built single-page site into fully-formed static HTML,
// so crawlers that don't execute JavaScript (and social-preview bots)
// see real content instead of an empty <div id="root">.
//
// react-snap and vite-plugin-prerender were considered and rejected:
// react-snap is unmaintained since 2020 and doesn't reliably support
// Vite/React 19/Tailwind v4; vite-plugin-prerender has very limited
// adoption. This is a single-route site, so a ~60-line custom script
// covers 100% of the content with no new framework dependency beyond
// Playwright (a devDependency already used for this repo's screenshot
// tooling).
//
// Approach: serve dist/ locally, load it in headless Chromium, scroll
// through the page to trigger the IntersectionObserver-based Reveal
// animations (see src/components/Reveal.jsx) so their content is
// actually present in the DOM, then snapshot the fully-rendered HTML
// and write it back over dist/index.html. The <head> (meta tags,
// JSON-LD, <title>) survives unchanged since it's part of the DOM
// Playwright captures -- only the rendered <body> content changes.
import { chromium } from "playwright";
import { preview } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "..", "dist");
const BASE_PATH = "/portfolio/";

async function main() {
  // vite preview serves the already-built dist/ folder with the same
  // base path the production site uses, so relative asset URLs in the
  // captured HTML resolve exactly as they will on GitHub Pages.
  const previewServer = await preview({
    root: path.join(__dirname, ".."),
    preview: { port: 4174 },
  });
  const url = previewServer.resolvedUrls.local[0] + BASE_PATH.slice(1);

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Trigger every scroll-triggered Reveal by walking down the page in
    // increments -- IntersectionObserver only fires for elements that
    // have actually entered the viewport, which a single scrollTo(max)
    // can skip past too fast to register.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 400) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const html = await page.content();
    await fs.writeFile(path.join(DIST_DIR, "index.html"), html, "utf-8");
    console.log("Pre-rendered dist/index.html");
  } finally {
    await browser.close();
    await previewServer.close();
  }
}

main().catch((err) => {
  console.error("Pre-render failed:", err);
  process.exit(1);
});
