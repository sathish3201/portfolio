import PORTFOLIO_DATA from "../data";

export default function Footer() {
  const { meta } = PORTFOLIO_DATA;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
        <p>
          © {year} {meta.name}. All rights reserved.
        </p>
        <p className="font-mono text-xs">Built with React, Vite &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
