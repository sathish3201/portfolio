import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export default function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handleChange = (e) => setPrefersReduced(e.matches);

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
