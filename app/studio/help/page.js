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
          <h3 className="text-xl font-semibold mb-3">2. Edit site content</h3>
          <p className="text-black/80 leading-relaxed mb-3">
            <Link href="/studio/site" className="underline">
              Site content
            </Link>{' '}
            covers the homepage hero, about paragraphs, contact info, FAQ, articles index intro, and
            browser tab title. Click directly in each section to edit — what you see is what visitors
            get.
          </p>
          <p className="text-black/80 leading-relaxed">
            Changes <strong>auto-save after a short pause</strong>, or use{' '}
            <strong>Save all changes</strong> at the bottom. Either way, saved content goes live on the
            public site immediately.
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
            <li>Upload images inside the gallery editor, add captions, and drag to reorder.</li>
            <li>
              Turn on <strong>Published on homepage</strong> when the gallery should appear on the
              public site. Draft galleries stay hidden.
            </li>
            <li>
              Set homepage order by dragging galleries on the{' '}
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
            <li>
              Use <strong>Duplicate</strong> on an existing article to start a new residency post from
              a template.
            </li>
            <li>Articles auto-save while you edit, same as site content and galleries.</li>
          </ul>
        </section>

        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">5. Formatting &amp; writing tips</h3>
          <ul className="list-disc pl-5 space-y-2 text-black/80">
            <li>
              Use the toolbar for bold, italic, underline, links, lists, headings, alignment, and
              quotes. Select text for a quick formatting bar, or press <strong>Ctrl+K</strong> to add a
              link.
            </li>
            <li>
              <strong>Paste from Google Docs or Word:</strong> write in a doc, copy, and paste into any
              text block. Bold, lists, headings, and links come through; fonts and colors are replaced
              with your site&apos;s styling automatically.
            </li>
            <li>
              Drag blocks, FAQ items, about paragraphs, and gallery images using the ⋮⋮ handle.
            </li>
            <li>
              <strong>View on site</strong> opens the public page in a new tab (only when published).
            </li>
            <li>While signed in, a black bar at the bottom of the public site links back to Studio.</li>
          </ul>
        </section>
        <section className="bg-white border border-black/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">6. SEO — search results</h3>
          <div className="text-black/80 leading-relaxed space-y-3">
            <p>
              <strong>SEO</strong> (search engine optimization) controls how your pages look in Google —
              not the page itself, but the <strong>title</strong> and <strong>description</strong> people
              see before they click.
            </p>
            <p>For example, a Google result might look like:</p>
            <div className="rounded-lg border border-black/10 bg-stone-50 px-4 py-3 text-sm">
              <p className="text-[#1a0dab] text-lg leading-snug">Cory Woodall — Cyanotype Artist</p>
              <p className="text-[#006621] text-xs mb-1">https://corywoodall.com</p>
              <p className="text-black/70">
                Contemporary cyanotype prints and artist residencies. Portfolio, articles, and contact.
              </p>
            </div>
            <p>
              The blue line is your <strong>SEO title</strong>. The gray sentence is your{' '}
              <strong>SEO description</strong>. Edit these under{' '}
              <Link href="/studio/site" className="underline">
                Site content
              </Link>{' '}
              (homepage) or in each article&apos;s page settings. If you leave them blank, the site uses
              your normal title and intro text.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
