
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: string; // userId
  categories: string[]; // categoryIds
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  parent?: string; // parentId
}

export interface Media {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export interface SiteSettings {
  title: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactEmail?: string;
}

export const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin', // In a real app, this would be hashed
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
];

export const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest technology news and advancements',
  },
  {
    id: '2',
    name: 'Business',
    slug: 'business',
    description: 'Business news and market updates',
  },
  {
    id: '3',
    name: 'Politics',
    slug: 'politics',
    description: 'Political news and analysis',
  },
  {
    id: '4',
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries and research',
  },
];

export const initialArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of AI in Everyday Life',
    slug: 'future-ai-everyday-life',
    content: `
      <p>Artificial intelligence is rapidly transforming how we live and work. From smart assistants to autonomous vehicles, AI technologies are becoming increasingly integrated into our daily routines.</p>
      
      <p>Recent advancements in machine learning have enabled AI systems to understand human language, recognize images, and even create art. These capabilities are opening up new possibilities for how we interact with technology.</p>
      
      <p>Experts predict that in the coming years, AI will become even more seamlessly integrated into our lives, automating routine tasks and augmenting human capabilities in unprecedented ways. However, this rapid advancement also raises important questions about privacy, job displacement, and the ethical implications of increasingly autonomous systems.</p>
      
      <p>As AI continues to evolve, it will be crucial for policymakers, technologists, and citizens to work together to ensure that these powerful tools are developed and deployed in ways that benefit humanity as a whole.</p>
    `,
    excerpt: 'Artificial intelligence is rapidly transforming how we live and work. From smart assistants to autonomous vehicles, AI technologies are becoming increasingly integrated into our daily routines.',
    author: '1',
    categories: ['1'],
    status: 'published',
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T15:30:00Z',
    publishedAt: '2023-01-15T16:00:00Z',
  },
  {
    id: '2',
    title: 'Global Markets React to Economic Policy Shifts',
    slug: 'global-markets-economic-policy',
    content: `
      <p>Global financial markets experienced significant volatility today in response to major economic policy announcements from several central banks. The Federal Reserve's decision to maintain current interest rates, contrary to market expectations, sparked a rally in tech stocks while putting pressure on the banking sector.</p>
      
      <p>Meanwhile, the European Central Bank's introduction of new stimulus measures provided a boost to European markets, with particularly strong gains in manufacturing and export-oriented companies. Analysts noted that these divergent approaches reflect the different economic challenges facing various regions as they navigate the post-pandemic recovery.</p>
      
      <p>Asian markets showed a mixed response, with Japanese stocks rising on export optimism while Chinese markets remained cautious amid ongoing regulatory concerns. Commodity prices also saw movement, with oil rising on improved demand forecasts and gold retreating as risk appetite increased.</p>
      
      <p>Market strategists are now closely watching how these policy developments will impact global trade, inflation expectations, and currency markets in the coming months. The increased policy divergence could lead to greater market segmentation and create both challenges and opportunities for international investors.</p>
    `,
    excerpt: 'Global financial markets experienced significant volatility today in response to major economic policy announcements from several central banks.',
    author: '1',
    categories: ['2'],
    status: 'published',
    createdAt: '2023-01-16T09:15:00Z',
    updatedAt: '2023-01-16T11:45:00Z',
    publishedAt: '2023-01-16T14:00:00Z',
  },
  {
    id: '3',
    title: 'Breakthrough in Renewable Energy Storage',
    slug: 'breakthrough-renewable-energy-storage',
    content: `
      <p>Scientists at the National Renewable Energy Laboratory have announced a major breakthrough in energy storage technology that could accelerate the global transition to renewable energy sources. The new battery technology, which uses abundant and low-cost materials, promises to store large amounts of energy for extended periods at a fraction of the cost of current solutions.</p>
      
      <p>The innovation addresses one of the key challenges in renewable energy adoption: the intermittent nature of sources like solar and wind. By providing an efficient and economical way to store excess energy when production is high and release it when production drops, the technology could help stabilize power grids and reduce reliance on fossil fuel backup systems.</p>
      
      <p>Initial tests suggest the new batteries can achieve an energy density three times higher than conventional lithium-ion batteries while using materials that are more sustainable and ethically sourced. The research team is now working with industry partners to scale up production and integrate the technology into existing power systems.</p>
      
      <p>"This represents a potential tipping point in our ability to power the world with renewable energy," said Dr. Sarah Chen, lead researcher on the project. "We're not just incrementally improving storage capability—we're fundamentally changing the equation."</p>
    `,
    excerpt: 'Scientists have announced a major breakthrough in energy storage technology that could accelerate the global transition to renewable energy sources.',
    author: '1',
    categories: ['1', '4'],
    status: 'published',
    createdAt: '2023-01-18T10:20:00Z',
    updatedAt: '2023-01-19T09:30:00Z',
    publishedAt: '2023-01-19T13:00:00Z',
  },
];

