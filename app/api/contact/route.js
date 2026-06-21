import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSiteContent } from '@/lib/content/queries';
import { sendContactEmail } from '@/lib/email/sendContactEmail';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    let toEmail = process.env.CONTACT_TO_EMAIL;
    if (!toEmail) {
      try {
        const supabase = createClient();
        const siteContent = await getSiteContent(supabase);
        toEmail = siteContent.home.contact.email;
      } catch {
        toEmail = 'woodallcory@gmail.com';
      }
    }

    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim(),
      message: message.trim(),
      toEmail,
    });

    if (!result.ok && result.reason === 'not_configured') {
      return NextResponse.json({
        message: 'Message received. Email delivery is not configured yet — please use the email link above.',
      });
    }

    if (!result.ok) {
      return NextResponse.json(
        { error: 'Could not send your message right now. Please email directly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: 'Thank you — your message was sent. Cory will get back to you soon.',
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Error processing your message.' }, { status: 500 });
  }
}
