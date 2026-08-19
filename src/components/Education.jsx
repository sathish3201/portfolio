import { GraduationCap, Award, ExternalLink } from "lucide-react";
import { usePortfolioData } from "../lib/portfolioDataContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

export default function Education() {
  const { data } = usePortfolioData();
  const { education, certifications } = data;

  return (
    <section id="education" className="mx-auto max-w-4xl px-6 py-28 space-y-16">
      {/* Education Section */}
      <div>
        <Reveal>
          <SectionHeading eyebrow="Academic background" title="Education" />
        </Reveal>

        <div className="space-y-4">
          {education.map((edu, i) => (
            <Reveal key={`${edu.school}-${i}`} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
              <TiltCard className="glass-panel flex items-center gap-5 rounded-2xl p-6 hover:border-purple-400/30">
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
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div>
          <Reveal>
            <SectionHeading eyebrow="Professional Credentials" title="Certifications" />
          </Reveal>

          <div className="space-y-4">
            {certifications.map((cert, i) => {
              const hasUrl = cert.url && cert.url !== "#" && cert.url.trim() !== "";
              
              const CardContent = (
                <TiltCard className="glass-panel flex items-center gap-5 rounded-2xl p-6 hover:border-cyan-400/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20">
                    <Award size={22} className="text-cyan-300" />
                  </div>
                  <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-50 flex items-center gap-2">
                        {cert.name}
                        {hasUrl && <ExternalLink size={14} className="text-cyan-400 inline" />}
                      </h3>
                      {cert.issuer && <p className="text-sm text-slate-400">{cert.issuer}</p>}
                    </div>
                    <p className="font-mono text-sm text-slate-400">{cert.year}</p>
                  </div>
                </TiltCard>
              );

              return (
                <Reveal key={`${cert.name}-${i}`} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
                  {hasUrl ? (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block">
                      {CardContent}
                    </a>
                  ) : (
                    CardContent
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
