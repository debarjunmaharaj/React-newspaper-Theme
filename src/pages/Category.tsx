
import { useParams } from 'react-router-dom';
import { PublicLayout } from '@/components/Layout/PublicLayout';
import { ArticleList } from '@/components/Articles/ArticleList';
import { useSite } from '@/context/SiteContext';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCategory, articles } = useSite();
  
  const category = slug !== 'all' ? getCategory(slug || '') : null;
  const title = category ? category.name : 'All Articles';
  const description = category?.description;

  return (
    <PublicLayout>
      <div className="mb-12 text-center">
        <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">{title}</h1>
        {description && (
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
      
      <ArticleList categorySlug={slug !== 'all' ? slug : undefined} />
    </PublicLayout>
  );
};

export default Category;
