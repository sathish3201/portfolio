// Shown while portfolio-site.json is being fetched from nexoria-backend.
// Kept intentionally simple (no layout-shift risk, no dependency on data
// that isn't loaded yet) since this is the very first thing a visitor sees.
export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b0f19] text-slate-300">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
      <p className="font-mono text-sm text-slate-500">Loading…</p>
    </div>
  );
}

export function LoadingError({ message }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0b0f19] px-6 text-center text-slate-300">
      <p className="text-lg font-semibold text-slate-100">Couldn't load this page right now.</p>
      <p className="max-w-md text-sm text-slate-400">
        The content service may be waking up (it sleeps after inactivity) — try refreshing in a moment.
        {message ? ` (${message})` : ""}
      </p>
    </div>
  );
}
