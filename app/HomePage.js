'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from './components/Navigation';
import SiteEditBar from './components/SiteEditBar';
import ContactForm from './components/ContactForm';
import { CmsRichText } from './components/CmsRichText';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
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

  /* Lightbox hover behavior */
  .yarl__slide:hover .yarl__captions_description_container {
    opacity: 1 !important;
  }
  
  /* Ensure captions are visible on hover */
  .yarl__slide:hover .yarl__captions_description_container {
    opacity: 1 !important;
    transition: opacity 0.3s ease-in-out !important;
  }
  
  /* Additional hover rules for lightbox captions */
  .yarl__container:hover .yarl__captions_description_container {
    opacity: 1 !important;
  }
  
  .yarl__slide:hover .yarl__captions_description_container {
    opacity: 1 !important;
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

export default function Home({ portfolioSections, siteContent }) {
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
  const [captionOpacity, setCaptionOpacity] = useState(0.4);
  const [mouseTimeout, setMouseTimeout] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  const handleMouseMove = () => {
    setCaptionOpacity(1);
    if (mouseTimeout) {
      clearTimeout(mouseTimeout);
    }
    const timeout = setTimeout(() => {
      setCaptionOpacity(0.4);
    }, 2000);
    setMouseTimeout(timeout);
  };

  const goToNextGallery = () => {
    const nextIndex = (currentGalleryIndex + 1) % portfolioSections.length;
    setCurrentGalleryIndex(nextIndex);
    setSelectedGallery(portfolioSections[nextIndex]);
    setPhotoIndex(0);
    setIsLightboxOpen(false);
    setTimeout(() => setIsLightboxOpen(true), 10);
  };

  const goToPreviousGallery = () => {
    const prevIndex = currentGalleryIndex === 0 ? portfolioSections.length - 1 : currentGalleryIndex - 1;
    setCurrentGalleryIndex(prevIndex);
    setSelectedGallery(portfolioSections[prevIndex]);
    setPhotoIndex(0);
    setIsLightboxOpen(false);
    setTimeout(() => setIsLightboxOpen(true), 10);
  };

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

  // Use scroll position to determine active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Get section positions
      const aboutTop = aboutRef.current?.offsetTop || 0;
      const portfolioTop = portfolioRef.current?.offsetTop || 0;
      const contactTop = contactRef.current?.offsetTop || 0;
      const faqTop = faqRef.current?.offsetTop || 0;
      
      // Determine which section is currently active
      if (scrollY < windowHeight / 2) {
        setActiveSection(''); // Hero section
      } else if (scrollY < portfolioTop - 100) {
        setActiveSection('about');
      } else if (scrollY < contactTop - 100) {
        setActiveSection('portfolio');
      } else if (scrollY < faqTop - 100) {
        setActiveSection('contact');
      } else {
        setActiveSection('faq');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { hero, about, contact, faq } = siteContent.home;

  const renderAboutParagraph = (paragraph, index) => {
    const className = 'text-sm sm:text-base md:text-lg leading-relaxed tracking-wide';
    if (paragraph.includes('<')) {
      return (
        <CmsRichText
          key={`about-${index}`}
          as="div"
          className={className}
          value={paragraph}
        />
      );
    }
    return (
      <p key={`about-${index}`} className={className}>
        {paragraph}
      </p>
    );
  };

  return (
    <>
      <style jsx global>{styles}</style>
      <div className="relative">
        {/* Fixed background with parallax and overlay */}
        <div className="fixed inset-0 w-full h-full z-0">
          <div className="parallax-bg absolute inset-0 w-full h-[200vh]">
            <div className="relative w-full h-full">
              <Image
                src={hero.backgroundImage}
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
        <div className="relative z-10 pb-20">
          {/* Navigation */}
          <Navigation currentPage="home" activeSection={activeSection} />

          {/* Hero section */}
          <section className="relative min-h-screen w-full flex items-center justify-center">
            <div className="text-center px-4">
              <CmsRichText
                as="h1"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 md:mb-16 tracking-[0.1em]"
                value={hero.name}
              />
              <div className="backdrop-blur-md bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg max-w-2xl mx-auto">
                <CmsRichText
                  as="h2"
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-bold mb-4 md:mb-6 tracking-wider"
                  value={hero.subtitle}
                />
                <CmsRichText
                  as="p"
                  className="text-sm sm:text-base md:text-xl lg:text-2xl text-black font-medium tracking-wide leading-relaxed"
                  value={hero.tagline}
                />
              </div>
            </div>
          </section>

          {/* About section */}
          <section id="about" ref={aboutRef} className="min-h-screen flex items-center justify-center py-10 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl backdrop-blur-md bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg">
              <div className="space-y-4 md:space-y-8 text-black">
                {about.paragraphs.map(renderAboutParagraph)}
              </div>
            </div>
          </section>

          {/* Portfolio section */}
          <section id="portfolio" ref={portfolioRef} className="relative min-h-screen pt-16 pb-32">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {/* Portfolio list */}
                <div className="space-y-16">
                  {portfolioSections.map((section, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div 
                        key={section.title} 
                        className={`flex flex-col md:flex-row gap-8 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                      >
                        {/* Image */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                          <div 
                            className="relative aspect-square cursor-pointer overflow-hidden transform transition-transform duration-300 hover:scale-105"
                            onClick={() => {
                              setSelectedGallery(section);
                              setCurrentGalleryIndex(index);
                              setIsLightboxOpen(true);
                            }}
                          >
                            <Image
                              src={section.coverImage}
                              alt={section.title}
                              fill
                              className="object-contain relative z-10"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div className="w-full md:w-2/3">
                          <CmsRichText
                            as="h3"
                            className="text-3xl font-bold text-black tracking-wider mb-4"
                            value={section.title}
                          />
                          <div className="backdrop-blur-md bg-white/80 p-6 rounded-lg border border-white/20 shadow-lg">
                            {section.description.includes('<') ? (
                              <CmsRichText
                                as="div"
                                className="text-lg text-gray-800 leading-relaxed mb-4"
                                value={section.description}
                              />
                            ) : (
                              <>
                                <p className="text-lg text-gray-800 leading-relaxed mb-4">
                                  {section.description.split('\n\n')[0]}
                                </p>
                                {section.description.split('\n\n').length > 1 && (
                                  <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Works in this series:</p>
                                    <div className="space-y-1">
                                      {section.description.split('\n\n')[1].split('\n').map((work, workIndex) => (
                                        <button
                                          key={workIndex}
                                          onClick={() => {
                                            setSelectedGallery(section);
                                            setPhotoIndex(workIndex);
                                            setIsLightboxOpen(true);
                                          }}
                                          className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-left"
                                        >
                                          {work}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            
                            <button 
                              onClick={() => {
                                setSelectedGallery(section);
                                setIsLightboxOpen(true);
                              }}
                              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
                            >
                              View All Images
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Add spacer for separation */}
          <div className="h-[50vh]"></div>

          {/* Contact section */}
          <section id="contact" ref={contactRef} className="min-h-screen flex items-center justify-center py-10 md:py-0">
            <div className="container mx-auto px-4 max-w-2xl">
              <div className="text-center">
                <div className="backdrop-blur-md bg-white/50 p-4 sm:p-8 md:p-12 rounded-lg">
                  <div className="space-y-4 md:space-y-8">
                    <div className="space-y-2 md:space-y-4">
                      <CmsRichText
                        as="h3"
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-wide"
                        value={contact.heading}
                      />
                      <CmsRichText
                        as="p"
                        className="text-sm sm:text-base md:text-lg text-black/80 leading-relaxed"
                        value={contact.intro}
                      />
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <span className="text-black/60 text-sm sm:text-base md:text-lg">Email:</span>
                        <a 
                          href={`mailto:${contact.email}`}
                          className="text-sm sm:text-base md:text-xl text-black hover:text-gray-700 transition-colors duration-300 font-medium break-all"
                        >
                          {contact.email}
                        </a>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <span className="text-black/60 text-sm sm:text-base md:text-lg">Location:</span>
                        <span className="text-sm sm:text-base md:text-xl text-black font-medium">
                          {contact.location}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 md:pt-6 border-t border-black/20">
                      <CmsRichText
                        as="p"
                        className="text-xs sm:text-sm text-black/60"
                        value={contact.footerNote}
                      />
                    </div>

                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Add spacer for separation */}
          <div className="h-[25vh]"></div>

          {/* FAQ section */}
          <section id="faq" ref={faqRef} className="min-h-screen flex items-center justify-center py-10 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl backdrop-blur-md bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg">
              <CmsRichText
                as="h2"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center mb-6 md:mb-12 text-black tracking-[0.1em]"
                value={faq.title}
              />
              <div className="space-y-4 md:space-y-8 text-black">
                {faq.items.map((item, index) => (
                  <div key={item.question} className="faq-item">
                    <CmsRichText
                      as="h3"
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 cursor-pointer"
                      value={item.question}
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    />
                    <div className={openFaqIndex === index ? 'block' : 'hidden'}>
                      {item.answer?.includes('<') ? (
                        <div
                          className="text-sm sm:text-base md:text-lg leading-relaxed tracking-wide mb-4 cms-rich-text"
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      ) : (
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed tracking-wide mb-4">
                          {item.answer}
                        </p>
                      )}
                      {item.showArticlesLink && (
                        <Link href="/articles" className="text-sm text-gray-600 hover:text-black transition-colors duration-300">
                          Read more about cyanotype art in our articles section →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
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
            description: `${selectedGallery?.title}\n${image.alt}`
          }))}
          plugins={[Zoom, Captions, Counter]}
          captions={{ 
            showToggle: false, 
            descriptionTextAlign: 'left'
          }}
          onMouseMove={handleMouseMove}
          styles={{
            container: { 
              backgroundColor: '#000000'
            },
            captionsDescriptionContainer: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              position: 'absolute',
              bottom: '60px',
              left: '20px',
              right: 'auto',
              width: 'auto',
              maxWidth: '300px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              opacity: captionOpacity,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: 'none',
              zIndex: 1000
            },
            captionsDescription: {
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'pre-line',
              lineHeight: '1.4',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              margin: '0'
            }
          }}
        />
        <SiteEditBar />
      </div>
    </>
  );
} 