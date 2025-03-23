import { PublicLayout } from '@/components/Layout/PublicLayout';
import { ArticleList } from '@/components/Articles/ArticleList';
import { useSite } from '@/context/SiteContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '@/data/initialData';

const Index = () => {
  const { articles, categories } = useSite();
  
  // Get published articles
  const publishedArticles = articles.filter(article => article.status === 'published')
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  
  // Featured article is the latest one
  const featuredArticle = publishedArticles[0];
  
  // Rest of the articles
  const recentArticles = publishedArticles.slice(1);
  
  // Check if we need to show featured section
  const showFeatured = featuredArticle !== undefined;

  return (
    <PublicLayout>
      <div className="space-y-12">
        {/* Featured Article */}
        {showFeatured && (
          <section className="animate-fade-in">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="md:order-2 h-64 md:h-auto">
                  {featuredArticle.featuredImage ? (
                    <img 
                      src={featuredArticle.featuredImage} 
                      alt={featuredArticle.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredArticle.categories.slice(0, 2).map(categoryId => {
                      const category = categories.find(c => c.id === categoryId);
                      return category ? (
                        <Link 
                          key={category.id}
                          to={`/category/${category.slug}`}
                          className="bg-news-accent/10 text-news-accent px-3 py-1 text-sm font-medium rounded-full hover:bg-news-accent/20 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ) : null;
                    })}
                  </div>
                  
                  <Link to={`/article/${featuredArticle.slug}`}>
                    <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-4 hover:text-news-accent transition-colors">
                      {featuredArticle.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="mt-auto">
                    <Link 
                      to={`/article/${featuredArticle.slug}`}
                      className="inline-flex items-center text-news-accent hover:text-blue-700 font-medium transition-colors"
                    >
                      Read Full Article
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Latest Articles */}
        <section className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-heading font-bold">Latest Articles</h2>
            <Link 
              to="/category/all"
              className="text-news-accent hover:text-blue-700 font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          
          <ArticleList limit={6} />
        </section>
        
        {/* Category Sections */}
        {categories.slice(0, 2).map(category => (
          <section key={category.id} className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-heading font-bold">{category.name}</h2>
              <Link 
                to={`/category/${category.slug}`}
                className="text-news-accent hover:text-blue-700 font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            
            <ArticleList categorySlug={category.slug} limit={3} />
          </section>
        ))}
      </div>
    </PublicLayout>
  );
};

export default Index;
