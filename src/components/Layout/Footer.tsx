
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const { categories, pages, menuItems, siteSettings } = useSite();
  
  // Filter menu items by location
  const footerLinks = menuItems.filter(item => item.location === 'footer');
  const socialLinks = menuItems.filter(item => item.location === 'social');
  
  return (
    <footer>
      {/* Pre-Footer Ad */}
      <div className="w-full bg-gray-200 h-24 flex items-center justify-center text-gray-500 border-t border-b">
        Advertisement Banner 970x90
      </div>
      
      {/* Main Footer */}
      <div className="bg-neutral-800 text-gray-300 py-8">
        <div className="news-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: About */}
            <div>
              <h3 className="font-bold text-white text-lg mb-4 border-b border-red-600 pb-2">ABOUT US</h3>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed">
                  {siteSettings.description}
                </p>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span>123 News Street, City, Country</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-red-500" />
                  <span>+1-234-567-8900</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-red-500" />
                  <span>info@dailyexpress.com</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <a href="#" className="bg-neutral-700 hover:bg-red-600 transition-colors p-2 rounded-full">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="#" className="bg-neutral-700 hover:bg-red-600 transition-colors p-2 rounded-full">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="bg-neutral-700 hover:bg-red-600 transition-colors p-2 rounded-full">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="#" className="bg-neutral-700 hover:bg-red-600 transition-colors p-2 rounded-full">
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Column 2: Categories */}
            <div>
              <h3 className="font-bold text-white text-lg mb-4 border-b border-red-600 pb-2">CATEGORIES</h3>
              <ul className="space-y-2">
                {categories.slice(0, 8).map(category => (
                  <li key={category.id}>
                    <Link 
                      to={`/category/${category.slug}`}
                      className="text-sm hover:text-red-500 transition-colors flex items-center"
                    >
                      <span className="text-red-500 mr-2">›</span>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 3: Popular News */}
            <div>
              <h3 className="font-bold text-white text-lg mb-4 border-b border-red-600 pb-2">POPULAR NEWS</h3>
              <div className="space-y-4">
                {/* We'll use some of the existing categories as placeholders for popular news */}
                {categories.slice(0, 3).map(category => (
                  <Link 
                    key={category.id} 
                    to={`/category/${category.slug}`} 
                    className="block group"
                  >
                    <div className="font-semibold text-sm group-hover:text-red-500 transition-colors">
                      {category.name}: Latest updates and breaking news
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Jan 01, 2023</div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Column 4: Newsletter */}
            <div>
              <h3 className="font-bold text-white text-lg mb-4 border-b border-red-600 pb-2">NEWSLETTER</h3>
              <p className="text-sm mb-4">
                Subscribe to our newsletter and get our latest news delivered directly to your inbox.
              </p>
              <form>
                <div className="flex flex-col space-y-2">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="bg-neutral-700 text-white text-sm px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    SUBSCRIBE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="bg-neutral-900 text-gray-400 py-4">
        <div className="news-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              {siteSettings.footerText || `© ${new Date().getFullYear()} ${siteSettings.title}. All Rights Reserved.`}
            </div>
            <div>
              <ul className="flex flex-wrap gap-4 text-xs">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                {footerLinks.map(item => (
                  <li key={item.id}>
                    <Link to={item.url} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                {pages.slice(0, 3).map(page => (
                  <li key={page.id}>
                    <Link to={`/page/${page.slug}`} className="hover:text-white transition-colors">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
