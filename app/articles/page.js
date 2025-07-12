'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Articles() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      title: "What is a cyanotype?",
      excerpt: "The medium of cyanotype is a photographic one, created with a careful mixture of light sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially.",
      date: "2024",
      readTime: "5 min read",
      content: `
        <p>The medium of cyanotype is a photographic one, created with a careful mixture of light sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially. This shadow-fixing process is the basis of all non-digital photography since its invention in 1839. The major difference between the numerous ways of making photographic prints is the materials involved that makes a surface light sensitive with the ability to capture and preserve impressions of light and shadow. Cyanotype emulsion (a liquid) uses a combination of water and chemicals that are available commercially today and can be applied to a variety of support surfaces, including paper, fabric, and ceramic.</p>
        
        <p>A cyanotype can be made with a negative (procured via cameras either digitally or on film) to produce a positive print, or by placing objects directly onto the sensitized support surface. The latter is referred to as a "photogram" and is the type of work I typically make.</p>
        
        <p>Cyanotype paper begins to develop as soon as it encounters sunlight (or artificial UV light), so the emulsion coating, drying, and arrangement of the subject material (negatives or objects) takes place in dark interiors. I frequently treat my papers at night and leave them to dry before scrambling to store them in a light-proof box in the morning.</p>
        
        <p>When the composition is satisfactory, the support surface and the subject material are moved into sunlight to be exposed. In high UV areas like Flagstaff, the exposure time can take less than 3 minutes, whereas lower UV climates will need half an hour or longer to achieve their desired results. UV lamps can alternatively be used and make for an excellent substitute in winter.</p>
        
        <p>Finally, the cyanotype is moved back indoors and out of the UV light, halting the exposure. The subject material is removed, and the support surface is rinsed with water. The rinsing will reveal a blue and white image within minutes. The support surface is then left to dry, and the process is complete. I like to dry my works on paper flat on my cement floor, and I find that the natural water tension of the wet print helps it lay flat during the drying process, resulting in a relatively flat finished product. Works on fabric typically get draped on coat hangers over my bathtub.</p>
        
        <p>Like most photographic works, cyanotype prints are moderately light stable. If exposed to direct sunlight over years the imagery will eventually fade. This ephemeral quality of the cyanotype makes it even more precious in the years they are at their most vibrant. To extend the life of your cyanotypes, consider rotating their display every 6 months to allow works to "rest" in a dark place.</p>
      `
    }
    // Future articles can be added here
  ];

  return (
    <div className="relative min-h-screen">
      {/* Fixed background with overlay */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/background.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-white" style={{ opacity: 0.65 }} />
      </div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 bg-white/20 backdrop-blur-md shadow-lg z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-16">
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-xl font-black hover:scale-105 transition-all duration-300 tracking-[0.2em] text-black">
                  CORY WOODALL
                </Link>
                <span className="font-medium opacity-30 transition-all duration-300 text-black">|</span>
                <Link href="/#about" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  About
                </Link>
                <Link href="/#portfolio" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  Portfolio
                </Link>
                <Link href="/#contact" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  Contact
                </Link>
                <Link href="/#faq" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  FAQ
                </Link>
                <span className="font-medium opacity-30 transition-all duration-300 text-black">|</span>
                <span className="text-black font-bold opacity-100">Articles</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-6xl font-black text-black mb-8 tracking-[0.1em]">ARTICLES</h1>
              <p className="text-xl text-black/80 tracking-wide max-w-2xl mx-auto">
                Insights into cyanotype art, historical processes, and contemporary applications
              </p>
            </div>

            {/* Articles list */}
            <div className="space-y-8">
              {articles.map((article) => (
                <div 
                  key={article.id}
                  className="backdrop-blur-md bg-white/50 p-8 rounded-lg cursor-pointer hover:bg-white/60 transition-all duration-300"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold text-black tracking-wide">{article.title}</h2>
                    <div className="text-sm text-black/60">
                      <span>{article.date}</span>
                      <span className="mx-2">•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <p className="text-lg text-black/80 leading-relaxed tracking-wide">
                    {article.excerpt}
                  </p>
                  <div className="mt-4">
                    <span className="text-black font-medium hover:underline">Read more →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Article modal */}
            {selectedArticle && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-4xl font-bold text-black tracking-wide">{selectedArticle.title}</h2>
                      <button 
                        onClick={() => setSelectedArticle(null)}
                        className="text-2xl text-black/60 hover:text-black transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-sm text-black/60 mb-8">
                      <span>{selectedArticle.date}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedArticle.readTime}</span>
                    </div>
                    <div 
                      className="prose prose-lg max-w-none text-black leading-relaxed tracking-wide"
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 