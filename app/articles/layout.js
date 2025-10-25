import Image from 'next/image';
import Navigation from '../components/Navigation';

export default function ArticlesLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background image with overlay */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Image
          src="/images/background.jpg"
          alt="Background"
          fill
          priority
          className="object-cover parallax-bg"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" style={{ zIndex: 1 }} />
      </div>
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation currentPage="articles" />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 