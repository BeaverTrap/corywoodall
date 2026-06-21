'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const supabase = createClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/studio`,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-24">
      <div className="backdrop-blur-md bg-white p-8 rounded-lg shadow-lg border border-black/10">
        <p className="text-xs uppercase tracking-[0.2em] text-black/50 mb-2">Private access</p>
        <h1 className="text-3xl font-bold mb-2">Studio Login</h1>
        <p className="text-black/70 mb-8">
          Sign in with an approved Google account to manage articles and galleries.
        </p>

        {error === 'not_authorized' && (
          <p className="mb-4 rounded bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            This Google account is not on the allowlist. Contact the site administrator.
          </p>
        )}
        {error === 'auth_failed' && (
          <p className="mb-4 rounded bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            Sign in failed. Please try again.
          </p>
        )}

        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full px-4 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
