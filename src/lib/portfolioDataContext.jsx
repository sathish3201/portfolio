import { createContext, useContext, useEffect, useState } from "react";

// Portfolio content now lives on nexoria-backend (backend/data/portfolio-site.json)
// instead of being bundled into this site's JS at build time — editing that
// JSON updates the live site on next page load, no rebuild/redeploy needed.
// This context fetches it once on mount and provides it to every section.
const API_BASE = import.meta.env.VITE_API_BASE || "https://nexoria-backend-og2p.onrender.com/api";

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/data`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PortfolioDataContext.Provider value={{ data, error }}>{children}</PortfolioDataContext.Provider>
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
