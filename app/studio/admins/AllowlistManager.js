'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AllowlistManager({ initialEntries = [], currentEmail = '' }) {
  const router = useRouter();
  const supabase = createClient();
  const [entries, setEntries] = useState(initialEntries);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('info');
  const [working, setWorking] = useState(false);

  const addEmail = async (event) => {
    event.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email) return;

    setWorking(true);
    setMessage('');

    const { data, error } = await supabase
      .from('admin_allowlist')
      .insert({ email })
      .select('id, email, created_at')
      .single();

    setWorking(false);

    if (error) {
      setMessage(error.message);
      setMessageTone('error');
      return;
    }

    setEntries((prev) => [...prev, data].sort((a, b) => a.email.localeCompare(b.email)));
    setNewEmail('');
    setMessage(`Added ${email} to the allowlist.`);
    setMessageTone('success');
    router.refresh();
  };

  const removeEmail = async (entry) => {
    if (
      !window.confirm(
        `Remove ${entry.email} from Studio access? They will not be able to sign in after their session ends.`
      )
    ) {
      return;
    }

    setWorking(true);
    setMessage('');

    const { error } = await supabase.from('admin_allowlist').delete().eq('id', entry.id);

    setWorking(false);

    if (error) {
      setMessage(error.message);
      setMessageTone('error');
      return;
    }

    setEntries((prev) => prev.filter((item) => item.id !== entry.id));
    setMessage(`Removed ${entry.email}.`);
    setMessageTone('success');
    router.refresh();
  };

  const toneClass =
    messageTone === 'success'
      ? 'bg-green-50 border-green-200 text-green-900'
      : messageTone === 'error'
        ? 'bg-red-50 border-red-200 text-red-900'
        : 'bg-stone-100 border-black/10 text-black/80';

  return (
    <div className="space-y-6">
      {message ? (
        <p className={`text-sm rounded-lg border px-4 py-3 ${toneClass}`} role="status">
          {message}
        </p>
      ) : null}

      <form onSubmit={addEmail} className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium mb-1">
            Add Google account email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="name@gmail.com"
            className="w-full border border-black/20 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={working}
          className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium disabled:opacity-50"
        >
          Add admin
        </button>
      </form>

      <div className="bg-white border border-black/10 rounded-lg divide-y divide-black/10">
        {entries.length === 0 ? (
          <p className="p-6 text-sm text-black/60">No admins on the allowlist yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{entry.email}</p>
                {entry.email === currentEmail?.toLowerCase() ? (
                  <p className="text-xs text-black/50 mt-1">That&apos;s you</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeEmail(entry)}
                disabled={working || entry.email === currentEmail?.toLowerCase()}
                className="px-3 py-1.5 rounded border border-red-300 text-red-800 text-sm hover:bg-red-50 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
