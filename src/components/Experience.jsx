import { Briefcase, MapPin } from "lucide-react";
import PORTFOLIO_DATA from "../data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience() {
  const { experience } = PORTFOLIO_DATA;

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-28">
      <Reveal>
        <SectionHeading eyebrow="Where I've worked" title="Experience" />
      </Reveal>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[15px] w-px bg-gradient-to-b from-cyan-400/50 via-purple-500/30 to-transparent sm:left-[19px]" />

        <div className="space-y-10">
          {experience.map((job, i) => (
            <Reveal key={`${job.company}-${i}`} delay={i * 100}>
              <div className="relative flex gap-6 pl-2 sm:gap-8">
                <div className="glass-panel relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-cyan-400/40 sm:h-10 sm:w-10">
                  <Briefcase size={16} className="text-cyan-300" />
                </div>

                <div className="glass-panel flex-1 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-50">{job.role}</h3>
                      <p className="text-gradient font-semibold">{job.company}</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      <p className="font-mono">{job.period}</p>
                      <p className="mt-1 flex items-center justify-end gap-1">
                        <MapPin size={12} /> {job.location}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {job.achievements.map((a, idx) => (
                      <li key={idx} className="flex gap-2 text-sm leading-relaxed text-slate-400">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                        {a}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
