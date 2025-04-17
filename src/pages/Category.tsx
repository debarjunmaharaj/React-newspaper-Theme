
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { PublicLayout } from '@/components/Layout/PublicLayout';
import { formatDate, truncateText } from '@/lib/utils';
import { Pagination } from '@/components/ui/pagination';
import { PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCategory, getArticlesByCategory, categories } = useSite();
  const [category, setCategory] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<any[]>([]);

  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const [paginatedArticles, setPaginatedArticles] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (slug) {
      const foundCategory = getCategory(slug);
      setCategory(foundCategory);
      
      if (foundCategory) {
        const categoryArticles = getArticlesByCategory(slug);
        setArticles(categoryArticles);
        
        // Reset pagination when category changes
        setCurrentPage(1);
        
        // Find related categories (here we're just using other categories as an example)
        setRelatedCategories(
          categories
            .filter(cat => cat.id !== foundCategory.id)
            .slice(0, 5)
        );
      }
    }
  }, [slug, getCategory, getArticlesByCategory, categories]);
  
  useEffect(() => {
    // Calculate total pages
    setTotalPages(Math.ceil(articles.length / articlesPerPage));
    
    // Paginate articles
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    setPaginatedArticles(articles.slice(startIndex, endIndex));
  }, [articles, currentPage]);
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!category) {
    return (
      <PublicLayout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-4">The category you're looking for doesn't exist.</p>
          <Link to="/" className="mt-6 inline-block text-red-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-6">
        {/* Category Header */}
        <div className="border-b-2 border-red-600 pb-2">
          <h1 className="text-2xl font-bold uppercase">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>
        
        {/* Ad Banner */}
        <div className="w-full bg-gray-200 h-[90px] flex items-center justify-center text-gray-500 border">
          Advertisement Banner 728x90
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Articles List */}
          <div className="lg:col-span-8">
            {paginatedArticles.length > 0 ? (
              <div className="space-y-6">
                {paginatedArticles.map((article, index) => (
                  <div key={article.id} className={`flex flex-col md:flex-row gap-4 ${index !== 0 ? 'border-t pt-6' : ''}`}>
                    {/* Article Image */}
                    {article.featuredImage && (
                      <Link to={`/article/${article.slug}`} className="md:w-1/3">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-48 md:h-40 object-cover"
                        />
                      </Link>
                    )}
                    
                    {/* Article Content */}
                    <div className={article.featuredImage ? 'md:w-2/3' : 'w-full'}>
                      <div className="flex text-xs space-x-2 mb-2">
                        <span className="news-category-label uppercase">
                          {category.name}
                        </span>
                        <span className="text-gray-500">
                          {formatDate(article.publishedAt || article.updatedAt)}
                        </span>
                      </div>
                      
                      <Link to={`/article/${article.slug}`}>
                        <h2 className="text-xl font-bold hover:text-red-600 transition-colors">
                          {article.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mt-2">
                        {truncateText(article.excerpt, 200)}
                      </p>
                      
                      <Link 
                        to={`/article/${article.slug}`}
                        className="text-red-600 font-medium hover:underline inline-block mt-3"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination className="justify-center pt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <button
                            className={`w-8 h-8 rounded-md ${
                              i + 1 === currentPage 
                                ? 'bg-red-600 text-white' 
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            ) : (
              <div className="py-8 text-center border">
                <h2 className="text-xl font-medium">No articles found</h2>
                <p className="text-gray-600 mt-2">
                  There are no articles in this category yet.
                </p>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Ad Space */}
            <div className="bg-gray-200 h-[250px] flex items-center justify-center text-gray-500 border text-sm">
              Ad 300x250
            </div>
            
            {/* Related Categories */}
            <div className="border p-4">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Related Categories</h3>
              <ul className="space-y-2">
                {relatedCategories.map(relCat => (
                  <li key={relCat.id}>
                    <Link
                      to={`/category/${relCat.slug}`}
                      className="flex items-center text-sm hover:text-red-600 transition-colors"
                    >
                      <span className="text-red-600 mr-2">›</span>
                      {relCat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Popular Articles in This Category */}
            <div className="border p-4">
              <h3 className="font-bold text-lg mb-4 border-b pb-2">Popular in {category.name}</h3>
              <div className="space-y-4">
                {articles.slice(0, 5).map((article, idx) => (
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

export default Category;
