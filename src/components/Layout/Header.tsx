
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MainNav } from '@/components/Navigation/MainNav';
import { MenuIcon, Search, X, Phone, Mail, User, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const Header = () => {
  const { siteSettings, categories } = useSite();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header className="border-b">
      {/* Top Bar */}
      <div className="bg-gray-100 border-b">
        <div className="news-container py-1">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(currentDate)}
              </div>
              <div className="hidden md:flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                <span>+1-234-567-8900</span>
              </div>
              <div className="hidden md:flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                <span>info@dailyexpress.com</span>
              </div>
            </div>
            <div className="flex space-x-4">
              {user ? (
                <Link to="/admin" className="hover:underline flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  Admin
                </Link>
              ) : (
                <Link to="/admin/login" className="hover:underline flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  Login
                </Link>
              )}
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:underline hidden md:inline">Subscribe</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="news-container py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="md:hidden mr-2"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
            
            <Link to="/" className="flex items-center">
              {siteSettings.logo ? (
                <img 
                  src={siteSettings.logo} 
                  alt={siteSettings.title} 
                  className="h-14 mr-3" 
                />
              ) : (
                <h1 className="text-3xl font-bold tracking-tighter text-red-600">
                  {siteSettings.title}
                </h1>
              )}
            </Link>
          </div>
          
          {/* Ad Banner */}
          <div className="w-full md:w-auto py-2">
            <div className="bg-gray-200 h-14 w-full md:w-[468px] flex items-center justify-center text-gray-500 text-sm">
              Advertisement 468x60
            </div>
          </div>
          
          {/* Search Button */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="ml-2"
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-3 border-t">
            <form 
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                // Handle search
                console.log('Searching for:', searchTerm);
              }}
            >
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="bg-red-600 text-white shadow">
        <div className="news-container">
          <div className="hidden md:block">
            <MainNav />
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-2">
              <nav>
                <ul className="space-y-1">
                  <li>
                    <Link 
                      to="/" 
                      className="block py-2 px-3 hover:bg-red-700 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  
                  {categories.map(category => (
                    <li key={category.id}>
                      <Link 
                        to={`/category/${category.slug}`} 
                        className="block py-2 px-3 hover:bg-red-700 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
      
      {/* Breaking News Ticker */}
      <div className="bg-black text-white py-1">
        <div className="news-container">
          <div className="flex items-center overflow-hidden">
            <div className="bg-red-600 py-1 px-2 text-xs font-semibold mr-2 whitespace-nowrap animate-blink uppercase">
              BREAKING
            </div>
            <div className="news-ticker">
              Latest Breaking News: World leaders gather for climate summit • Stock markets reach new high • Sports champions announced • Tech company launches revolutionary product • Health officials announce breakthrough
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
