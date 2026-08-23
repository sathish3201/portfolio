// Generates public/sitemap.xml. This is a single-page site (About,
// Experience, Projects, etc. are in-page anchors, not separate
// routes), so the sitemap lists exactly one URL -- still worth
// generating because search consoles and some crawlers expect the
// file to exist at /sitemap.xml even for a one-page site, and it's
// referenced from robots.txt.
//
// Run manually (`node scripts/generate-sitemap.js`) whenever the site
// is meaningfully updated, so <lastmod> reflects real content changes.
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://sathish3201.github.io/portfolio/";
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(__dirname, "..", "public", "sitemap.xml"), xml, "utf-8");
console.log(`Wrote public/sitemap.xml (lastmod ${today})`);
