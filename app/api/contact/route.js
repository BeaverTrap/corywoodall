import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();
    
    // For now, just return success
    // We'll implement email sending tomorrow
    console.log('Contact form submission:', { name, email, subject, message });
    
    return NextResponse.json({ message: 'Message received! Email functionality coming soon.' }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Error processing your message' }, { status: 500 });
  }
} 