import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth/verify-admin';
import { uploadImageFile } from '@/lib/uploads/cloudinary';

export async function POST(request) {
  const auth = await verifyAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload request.' }, { status: 400 });
  }

  const file = formData.get('file');
  const folder = String(formData.get('folder') || 'uploads');
  const preset = formData.get('preset') ? String(formData.get('preset')) : undefined;

  try {
    const url = await uploadImageFile(file, folder, preset);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image upload failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
