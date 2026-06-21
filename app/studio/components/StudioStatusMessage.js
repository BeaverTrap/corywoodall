export default function StudioStatusMessage({ message, tone = 'info' }) {
  if (!message) return null;

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-stone-100 border-black/10 text-black/80',
  };

  return (
    <p className={`text-sm rounded-lg border px-4 py-3 ${styles[tone] || styles.info}`} role="status">
      {message}
    </p>
  );
}
