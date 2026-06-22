export default function StudioMetaFields({ children }) {
  return (
    <div className="border-t border-black/10 bg-stone-50 px-4 py-4 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-black/45">Page settings</p>
      {children}
    </div>
  );
}

export function StudioMetaInput({ label, value, onChange, placeholder, hint }) {
  return (
    <div>
      <label className="block text-xs font-medium text-black/60 mb-1">{label}</label>
      <input
        className="w-full border border-black/15 rounded px-3 py-2 text-sm bg-white"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {hint ? <p className="text-xs text-black/45 mt-1">{hint}</p> : null}
    </div>
  );
}
