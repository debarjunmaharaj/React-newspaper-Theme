
import { Link } from 'react-router-dom';
import { Article, Category } from '@/data/initialData';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  categories: Category[];
  size?: 'small' | 'medium' | 'large';
}

export const ArticleCard = ({ article, categories, size = 'medium' }: ArticleCardProps) => {
  const articleCategories = categories.filter(cat => 
    article.categories.includes(cat.id)
  );
  
  const imageHeight = size === 'small' ? 'h-40' : size === 'medium' ? 'h-48' : 'h-64';

  return (
    <article className={`article-card group overflow-hidden flex flex-col h-full transition-all duration-300 hover:translate-y-[-4px]`}>
      <div className={`relative ${imageHeight} overflow-hidden`}>
        {article.featuredImage ? (
          <img 
            src={article.featuredImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No Image</span>
          </div>
        )}
        
        {articleCategories.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {articleCategories.slice(0, 2).map(category => (
              <Link 
                key={category.id}
                to={`/category/${category.slug}`}
                className="bg-news-accent text-white px-2 py-1 text-xs font-semibold rounded-sm hover:bg-blue-700 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4">
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          {formatDate(article.publishedAt || article.createdAt)}
        </div>
        
        <Link to={`/article/${article.slug}`}>
          <h3 className={`font-heading font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-news-accent transition-colors ${
            size === 'small' ? 'text-lg' : size === 'medium' ? 'text-xl' : 'text-2xl'
          }`}>
            {article.title}
          </h3>
        </Link>
        
        {size !== 'small' && (
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {article.excerpt}
          </p>
        )}
      </div>
      
      <div className="px-4 pb-4 mt-auto">
        <Link 
          to={`/article/${article.slug}`}
          className="text-news-accent hover:text-blue-700 font-medium text-sm inline-flex items-center transition-colors"
        >
          Read More
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
};
