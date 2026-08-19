import { Suspense } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import useInView from "../hooks/useInView";

/**
 * Gates a lazy-loaded R3F scene behind two conditions: the visitor hasn't
 * asked for reduced motion, and the section is currently in (or near) the
 * viewport. Either condition failing renders `fallback` (real 2D markup,
 * not a spinner) instead — no Canvas is ever mounted, no
 * three/@react-three/fiber chunk is ever requested, in either case. This
 * is deliberate: a static (non-animating) Canvas would still pay the full
 * WebGL + bundle cost for zero benefit to a reduced-motion visitor, so we
 * skip it entirely rather than mounting a frozen scene.
 *
 * Visibility (via useInView, not useInViewOnce) is tracked continuously,
 * not just on first entry — each Canvas is its own WebGL context, and
 * browsers cap how many can be alive at once (~16 in Chrome). A page with
 * a dozen+ 3D sections that each mounted "once visited, forever alive"
 * would exceed that cap on a full scroll-through, causing
 * "WebGLRenderer: Context Lost" crashes once the browser force-evicts
 * older contexts. Unmounting scenes once they scroll meaningfully
 * offscreen keeps only the currently-visible ones alive.
 *
 * `scene` is a component reference from React.lazy(() => import(...)),
 * constructed by the caller so each 3D scene stays in its own code-split
 * chunk and is never imported eagerly.
 */
export default function Scene3D({
  scene: LazyScene,
  fallback = null,
  threshold = 0.2,
  className = "",
  ...sceneProps
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ref, inView] = useInView(threshold);

  const showScene = !prefersReducedMotion && inView;

  return (
    <div ref={ref} className={className}>
      {showScene ? (
        <Suspense fallback={fallback}>
          <LazyScene {...sceneProps} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
