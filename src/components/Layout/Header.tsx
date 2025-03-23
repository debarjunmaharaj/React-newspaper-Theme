
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { MainNav } from '@/components/Navigation/MainNav';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const { siteSettings } = useSite();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-b-gray-200 dark:border-b-gray-800 bg-white dark:bg-gray-900 shadow-sm backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 sticky top-0 z-50 transition-all duration-300">
      <div className="news-container py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="transition-transform duration-300 hover:scale-105">
              {siteSettings.logo ? (
                <img 
                  src={siteSettings.logo} 
                  alt={siteSettings.title} 
                  className="h-10 w-auto"
                />
              ) : (
                <h1 className="text-2xl font-heading font-bold tracking-tight text-gray-900 dark:text-white">
                  {siteSettings.title}
                </h1>
              )}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              {siteSettings.tagline}
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <MainNav className="mx-6" />
            
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/admin">Dashboard</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/admin/login">Admin Login</Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile nav - shown on small screens */}
        <div className="md:hidden mt-4 pb-2 hidden">
          <MainNav className="flex flex-col space-y-3" />
        </div>
      </div>
    </header>
  );
};
