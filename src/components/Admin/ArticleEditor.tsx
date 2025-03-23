
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { generateSlug } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    articles, 
    categories, 
    addArticle, 
    updateArticle, 
    deleteArticle,
    media
  } = useSite();
  
  const isNew = id === 'new';
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(undefined);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(true);

  useEffect(() => {
    if (!isNew && id) {
      const article = articles.find(a => a.id === id);
      if (article) {
        setTitle(article.title);
        setSlug(article.slug);
        setContent(article.content);
        setExcerpt(article.excerpt);
        setSelectedCategories(article.categories);
        setStatus(article.status);
        setFeaturedImage(article.featuredImage);
        setIsGeneratingSlug(false);
      }
    }
  }, [id, articles, isNew]);

  useEffect(() => {
    if (isGeneratingSlug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isGeneratingSlug]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsGeneratingSlug(false);
    setSlug(e.target.value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !content) {
      return;
    }
    
    if (isNew) {
      addArticle({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        featuredImage,
        author: user?.id || '',
        categories: selectedCategories,
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      });
    } else if (id) {
      updateArticle(id, {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        featuredImage,
        categories: selectedCategories,
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      });
    }
    
    navigate('/admin/articles');
  };

  const handleDelete = () => {
    if (id && !isNew && window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
      navigate('/admin/articles');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNew ? 'Create New Article' : 'Edit Article'}
        </h1>
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            type="submit"
            form="article-form"
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

      <form id="article-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title"
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
                  placeholder="article-slug"
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
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Article content..."
                className="h-64 font-mono"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description (optional)"
                className="h-24"
              />
              <p className="text-sm text-gray-500">
                If left empty, excerpt will be generated from content
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={status} 
                      onValueChange={(value) => setStatus(value as 'draft' | 'published')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryChange(category.id)}
                            />
                            <Label
                              htmlFor={`category-${category.id}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No categories available</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <Select 
                      value={featuredImage} 
                      onValueChange={setFeaturedImage}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select image" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>None</SelectItem>
                        {media
                          .filter(item => item.type.startsWith('image/'))
                          .map((item) => (
                            <SelectItem key={item.id} value={item.url}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    
                    {featuredImage && (
                      <div className="mt-2 rounded-md overflow-hidden border">
                        <img 
                          src={featuredImage} 
                          alt="Featured" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
