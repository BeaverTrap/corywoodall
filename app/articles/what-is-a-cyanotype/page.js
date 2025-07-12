import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import ArticleClient from './ArticleClient';

export default async function CyanotypePage() {
  const articlesDir = path.join(process.cwd(), 'app/articles');
  const entries = fs.readdirSync(articlesDir, { withFileTypes: true });
  const articleDirs = entries.filter(e => e.isDirectory() && e.name !== '[slug]');
  const articles = articleDirs.map(dir => {
    const mdxPath = path.join(articlesDir, dir.name, 'page.mdx');
    if (!fs.existsSync(mdxPath)) return null;
    const fileContents = fs.readFileSync(mdxPath, 'utf8');
    const { data, content } = matter(fileContents);
    const words = content ? content.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.round(words / 200));
    return { slug: dir.name, ...data, readingTime };
  }).filter(Boolean).sort((a, b) => new Date(a.date) - new Date(b.date));

  const slug = 'what-is-a-cyanotype';
  const idx = articles.findIndex(a => a.slug === slug);
  const prev = idx > 0 ? articles[idx - 1] : null;
  const next = idx < articles.length - 1 ? articles[idx + 1] : null;

  const mdxPath = path.join(articlesDir, slug, 'page.mdx');
  const fileContents = fs.readFileSync(mdxPath, 'utf8');
  const { data, content } = matter(fileContents);
  const mdxSource = await serialize(content);

  // Extract all image URLs from the MDX content
  const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  const images = [];
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({ src: match[1] });
  }

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
      readingTime={articles[idx]?.readingTime}
      prev={prev}
      next={next}
      images={images}
      shareLinks={shareLinks}
    />
  );
} 