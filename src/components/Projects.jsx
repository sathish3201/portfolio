import { lazy } from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { usePortfolioData } from "../lib/portfolioDataContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Scene3D from "./Scene3D";
import TiltCard from "./TiltCard";
import { GithubIcon } from "./SocialIcons";

const ProjectArchitectureScene = lazy(() => import("./3d/ProjectArchitectureScene"));
const CardNodeGraph = lazy(() => import("./3d/CardNodeGraph"));

const GRADIENTS = {
  "gradient-1": "from-cyan-500/30 via-blue-500/20 to-purple-500/30",
  "gradient-2": "from-purple-500/30 via-fuchsia-500/20 to-cyan-500/30",
  "gradient-3": "from-emerald-500/30 via-cyan-500/20 to-blue-500/30",
  "gradient-4": "from-rose-500/30 via-purple-500/20 to-cyan-500/30",
  "gradient-5": "from-blue-500/30 via-indigo-500/20 to-cyan-500/30",
  "gradient-6": "from-amber-500/30 via-orange-500/20 to-rose-500/30",
  "gradient-flagship": "from-cyan-500/40 via-purple-500/25 to-purple-600/40",
};

const API_BASE = import.meta.env.VITE_API_BASE || "https://nexoria-backend-og2p.onrender.com/api";

// A demo URL starting with "/" (e.g. "/api/oop-reference") is a path on
// the backend, not this static site's own origin — resolve it against
// the backend before use. Full URLs (https://...) pass through as-is.
function resolveDemoUrl(demo) {
  if (!demo || demo === "#" || /^https?:\/\//.test(demo)) return demo;
  const backendOrigin = API_BASE.replace(/\/api\/?$/, "");
  return `${backendOrigin}${demo}`;
}

export default function Projects() {
  const { data } = usePortfolioData();
  const { projects } = data;

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <SectionHeading eyebrow="What I've built" title="Featured Projects" />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 100}>
            <TiltCard
              liftClassName="hover:-translate-y-1.5"
              className="glass-panel group h-full overflow-hidden rounded-2xl hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div
                className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${
                  GRADIENTS[project.image] ?? GRADIENTS["gradient-1"]
                }`}
              >
                {project.image === "gradient-flagship" ? (
                  <Scene3D
                    scene={ProjectArchitectureScene}
                    threshold={0.3}
                    className="absolute inset-0"
                    fallback={
                      <Sparkles
                        size={40}
                        className="absolute inset-0 m-auto text-white/70 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                      />
                    }
                  />
                ) : (
                  <Scene3D
                    scene={CardNodeGraph}
                    nodeCount={2 + (i % 3)}
                    accent={i % 2 === 0 ? "cyan" : "purple"}
                    threshold={0.3}
                    className="absolute inset-0"
                    fallback={
                      <Sparkles
                        size={40}
                        className="absolute inset-0 m-auto text-white/70 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                      />
                    }
                  />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)]" />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-50">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300"
                    >
                      <GithubIcon size={16} /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={resolveDemoUrl(project.demo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300"
                    >
                      <ExternalLink size={16} /> {project.demo.startsWith("/") ? "Read Guide" : "Live Demo"}
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
