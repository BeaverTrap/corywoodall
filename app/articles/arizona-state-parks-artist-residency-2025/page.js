import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import ArticleClient from './ArticleClient';

export default async function ArizonaStateParksResidency() {
  const articlesDir = path.join(process.cwd(), 'app/articles');
  const entries = fs.readdirSync(articlesDir, { withFileTypes: true });
  const articleDirs = entries.filter(e => e.isDirectory() && e.name !== '[slug]');
  const articles = articleDirs.map(dir => {
    const mdxPath = path.join(articlesDir, dir.name, 'page.mdx');
    const jsPath = path.join(articlesDir, dir.name, 'page.js');
    
    if (fs.existsSync(mdxPath)) {
      const fileContents = fs.readFileSync(mdxPath, 'utf8');
      const { data, content } = matter(fileContents);
      const words = content ? content.split(/\s+/).length : 0;
      const readingTime = Math.max(1, Math.round(words / 200));
      return { slug: dir.name, ...data, readingTime };
    } else if (fs.existsSync(jsPath) && dir.name === 'arizona-state-parks-artist-residency-2025') {
      return { slug: dir.name, title: 'Cory Woodall Selected for Arizona State Parks Artist Residency', date: '2025-10-24', readingTime: 3 };
    }
    return null;
  }).filter(Boolean).sort((a, b) => new Date(a.date) - new Date(b.date));

  const slug = 'arizona-state-parks-artist-residency-2025';
  const idx = articles.findIndex(a => a.slug === slug);
  const prev = idx > 0 ? articles[idx - 1] : null;
  const next = idx < articles.length - 1 ? articles[idx + 1] : null;

  // Create mock MDX content for the residency article
  const content = `# Artist in Residence: Patagonia Lake State Park (Oct 29–Nov 16, 2025)

I'm honored to be selected for the **Arizona State Parks Artist Residency Program**, hosted at **Patagonia Lake State Park** and presented in collaboration with **Arizona State Parks and Trails** and the **Arizona Commission on the Arts**, with support from the **Arizona Community Foundation**.

My work during the residency will continue my exploration of historic **cyanotype** printmaking—hand-coated papers, light-sensitive chemistry, and ethically sourced botanical specimens arranged to study form and luminous contrast.

> "I'm interested in how light maps the structure of plants—quiet, ethereal impressions that sit between drawing and photography."

- Official announcement from the Arizona Commission on the Arts → [**Read the article**](https://azarts.gov/news/artists-selected-for-state-park-artist-residency-program/)
- Residency announcement on Arizona State Parks' Instagram → [**See the post**](https://www.instagram.com/p/DQHp9xDjqa9/?utm_source=ig_web_copy_link)

## What to Expect

While I may post sparingly **during** the residency, I'll publish a fuller update **after** Nov 16 with:

- A gallery of new cyanotypes created on site
- Notes on process, materials, and plant selection
- Next steps for this body of work (exhibits, editions, and prints)

## Program Notes

The State Parks Artist Residency places artists inside Arizona's landscapes with on-site housing, workspace, and opportunities for open studios and public engagement at the park.

**Partners:** @azstateparks, @azartscomm, @theazfoundation

---

## Follow-up & Updates

Subscribe or check back here; this page will serve as the **central hub** for post-residency images, write-ups, and announcements.`;

  const data = {
    title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
    date: '2025-10-24'
  };

  const mdxSource = await serialize(content);
  const images = []; // No images for this article

  // Social share URLs
  const pageUrl = `https://yourdomain.com/articles/${slug}`;
  const shareText = encodeURIComponent(data.title || '');
  const shareLinks = [
    { href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${shareText}`, label: 'Twitter' },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, label: 'Facebook' },
    { href: `mailto:?subject=${shareText}&body=${encodeURIComponent(pageUrl)}`, label: 'Email' },
  ];

  return (
    <ArticleClient
      data={data}
      mdxSource={mdxSource}
      readingTime={3}
      prev={prev}
      next={next}
      images={images}
      shareLinks={shareLinks}
    />
  );
}