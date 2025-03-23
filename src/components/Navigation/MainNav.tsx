
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const MainNav = () => {
  const { menuItems, categories } = useSite();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Group categories by parent
  const categoryChildren: Record<string, typeof categories> = {};
  categories.forEach(category => {
    if (category.parentId) {
      if (!categoryChildren[category.parentId]) {
        categoryChildren[category.parentId] = [];
      }
      categoryChildren[category.parentId].push(category);
    }
  });

  const hasChildren = (categoryId: string) => {
    return categoryChildren[categoryId] && categoryChildren[categoryId].length > 0;
  };

  const handleMouseEnter = (id: string) => {
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="py-2">
      <ul className="flex flex-wrap items-center">
        <li className="relative group" onMouseEnter={() => handleMouseEnter('home')} onMouseLeave={handleMouseLeave}>
          <Link 
            to="/" 
            className="block py-2 px-4 font-medium hover:bg-red-700 transition-colors"
          >
            Home
          </Link>
        </li>
        
        {categories
          .filter(cat => !cat.parentId)
          .map(category => (
            <li 
              key={category.id} 
              className="relative group"
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                to={`/category/${category.slug}`} 
                className="flex items-center py-2 px-4 font-medium hover:bg-red-700 transition-colors"
              >
                {category.name}
                {hasChildren(category.id) && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </Link>
              
              {hasChildren(category.id) && activeDropdown === category.id && (
                <div className="absolute left-0 top-full bg-white text-black shadow-md min-w-48 z-50">
                  <ul>
                    {categoryChildren[category.id].map(child => (
                      <li key={child.id}>
                        <Link 
                          to={`/category/${child.slug}`} 
                          className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        
        {menuItems
          .filter(item => item.location === 'main')
          .map(item => (
            <li key={item.id}>
              <Link 
                to={item.url} 
                className="block py-2 px-4 font-medium hover:bg-red-700 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};
