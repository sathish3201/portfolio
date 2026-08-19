import { useEffect, useRef, useState } from "react";

// Same one-shot IntersectionObserver logic as useReveal.js, extracted as a
// standalone hook (no CSS-transition assumptions baked in) so it's reusable
// for gating a 3D Canvas mount, not just a fade-up. useReveal.js is left
// untouched — this is a new parallel hook, not a refactor of working code.
export default function useInViewOnce(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
