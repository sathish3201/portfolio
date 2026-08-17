import { createContext, useContext, useEffect, useState } from "react";
import FALLBACK_DATA from "../data-fallback.json";

// Portfolio content lives on nexoria-backend (backend/data/portfolio-site.json)
// so it can be edited without a rebuild/redeploy — but the site must not
// fully depend on that backend being reachable just to render. src/data-fallback.json
// is a bundled snapshot of the same content (update it by re-copying that
// file whenever the backend JSON changes meaningfully). The site renders
// immediately from this snapshot, then quietly swaps in fresh data if the
// backend responds — so a cold-starting or unreachable backend degrades to
// "slightly stale content" instead of "blank loading screen forever."
const API_BASE = import.meta.env.VITE_API_BASE || "https://nexoria-backend-og2p.onrender.com/api";

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(FALLBACK_DATA);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/data`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setIsLive(true);
        }
      })
      .catch((err) => {
        // Swallow the error — FALLBACK_DATA is already rendered, so
        // there's nothing broken to show the visitor. Log for debugging
        // only (e.g. Render's free tier cold-starting or being down).
        console.warn("Could not fetch live portfolio data, showing bundled snapshot instead:", err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PortfolioDataContext.Provider value={{ data, isLive }}>{children}</PortfolioDataContext.Provider>
  );
}

// Throws if used outside the provider (a programming error, not a
// runtime state to handle gracefully) — every section using this hook
// is a child of PortfolioDataProvider in App.jsx, so this should never
// actually fire.
export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error("usePortfolioData must be used within PortfolioDataProvider");
  return ctx;
}
