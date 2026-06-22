export default function SeoExplainer({ variant = 'light', context = 'site' }) {
  const isDark = variant === 'dark';

  const boxClass = isDark
    ? 'rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/85 leading-relaxed'
    : 'rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black/75 leading-relaxed';

  const titleClass = isDark ? 'font-medium text-white mb-1.5' : 'font-medium text-black/90 mb-1.5';

  const contextNote =
    context === 'article'
      ? 'These settings apply to this article when it shows up in Google or when someone shares the link.'
      : 'These settings apply to your homepage when it shows up in Google or when someone shares corywoodall.com.';

  return (
    <div className={boxClass}>
      <p className={titleClass}>What is SEO?</p>
      <p className="mb-2">
        <strong>SEO</strong> (search engine optimization) is simply how your pages look when people find
        you on Google — or when a link is shared on social media. You are not changing the page visitors
        see; you are writing the <strong>title</strong> and <strong>short summary</strong> that appear in
        search results.
      </p>
      <ul className={`list-disc pl-5 space-y-1 mb-2 ${isDark ? 'text-white/80' : ''}`}>
        <li>
          <strong>Title</strong> — the clickable headline in Google (usually also the browser tab name)
        </li>
        <li>
          <strong>Description</strong> — one or two sentences under the title that explain what the page is
          about
        </li>
      </ul>
      <p className={isDark ? 'text-white/70 text-xs' : 'text-black/60 text-xs'}>
        {contextNote} Leave these blank to use your normal page title and intro text automatically.
      </p>
    </div>
  );
}
