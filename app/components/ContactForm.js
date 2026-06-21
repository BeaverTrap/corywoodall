'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();
      if (!response.ok) {
        setFeedback({ tone: 'error', text: data.error || 'Something went wrong. Please try again.' });
        return;
      }

      setFeedback({ tone: 'success', text: data.message });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setFeedback({ tone: 'error', text: 'Could not send your message. Please email directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          required
          className="w-full border border-black/20 rounded px-3 py-2 bg-white/80"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          className="w-full border border-black/20 rounded px-3 py-2 bg-white/80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="contact-subject">
          Subject (optional)
        </label>
        <input
          id="contact-subject"
          className="w-full border border-black/20 rounded px-3 py-2 bg-white/80"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          className="w-full border border-black/20 rounded px-3 py-2 bg-white/80"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-black text-white font-medium disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send message'}
      </button>
      {feedback ? (
        <p
          className={`text-sm rounded-lg border px-4 py-3 ${
            feedback.tone === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
          role="status"
        >
          {feedback.text}
        </p>
      ) : null}
    </form>
  );
}
