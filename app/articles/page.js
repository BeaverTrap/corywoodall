import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Navigation from '../components/Navigation';

const articlesDirectory = path.join(process.cwd(), 'app/articles');

export default function ArticlesIndex() {
  // Get all subdirectories in app/articles (excluding files and [slug])
  const entries = fs.readdirSync(articlesDirectory, { withFileTypes: true });
  const articleDirs = entries.filter(
    (entry) => entry.isDirectory() && entry.name !== '[slug]'
  );

  // For each directory, read page.mdx or page.js and parse frontmatter
  const articles = articleDirs.map((dir) => {
    const mdxPath = path.join(articlesDirectory, dir.name, 'page.mdx');
    const jsPath = path.join(articlesDirectory, dir.name, 'page.js');
    
    if (fs.existsSync(mdxPath)) {
      // Handle MDX files
      const fileContents = fs.readFileSync(mdxPath, 'utf8');
      const { data, content } = matter(fileContents);
      const words = content ? content.split(/\s+/).length : 0;
      const readingTime = Math.max(1, Math.round(words / 200));
      const preview = content ? content.split(/\s+/).slice(0, 40).join(' ') + '…' : '';
      return {
        slug: dir.name,
        ...data,
        readingTime,
        preview,
      };
    } else if (fs.existsSync(jsPath)) {
      // Handle JS files
      if (dir.name === 'what-is-a-cyanotype') {
        return {
          slug: dir.name,
          title: 'What is a Cyanotype?',
          date: '2025-07-12',
          readingTime: 4,
          preview: 'The medium of cyanotype is a photographic one, created with a careful mixture of light sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially. This shadow-fixing process is the basis of all non-digital photography since its invention in 1839.…'
        };
      } else if (dir.name === 'arizona-state-parks-artist-residency-2025') {
        return {
          slug: dir.name,
          title: 'Cory Woodall Selected for Arizona State Parks Artist Residency',
          date: '2025-10-24',
          readingTime: 4,
          preview: 'Flagstaff-based artist Cory Woodall has been selected for the Arizona State Parks Artist Residency Program, hosted at Patagonia Lake State Park and presented in collaboration with Arizona State Parks and Trails and the Arizona Commission on the Arts. During the three-week residency, Cory will continue her exploration of the historic cyanotype process.…'
        };
      }
    }
    return null;
  }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Navigation currentPage="articles" />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h1 className="text-6xl font-black text-black mb-8 tracking-[0.1em]">ARTICLES</h1>
              <p className="text-xl text-black/80 tracking-wide max-w-2xl mx-auto">
                Insights into cyanotype art, historical processes, and contemporary applications
              </p>
            </div>
            <div className="space-y-8">
              {articles.map(article => (
                <div key={article.slug} className="backdrop-blur-md bg-white/50 p-8 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <Link href={`/articles/${article.slug}`} className="text-3xl font-bold text-black tracking-wide hover:underline">
                      {article.title}
                    </Link>
                    <div className="text-sm text-black/60">
                      <span>{article.date}</span>
                      <span className="mx-2">·</span>
                      <span>{article.readingTime} min read</span>
                    </div>
                  </div>
                  <p className="text-lg text-black/80 leading-relaxed tracking-wide">
                    {article.preview}
                  </p>
                  <div className="mt-4">
                    <Link href={`/articles/${article.slug}`} className="text-black font-medium hover:underline">Read more →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 