export const initialPages: Page[] = [
  {
    id: '1',
    title: 'About Us',
    slug: 'about',
    content: `
      <h2>About Our News Organization</h2>
      <p>Founded with a commitment to journalistic integrity and public service, our news organization strives to deliver accurate, unbiased, and timely information to our readers.</p>
      
      <h3>Our Mission</h3>
      <p>We believe in the power of well-reported news to strengthen communities and democracy. Our mission is to investigate and report the truth, hold power accountable, and give voice to the diverse perspectives that make up our society.</p>
      
      <h3>Our Team</h3>
      <p>Our newsroom brings together experienced journalists and emerging talent who share a dedication to excellence in reporting and storytelling. Our diverse team brings a wide range of backgrounds, expertise, and viewpoints to our coverage.</p>
      
      <h3>Editorial Standards</h3>
      <p>We adhere to the highest standards of journalistic ethics. We verify information before publishing, correct errors promptly, and maintain a clear separation between news reporting and opinion content. We're committed to transparency about our methods and sources.</p>
      
      <h3>Contact Us</h3>
      <p>We welcome feedback from our readers and are always open to news tips and story ideas. Please reach out to us at contact@example.com.</p>
    `,
    status: 'published',
    createdAt: '2023-01-10T08:00:00Z',
    updatedAt: '2023-01-10T08:00:00Z',
  },
  {
    id: '2',
    title: 'Contact',
    slug: 'contact',
    content: `
      <h2>Contact Us</h2>
      <p>We value your feedback and inquiries. Please use the information below to get in touch with our team.</p>
      
      <h3>General Inquiries</h3>
      <p>Email: info@example.com<br>
      Phone: (555) 123-4567</p>
      
      <h3>News Tips</h3>
      <p>Have a story idea or news tip? We'd love to hear from you!<br>
      Email: tips@example.com</p>
      
      <h3>Advertising</h3>
      <p>For advertising opportunities and media kit requests:<br>
      Email: advertising@example.com</p>
      
      <h3>Careers</h3>
      <p>Interested in joining our team?<br>
      Email: careers@example.com</p>
      
      <h3>Office Location</h3>
      <p>123 News Street<br>
      Cityville, State 12345<br>
      United States</p>
    `,
    status: 'published',
    createdAt: '2023-01-10T09:30:00Z',
    updatedAt: '2023-01-10T09:30:00Z',
  },
];

export const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    label: 'Home',
    url: '/',
    order: 1,
  },
  {
    id: '2',
    label: 'Technology',
    url: '/category/technology',
    order: 2,
  },
  {
    id: '3',
    label: 'Business',
    url: '/category/business',
    order: 3,
  },
  {
    id: '4',
    label: 'Politics',
    url: '/category/politics',
    order: 4,
  },
  {
    id: '5',
    label: 'Science',
    url: '/category/science',
    order: 5,
  },
  {
    id: '6',
    label: 'About',
    url: '/page/about',
    order: 6,
  },
  {
    id: '7',
    label: 'Contact',
    url: '/page/contact',
    order: 7,
  },
];

export const initialSiteSettings: SiteSettings = {
  title: 'The Daily Chronicle',
  tagline: 'Informed Perspectives, Every Day',
  description: 'Your trusted source for the latest news, in-depth analysis, and thoughtful commentary on the issues that matter most.',
  social: {
    facebook: 'https://facebook.com/dailychronicle',
    twitter: 'https://twitter.com/dailychronicle',
    instagram: 'https://instagram.com/dailychronicle',
  },
  contactEmail: 'contact@dailychronicle.example.com',
};
