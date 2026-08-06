import { CheckCircle2 } from "lucide-react";
import PORTFOLIO_DATA from "../data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function About() {
  const { about } = PORTFOLIO_DATA;

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <SectionHeading eyebrow="Get to know me" title="About Me" />
      </Reveal>

      <div className="grid gap-14 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Reveal className="space-y-5">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-slate-400">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={150} className="mt-8">
            <p className="mb-4 text-sm font-semibold tracking-wide text-slate-200 uppercase">
              Focus Areas
            </p>
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
          <Reveal delay={200} className="grid grid-cols-2 gap-4">
            {about.stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <p className="text-gradient text-3xl font-extrabold">{stat.value}</p>
                <p className="mt-2 text-xs tracking-wide text-slate-400 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
