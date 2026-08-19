import { lazy } from "react";
import { CheckCircle2 } from "lucide-react";
import { usePortfolioData } from "../lib/portfolioDataContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Scene3D from "./Scene3D";
import TiltCard from "./TiltCard";

const AboutBackgroundGraph = lazy(() => import("./3d/AboutBackgroundGraph"));
const CardNodeGraph = lazy(() => import("./3d/CardNodeGraph"));

export default function About() {
  const { data } = usePortfolioData();
  const { about } = data;

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <Scene3D
        scene={AboutBackgroundGraph}
        threshold={0.2}
        className="pointer-events-none absolute inset-y-0 right-0 left-1/2 z-0 opacity-[0.18]"
        fallback={null}
      />

      <div className="relative z-10">
        <Reveal>
          <SectionHeading eyebrow="Get to know me" title="About Me" />
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Reveal direction="left" className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed text-slate-400">
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal delay={150} className="mt-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
                  <Scene3D
                    scene={CardNodeGraph}
                    nodeCount={3}
                    accent="cyan"
                    threshold={0.2}
                    className="flex h-full w-full items-center justify-center"
                    fallback={null}
                  />
                </div>
                <p className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                  Focus Areas
                </p>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {about.focusAreas.map((area) => (
                  <li key={area} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="shrink-0 text-cyan-400" />
                    {area}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <Reveal delay={200} direction="right" className="grid grid-cols-2 gap-4">
              {about.stats.map((stat) => (
                <TiltCard
                  key={stat.label}
                  className="glass-panel rounded-2xl p-6 text-center hover:border-cyan-400/30"
                >
                  <p className="text-gradient text-3xl font-extrabold">{stat.value}</p>
                  <p className="mt-2 text-xs tracking-wide text-slate-400 uppercase">
                    {stat.label}
                  </p>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
