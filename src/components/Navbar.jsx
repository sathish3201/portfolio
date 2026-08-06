import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import PORTFOLIO_DATA from "../data";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? "pt-3" : "pt-5"
        }`}
    >
      <nav
        className={`glass-panel flex w-[92%] max-w-3xl items-center justify-between rounded-2xl px-5 py-3 shadow-lg shadow-black/20 transition-all duration-300 ${scrolled ? "shadow-black/40" : ""
          }`}
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("home");
          }}
          className="font-mono text-lg font-bold text-slate-50"
        >
          <span className="text-gradient">{PORTFOLIO_DATA.meta.name.split(" ")[0]}</span>
          <span className="text-slate-500">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNavClick(link.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${active === link.id
                    ? "bg-white/5 text-cyan-300"
                    : "text-slate-300 hover:text-white"
                  }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleNavClick("contact")}
          className="hidden rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:scale-105 md:inline-block"
        >
          Let's Talk
        </button>

        <button
          className="text-slate-200 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="glass-panel absolute top-[calc(100%+8px)] w-[92%] max-w-3xl rounded-2xl p-4 shadow-lg shadow-black/40 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${active === link.id
                      ? "bg-white/5 text-cyan-300"
                      : "text-slate-300 hover:text-white"
                    }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
