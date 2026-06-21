export async function uploadStudioImage(file, folder = 'uploads', preset) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  if (preset) {
    formData.append('preset', preset);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Image upload failed.');
  }

  return payload.url;
}
