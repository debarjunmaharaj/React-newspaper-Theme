
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MainNav } from '@/components/Navigation/MainNav';
import { MenuIcon, Search, X, ChevronDown } from 'lucide-react';
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
      {/* Top Header */}
      <div className="bg-gray-100 border-b">
        <div className="news-container py-1">
          <div className="flex justify-between items-center text-xs">
            <div>{formatDate(currentDate)}</div>
            <div className="flex space-x-4">
              {user ? (
                <Link to="/admin" className="hover:underline">Admin Dashboard</Link>
              ) : (
                <Link to="/admin/login" className="hover:underline">Login</Link>
              )}
              <span>|</span>
              <a href="#" className="hover:underline">Subscribe</a>
              <span>|</span>
              <a href="#" className="hover:underline">Contact</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="news-container py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
          
          <div className="text-center md:text-right">
            <p className="text-sm italic text-muted-foreground">
              {siteSettings.tagline}
            </p>
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
            <div className="md:hidden py-4">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/" 
                      className="block py-2 px-4 hover:bg-red-700 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  
                  {categories.map(category => (
                    <li key={category.id}>
                      <Link 
                        to={`/category/${category.slug}`} 
                        className="block py-2 px-4 hover:bg-red-700 rounded"
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
      <div className="bg-black text-white py-2">
        <div className="news-container">
          <div className="flex items-center overflow-hidden">
            <div className="bg-red-600 py-1 px-3 text-sm font-semibold mr-3 whitespace-nowrap">
              BREAKING
            </div>
            <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite]">
              Latest Breaking News: Check out our latest articles and updates. Stay informed with our comprehensive coverage.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
