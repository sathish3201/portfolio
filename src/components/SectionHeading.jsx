export default function SectionHeading({ eyebrow, title, align = "left" }) {
  return (
    <div className={`mb-14 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 font-mono text-sm font-medium tracking-wider text-cyan-400 uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">{title}</h2>
      <div
        className={`mt-4 h-px w-16 bg-gradient-to-r from-cyan-400 to-purple-500 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
