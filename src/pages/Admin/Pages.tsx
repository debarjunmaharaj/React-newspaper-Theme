
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { generateSlug } from '@/lib/utils';

const Pages = () => {
  const { id } = useParams<{ id: string }>();
  const { pages, addPage, updatePage, deletePage, getPage } = useSite();
  const navigate = useNavigate();
  
  const isNew = id === 'new';
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(true);
  
  // Load page data when editing
  useEffect(() => {
    if (!isNew && id) {
      const page = getPage(pages.find(p => p.id === id)?.slug || '');
      if (page) {
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content);
        setStatus(page.status);
        setIsGeneratingSlug(false);
      }
    }
  }, [id, isNew, pages, getPage]);
  
  // Generate slug from title if enabled
  useEffect(() => {
    if (isGeneratingSlug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isGeneratingSlug]);
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsGeneratingSlug(false);
    setSlug(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !content) {
      return;
    }
    
    if (isNew) {
      addPage({
        title,
        slug,
        content,
        status,
      });
    } else if (id) {
      updatePage(id, {
        title,
        slug,
        content,
        status,
      });
    }
    
    navigate('/admin/pages');
  };
  
  const handleDelete = () => {
    if (id && !isNew && window.confirm('Are you sure you want to delete this page?')) {
      deletePage(id);
      navigate('/admin/pages');
    }
  };
  
  // If id is provided, show the page editor
  if (id) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {isNew ? 'Create New Page' : 'Edit Page'}
            </h1>
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                type="submit"
                form="page-form"
              >
                {isNew ? 'Create' : 'Update'}
              </Button>
              {!isNew && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          <form id="page-form" onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Page Title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="slug"
                      value={slug}
                      onChange={handleSlugChange}
                      placeholder="page-slug"
                      required
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsGeneratingSlug(true);
                        setSlug(generateSlug(title));
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Page content..."
                    className="h-64 font-mono"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pages</h1>
            <p className="text-muted-foreground">
              Manage your static pages
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/pages/new">New Page</Link>
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.length > 0 ? (
                pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/admin/pages/${page.id}`}
                        className="hover:text-news-accent transition-colors"
                      >
                        {page.title}
                      </Link>
                    </TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>
                      <Badge className={page.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}>
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(page.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/pages/${page.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link to={`/page/${page.slug}`} target="_blank">
                            View
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No pages found.
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

export default Pages;
