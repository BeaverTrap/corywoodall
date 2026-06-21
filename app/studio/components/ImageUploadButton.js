'use client';

export default function ImageUploadButton({
  label = 'Upload image',
  onChange,
  disabled = false,
  multiple = false,
}) {
  return (
    <label
      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
        disabled
          ? 'bg-black/30 text-white/70 cursor-not-allowed'
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        multiple={multiple}
        onChange={onChange}
      />
    </label>
  );
}
