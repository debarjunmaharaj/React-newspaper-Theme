
import { PublicLayout } from '@/components/Layout/PublicLayout';
import { useSite } from '@/context/SiteContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArticleCard } from '@/components/Articles/ArticleCard';

const Index = () => {
  const { articles, categories, siteSettings } = useSite();
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [categorizedArticles, setCategorizedArticles] = useState<Record<string, any[]>>({});
  
  useEffect(() => {
    // Get published articles
    const publishedArticles = articles.filter(article => article.status === 'published');
    
    // Sort by date (newest first)
    const sortedArticles = [...publishedArticles].sort((a, b) => 
      new Date(b.publishedAt || b.updatedAt).getTime() - 
      new Date(a.publishedAt || a.updatedAt).getTime()
    );
    
    // Set featured articles (with featured image)
    setFeaturedArticles(
      sortedArticles
        .filter(article => article.featuredImage)
        .slice(0, 15)
    );
    
    // Set latest articles
    setLatestArticles(sortedArticles.slice(0, 20));
    
    // Group articles by category
    const articlesByCategory: Record<string, any[]> = {};
    categories.forEach(category => {
      const categoryArticles = sortedArticles.filter(
        article => article.categories.includes(category.id)
      );
      if (categoryArticles.length > 0) {
        articlesByCategory[category.id] = categoryArticles.slice(0, 8);
      }
    });
    setCategorizedArticles(articlesByCategory);
    
  }, [articles, categories]);

  // Helper function for article cards
  const renderArticleCard = (article: any, size: 'sm' | 'md' | 'lg' = 'md') => {
    const imageClass = size === 'sm' ? 'h-20' : size === 'lg' ? 'h-48' : 'h-32';
    
    return (
      <div key={article.id} className="news-card">
        {article.featuredImage && (
          <Link to={`/article/${article.slug}`} className="block">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className={`news-thumbnail ${imageClass} w-full object-cover`}
            />
          </Link>
        )}
        <div className="space-y-1">
          <div className="flex text-xs space-x-2 mb-1">
            <span className="news-category-label">BREAKING</span>
            <span className="news-date">{formatDate(article.publishedAt || article.updatedAt)}</span>
          </div>
          <Link to={`/article/${article.slug}`}>
            <h3 className={size === 'lg' ? 'news-headline' : 'news-subheadline'}>
              {article.title}
            </h3>
          </Link>
          {size !== 'sm' && (
            <p className="news-excerpt">
              {truncateText(article.excerpt, size === 'lg' ? 150 : 100)}
            </p>
          )}
        </div>
      </div>
    );
  };
  
  const renderHorizontalCard = (article: any) => {
    return (
      <div key={article.id} className="news-horizontal-card">
        {article.featuredImage && (
          <Link to={`/article/${article.slug}`} className="shrink-0">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="news-thumbnail-sm"
            />
          </Link>
        )}
        <div className="space-y-1">
          <Link to={`/article/${article.slug}`}>
            <h3 className="font-semibold hover:text-red-600 text-sm">
              {truncateText(article.title, 70)}
            </h3>
          </Link>
          <span className="news-date block">{formatDate(article.publishedAt || article.updatedAt)}</span>
        </div>
      </div>
    );
  };

  
  return (
    <PublicLayout>
      <div className="space-y-4">
        {/* Top Ad Banner */}
        <div className="w-full bg-gray-200 h-16 flex items-center justify-center text-gray-500 border">
          Advertisement Banner 728x90
        </div>
      
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border p-2">
              <div className="news-section-title">
                <h2>LATEST</h2>
              </div>
              <div className="space-y-3 mt-3">
                {latestArticles.slice(0, 5).map((article, idx) => (
                  <div key={article.id} className="flex gap-2 border-b pb-3 last:border-0">
                    <div className="text-xl font-bold text-red-600 w-6">{idx + 1}</div>
                    <div>
                      <Link to={`/article/${article.slug}`}>
                        <h4 className="font-medium text-sm hover:text-red-600 transition-colors">
                          {truncateText(article.title, 60)}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(article.publishedAt || article.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Ad Space */}
            <div className="bg-gray-200 h-[250px] flex items-center justify-center text-gray-500 border text-sm">
              Ad 160x250
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-4">
            {/* Featured Articles Grid */}
            {featuredArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Main Featured Article */}
                <div className="md:col-span-2">
                  {renderArticleCard(featuredArticles[0], 'lg')}
                </div>
                
                {/* Secondary Featured Articles */}
                {featuredArticles.slice(1, 5).map(article => (
                  <div key={article.id}>
                    {renderArticleCard(article, 'md')}
                  </div>
                ))}
              </div>
            )}
            
            {/* Category Sections */}
            {Object.entries(categorizedArticles).slice(0, 3).map(([catId, catArticles], index) => {
              const category = categories.find(c => c.id === catId);
              if (!category || catArticles.length === 0) return null;
              
              return (
                <div key={catId} className="border-t pt-4">
                  <div className="news-section-title">
                    <Link to={`/category/${category.slug}`}>
                      <h2>{category.name.toUpperCase()}</h2>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {/* Main Category Article */}
                    <div className="md:col-span-1">
                      {renderArticleCard(catArticles[0], 'md')}
                    </div>
                    
                    {/* Category List */}
                    <div className="md:col-span-1 space-y-3">
                      {catArticles.slice(1, 4).map(article => (
                        renderHorizontalCard(article)
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Mid Page Ad Banner */}
            <div className="w-full bg-gray-200 h-[90px] flex items-center justify-center text-gray-500 border">
              Advertisement Banner 728x90
            </div>
            
            {/* More Category Sections */}
            {Object.entries(categorizedArticles).slice(3, 6).map(([catId, catArticles], index) => {
              const category = categories.find(c => c.id === catId);
              if (!category || catArticles.length === 0) return null;
              
              return (
                <div key={catId} className="border-t pt-4">
                  <div className="news-section-title">
                    <Link to={`/category/${category.slug}`}>
                      <h2>{category.name.toUpperCase()}</h2>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {/* Main Category Article */}
                    <div className="md:col-span-1">
                      {renderArticleCard(catArticles[0], 'md')}
                    </div>
                    
                    {/* Category List */}
                    <div className="md:col-span-1 space-y-3">
                      {catArticles.slice(1, 4).map(article => (
                        renderHorizontalCard(article)
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Ad Space */}
            <div className="bg-gray-200 h-[250px] flex items-center justify-center text-gray-500 border text-sm">
              Ad 300x250
            </div>
            
            {/* Most Read Articles */}
            <div className="border p-2">
              <div className="news-section-title">
                <h2>MOST READ</h2>
              </div>
              <div className="space-y-3 mt-3">
                {latestArticles.slice(0, 5).map((article, idx) => (
                  <div key={article.id} className="flex gap-2 border-b pb-3 last:border-0">
                    <div className="text-xl font-bold text-red-600 w-6">{idx + 1}</div>
                    <div>
                      <Link to={`/article/${article.slug}`}>
                        <h4 className="font-medium text-sm hover:text-red-600 transition-colors">
                          {truncateText(article.title, 60)}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(article.publishedAt || article.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Category Tabs */}
            <div className="border p-2">
              <Tabs defaultValue={categories[0]?.id}>
                <TabsList className="w-full justify-start overflow-auto flex-nowrap">
                  {categories.slice(0, 4).map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="text-xs uppercase"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.slice(0, 4).map(category => {
                  const catArticles = categorizedArticles[category.id] || [];
                  return (
                    <TabsContent key={category.id} value={category.id} className="p-2">
                      <div className="space-y-3">
                        {catArticles.slice(0, 3).map(article => (
                          <div key={article.id} className="pb-3 border-b last:border-0">
                            {article.featuredImage && (
                              <Link to={`/article/${article.slug}`} className="block mb-2">
                                <img 
                                  src={article.featuredImage} 
                                  alt={article.title}
                                  className="w-full h-32 object-cover"
                                />
                              </Link>
                            )}
                            <Link to={`/article/${article.slug}`}>
                              <h4 className="font-medium hover:text-red-600 transition-colors">{article.title}</h4>
                            </Link>
                            <p className="text-xs text-gray-500">{formatDate(article.publishedAt || article.updatedAt)}</p>
                          </div>
                        ))}
                        
                        <Link 
                          to={`/category/${category.slug}`}
                          className="text-red-600 text-xs font-medium hover:underline block text-right"
                        >
                          View All {category.name} News →
                        </Link>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
            
            {/* More Ad Space */}
            <div className="bg-gray-200 h-[250px] flex items-center justify-center text-gray-500 border text-sm">
              Ad 300x250
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
