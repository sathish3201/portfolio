import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import PORTFOLIO_DATA from "../data";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

const SOCIAL_ICONS = { github: GithubIcon, linkedin: LinkedinIcon, twitter: TwitterIcon };

export default function Hero() {
  const { meta, hero } = PORTFOLIO_DATA;
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

      <div className="animate-fade-up mx-auto w-full max-w-4xl text-center">
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
          <a
            href={meta.resumeUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-slate-100 transition-colors duration-200 hover:border-cyan-400/40"
          >
            Download Resume
          </a>
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
