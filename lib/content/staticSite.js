export const defaultHomeContent = {
  hero: {
    name: 'CORY WOODALL',
    subtitle: 'Contemporary Cyanotypes',
    tagline:
      'A revival of the historic cyanotype process, blending traditional UV exposure with contemporary themes and materials.',
    backgroundImage: '/images/background_new.jpg',
  },
  about: {
    paragraphs: [
      '<strong>Cory Woodall</strong> is an art historian, curator, and contemporary artist specializing in the historic cyanotype process. A graduate of the University of California, San Diego, she merges early photographic techniques with modern artistic perspectives to create evocative, nature-inspired works.',
      "Drawing inspiration from early photography pioneers, Cory reinterprets the medium of cyanotype through the lens of modern botanical studies. Using hand-coated, light-sensitive paper, she arranges ethically sourced plant specimens to create luminous, organic compositions that highlight nature's intricate beauty.",
      'Her work bridges science, history, and art, transforming delicate botanical forms into striking imagery. Each piece reflects a meticulous process of selection, arrangement, and exposure, resulting in a timeless fusion of historical craftsmanship and contemporary expression.',
      'Cory currently lives and works in Flagstaff, Arizona, where she enables and incentivizes local artists. She has previously served as Assistant Curator at The San Diego Museum of Art and Curator of the Juneau-Douglas City Museum in Alaska.',
    ],
  },
  contact: {
    heading: 'Contact',
    intro: 'Available for commissions, gallery exhibitions, and educational workshops.',
    email: 'woodallcory@gmail.com',
    location: 'Flagstaff, Arizona',
    footerNote: 'Please include details about your project or inquiry in your email.',
  },
  faq: {
    title: 'FAQ',
    items: [
      {
        question: 'What is cyanotype art?',
        answer:
          'The medium of cyanotype is a photographic one, created with a careful mixture of light sensitive chemicals coated onto a support surface and exposed to ultraviolet light, leaving behind areas of light and dark—shadows, essentially. This shadow-fixing process is the basis of all non-digital photography since its invention in 1839. The major difference between the numerous ways of making photographic prints is the materials involved that makes a surface light sensitive with the ability to capture and preserve impressions of light and shadow. Cyanotype emulsion (a liquid) uses a combination of water and chemicals that are available commercially today and can be applied to a variety of support surfaces, including paper, fabric, and ceramic.',
        showArticlesLink: true,
      },
      {
        question: 'How does cyanotype work?',
        answer:
          "The cyanotype process involves exposing light-sensitive paper to a solution of ferric ammonium citrate (FAC) and potassium ferricyanide (K3Fe(CN)6). When light hits the paper, it creates a latent image. The paper is then immersed in a developer (usually a solution of ferrous ammonium sulfate) to reveal the blue print. Cory's work involves careful exposure to UV light and precise timing of the developer application.",
      },
      {
        question: 'What materials do you use for cyanotype?',
        answer:
          'Cory uses a variety of light-sensitive papers, including cotton rag, watercolor, and specialty papers. She also works with natural materials like leaves, flowers, and plant specimens. The choice of paper and materials is crucial for achieving the desired results, as each has its own sensitivity and characteristics.',
      },
      {
        question: 'How long does a cyanotype print take to develop?',
        answer:
          "The development time can vary greatly depending on the paper, exposure, and developer. A typical cyanotype print takes anywhere from 10 minutes to several hours to develop. Cory's prints often require multiple exposures and careful timing to achieve the desired effect.",
      },
      {
        question: 'Are cyanotype prints permanent?',
        answer:
          'Cyanotype prints are indeed permanent. The blue image created on the paper is chemically bonded and will not fade or wash away. This makes them ideal for long-term preservation and exhibition.',
      },
      {
        question: 'Can I make my own cyanotype prints?',
        answer:
          'Yes, absolutely! Cory offers workshops and tutorials for beginners to learn the basics of cyanotype. The process is relatively simple and can be done with common household items. It\'s a great way to engage with the medium and create your own unique prints.',
      },
    ],
  },
};

export const defaultArticlesIndexContent = {
  title: 'ARTICLES',
  subtitle:
    'Insights into cyanotype art, historical processes, and contemporary applications',
};

export const defaultSiteMeta = {
  title: 'Cory Woodall - Art Historian & Contemporary Artist',
  description:
    'Cory Woodall is an art historian, curator, and contemporary artist specializing in the historic cyanotype process.',
};

export const defaultSiteContent = {
  home: defaultHomeContent,
  articles_index: defaultArticlesIndexContent,
  site_meta: defaultSiteMeta,
};
