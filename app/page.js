'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { MdBrightness6, MdOpacity } from 'react-icons/md';

  // Add this CSS to your global styles or in a style tag
const styles = `
  .portfolio-item {
    transition: all 0.3s ease-in-out;
  }

  .portfolio-item:hover {
    transform: translateY(-5px);
  }

  /* Custom Lightbox Styles */
  .yarl__toolbar {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 20px !important;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent) !important;
  }

  .yarl__title {
    color: white !important;
    font-size: 18px !important;
    font-weight: 500 !important;
    margin-right: auto !important;
    padding-left: 20px !important;
  }

  .yarl__toolbar_right {
    display: flex !important;
    align-items: center !important;
    gap: 20px !important;
  }

  /* FAQ Styles */
  .faq-item h3 {
    transition: all 0.3s ease;
    border-bottom: 2px solid transparent;
    padding-bottom: 8px;
  }

  .faq-item h3:hover {
    border-bottom-color: rgba(0,0,0,0.3);
  }

  .faq-item p {
    transition: all 0.3s ease;
    overflow: hidden;
  }
`;

// Custom toolbar with sliders
const Toolbar = ({ lightboxOpacity, setLightboxOpacity, lightboxDarkness, setLightboxDarkness, imageTitle }) => {
  return (
    <div className="yarl__toolbar">
      {/* Title on the left */}
      <div className="yarl__title">
        {imageTitle}
      </div>

      {/* Controls on the right */}
      <div className="yarl__toolbar_right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdOpacity color="white" size={20} />
          <input
            type="range"
            min="0"
            max="100"
            value={lightboxOpacity * 100}
            onChange={(e) => setLightboxOpacity(e.target.value / 100)}
            style={{ width: '80px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MdBrightness6 color="white" size={20} />
          <input
            type="range"
            min="0"
            max="100"
            value={lightboxDarkness * 100}
            onChange={(e) => setLightboxDarkness(e.target.value / 100)}
            style={{ width: '80px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const aboutRef = useRef(null);
  const portfolioRef = useRef(null);
  const parallaxRef = useRef(null);
  const californiaNativesRef = useRef(null);
  const glassRef = useRef(null);
  const herbariaRef = useRef(null);
  const snowfallRef = useRef(null);
  const miscWorksRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.05);
  const [activeSection, setActiveSection] = useState('');

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpacity, setLightboxOpacity] = useState(1);
  const [lightboxDarkness, setLightboxDarkness] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      const navbarHeight = 64; // Height of the navbar (h-16 = 64px)
      const element = ref.current;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Add scroll handler for parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Get portfolio and contact section positions
      const portfolioSection = portfolioRef.current?.getBoundingClientRect();
      const contactSection = contactRef.current?.getBoundingClientRect();
      const portfolioOffset = portfolioSection?.top + scrollPosition || 0;
      const contactOffset = contactSection?.top + scrollPosition || 0;
      
      // Calculate the transition zone between portfolio and contact
      const transitionStart = contactOffset - windowHeight; // Start transition one viewport height before contact
      
      // Calculate opacity based on scroll position
      let newOpacity;
      
      if (scrollPosition <= 0) {
        // At the top
        newOpacity = 0.05;
      } else if (scrollPosition < portfolioOffset) {
        // Between top and portfolio
        const progress = scrollPosition / portfolioOffset;
        newOpacity = 0.05 + (progress * (0.9 - 0.05));
      } else if (scrollPosition < transitionStart) {
        // At portfolio section
        newOpacity = 0.9;
      } else if (scrollPosition < contactOffset) {
        // Transitioning to contact section
        const transitionProgress = (scrollPosition - transitionStart) / (contactOffset - transitionStart);
        newOpacity = 0.9 - (transitionProgress * (0.9 - 0.65));
      } else {
        // At contact section
        newOpacity = 0.65;
      }
      
      setOverlayOpacity(newOpacity);

      // Calculate parallax transform
      const parallaxTransform = -(scrollPosition / (documentHeight - windowHeight) * 50);
      const parallaxBg = document.querySelector('.parallax-bg');
      if (parallaxBg) {
        parallaxBg.style.transform = `translateY(${parallaxTransform}%)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // First, modify the intersection observer to handle the hero section
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '-80px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When a section enters the viewport
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        } else {
          // When a section leaves the viewport, check if we're scrolling up
          const scrollingUp = entry.boundingClientRect.y > 0;
          if (scrollingUp) {
            // Find the previous section that's in view
            const sections = [aboutRef.current, portfolioRef.current, contactRef.current, faqRef.current];
            const currentIndex = sections.findIndex(section => section === entry.target);
            if (currentIndex > 0) {
              const previousSection = sections[currentIndex - 1];
              if (previousSection && previousSection.getBoundingClientRect().top < window.innerHeight) {
                setActiveSection(previousSection.id);
              }
            } else if (currentIndex === 0 && window.scrollY < window.innerHeight / 2) {
              setActiveSection(''); // Reset to hero section
            }
          }
        }
      });
    }, observerOptions);

    // Add check for scroll position to handle hero section
    const handleScroll = () => {
      if (window.scrollY < window.innerHeight / 2) {
        setActiveSection(''); // Empty string when in hero section
      }
    };

    const sections = [aboutRef.current, portfolioRef.current, contactRef.current, faqRef.current];
    sections.forEach(section => {
      if (section) {
        sectionObserver.observe(section);
      }
    });

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Your complete portfolio images data
  const portfolioImages = {
    californiaNatives: [
      {
        thumbnail: '/images/portfolio/california_native/thumbs/California Poppy 2022.jpg',
        full: '/images/portfolio/california_native/full/California Poppy 2022.jpg',
        alt: 'California Poppy, 2022'
      },
      {
        thumbnail: '/images/portfolio/california_native/thumbs/CA Native 1.jpg',
        full: '/images/portfolio/california_native/full/CA Native 1.jpg',
        alt: 'California Native Study 1'
      },
      {
        thumbnail: '/images/portfolio/california_native/thumbs/CA Native 2.jpg',
        full: '/images/portfolio/california_native/full/CA Native 2.jpg',
        alt: 'California Native Study 2'
      },
      {
        thumbnail: '/images/portfolio/california_native/thumbs/CA NAtive 3.jpg',
        full: '/images/portfolio/california_native/full/CA NAtive 3.jpg',
        alt: 'California Native Study 3'
      },
      {
        thumbnail: '/images/portfolio/california_native/thumbs/CA NAtive 4.jpg',
        full: '/images/portfolio/california_native/full/CA NAtive 4.jpg',
        alt: 'California Native Study 4'
      },
      {
        thumbnail: '/images/portfolio/california_native/thumbs/Ca Native 5.jpg',
        full: '/images/portfolio/california_native/full/Ca Native 5.jpg',
        alt: 'California Native Study 5'
      }
    ],
    glass: [
      {
        thumbnail: '/images/portfolio/glass/thumbs/Cosmos and Fern 2024.jpg',
        full: '/images/portfolio/glass/full/Cosmos and Fern 2024.jpg',
        alt: 'Cosmos and Fern, 2024'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/Cosmos in Jar May 2023.jpg',
        full: '/images/portfolio/glass/full/Cosmos in Jar May 2023.jpg',
        alt: 'Cosmos in Jar, May 2023'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/FLower in jar MAy 2023 perf.jpg',
        full: '/images/portfolio/glass/full/FLower in jar MAy 2023 perf.jpg',
        alt: 'Flower in Jar, May 2023'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/Flower in jar moms yeard May 2023 editA.jpg',
        full: '/images/portfolio/glass/full/Flower in jar moms yeard May 2023 editA.jpg',
        alt: 'Flower in Jar from Mom\'s Garden, May 2023'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/Pea flower jar 2 May 2023.jpg',
        full: '/images/portfolio/glass/full/Pea flower jar 2 May 2023.jpg',
        alt: 'Pea Flower in Jar, May 2023'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/Phantom flower May 2023 enhance.jpg',
        full: '/images/portfolio/glass/full/Phantom flower May 2023 enhance.jpg',
        alt: 'Phantom Flower, May 2023'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/wildflowers in jar edit crop.jpg',
        full: '/images/portfolio/glass/full/wildflowers in jar edit crop.jpg',
        alt: 'Wildflowers in Jar'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/Paperwhites in jar 4-22-2023.jpg',
        full: '/images/portfolio/glass/full/Paperwhites in jar 4-22-2023.jpg',
        alt: 'Paperwhites in Jar, April 2023'
      },
      {
        thumbnail: '/images/portfolio/glass/thumbs/Wildflower in jar 4-22-23.jpg',
        full: '/images/portfolio/glass/full/Wildflower in jar 4-22-23.jpg',
        alt: 'Wildflower in Jar, April 2023'
      }
    ],
    herbaria: [
      {
        thumbnail: '/images/portfolio/herbaria/thumbs/Blackberry May 2023.jpg',
        full: '/images/portfolio/herbaria/full/Blackberry May 2023.jpg',
        alt: 'Blackberry Study, May 2023'
      },
      {
        thumbnail: '/images/portfolio/herbaria/thumbs/Blue flower aguanga May 2023.jpg',
        full: '/images/portfolio/herbaria/full/Blue flower aguanga May 2023.jpg',
        alt: 'Blue Flower from Aguanga, May 2023'
      },
      {
        thumbnail: '/images/portfolio/herbaria/thumbs/Long flower May 2023 edit.jpg',
        full: '/images/portfolio/herbaria/full/Long flower May 2023 edit.jpg',
        alt: 'Long Flower Study, May 2023'
      },
      {
        thumbnail: '/images/portfolio/herbaria/thumbs/Many baby sprouts May 2023.jpg',
        full: '/images/portfolio/herbaria/full/Many baby sprouts May 2023.jpg',
        alt: 'Many Baby Sprouts, May 2023'
      },
      {
        thumbnail: '/images/portfolio/herbaria/thumbs/Sprouts weed May 2023.jpg',
        full: '/images/portfolio/herbaria/full/Sprouts weed May 2023.jpg',
        alt: 'Sprout Study, May 2023'
      },
      {
        thumbnail: '/images/portfolio/herbaria/thumbs/Three weed sprouts May 2023.jpg',
        full: '/images/portfolio/herbaria/full/Three weed sprouts May 2023.jpg',
        alt: 'Three Weed Sprouts, May 2023'
      },
      {
        thumbnail: '/images/portfolio/herbaria/thumbs/Weed sprout 2022 blue CLEAN WHITE.jpg',
        full: '/images/portfolio/herbaria/full/Weed sprout 2022 blue CLEAN WHITE.jpg',
        alt: 'Weed Sprout Study, 2022'
      }
    ],
    snowfall: [
      {
        thumbnail: '/images/portfolio/snowfall/thumbs/SNOW APRIL 4 2025 FLAGSTAFF CW.jpg',
        full: '/images/portfolio/snowfall/full/SNOW APRIL 4 2025 FLAGSTAFF CW.jpg',
        alt: 'Snowfall, April 4 2025, Flagstaff'
      },
      {
        thumbnail: '/images/portfolio/snowfall/thumbs/Snow quad.jpg',
        full: '/images/portfolio/snowfall/full/Snow quad.jpg',
        alt: 'Snow Quadriptych'
      },
      {
        thumbnail: '/images/portfolio/snowfall/thumbs/Snowfall January, 2025 Flagstaff.jpg',
        full: '/images/portfolio/snowfall/full/Snowfall January, 2025 Flagstaff.jpg',
        alt: 'Snowfall, January 2025, Flagstaff'
      },
      {
        thumbnail: '/images/portfolio/snowfall/thumbs/Snowfall, April 3 2025, Flagstaffcw.jpg',
        full: '/images/portfolio/snowfall/full/Snowfall, April 3 2025, Flagstaffcw.jpg',
        alt: 'Snowfall, April 3 2025, Flagstaff'
      },
      {
        thumbnail: '/images/portfolio/snowfall/thumbs/Snowfall, April 4, 2025 Flagstaff CW.jpg',
        full: '/images/portfolio/snowfall/full/Snowfall, April 4, 2025 Flagstaff CW.jpg',
        alt: 'Snowfall, April 4 2025, Flagstaff'
      }
    ],
    miscWorks: [
      {
        thumbnail: '/images/portfolio/misc_works/thumbs/Lilly of theh Valley Bouquet, Feb 2025.jpg',
        full: '/images/portfolio/misc_works/full/Lilly of theh Valley Bouquet, Feb 2025.jpg',
        alt: 'Lily of the Valley Bouquet, February 2025'
      },
      {
        thumbnail: '/images/portfolio/misc_works/thumbs/Cosmos and Dill varieties May 2023 fb.jpg',
        full: '/images/portfolio/misc_works/full/Cosmos and Dill varieties May 2023 fb.jpg',
        alt: 'Cosmos and Dill Varieties, May 2023'
      },
      {
        thumbnail: '/images/portfolio/misc_works/thumbs/Paperwhites April 25cw.jpg',
        full: '/images/portfolio/misc_works/full/Paperwhites April 25cw.jpg',
        alt: 'Paperwhites, April 25'
      },
      {
        thumbnail: '/images/portfolio/misc_works/thumbs/foliage.jpg',
        full: '/images/portfolio/misc_works/full/foliage.jpg',
        alt: 'Foliage Study'
      },
      {
        thumbnail: '/images/portfolio/misc_works/thumbs/Sweet Potato sprouting - 2022.jpg',
        full: '/images/portfolio/misc_works/full/Sweet Potato sprouting - 2022.jpg',
        alt: 'Sweet Potato Sprouting, 2022'
      },
      {
        thumbnail: '/images/portfolio/misc_works/thumbs/Seaweed and flower April 2023.jpg',
        full: '/images/portfolio/misc_works/full/Seaweed and flower April 2023.jpg',
        alt: 'Seaweed and Flower, April 2023'
      },
      {
        thumbnail: '/images/portfolio/misc_works/thumbs/Lilly and leaves.jpg',
        full: '/images/portfolio/misc_works/full/Lilly and leaves.jpg',
        alt: 'Lily and Leaves'
      }
    ]
  };

  // Define your portfolio sections
  const portfolioSections = [
    {
      title: "California Natives",
      coverImage: "/images/portfolio/california_native/california_native-cover.jpg",
      images: portfolioImages.californiaNatives
    },
    {
      title: "Glass",
      coverImage: "/images/portfolio/glass/glass-cover.jpg",
      images: portfolioImages.glass
    },
    {
      title: "Herbaria",
      coverImage: "/images/portfolio/herbaria/herbaria-cover.jpg",
      images: portfolioImages.herbaria
    },
    {
      title: "Snowfall",
      coverImage: "/images/portfolio/snowfall/snowfall-cover.jpg",
      images: portfolioImages.snowfall
    },
    {
      title: "Misc Works",
      coverImage: "/images/portfolio/misc_works/misc_works-cover.jpg",
      images: portfolioImages.miscWorks
    }
  ];



  return (
    <>
      <style jsx global>{styles}</style>
      <div className="relative">
        {/* Fixed background with parallax and overlay */}
        <div className="fixed inset-0 w-full h-full z-0">
          <div className="parallax-bg absolute inset-0 w-full h-[200vh]">
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
            <div 
              className="absolute inset-0 bg-white"
              style={{ opacity: overlayOpacity }}
            />
          </div>
        </div>

        {/* Content container */}
        <div className="relative z-10">
          {/* Navbar */}
          <nav className="fixed top-0 left-0 right-0 bg-white/20 backdrop-blur-md shadow-lg z-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center h-16">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-xl font-black hover:scale-105 transition-all duration-300 tracking-[0.2em] text-black"
                  >
                    CORY WOODALL
                  </button>
                  <span className="font-medium opacity-30 transition-all duration-300 text-black">|</span>
                  <button 
                    onClick={() => scrollToSection(aboutRef)}
                    className={`text-black transition-all duration-300 ${
                      activeSection === 'about' 
                        ? 'opacity-100 scale-110 font-bold' 
                        : 'opacity-70 hover:scale-110 hover:opacity-100'
                    }`}
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection(portfolioRef)}
                    className={`text-black transition-all duration-300 ${
                      activeSection === 'portfolio' 
                        ? 'opacity-100 scale-110 font-bold' 
                        : 'opacity-70 hover:scale-110 hover:opacity-100'
                    }`}
                  >
                    Portfolio
                  </button>
                  <button 
                    onClick={() => scrollToSection(contactRef)}
                    className={`text-black transition-all duration-300 ${
                      activeSection === 'contact' 
                        ? 'opacity-100 scale-110 font-bold' 
                        : 'opacity-70 hover:scale-110 hover:opacity-100'
                    }`}
                  >
                    Contact
                  </button>
                  <button 
                    onClick={() => scrollToSection(faqRef)}
                    className={`text-black transition-all duration-300 ${
                      activeSection === 'faq' 
                        ? 'opacity-100 scale-110 font-bold' 
                        : 'opacity-70 hover:scale-110 hover:opacity-100'
                    }`}
                  >
                    FAQ
                  </button>
                  <Link 
                    href="/articles"
                    className="text-black transition-all duration-300 opacity-70 hover:scale-110 hover:opacity-100"
                  >
                    Articles
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero section */}
          <section className="relative min-h-screen w-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-7xl md:text-8xl font-black text-white mb-16 tracking-[0.1em]">
                CORY WOODALL
              </h1>
              <div className="backdrop-blur-md bg-white/50 p-8 rounded-lg max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl text-black font-bold mb-6 tracking-wider">
                  Cyanotype Resurgence
                </h2>
                <p className="text-xl md:text-2xl text-black font-medium tracking-wide">
                  A modern revival of the historic cyanotype process, blending traditional UV exposure with contemporary themes and materials.
                </p>
              </div>
            </div>
          </section>

          {/* About section */}
          <section id="about" ref={aboutRef} className="min-h-screen flex items-center justify-center py-20">
            <div className="container mx-auto px-4 max-w-3xl backdrop-blur-md bg-white/50 p-8 rounded-lg">
              <div className="space-y-8 text-black">
                <p className="text-lg leading-relaxed tracking-wide">
                  <strong className="font-black tracking-wider">Cory Woodall</strong> is an art historian, curator, and contemporary artist specializing in the historic cyanotype process. A graduate of the University of California, San Diego, she merges early photographic techniques with modern artistic perspectives to create evocative, nature-inspired works.
                </p>
                <p className="text-lg leading-relaxed tracking-wide">
                  Drawing inspiration from early photography pioneers, Cory reinterprets the medium of cyanotype through the lens of modern botanical studies. Using hand-coated, light-sensitive paper, she arranges ethically sourced plant specimens to create luminous, organic compositions that highlight nature's intricate beauty.
                </p>
                <p className="text-lg leading-relaxed tracking-wide">
                  Her work bridges science, history, and art, transforming delicate botanical forms into striking imagery. Each piece reflects a meticulous process of selection, arrangement, and exposure, resulting in a timeless fusion of historical craftsmanship and contemporary expression.
                </p>
                <p className="text-lg leading-relaxed tracking-wide">
                  Cory currently lives and works in Flagstaff, Arizona, where she enables and incentivizes local artists. She has previously served as Assistant Curator at The San Diego Museum of Art and Curator of the Juneau-Douglas City Museum in Alaska.
                </p>
              </div>
            </div>
          </section>

          {/* Portfolio section */}
          <section id="portfolio" ref={portfolioRef} className="relative min-h-screen pt-16 pb-32">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {/* Portfolio grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {portfolioSections.slice(0, 3).map((section, index) => (
                    <div 
                      key={section.title} 
                      className="portfolio-item w-full max-w-md mx-auto relative group"
                    >
                      <div 
                        className="relative aspect-square cursor-pointer overflow-hidden transform transition-transform duration-300 group-hover:scale-105"
                        onClick={() => {
                          setSelectedGallery(section);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <Image
                          src={section.coverImage}
                          alt={section.title}
                          fill
                          className="object-contain relative z-10"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-2xl font-bold text-black tracking-wider transition-opacity duration-300 group-hover:hidden">
                          {section.title}
                        </p>
                        <p className="text-2xl font-bold text-black tracking-wider hidden group-hover:block">
                          View Gallery
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Second row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[calc(66.666%-1rem)] mx-auto">
                  {portfolioSections.slice(3, 5).map((section, index) => (
                    <div 
                      key={section.title} 
                      className="portfolio-item w-full max-w-md mx-auto relative group"
                    >
                      <div 
                        className="relative aspect-square cursor-pointer overflow-hidden transform transition-transform duration-300 group-hover:scale-105"
                        onClick={() => {
                          setSelectedGallery(section);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <Image
                          src={section.coverImage}
                          alt={section.title}
                          fill
                          className="object-contain relative z-10"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-2xl font-bold text-black tracking-wider transition-opacity duration-300 group-hover:hidden">
                          {section.title}
                        </p>
                        <p className="text-2xl font-bold text-black tracking-wider hidden group-hover:block">
                          View Gallery
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Add spacer for separation */}
          <div className="h-[50vh]"></div>

          {/* Contact section */}
          <section id="contact" ref={contactRef} className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-2xl">
              <div className="text-center">
                <div className="backdrop-blur-md bg-white/50 p-12 rounded-lg">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-black tracking-wide">Contact</h3>
                      <p className="text-lg text-black/80 leading-relaxed">
                        Available for commissions, gallery exhibitions, and educational workshops.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-center space-x-4">
                        <span className="text-black/60 text-lg">Email:</span>
                        <a 
                          href="mailto:woodallcory@gmail.com" 
                          className="text-xl text-black hover:text-gray-700 transition-colors duration-300 font-medium"
                        >
                          woodallcory@gmail.com
                        </a>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <span className="text-black/60 text-lg">Location:</span>
                        <span className="text-xl text-black font-medium">
                          Flagstaff, Arizona
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-black/20">
                      <p className="text-sm text-black/60">
                        Please include details about your project or inquiry in your email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Add spacer for separation */}
          <div className="h-[25vh]"></div>

          {/* FAQ section */}
          <section id="faq" ref={faqRef} className="min-h-screen flex items-center justify-center py-20">
            <div className="container mx-auto px-4 max-w-3xl backdrop-blur-md bg-white/50 p-8 rounded-lg">
              <h2 className="text-5xl font-black text-center mb-12 text-black tracking-[0.1em]">FAQ</h2>
              <div className="space-y-8 text-black">
                                 <div className="faq-item">
                   <h3 className="text-3xl font-bold mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}>
                     What is cyanotype art?
                   </h3>
                   <div className={`${openFaqIndex === 0 ? 'block' : 'hidden'}`}>
                     <p className="text-lg leading-relaxed tracking-wide mb-4">
                       The medium of cyanotype is a photographic one, created with a careful mixture of light sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially. This shadow-fixing process is the basis of all non-digital photography since its invention in 1839. The major difference between the numerous ways of making photographic prints is the materials involved that makes a surface light sensitive with the ability to capture and preserve impressions of light and shadow. Cyanotype emulsion (a liquid) uses a combination of water and chemicals that are available commercially today and can be applied to a variety of support surfaces, including paper, fabric, and ceramic.
                     </p>
                     <Link href="/articles" className="text-sm text-gray-600 hover:text-black transition-colors duration-300">
                       Read more about cyanotype art in our articles section →
                     </Link>
                   </div>
                 </div>
                <div className="faq-item">
                  <h3 className="text-3xl font-bold mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}>
                    How does cyanotype work?
                  </h3>
                  <p className={`text-lg leading-relaxed tracking-wide ${openFaqIndex === 1 ? 'block' : 'hidden'}`}>
                    The cyanotype process involves exposing light-sensitive paper to a solution of ferric ammonium citrate (FAC) and potassium ferricyanide (K3Fe(CN)6). When light hits the paper, it creates a latent image. The paper is then immersed in a developer (usually a solution of ferrous ammonium sulfate) to reveal the blue print. Cory's work involves careful exposure to UV light and precise timing of the developer application.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-3xl font-bold mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}>
                    What materials do you use for cyanotype?
                  </h3>
                  <p className={`text-lg leading-relaxed tracking-wide ${openFaqIndex === 2 ? 'block' : 'hidden'}`}>
                    Cory uses a variety of light-sensitive papers, including cotton rag, watercolor, and specialty papers. She also works with natural materials like leaves, flowers, and plant specimens. The choice of paper and materials is crucial for achieving the desired results, as each has its own sensitivity and characteristics.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-3xl font-bold mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}>
                    How long does a cyanotype print take to develop?
                  </h3>
                  <p className={`text-lg leading-relaxed tracking-wide ${openFaqIndex === 3 ? 'block' : 'hidden'}`}>
                    The development time can vary greatly depending on the paper, exposure, and developer. A typical cyanotype print takes anywhere from 10 minutes to several hours to develop. Cory's prints often require multiple exposures and careful timing to achieve the desired effect.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-3xl font-bold mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}>
                    Are cyanotype prints permanent?
                  </h3>
                  <p className={`text-lg leading-relaxed tracking-wide ${openFaqIndex === 4 ? 'block' : 'hidden'}`}>
                    Cyanotype prints are indeed permanent. The blue image created on the paper is chemically bonded and will not fade or wash away. This makes them ideal for long-term preservation and exhibition.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-3xl font-bold mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}>
                    Can I make my own cyanotype prints?
                  </h3>
                  <p className={`text-lg leading-relaxed tracking-wide ${openFaqIndex === 5 ? 'block' : 'hidden'}`}>
                    Yes, absolutely! Cory offers workshops and tutorials for beginners to learn the basics of cyanotype. The process is relatively simple and can be done with common household items. It's a great way to engage with the medium and create your own unique prints.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Just the Lightbox */}
        <Lightbox
          open={isLightboxOpen}
          close={() => {
            setIsLightboxOpen(false);
            setSelectedGallery(null);
          }}
          index={photoIndex}
          slides={(selectedGallery?.images ?? []).map(image => ({
            src: image.full,
            description: `${image.alt}\n2023\n${selectedGallery?.title}`
          }))}
          plugins={[Zoom, Captions]}
          captions={{ 
            showToggle: false, 
            descriptionTextAlign: 'left'
          }}
          styles={{
            container: { 
              backgroundColor: '#000000'
            },
            captionsDescriptionContainer: {
              backgroundColor: 'transparent',
              position: 'absolute',
              bottom: '40px',
              left: '60px',
              right: 0,
              padding: '0 40px'
            },
            captionsDescription: {
              color: 'white',
              fontSize: '20px',
              fontWeight: '400',
              whiteSpace: 'pre-line',
              lineHeight: '1.5'
            }
          }}
        />
      </div>
    </>
  );
} 