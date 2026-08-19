import { lazy } from "react";
import { LayoutPanelLeft, Server, Cloud, Wrench, Code2 } from "lucide-react";
import { usePortfolioData } from "../lib/portfolioDataContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import Scene3D from "./Scene3D";
import TiltCard from "./TiltCard";

const SkillIcon3D = lazy(() => import("./3d/SkillIcon3D"));

const ICONS = {
  "layout-panel-left": LayoutPanelLeft,
  server: Server,
  cloud: Cloud,
  wrench: Wrench,
};

// Maps each category's existing lucide icon key to a distinct 3D primitive
// + accent color, so the four icon slots read as visually different, not
// four copies of the same shape.
const SHAPE_3D = {
  "layout-panel-left": { shape: "icosahedron", accent: "purple" },
  server: { shape: "box", accent: "cyan" },
  cloud: { shape: "octahedron", accent: "purple" },
  wrench: { shape: "torus", accent: "cyan" },
};

export default function Skills() {
  const { data } = usePortfolioData();
  const { skills } = data;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <SectionHeading eyebrow="What I work with" title="Skills & Tools" />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group, i) => {
          const Icon = ICONS[group.icon] ?? Code2;
          const shape3d = SHAPE_3D[group.icon];
          return (
            <Reveal key={group.category} delay={i * 100}>
              <TiltCard className="glass-panel h-full rounded-2xl p-6 hover:border-purple-400/30">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
                  {shape3d ? (
                    <Scene3D
                      scene={SkillIcon3D}
                      shape={shape3d.shape}
                      accent={shape3d.accent}
                      threshold={0.2}
                      className="flex h-full w-full items-center justify-center"
                      fallback={<Icon size={20} className="text-cyan-300" />}
                    />
                  ) : (
                    <Icon size={20} className="text-cyan-300" />
                  )}
                </div>
                <h3 className="font-bold text-slate-50">{group.category}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-slate-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
