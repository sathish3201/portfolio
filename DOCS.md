# Portfolio Site — Code Walkthrough

This explains how your portfolio site is built and why, so you can talk through the code confidently. It's a single-page React app — much simpler than MockGenius AI — but it has a few patterns worth understanding well, especially since it's the first thing anyone reviewing your work will actually look at.

---

## 1. The core idea: one data file, many dumb components

The entire site's content lives in **one file**: `src/data.js`. Every section component (`Hero.jsx`, `About.jsx`, `Experience.jsx`, etc.) imports `PORTFOLIO_DATA` from it and renders whatever's there — none of them contain your actual name, bio text, or project descriptions hardcoded.

```js
// every section component does this
import PORTFOLIO_DATA from "../data";
const { hero } = PORTFOLIO_DATA; // or about, experience, projects, etc.
```

**Why this matters and what to say about it:** this is the "data-driven UI" pattern — the components are templates, and `data.js` is the content. If asked "how would you update this site for a different person / different resume," the honest answer is: you'd only ever touch `data.js`, never the components. This is also *why* it was straightforward to swap the placeholder "Alex Rivera" content for your real resume data earlier — one file changed, the entire site updated.

---

## 2. How the page is assembled: `App.jsx`

```jsx
export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-300">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
```

No routing library, no React Router — this is a genuine single-page site where "pages" are just `<section id="...">` blocks stacked vertically, and navigation is smooth-scrolling between them, not URL changes. That's a deliberate, correct choice for a portfolio: there's nothing here that needs its own URL or needs to be bookmarked to a sub-page.

---

## 3. The navbar: smooth scroll + active-section highlighting

`Navbar.jsx` does two things worth understanding:

### Scrolling to a section

```js
const handleNavClick = (id) => {
  setOpen(false);
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};
```

No library — `scrollIntoView({ behavior: "smooth" })` is a native browser API. Every section has a matching `id` (`id="about"`, `id="experience"`, etc. — set on each section component), and clicking a nav link just finds that DOM node and asks the browser to scroll to it smoothly. This is simpler and lighter than pulling in a scrolling library for what's a one-line native API call.

### Knowing which section is currently in view

```js
useEffect(() => {
  const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));
  return () => observer.disconnect();
}, []);
```

This is an **IntersectionObserver** — a browser API that watches DOM elements and fires a callback when they enter or leave the viewport, without you having to manually calculate scroll positions on every scroll event (which would be expensive to run constantly). The `rootMargin: "-40% 0px -50% 0px"` is the interesting part: it shrinks the "viewport" the observer considers, from the top and bottom, so a section is only considered "active" when it's roughly in the vertical *middle* of the screen — not just barely peeking into view at the very edge. This is what makes the highlighted nav link change at a visually sensible moment as you scroll, instead of flickering the instant a section's top pixel appears.

If asked "why not just track scroll position with `onScroll`," the answer is: `IntersectionObserver` is more performant (it's handled by the browser's rendering pipeline, not JS running on every scroll tick) and simpler to reason about (you get a clean "is this element visible" boolean instead of doing manual math against `getBoundingClientRect()`).

---

## 4. Scroll-reveal animations: `useReveal` + `Reveal`

Two small files work together to make sections fade/slide in as you scroll to them.

**`src/hooks/useReveal.js`** — a custom hook wrapping `IntersectionObserver` again, but for a different purpose (triggering a one-time animation instead of tracking ongoing position):

```js
export default function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
```

Notice `observer.unobserve(node)` inside the callback — once an element has been seen and `visible` is set to `true`, the observer stops watching it. This is intentional: the reveal animation should only ever play once per element, the first time it scrolls into view, not every time you scroll up and back down past it.

**`src/components/Reveal.jsx`** wraps that hook into a reusable component:

```jsx
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
```

This is the pattern to point to if asked "how do the animations work, did you use a library like Framer Motion." The answer: no library — it's plain Tailwind CSS transition classes toggled by a boolean from `IntersectionObserver`, wrapped in one small reusable component. Every section (`About.jsx`, `Experience.jsx`, etc.) just wraps its content in `<Reveal>` or `<Reveal delay={100}>` and gets the fade-in-on-scroll behavior for free, with staggered delays where multiple `Reveal`s appear near each other (see `Experience.jsx` passing `delay={i * 100}` per timeline item, so they cascade in one after another instead of all appearing simultaneously).

---

