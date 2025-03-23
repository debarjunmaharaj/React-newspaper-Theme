
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/Layout/PublicLayout';
import { useSite } from '@/context/SiteContext';

const Page = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getPage } = useSite();
  
  const page = getPage(slug || '');
  
  if (!page) {
    return (
      <PublicLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The page you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/"
            className="btn-primary inline-block"
          >
            Return to Home
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-gray-900 dark:text-white">
            {page.title}
          </h1>
          <div className="news-separator mx-auto w-32" />
        </header>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </PublicLayout>
  );
};

export default Page;
