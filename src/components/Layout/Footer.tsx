
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  const { siteSettings, menuItems, pages } = useSite();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-10">
      <div className="news-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand and About */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="font-heading font-bold text-xl mb-4 text-gray-900 dark:text-white">
              {siteSettings.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {siteSettings.description}
            </p>
            <div className="flex space-x-4 mt-4">
              {siteSettings.social.facebook && (
                <a 
                  href={siteSettings.social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {siteSettings.social.twitter && (
                <a 
                  href={siteSettings.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {siteSettings.social.instagram && (
                <a 
                  href={siteSettings.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {siteSettings.social.linkedin && (
                <a 
                  href={siteSettings.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Linkedin size={20} />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="font-heading font-bold text-xl mb-4 text-gray-900 dark:text-white">Categories</h3>
            <ul className="space-y-2">
              {menuItems
                .filter(item => item.url.includes('/category/'))
                .slice(0, 6)
                .map(item => (
                  <li key={item.id}>
                    <Link 
                      to={item.url} 
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Pages */}
          <div className="col-span-1">
            <h3 className="font-heading font-bold text-xl mb-4 text-gray-900 dark:text-white">Pages</h3>
            <ul className="space-y-2">
              {pages
                .filter(page => page.status === 'published')
                .slice(0, 6)
                .map(page => (
                  <li key={page.id}>
                    <Link 
                      to={`/page/${page.slug}`} 
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-heading font-bold text-xl mb-4 text-gray-900 dark:text-white">Contact</h3>
            {siteSettings.contactEmail && (
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold">Email:</span> {siteSettings.contactEmail}
              </p>
            )}
            <Link 
              to="/page/contact" 
              className="inline-block mt-2 text-news-accent hover:underline transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} {siteSettings.title}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
