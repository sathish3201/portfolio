import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

// Reusable pointer-tilt + lift + cursor-tracking spotlight wrapper, applied
// consistently across every card-like section (Hero CTAs, Skills, Projects,
// Experience, Education, Certifications, Contact's social icons) instead of
// copy-pasting this per section. Wraps `children` — usually a .glass-panel
// card — in a 3D-perspective container that rotates toward the cursor,
// springs back flat on mouse-leave, and shows a soft radial "light" that
// follows the pointer across the card's surface.
//
// This is a pointer-driven interaction, not autoplaying animation, so
// prefers-reduced-motion isn't checked here — rotation amounts are kept
// small (max ~8deg) specifically so it stays comfortable either way.
const MAX_TILT_DEG = 8;

export default function TiltCard({ children, className = "", liftClassName = "hover:-translate-y-1" }) {
  const ref = useRef(null);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 220, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]), springConfig);

  const spotlightX = useTransform(mouseX, (v) => `${v * 100}%`);
  const spotlightY = useTransform(mouseY, (v) => `${v * 100}%`);
  const spotlightBackground = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(220px circle at ${x} ${y}, rgba(34, 211, 238, 0.16), rgba(168, 85, 247, 0.08) 45%, transparent 70%)`
  );

  function handleMouseMove(e) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseEnter() {
    setHovering(true);
  }

  function handleMouseLeave() {
    setHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`relative ${liftClassName} transition-transform duration-300 ${className}`}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: spotlightBackground }}
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
}
