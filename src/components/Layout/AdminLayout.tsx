
import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Menu as MenuIcon, 
  Image, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const { siteSettings } = useSite();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // If not authenticated, redirect to login
  if (!user) {
    navigate('/admin/login');
    return null;
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/articles', label: 'Articles', icon: <FileText size={20} /> },
    { path: '/admin/categories', label: 'Categories', icon: <FolderOpen size={20} /> },
    { path: '/admin/pages', label: 'Pages', icon: <FileText size={20} /> },
    { path: '/admin/menus', label: 'Menus', icon: <MenuIcon size={20} /> },
    { path: '/admin/media', label: 'Media', icon: <Image size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            {!collapsed && (
              <Link to="/admin" className="font-heading font-bold text-gray-800 dark:text-white truncate">
                {siteSettings.title}
              </Link>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setCollapsed(!collapsed)}
              className="ml-auto"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.path 
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Home size={20} />
                {!collapsed && <span className="ml-3">View Site</span>}
              </Link>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={20} />
              {!collapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
