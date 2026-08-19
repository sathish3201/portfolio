import { useEffect, useState, lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { usePortfolioData } from "../lib/portfolioDataContext";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";
import TiltCard from "./TiltCard";

// Three.js + react-three-fiber add ~800KB to the bundle — lazy-load so
// it downloads after the initial page paint instead of blocking it.
// Nothing renders in its place before it loads (the two blur-orb divs
// above already provide a background), so no loading fallback is needed.
const ParticleField = lazy(() => import("./ParticleField"));

const SOCIAL_ICONS = { github: GithubIcon, linkedin: LinkedinIcon, twitter: TwitterIcon };

const API_BASE = import.meta.env.VITE_API_BASE || "https://nexoria-backend-og2p.onrender.com/api";

// resumeUrl from portfolio-site.json is a path relative to the backend
// (e.g. "/api/resume") — resolve it against the backend's actual origin
// rather than this site's own origin.
function resolveResumeUrl(resumeUrl) {
  if (/^https?:\/\//.test(resumeUrl)) return resumeUrl;
  const backendOrigin = API_BASE.replace(/\/api\/?$/, "");
  return `${backendOrigin}${resumeUrl}`;
}

export default function Hero() {
  const { data } = usePortfolioData();
  const { meta, hero } = data;
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % hero.roles.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [hero.roles.length]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-32 pb-20"
    >
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="animate-glow-pulse pointer-events-none absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[120px]"
        style={{ animationDelay: "2s" }}
      />
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      <div className="animate-fade-up relative mx-auto w-full max-w-4xl text-center">
        <p className="mb-4 font-mono text-sm font-medium tracking-wider text-cyan-400 uppercase">
          {hero.greeting} {meta.name}
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50 sm:text-6xl">
          {meta.role.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-gradient">{meta.role.split(" ").slice(-1)}</span>
        </h1>

        <div className="mt-5 h-8 font-mono text-lg text-slate-300 sm:text-xl">
          <span key={roleIndex} className="animate-fade-up inline-block">
            {hero.roles[roleIndex]}
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {hero.summary}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <TiltCard liftClassName="" className="rounded-full">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:scale-105"
            >
              View My Work
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </TiltCard>
          <TiltCard liftClassName="" className="rounded-full">
            <a
              href={resolveResumeUrl(meta.resumeUrl)}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel block rounded-full px-6 py-3 text-sm font-semibold text-slate-100 transition-colors duration-200 hover:border-cyan-400/40"
            >
              Download Resume
            </a>
          </TiltCard>
        </div>

        <div className="mt-10 flex items-center justify-center gap-5">
          {Object.entries(meta.social).map(([key, url]) => {
            const Icon = SOCIAL_ICONS[key];
            if (!Icon) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                className="text-slate-400 transition-colors duration-200 hover:text-cyan-300"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
