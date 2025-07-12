import Image from 'next/image';
import Link from 'next/link';

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
                <Link href="/articles" className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100">
                  Articles
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 