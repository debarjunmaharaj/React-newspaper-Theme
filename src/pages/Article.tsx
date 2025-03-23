
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { PublicLayout } from '@/components/Layout/PublicLayout';
import { formatDate } from '@/lib/utils';
import { ArticleView } from '@/components/Articles/ArticleView';
import { Facebook, Twitter, Linkedin, Mail, Printer, User, Calendar, Eye } from 'lucide-react';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getArticle, categories, articles } = useSite();
  const [article, setArticle] = useState<any>(null);
  const [articleCategories, setArticleCategories] = useState<any[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      const foundArticle = getArticle(slug);
      setArticle(foundArticle);
      
      if (foundArticle) {
        // Get category objects for this article
        const cats = categories.filter(cat => 
          foundArticle.categories.includes(cat.id)
        );
        setArticleCategories(cats);
        
        // Get related articles (from same categories)
        const related = articles
          .filter(a => 
            a.id !== foundArticle.id && 
            a.status === 'published' &&
            a.categories.some(catId => foundArticle.categories.includes(catId))
          )
          .slice(0, 4);
          
        setRelatedArticles(related);
      }
    }
  }, [slug, getArticle, categories, articles]);

  if (!article) {
    return (
      <PublicLayout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <p className="mt-4">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="mt-6 inline-block text-red-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <article className="space-y-4">
            {/* Article Categories */}
            <div className="flex flex-wrap gap-2">
              {articleCategories.map(category => (
                <Link 
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="news-category-label"
                >
                  {category.name.toUpperCase()}
                </Link>
              ))}
            </div>
            
            {/* Article Title */}
            <h1 className="text-3xl font-bold leading-tight">{article.title}</h1>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm border-b border-t py-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Admin</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(article.publishedAt || article.updatedAt)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>1.2K Views</span>
              </div>
            </div>
            
            {/* Featured Image */}
            {article.featuredImage && (
              <div className="my-4">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
            )}
            
            {/* Sharing Icons */}
            <div className="flex gap-2 my-4">
              <a href="#" className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-full">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-white bg-sky-500 hover:bg-sky-600 p-2 rounded-full">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-full">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" className="text-white bg-gray-600 hover:bg-gray-700 p-2 rounded-full">
                <Printer className="h-4 w-4" />
              </a>
            </div>
            
            {/* Article Content */}
            <div className="article-content prose max-w-none">
              <ArticleView content={article.content} />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 border-t border-b py-4 my-6">
              <span className="font-semibold">Tags:</span>
              {articleCategories.map(category => (
                <Link 
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-sm text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            {/* Mid-Article Ad */}
            <div className="w-full bg-gray-200 h-[90px] flex items-center justify-center text-gray-500 border">
              Advertisement Banner 728x90
            </div>
            
            {/* Related Articles */}
            <div className="my-6">
              <h3 className="text-xl font-bold mb-4 border-b-2 border-red-600 pb-2">
                Related Articles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map(relArticle => (
                  <div key={relArticle.id} className="border-b pb-4">
                    {relArticle.featuredImage && (
                      <Link to={`/article/${relArticle.slug}`} className="block mb-2">
                        <img 
                          src={relArticle.featuredImage} 
                          alt={relArticle.title}
                          className="w-full h-40 object-cover"
                        />
                      </Link>
                    )}
                    
                    <Link to={`/article/${relArticle.slug}`}>
                      <h4 className="font-bold hover:text-red-600 transition-colors">
                        {relArticle.title}
                      </h4>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(relArticle.publishedAt || relArticle.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Comments Section Placeholder */}
            <div className="border p-4">
              <h3 className="text-xl font-bold mb-4">Comments</h3>
              <p className="text-gray-600">Comments are not implemented in the demo.</p>
            </div>
          </article>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ad Space */}
          <div className="bg-gray-200 h-[250px] flex items-center justify-center text-gray-500 border text-sm">
            Ad 300x250
          </div>
          
          {/* Most Popular */}
          <div className="border p-4">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Popular News</h3>
            <div className="space-y-4">
              {articles
                .filter(a => a.status === 'published')
                .slice(0, 5)
                .map((article, idx) => (
                <div key={article.id} className="flex gap-2 border-b pb-3 last:border-0">
                  <div className="text-xl font-bold text-red-600 w-6">{idx + 1}</div>
                  <div>
                    <Link to={`/article/${article.slug}`}>
                      <h4 className="font-medium text-sm hover:text-red-600 transition-colors">
                        {article.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(article.publishedAt || article.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Categories */}
          <div className="border p-4">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-center justify-between text-sm hover:text-red-600 transition-colors group"
                  >
                    <span className="flex items-center">
                      <span className="text-red-600 mr-2">›</span>
                      {category.name}
                    </span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs group-hover:bg-red-600 group-hover:text-white transition-colors">
                      {articles.filter(a => a.categories.includes(category.id) && a.status === 'published').length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* More Ad Space */}
          <div className="bg-gray-200 h-[250px] flex items-center justify-center text-gray-500 border text-sm">
            Ad 300x250
          </div>
          
          {/* Newsletter */}
          <div className="bg-gray-100 p-4 border">
            <h3 className="font-bold text-lg mb-2">Newsletter</h3>
            <p className="text-sm mb-3">
              Subscribe to our newsletter for daily news and updates.
            </p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-3 py-2 border text-sm"
              />
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 text-sm font-medium hover:bg-red-700 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Article;
