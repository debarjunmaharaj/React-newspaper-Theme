
import { useSite } from '@/context/SiteContext';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface ArticleViewProps {
  slug: string;
}

export const ArticleView = ({ slug }: ArticleViewProps) => {
  const { getArticle, categories } = useSite();
  const article = getArticle(slug);
  
  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          to="/"
          className="btn-primary inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }
  
  const articleCategories = categories.filter(cat => 
    article.categories.includes(cat.id)
  );

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {articleCategories.map(category => (
            <Link 
              key={category.id}
              to={`/category/${category.slug}`}
              className="bg-news-accent/10 text-news-accent px-3 py-1 text-sm font-medium rounded-full hover:bg-news-accent/20 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
          <span className="text-sm">
            Published on {formatDate(article.publishedAt || article.createdAt)}
          </span>
        </div>
        
        {article.featuredImage && (
          <div className="rounded-lg overflow-hidden mb-8">
            <img 
              src={article.featuredImage} 
              alt={article.title} 
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}
      </header>

      <div 
        className="article-content prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      
      <div className="news-separator" />
      
      <div className="mt-8 text-center">
        <Link 
          to="/" 
          className="text-news-accent hover:text-blue-700 font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </article>
  );
};
