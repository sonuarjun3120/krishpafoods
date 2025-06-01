
interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastModified: string;
}

interface SiteSettings {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  aboutDescription: string;
  featuredProducts: string[];
}

// Mock data storage - in a real app this would connect to your database
let pageContents: PageContent[] = [
  {
    id: '1',
    title: 'Home Page',
    slug: 'home',
    content: JSON.stringify({
      heroTitle: 'A Taste of Tradition in Every Bite!',
      heroDescription: 'Authentic Telugu-style pickles made with traditional recipes from Andhra and Telangana. Handcrafted with love and the finest ingredients.',
      aboutTitle: 'Our Pickle Heritage',
      aboutDescription: 'Krishpa Homemade Pickles began in a small kitchen in Vijayawada, where our founder\'s grandmother perfected recipes that have been treasured for generations. Today, we continue this legacy using the same traditional methods, handpicking ingredients, and crafting each batch with care and love.'
    }),
    status: 'published',
    lastModified: '2024-01-15'
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about',
    content: JSON.stringify({
      title: 'About Our Company',
      description: 'We have been sourcing premium spices for over 20 years...'
    }),
    status: 'published',
    lastModified: '2024-01-14'
  }
];

let siteSettings: SiteSettings = {
  siteName: 'Krishpa Homemade Pickles',
  tagline: 'Authentic Telugu Cuisine',
  heroTitle: 'A Taste of Tradition in Every Bite!',
  heroDescription: 'Authentic Telugu-style pickles made with traditional recipes from Andhra and Telangana.',
  aboutDescription: 'Traditional recipes passed down through generations.',
  featuredProducts: []
};

export const contentService = {
  // Page content methods
  getPageContent: (slug: string): PageContent | null => {
    return pageContents.find(page => page.slug === slug) || null;
  },

  getAllPages: (): PageContent[] => {
    return pageContents;
  },

  updatePageContent: (id: string, updates: Partial<PageContent>): boolean => {
    const index = pageContents.findIndex(page => page.id === id);
    if (index !== -1) {
      pageContents[index] = { 
        ...pageContents[index], 
        ...updates, 
        lastModified: new Date().toISOString().split('T')[0] 
      };
      return true;
    }
    return false;
  },

  createPage: (page: Omit<PageContent, 'id' | 'lastModified'>): PageContent => {
    const newPage: PageContent = {
      ...page,
      id: crypto.randomUUID(),
      lastModified: new Date().toISOString().split('T')[0]
    };
    pageContents.push(newPage);
    return newPage;
  },

  // Site settings methods
  getSiteSettings: (): SiteSettings => {
    return siteSettings;
  },

  updateSiteSettings: (updates: Partial<SiteSettings>): boolean => {
    siteSettings = { ...siteSettings, ...updates };
    return true;
  },

  // Helper to parse content
  parsePageContent: (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return { content };
    }
  }
};
