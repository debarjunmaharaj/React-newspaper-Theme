
import { useParams } from 'react-router-dom';
import { PublicLayout } from '@/components/Layout/PublicLayout';
import { ArticleView } from '@/components/Articles/ArticleView';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <PublicLayout>
      <ArticleView slug={slug || ''} />
    </PublicLayout>
  );
};

export default Article;
