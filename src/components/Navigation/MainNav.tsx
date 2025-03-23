
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { cn } from '@/lib/utils';

interface MainNavProps {
  className?: string;
}

export const MainNav = ({ className }: MainNavProps) => {
  const { menuItems } = useSite();

  // Sort menu items by order
  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);

  return (
    <nav className={cn('flex space-x-6', className)}>
      {sortedMenuItems.map((item) => (
        <Link
          key={item.id}
          to={item.url}
          className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors relative group"
        >
          {item.label}
          <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
      ))}
    </nav>
  );
};
