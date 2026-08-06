import { GraduationCap } from "lucide-react";
import PORTFOLIO_DATA from "../data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Education() {
  const { education } = PORTFOLIO_DATA;

  return (
    <section id="education" className="mx-auto max-w-4xl px-6 py-28">
      <Reveal>
        <SectionHeading eyebrow="Academic background" title="Education" />
      </Reveal>

      <div className="space-y-4">
        {education.map((edu, i) => (
          <Reveal key={`${edu.school}-${i}`} delay={i * 100}>
            <div className="glass-panel flex items-center gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
                <GraduationCap size={22} className="text-purple-300" />
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-50">{edu.degree}</h3>
                  <p className="text-sm text-slate-400">{edu.school}</p>
                </div>
                <p className="font-mono text-sm text-slate-400">{edu.period}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
