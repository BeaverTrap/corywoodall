import Link from 'next/link';

export default function StudioNav({ email }) {
  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">Private</p>
          <h1 className="text-xl font-bold tracking-wide">Cory Woodall Studio</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/studio" className="hover:underline">Dashboard</Link>
          <Link href="/studio/galleries" className="hover:underline">Galleries</Link>
          <Link href="/studio/articles" className="hover:underline">Articles</Link>
          <Link href="/" className="text-black/60 hover:underline">View site</Link>
          {email && <span className="text-black/50">{email}</span>}
          <form action="/auth/signout" method="post">
            <button type="submit" className="px-3 py-1.5 rounded bg-black text-white text-sm">
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
