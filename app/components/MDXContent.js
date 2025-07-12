'use client';

import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';

const components = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-black mb-6 tracking-wide">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-bold text-black mb-4 mt-8 tracking-wide">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-bold text-black mb-3 mt-6 tracking-wide">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-lg text-black/80 leading-relaxed tracking-wide mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-lg text-black/80 leading-relaxed tracking-wide mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-lg text-black/80 leading-relaxed tracking-wide mb-4 space-y-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-lg text-black/80 leading-relaxed tracking-wide">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-black/30 pl-6 italic text-lg text-black/70 leading-relaxed tracking-wide mb-4">{children}</blockquote>
  ),
  img: ({ src, alt, ...props }) => (
    <div className="my-8">
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={600}
        className="rounded-lg shadow-lg w-full h-auto"
        {...props}
      />
    </div>
  ),
};

export default function MDXContent({ source }) {
  return <MDXRemote {...source} components={components} />;
} 