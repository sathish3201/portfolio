import { useEffect, useState } from "react";
import { usePortfolioData } from "../lib/portfolioDataContext";

const API_BASE = import.meta.env.VITE_API_BASE || "https://nexoria-backend-og2p.onrender.com/api";
const POLL_INTERVAL_MS = 60_000;

// Polls the backend's /model-status route (never the model's own key —
// that stays server-side) to show whether the local LLM behind the
// portfolio's AI features is currently reachable, alongside whether the
// live content API (already tracked as `isLive` in context) is connected.
function useModelOnline() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    let cancelled = false;

    function check() {
      fetch(`${API_BASE}/model-status`)
        .then((res) => (res.ok ? res.json() : { online: false }))
        .then((json) => {
          if (!cancelled) setOnline(Boolean(json.online));
        })
        .catch(() => {
          if (!cancelled) setOnline(false);
        });
    }

    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return online;
}

function Dot({ status }) {
  const color =
    status === true ? "bg-emerald-400" : status === false ? "bg-rose-400" : "bg-slate-500";
  return (
    <span className="relative flex h-2 w-2">
      {status === true && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`} />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

export default function StatusBadge({ className = "" }) {
  const { isLive } = usePortfolioData();
  const modelOnline = useModelOnline();

  return (
    <div
      className={`flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <Dot status={isLive} />
        API
      </span>
      <span className="h-3 w-px bg-white/10" />
      <span className="flex items-center gap-1.5">
        <Dot status={modelOnline} />
        Model
      </span>
    </div>
  );
}
