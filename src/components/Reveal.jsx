import useReveal from "../hooks/useReveal";

// direction: "up" (default, original fade-up), "left" (slides + rotates in
// from the left, converging to center), "right" (mirror of left). left/right
// use a 3D perspective rotateY so the card visibly turns to face the viewer
// as it settles, rather than a flat 2D slide.
const OFFSET_CLASSES = {
  up: { hidden: "opacity-0 translate-y-8", visible: "opacity-100 translate-y-0" },
  left: {
    hidden: "opacity-0 -translate-x-16 [transform:perspective(1000px)_rotateY(-25deg)]",
    visible: "opacity-100 translate-x-0 [transform:perspective(1000px)_rotateY(0deg)]",
  },
  right: {
    hidden: "opacity-0 translate-x-16 [transform:perspective(1000px)_rotateY(25deg)]",
    visible: "opacity-100 translate-x-0 [transform:perspective(1000px)_rotateY(0deg)]",
  },
};

export default function Reveal({ as: Tag = "div", delay = 0, direction = "up", className = "", children }) {
  const [ref, visible] = useReveal();
  const offsets = OFFSET_CLASSES[direction] ?? OFFSET_CLASSES.up;

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? offsets.visible : offsets.hidden} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
