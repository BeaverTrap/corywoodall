import Link from 'next/link';

export default function StudioHelpPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/studio" className="text-sm text-black/60 hover:underline">
        ← Back to dashboard
      </Link>
      <h2 className="text-3xl font-bold mt-2 mb-2">How to use Studio</h2>
      <p className="text-black/70 mb-8">
        Quick reference for editing corywoodall.com without touching code.
      </p>

      <div className="space-y-8">
        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">1. Sign in</h3>
          <p className="text-black/80 leading-relaxed">
            Go to <strong>/studio</strong> and sign in with your approved Google account. If you see
            &ldquo;not authorized,&rdquo; ask the site administrator to add your email under{' '}
            <Link href="/studio/admins" className="underline">
              Admin allowlist
            </Link>
            .
          </p>
        </section>

        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">2. Edit site text</h3>
          <p className="text-black/80 leading-relaxed">
            <Link href="/studio/site" className="underline">
              Site content
            </Link>{' '}
            covers the homepage hero, about paragraphs, contact info, FAQ, articles index intro, and
            browser tab title. Each section shows a live preview beside the editor. Click{' '}
            <strong>Save all changes</strong> at the bottom when you&apos;re done — changes go live
            immediately.
          </p>
        </section>

        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">3. Manage galleries</h3>
          <ul className="list-disc pl-5 space-y-2 text-black/80">
            <li>
              Create or edit a gallery under{' '}
              <Link href="/studio/galleries" className="underline">
                Galleries
              </Link>
              .
            </li>
            <li>Upload images inside the gallery editor, add captions, and reorder with move up/down.</li>
            <li>
              Turn on <strong>Published on homepage</strong> when the gallery should appear on the
              public site. Draft galleries stay hidden.
            </li>
            <li>
              Set homepage order with move up/down on the{' '}
              <Link href="/studio/galleries" className="underline">
                galleries list
              </Link>
              .
            </li>
          </ul>
        </section>

        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">4. Write articles</h3>
          <ul className="list-disc pl-5 space-y-2 text-black/80">
            <li>
              Add blocks (heading, text, single image, image grid) under{' '}
              <Link href="/studio/articles" className="underline">
                Articles
              </Link>
              .
            </li>
            <li>Upload images inside image blocks — not from the block-type menu alone.</li>
            <li>
              Check <strong>Published</strong> when the article should appear at{' '}
              <strong>/articles/your-slug</strong>.
            </li>
            <li>Use <strong>Duplicate</strong> on an existing article to start a new residency post from a template.</li>
          </ul>
        </section>

        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">5. Tips</h3>
          <ul className="list-disc pl-5 space-y-2 text-black/80">
            <li>
              Rich text fields show formatting as you type — bold, italic, links, lists, and quotes.
            </li>
            <li>Drag blocks, FAQ items, paragraphs, and gallery images using the ⋮⋮ handle.</li>
            <li>
              <strong>View on site</strong> opens the public page in a new tab (only when published).
            </li>
            <li>While signed in, a black bar at the bottom of the public site links back to Studio.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
