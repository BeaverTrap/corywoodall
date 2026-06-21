export async function sendContactEmail({ name, email, subject, message, toEmail }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = toEmail || process.env.CONTACT_TO_EMAIL || 'woodallcory@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'Cory Woodall Website <onboarding@resend.dev>';

  if (!apiKey) {
    console.log('Contact form (email not configured):', { name, email, subject, message });
    return { ok: false, reason: 'not_configured' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: subject || `Website inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        subject ? `Subject: ${subject}` : null,
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n'),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Resend error:', errorBody);
    return { ok: false, reason: 'send_failed' };
  }

  return { ok: true };
}
