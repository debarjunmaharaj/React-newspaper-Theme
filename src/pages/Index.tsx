
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
        .slice(0, 5)
    );
    
    // Set latest articles
    setLatestArticles(sortedArticles.slice(0, 10));
    
    // Group articles by category
    const articlesByCategory: Record<string, any[]> = {};
    categories.forEach(category => {
      const categoryArticles = sortedArticles.filter(
        article => article.categories.includes(category.id)
      );
      if (categoryArticles.length > 0) {
        articlesByCategory[category.id] = categoryArticles.slice(0, 6);
      }
    });
    setCategorizedArticles(articlesByCategory);
    
  }, [articles, categories]);
  
  return (
    <PublicLayout>
      <div className="space-y-8">
        {/* Top Ad Banner */}
        <div className="w-full bg-gray-200 h-16 flex items-center justify-center text-gray-500 border">
          Advertisement Banner
        </div>
      
        {/* Featured Articles Slider */}
        {featuredArticles.length > 0 && (
          <div className="rounded overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredArticles.slice(0, 1).map(article => (
                <div key={article.id} className="md:col-span-2 lg:col-span-2 relative group h-80">
                  <Link to={`/article/${article.slug}`}>
                    <div className="absolute inset-0 bg-black">
                      <img 
                        src={article.featuredImage} 
                        alt={article.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <div className="bg-red-600 text-white text-xs font-medium px-2 py-1 mb-3 w-fit">
                        BREAKING
                      </div>
                      <h2 className="text-2xl font-bold mb-2 group-hover:underline">{article.title}</h2>
                      <p className="text-sm opacity-80">{formatDate(article.publishedAt || article.updatedAt)}</p>
                    </div>
                  </Link>
                </div>
              ))}
              
              <div className="lg:col-span-1 space-y-4">
                {featuredArticles.slice(1, 3).map(article => (
                  <div key={article.id} className="relative group h-[9.5rem]">
                    <Link to={`/article/${article.slug}`}>
                      <div className="absolute inset-0 bg-black">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                        <h3 className="text-base font-bold group-hover:underline">{article.title}</h3>
                        <p className="text-xs opacity-80">{formatDate(article.publishedAt || article.updatedAt)}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Latest News Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Latest News */}
            <div>
              <div className="border-b-2 border-red-600 mb-4">
                <h2 className="inline-block bg-red-600 text-white px-4 py-2 font-bold">LATEST NEWS</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {latestArticles.slice(0, 6).map(article => (
                  <div key={article.id} className="border-b pb-4">
                    {article.featuredImage && (
                      <Link to={`/article/${article.slug}`} className="block mb-2">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-44 object-cover"
                        />
                      </Link>
                    )}
                    <Link to={`/article/${article.slug}`}>
                      <h3 className="font-bold text-lg mb-1 hover:text-red-600 transition-colors">{article.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{truncateText(article.excerpt, 120)}</p>
                    <div className="text-xs text-gray-500">{formatDate(article.publishedAt || article.updatedAt)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Category News Sections */}
            {Object.entries(categorizedArticles).map(([catId, catArticles], index) => {
              const category = categories.find(c => c.id === catId);
              if (!category || catArticles.length === 0) return null;
              
              return (
                <div key={catId} className={index % 2 === 0 ? "bg-gray-50 p-4" : "p-4"}>
                  <div className="border-b-2 border-red-600 mb-4">
                    <Link to={`/category/${category.slug}`} className="inline-block">
                      <h2 className="inline-block bg-red-600 text-white px-4 py-2 font-bold">
                        {category.name.toUpperCase()}
                      </h2>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {catArticles.slice(0, 4).map(article => (
                      <div key={article.id} className="border-b pb-4">
                        {article.featuredImage && (
                          <Link to={`/article/${article.slug}`} className="block mb-2">
                            <img 
                              src={article.featuredImage} 
                              alt={article.title}
                              className="w-full h-44 object-cover"
                            />
                          </Link>
                        )}
                        <Link to={`/article/${article.slug}`}>
                          <h3 className="font-bold text-lg mb-1 hover:text-red-600 transition-colors">{article.title}</h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">{truncateText(article.excerpt, 100)}</p>
                        <div className="text-xs text-gray-500">{formatDate(article.publishedAt || article.updatedAt)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ad Space */}
            <div className="bg-gray-200 h-60 flex items-center justify-center text-gray-500 border">
              Sidebar Advertisement
            </div>
            
            {/* Most Read Articles */}
            <div className="border p-4">
              <h3 className="text-lg font-bold mb-4 border-b pb-2">MOST READ</h3>
              <div className="space-y-4">
                {latestArticles.slice(0, 5).map((article, idx) => (
                  <div key={article.id} className="flex gap-2">
                    <div className="text-xl font-bold text-red-600 w-8">{idx + 1}</div>
                    <div>
                      <Link to={`/article/${article.slug}`}>
                        <h4 className="font-medium hover:text-red-600 transition-colors">{article.title}</h4>
                      </Link>
                      <p className="text-xs text-gray-500">{formatDate(article.publishedAt || article.updatedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Category Tabs */}
            <div className="border">
              <Tabs defaultValue={categories[0]?.id}>
                <TabsList className="w-full justify-start overflow-auto flex-nowrap">
                  {categories.slice(0, 4).map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="text-xs whitespace-nowrap"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.slice(0, 4).map(category => {
                  const catArticles = categorizedArticles[category.id] || [];
                  return (
                    <TabsContent key={category.id} value={category.id} className="p-4">
                      <div className="space-y-4">
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
                          className="text-red-600 text-sm font-medium hover:underline block text-right"
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
            <div className="bg-gray-200 h-60 flex items-center justify-center text-gray-500 border">
              Sidebar Advertisement
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
