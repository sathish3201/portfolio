import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { usePortfolioData } from "../lib/portfolioDataContext";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

const SOCIAL_ICONS = { github: GithubIcon, linkedin: LinkedinIcon, twitter: TwitterIcon };

export default function Contact() {
  const { data } = usePortfolioData();
  const { meta } = data;

  return (
    <section id="contact" className="relative mx-auto max-w-4xl px-6 py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[300px] -translate-y-1/2 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent blur-[100px]"
      />

      <Reveal>
        <SectionHeading eyebrow="Get in touch" title="Let's Build Something Great" align="center" />
      </Reveal>

      <Reveal delay={100}>
        <p className="mx-auto max-w-xl text-center text-slate-400">
          I'm currently open to new opportunities and interesting collaborations. Whether you
          have a question or just want to say hi, my inbox is always open.
        </p>
      </Reveal>

      <Reveal delay={200} className="mt-10 flex flex-col items-center gap-6">
        <a
          href={`mailto:${meta.email}`}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-8 py-4 text-base font-semibold text-slate-950 transition-transform duration-200 hover:scale-105"
        >
          <Mail size={18} />
          {meta.email}
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <p className="flex items-center gap-1.5 text-sm text-slate-400">
          <MapPin size={14} /> {meta.location}
        </p>

        <div className="mt-2 flex items-center gap-5">
          {Object.entries(meta.social).map(([key, url]) => {
            const Icon = SOCIAL_ICONS[key];
            if (!Icon) return null;
            return (
              <TiltCard
                key={key}
                liftClassName=""
                className="glass-panel flex h-11 w-11 items-center justify-center rounded-full text-slate-300 hover:border-cyan-400/40 hover:text-cyan-300"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="flex h-full w-full items-center justify-center transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              </TiltCard>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
