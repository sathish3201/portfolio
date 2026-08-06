import { LayoutPanelLeft, Server, Cloud, Wrench, Code2 } from "lucide-react";
import PORTFOLIO_DATA from "../data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const ICONS = {
  "layout-panel-left": LayoutPanelLeft,
  server: Server,
  cloud: Cloud,
  wrench: Wrench,
};

export default function Skills() {
  const { skills } = PORTFOLIO_DATA;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <SectionHeading eyebrow="What I work with" title="Skills & Tools" />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group, i) => {
          const Icon = ICONS[group.icon] ?? Code2;
          return (
            <Reveal key={group.category} delay={i * 100}>
              <div className="glass-panel h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/30">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
                  <Icon size={20} className="text-cyan-300" />
                </div>
                <h3 className="font-bold text-slate-50">{group.category}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-slate-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
