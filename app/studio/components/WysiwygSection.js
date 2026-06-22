export default function WysiwygSection({ label, children, footer = null }) {
  return (
    <section className="space-y-3">
      {label ? (
        <p className="text-xs uppercase tracking-[0.2em] text-black/40">{label}</p>
      ) : null}
      <div className="rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">{children}</div>
      {footer}
    </section>
  );
}
