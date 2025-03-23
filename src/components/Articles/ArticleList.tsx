
import { useSite } from '@/context/SiteContext';
import { ArticleCard } from './ArticleCard';

interface ArticleListProps {
  categorySlug?: string;
  limit?: number;
  columns?: 1 | 2 | 3 | 4;
}

export const ArticleList = ({ categorySlug, limit, columns = 3 }: ArticleListProps) => {
  const { articles, categories, getArticlesByCategory } = useSite();
  
  let displayArticles = articles.filter(article => article.status === 'published');
  
  if (categorySlug) {
    displayArticles = getArticlesByCategory(categorySlug);
  }
  
  // Sort by published date (newest first)
  displayArticles = displayArticles
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  
  // Apply limit if specified
  if (limit && limit > 0) {
    displayArticles = displayArticles.slice(0, limit);
  }
  
  const getColsClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getColsClass()} gap-6`}>
      {displayArticles.length > 0 ? (
        displayArticles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            categories={categories} 
            size={columns >= 3 ? 'medium' : 'large'}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {categorySlug 
              ? 'There are no articles in this category yet.' 
              : 'There are no published articles yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};
