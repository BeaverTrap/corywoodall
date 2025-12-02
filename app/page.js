'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from './components/Navigation';
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

  // Your complete portfolio images data
  const portfolioImages = {
    newWorks2025: [
      {
        thumbnail: '/images/portfolio/new_works_2025/thumbs/Evening Primrose May 2025.jpg',
        full: '/images/portfolio/new_works_2025/full/Evening Primrose May 2025.jpg',
        alt: 'Evening Primrose, May 2025'
      },
      {
        thumbnail: '/images/portfolio/new_works_2025/thumbs/Lily of the Valley 2025.jpg',
        full: '/images/portfolio/new_works_2025/full/Lily of the Valley 2025.jpg',
        alt: 'Lily of the Valley, 2025'
      }
    ],
    arrangements: [
      {
        thumbnail: '/images/portfolio/Arrangements/Cosmos and Dill 2024.jpg',
        full: '/images/portfolio/Arrangements/Cosmos and Dill 2024.jpg',
        alt: 'Cosmos and Dill, 2024'
      },
      {
        thumbnail: '/images/portfolio/Arrangements/Viola May 2023 editA.jpg',
        full: '/images/portfolio/Arrangements/Viola May 2023 editA.jpg',
        alt: 'Viola (vase), 2023'
      },
      {
        thumbnail: '/images/portfolio/Arrangements/Phantom flower May 2023 enhance.jpg',
        full: '/images/portfolio/Arrangements/Phantom flower May 2023 enhance.jpg',
        alt: 'Phantom Flower, 2023'
      },
      {
        thumbnail: '/images/portfolio/Arrangements/wildflowers in jar edit crop.jpg',
        full: '/images/portfolio/Arrangements/wildflowers in jar edit crop.jpg',
        alt: 'Wildflowers (vase), 2025'
      },
      {
        thumbnail: '/images/portfolio/Arrangements/Tiger Lillies in vase with foliagecw.jpg',
        full: '/images/portfolio/Arrangements/Tiger Lillies in vase with foliagecw.jpg',
        alt: 'Tiger Lilies (vase), 2025'
      }
    ],
    herbaria: [
      {
        thumbnail: '/images/portfolio/Herbaria/Sapling 2022 blue CLEAN WHITE.jpg',
        full: '/images/portfolio/Herbaria/Sapling 2022 blue CLEAN WHITE.jpg',
        alt: 'Sapling, 2022'
      },
      {
        thumbnail: '/images/portfolio/Herbaria/California Poppy 2022.jpg',
        full: '/images/portfolio/Herbaria/California Poppy 2022.jpg',
        alt: 'California Poppy, 2022'
      },
      {
        thumbnail: '/images/portfolio/Herbaria/Blackberry May 2023.jpg',
        full: '/images/portfolio/Herbaria/Blackberry May 2023.jpg',
        alt: 'Blackberry Blossoms, May 2023'
      },
      {
        thumbnail: '/images/portfolio/Herbaria/Honeysuckle Fucshia.jpg',
        full: '/images/portfolio/Herbaria/Honeysuckle Fucshia.jpg',
        alt: 'Honeysuckle Fuchsia, May 2023'
      },
      {
        thumbnail: '/images/portfolio/Herbaria/Paperwhites April 25cw.jpg',
        full: '/images/portfolio/Herbaria/Paperwhites April 25cw.jpg',
        alt: 'Paperwhites, April 2025'
      },
      {
        thumbnail: '/images/portfolio/Herbaria/Evening Primrose group.jpg',
        full: '/images/portfolio/Herbaria/Evening Primrose group.jpg',
        alt: 'Three Weed Sprouts, 2023'
      }
    ],
    snowfall: [
      {
        thumbnail: '/images/portfolio/Snowfall/Snow quad.jpg',
        full: '/images/portfolio/Snowfall/Snow quad.jpg',
        alt: 'Snowfall (quadriptych), April 4 2025, Flagstaff AZ'
      },
      {
        thumbnail: '/images/portfolio/Snowfall/Snowfall 1 of 4.jpg',
        full: '/images/portfolio/Snowfall/Snowfall 1 of 4.jpg',
        alt: 'Snowfall (1 of 4), April 4 2025, Flagstaff AZ'
      },
      {
        thumbnail: '/images/portfolio/Snowfall/Snowfall 2 of 4.jpg',
        full: '/images/portfolio/Snowfall/Snowfall 2 of 4.jpg',
        alt: 'Snowfall (2 of 4), April 4 2025, Flagstaff AZ'
      },
      {
        thumbnail: '/images/portfolio/Snowfall/Snowfall 3 of 4 Flagstaff CW2.jpg',
        full: '/images/portfolio/Snowfall/Snowfall 3 of 4 Flagstaff CW2.jpg',
        alt: 'Snowfall (3 of 4), April 4 2025, Flagstaff AZ'
      },
      {
        thumbnail: '/images/portfolio/Snowfall/Snowfall 4 of 4.jpg',
        full: '/images/portfolio/Snowfall/Snowfall 4 of 4.jpg',
        alt: 'Snowfall (4 of 4), April 4 2025, Flagstaff AZ'
      }
    ],
    californiaNatives: [
      {
        thumbnail: '/images/portfolio/CA Native/CA Native 1.jpg',
        full: '/images/portfolio/CA Native/CA Native 1.jpg',
        alt: 'California Native Study 1, 2023'
      },
      {
        thumbnail: '/images/portfolio/CA Native/CA Native 2.jpg',
        full: '/images/portfolio/CA Native/CA Native 2.jpg',
        alt: 'California Native Study 2, 2023'
      },
      {
        thumbnail: '/images/portfolio/CA Native/CA NAtive 3.jpg',
        full: '/images/portfolio/CA Native/CA NAtive 3.jpg',
        alt: 'California Native Study 3, 2023'
      },
      {
        thumbnail: '/images/portfolio/CA Native/CA NAtive 4.jpg',
        full: '/images/portfolio/CA Native/CA NAtive 4.jpg',
        alt: 'California Native Study 4, 2023'
      },
      {
        thumbnail: '/images/portfolio/CA Native/Ca Native 5.jpg',
        full: '/images/portfolio/CA Native/Ca Native 5.jpg',
        alt: 'California Native Study 5, 2023'
      }
    ],
    flagstaffYard: [
      {
        thumbnail: '/images/portfolio/flagstaff_yard/thumbs/Backyard Arrangement Flagstaff 2025.jpg',
        full: '/images/portfolio/flagstaff_yard/full/Backyard Arrangement Flagstaff 2025.jpg',
        alt: 'Backyard Arrangement, Flagstaff, AZ, 2025'
      },
      {
        thumbnail: '/images/portfolio/Herbaria/Evening Primrose group.jpg',
        full: '/images/portfolio/Herbaria/Evening Primrose group.jpg',
        alt: 'Evening Primrose (group), 2025'
      },
      {
        thumbnail: '/images/portfolio/Herbaria/Field BINDWEED 2024 FLAGSTAFF CROP2.jpg',
        full: '/images/portfolio/Herbaria/Field BINDWEED 2024 FLAGSTAFF CROP2.jpg',
        alt: 'Field Bindweed, 2024'
      }
    ],
    patagoniaLake: [
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Spiny Poppy and Hemlock 001.jpg',
        full: '/images/portfolio/Patagonia Lake/Spiny Poppy and Hemlock 001.jpg',
        alt: 'Spiny Poppy and Hemlock, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Birdfoot Morning Glory 02.jpg',
        full: '/images/portfolio/Patagonia Lake/Birdfoot Morning Glory 02.jpg',
        alt: 'Birdfoot Morning Glory, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Cucumber.jpg',
        full: '/images/portfolio/Patagonia Lake/Cucumber.jpg',
        alt: 'Wild Cucumber, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Hemlock 02.jpg',
        full: '/images/portfolio/Patagonia Lake/Hemlock 02.jpg',
        alt: 'Hemlock, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Mesquite saplings.jpg',
        full: '/images/portfolio/Patagonia Lake/Mesquite saplings.jpg',
        alt: 'Mesquite Saplings, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Morning Glory and Weed 01.jpg',
        full: '/images/portfolio/Patagonia Lake/Morning Glory and Weed 01.jpg',
        alt: 'Morning Glory and Weed, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Orange Fantail.jpg',
        full: '/images/portfolio/Patagonia Lake/Orange Fantail.jpg',
        alt: 'Orange Fantails, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Trailing Four o Clock 01.jpg',
        full: '/images/portfolio/Patagonia Lake/Trailing Four o Clock 01.jpg',
        alt: 'Trailing Four-o-Clock, 2025'
      },
      {
        thumbnail: '/images/portfolio/Patagonia Lake/Wildflowers at Patagonia Lake.jpg',
        full: '/images/portfolio/Patagonia Lake/Wildflowers at Patagonia Lake.jpg',
        alt: 'Wildflowers, Patagonia Lake, Fall 2025'
      }
    ]
  };

  // Define your portfolio sections
  const portfolioSections = [
    {
      title: "Patagonia Lake State Park",
      coverImage: "/images/portfolio/Patagonia Lake/Spiny Poppy and Hemlock 001.jpg",
      images: portfolioImages.patagoniaLake,
      description: "Works created during the Arizona State Parks Artist Residency at Patagonia Lake State Park, Fall 2025. These cyanotypes document the diverse botanical specimens found in one of Arizona's most biologically mixed environments.\n\nSpiny Poppy and Hemlock, 2025\nBirdfoot Morning Glory, 2025\nWild Cucumber, 2025\nHemlock, 2025\nMesquite Saplings, 2025\nMorning Glory and Weed, 2025\nOrange Fantails, 2025\nTrailing Four-o-Clock, 2025\nWildflowers, Patagonia Lake, Fall 2025"
    },
    {
      title: "New Works",
      coverImage: "/images/portfolio/new_works_2025/full/Evening Primrose May 2025.jpg",
      images: portfolioImages.newWorks2025,
      description: "A selection of recent pieces shared without a set objective—individual explorations that may evolve into future series or remain independent.\n\nEvening Primrose, May 2025\nLily of the Valley, 2025"
    },
    {
      title: "Arrangements",
      coverImage: "/images/portfolio/Arrangements/Cosmos and Dill 2024.jpg",
      images: portfolioImages.arrangements,
      description: "Reimagining the genre of still life with glass vases and a variety of botanic specimens.\n\nCosmos and Dill, 2024\nViola (vase), 2023\nPhantom Flower, 2023\nWildflowers (vase), 2025\nTiger Lilies (vase), 2025"
    },
    {
      title: "Herbaria",
      coverImage: "/images/portfolio/Herbaria/California Poppy 2022.jpg",
      images: portfolioImages.herbaria,
      description: "Singular studies of a variety of botanical specimens in the traditional style of the herbarium, a catalog of plant life utilized by naturalists for centuries.\n\nSapling, 2022\nCalifornia Poppy, 2022\nBlackberry Blossoms, May 2023\nHoneysuckle Fuchsia, May 2023\nPaperwhites, April 2025\nThree Weed Sprouts, 2023"
    },
    {
      title: "Snowfall",
      coverImage: "/images/portfolio/Snowfall/Snowfall 1 of 4.jpg",
      images: portfolioImages.snowfall,
      description: "Snowfall (quadriptych), April 4 2025, Flagstaff AZ\n\nSnowfall (1 of 4)\nSnowfall (2 of 4)\nSnowfall (3 of 4)\nSnowfall (4 of 4)"
    },
    {
      title: "California Natives",
      coverImage: "/images/portfolio/CA Native/CA Native 1.jpg",
      images: portfolioImages.californiaNatives,
      description: "In this series, plants native to California are assembled in imaginary bouquets suggesting an invented and impossible growth between a variety of species. Incorporating specimens from various seasons and regions, these carefully arranged subjects are presented in a single organism.\n\nCalifornia Native Study 1, 2023\nCalifornia Native Study 2, 2023\nCalifornia Native Study 3, 2023\nCalifornia Native Study 4, 2023\nCalifornia Native Study 5, 2023"
    },
    {
      title: "From My Yard, Flagstaff, AZ",
      coverImage: "/images/portfolio/flagstaff_yard/full/Backyard Arrangement Flagstaff 2025.jpg",
      images: portfolioImages.flagstaffYard,
      description: "Botanical studies from the artist's backyard in Flagstaff, Arizona, capturing the natural beauty of local flora.\n\nEvening Primrose (group), 2025\nBackyard Arrangement, Flagstaff, AZ, 2025\nField Bindweed, 2024"
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
                src="/images/background_new.jpg"
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
          {/* Navigation */}
          <Navigation currentPage="home" activeSection={activeSection} />

          {/* Hero section */}
          <section className="relative min-h-screen w-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 md:mb-16 tracking-[0.1em]">
                CORY WOODALL
              </h1>
              <div className="backdrop-blur-md bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg max-w-2xl mx-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-bold mb-4 md:mb-6 tracking-wider">
                  Contemporary Cyanotypes
                </h2>
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-black font-medium tracking-wide leading-relaxed">
                  A revival of the historic cyanotype process, blending traditional UV exposure with contemporary themes and materials.
                </p>
              </div>
            </div>
          </section>

          {/* About section */}
          <section id="about" ref={aboutRef} className="min-h-screen flex items-center justify-center py-10 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl backdrop-blur-md bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg">
              <div className="space-y-4 md:space-y-8 text-black">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed tracking-wide">
                  <strong className="font-black tracking-wider">Cory Woodall</strong> is an art historian, curator, and contemporary artist specializing in the historic cyanotype process. A graduate of the University of California, San Diego, she merges early photographic techniques with modern artistic perspectives to create evocative, nature-inspired works.
                </p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed tracking-wide">
                  Drawing inspiration from early photography pioneers, Cory reinterprets the medium of cyanotype through the lens of modern botanical studies. Using hand-coated, light-sensitive paper, she arranges ethically sourced plant specimens to create luminous, organic compositions that highlight nature's intricate beauty.
                </p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed tracking-wide">
                  Her work bridges science, history, and art, transforming delicate botanical forms into striking imagery. Each piece reflects a meticulous process of selection, arrangement, and exposure, resulting in a timeless fusion of historical craftsmanship and contemporary expression.
                </p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed tracking-wide">
                  Cory currently lives and works in Flagstaff, Arizona, where she enables and incentivizes local artists. She has previously served as Assistant Curator at The San Diego Museum of Art and Curator of the Juneau-Douglas City Museum in Alaska.
                </p>
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
                          <h3 className="text-3xl font-bold text-black tracking-wider mb-4">
                            {section.title}
                          </h3>
                          <div className="backdrop-blur-md bg-white/80 p-6 rounded-lg border border-white/20 shadow-lg">
                            <p className="text-lg text-gray-800 leading-relaxed mb-4">
                              {section.description.split('\n\n')[0]}
                            </p>
                            
                            {/* Individual image links */}
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
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-wide">Contact</h3>
                      <p className="text-sm sm:text-base md:text-lg text-black/80 leading-relaxed">
                        Available for commissions, gallery exhibitions, and educational workshops.
                      </p>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <span className="text-black/60 text-sm sm:text-base md:text-lg">Email:</span>
                        <a 
                          href="mailto:woodallcory@gmail.com" 
                          className="text-sm sm:text-base md:text-xl text-black hover:text-gray-700 transition-colors duration-300 font-medium break-all"
                        >
                          woodallcory@gmail.com
                        </a>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <span className="text-black/60 text-sm sm:text-base md:text-lg">Location:</span>
                        <span className="text-sm sm:text-base md:text-xl text-black font-medium">
                          Flagstaff, Arizona
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 md:pt-6 border-t border-black/20">
                      <p className="text-xs sm:text-sm text-black/60">
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
          <section id="faq" ref={faqRef} className="min-h-screen flex items-center justify-center py-10 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl backdrop-blur-md bg-white/50 p-4 sm:p-6 md:p-8 rounded-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center mb-6 md:mb-12 text-black tracking-[0.1em]">FAQ</h2>
              <div className="space-y-4 md:space-y-8 text-black">
                                 <div className="faq-item">
                   <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}>
                     What is cyanotype art?
                   </h3>
                   <div className={`${openFaqIndex === 0 ? 'block' : 'hidden'}`}>
                     <p className="text-sm sm:text-base md:text-lg leading-relaxed tracking-wide mb-4">
                       The medium of cyanotype is a photographic one, created with a careful mixture of light sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially. This shadow-fixing process is the basis of all non-digital photography since its invention in 1839. The major difference between the numerous ways of making photographic prints is the materials involved that makes a surface light sensitive with the ability to capture and preserve impressions of light and shadow. Cyanotype emulsion (a liquid) uses a combination of water and chemicals that are available commercially today and can be applied to a variety of support surfaces, including paper, fabric, and ceramic.
                     </p>
                     <Link href="/articles" className="text-sm text-gray-600 hover:text-black transition-colors duration-300">
                       Read more about cyanotype art in our articles section →
                     </Link>
                   </div>
                 </div>
                <div className="faq-item">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}>
                    How does cyanotype work?
                  </h3>
                  <p className={`text-sm sm:text-base md:text-lg leading-relaxed tracking-wide ${openFaqIndex === 1 ? 'block' : 'hidden'}`}>
                    The cyanotype process involves exposing light-sensitive paper to a solution of ferric ammonium citrate (FAC) and potassium ferricyanide (K3Fe(CN)6). When light hits the paper, it creates a latent image. The paper is then immersed in a developer (usually a solution of ferrous ammonium sulfate) to reveal the blue print. Cory's work involves careful exposure to UV light and precise timing of the developer application.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}>
                    What materials do you use for cyanotype?
                  </h3>
                  <p className={`text-sm sm:text-base md:text-lg leading-relaxed tracking-wide ${openFaqIndex === 2 ? 'block' : 'hidden'}`}>
                    Cory uses a variety of light-sensitive papers, including cotton rag, watercolor, and specialty papers. She also works with natural materials like leaves, flowers, and plant specimens. The choice of paper and materials is crucial for achieving the desired results, as each has its own sensitivity and characteristics.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}>
                    How long does a cyanotype print take to develop?
                  </h3>
                  <p className={`text-sm sm:text-base md:text-lg leading-relaxed tracking-wide ${openFaqIndex === 3 ? 'block' : 'hidden'}`}>
                    The development time can vary greatly depending on the paper, exposure, and developer. A typical cyanotype print takes anywhere from 10 minutes to several hours to develop. Cory's prints often require multiple exposures and careful timing to achieve the desired effect.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}>
                    Are cyanotype prints permanent?
                  </h3>
                  <p className={`text-sm sm:text-base md:text-lg leading-relaxed tracking-wide ${openFaqIndex === 4 ? 'block' : 'hidden'}`}>
                    Cyanotype prints are indeed permanent. The blue image created on the paper is chemically bonded and will not fade or wash away. This makes them ideal for long-term preservation and exhibition.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 cursor-pointer" onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}>
                    Can I make my own cyanotype prints?
                  </h3>
                  <p className={`text-sm sm:text-base md:text-lg leading-relaxed tracking-wide ${openFaqIndex === 5 ? 'block' : 'hidden'}`}>
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
      </div>
    </>
  );
} 