## 5. Styling system: Tailwind v4's CSS-first config

This project uses **Tailwind CSS v4**, which changed how theming works compared to v3 — worth knowing since it looks different from most Tailwind tutorials/examples online.

In `src/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-base: #0b0f19;
  --color-cyan: #22d3ee;
  --color-purple: #a855f7;
  /* ... */
}
```

In Tailwind v3, you'd configure custom colors in a separate `tailwind.config.js` file as a JS object. In v4, theme values are defined directly in CSS using the `@theme` directive and plain CSS custom properties — there's no `tailwind.config.js` in this project at all (check `vite.config.js`: theming is handled entirely by the `@tailwindcss/vite` plugin reading this CSS file).

Two custom utilities are also defined here, used throughout the components:
```css
@utility text-gradient {
  background-image: linear-gradient(90deg, var(--color-cyan), var(--color-purple));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

@utility glass-panel {
  background: rgba(16, 20, 31, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

`@utility` is Tailwind v4's way of registering a custom class (`text-gradient`, `glass-panel`) that you can then use anywhere just like a built-in Tailwind class: `className="glass-panel rounded-2xl p-6"`. The `text-gradient` utility is the gradient-text effect used on your name/highlighted words in the Hero section — it works by clipping a background gradient to the shape of the text itself (`background-clip: text` + transparent text color), a well-known CSS technique that this project just wraps into a reusable class.

`glass-panel` is the frosted-glass "glassmorphism" look on the navbar and cards — `backdrop-filter: blur()` blurs whatever is *behind* the element, and the semi-transparent background color lets that blur show through, creating the frosted look.

---

## 6. Icons: why some are `lucide-react` and some are hand-written SVGs

Most icons in this project come from the `lucide-react` package — a standard icon library, imported like `import { Mail, MapPin } from "lucide-react"`.

But `src/components/SocialIcons.jsx` hand-codes GitHub, LinkedIn, and Twitter as raw inline SVGs instead of importing them from the library:

```jsx
export function GithubIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91..." />
    </svg>
  );
}
```

**The reason, if asked:** `lucide-react` removed brand/logo icons (GitHub, LinkedIn, Twitter/X, etc.) in its v1 release — they don't exist in the package anymore at all, for licensing/trademark reasons around bundling third-party logos. Rather than pull in a second icon library just for three brand logos, these were hand-written as inline SVGs matching each brand's actual logo path data. `fill="currentColor"` is the key detail — it means these SVGs inherit whatever text color is applied via Tailwind classes (`className="text-slate-400 hover:text-cyan-300"`), so they behave exactly like the `lucide-react` icons stylistically, despite being hand-coded.

---

## 7. Deployment: how `npm run deploy` actually works

`package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

`npm run deploy` triggers two things via npm's lifecycle hooks: `predeploy` runs automatically first (any script literally named `pre<scriptname>` auto-runs before `<scriptname>` — no extra config needed), which runs `vite build` and produces the `dist/` folder. Then `gh-pages -d dist` runs — this is a small CLI tool that takes the contents of `dist/` and force-pushes them to a separate branch called `gh-pages` in the same repo. GitHub Pages is configured (in the repo's Settings → Pages) to serve static files straight from that branch.

The `base: '/portfolio/'` line in `vite.config.js` is what makes all the asset URLs in the built HTML/JS correctly point to `/portfolio/assets/...` instead of `/assets/...` — necessary because the site is hosted at `username.github.io/portfolio/`, not at the domain root. If this were deployed to a custom domain instead (`yourname.dev`), this `base` would need to change to `/`.

---

## 8. Talking points if asked "what would you improve"

- **No automated tests** — the site was verified by running `npm run build` (catches type/import errors) and manual browser checks, not a test suite. For a marketing/portfolio site with no complex logic, this is a reasonable tradeoff, but worth naming honestly if asked.
- **No image optimization pipeline** — project "images" are actually CSS gradients (`gradient-1` through `gradient-4` mapped in `Projects.jsx`), not real photos, specifically to avoid needing an image optimization/CDN setup for a static portfolio site. If you ever add real screenshots, you'd want to add responsive `srcset`/lazy-loading at that point.
- **Bundle size warning on build** (`chunk larger than 500kB`) doesn't apply here — that's MockGenius AI's frontend (which pulls in Recharts), not this portfolio site, which stays lean since its only real dependencies are React, Tailwind, `lucide-react`, and `framer-motion`.
