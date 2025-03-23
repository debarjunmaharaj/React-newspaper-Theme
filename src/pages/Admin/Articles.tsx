
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { ArticleEditor } from '@/components/Admin/ArticleEditor';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const Articles = () => {
  const { id } = useParams<{ id: string }>();
  const { articles, categories } = useSite();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articles);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArticles([...articles].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredArticles(
        articles
          .filter(article => 
            article.title.toLowerCase().includes(term) || 
            article.content.toLowerCase().includes(term)
          )
          .sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      );
    }
  }, [articles, searchTerm]);

  // If id is provided, show the article editor
  if (id) {
    return (
      <AdminLayout>
        <ArticleEditor />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Articles</h1>
            <p className="text-muted-foreground">
              Manage your articles
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/articles/new">New Article</Link>
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/admin/articles/${article.id}`}
                        className="hover:text-news-accent transition-colors"
                      >
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {article.categories.map(catId => {
                          const category = categories.find(c => c.id === catId);
                          return category ? (
                            <Badge key={catId} variant="outline" className="text-xs">
                              {category.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={article.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(article.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/articles/${article.id}`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No articles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Articles;
