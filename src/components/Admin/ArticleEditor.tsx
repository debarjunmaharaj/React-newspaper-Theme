
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { generateSlug } from '@/lib/utils';
import { Image, FileUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

export const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    articles, 
    categories, 
    addArticle, 
    updateArticle, 
    deleteArticle,
    media,
    addMedia
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
  const [editorTab, setEditorTab] = useState<'visual' | 'code'>('visual');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleInlineImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        return;
      }
      
      // Check size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB size limit.`,
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          // Add image to media library
          addMedia({
            name: file.name,
            type: file.type,
            url: e.target.result,
            size: file.size,
          });
          
          // Insert image into editor at cursor position
          const imageTag = `<img src="${e.target.result}" alt="${file.name}" class="w-full max-w-full h-auto my-4" />`;
          
          // If in visual mode, append to content
          if (editorTab === 'visual') {
            setContent(prev => prev + '\n\n' + imageTag);
          } else {
            // In code mode, add at cursor or append
            setContent(prev => prev + '\n\n' + imageTag);
          }
          
          toast({
            title: "Image Uploaded",
            description: "Image has been added to the content",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !content) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
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
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="content">Content</Label>
                <div className="flex space-x-2">
                  <Tabs value={editorTab} onValueChange={(value) => setEditorTab(value as 'visual' | 'code')}>
                    <TabsList>
                      <TabsTrigger value="visual">Visual</TabsTrigger>
                      <TabsTrigger value="code">HTML</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileUp className="h-4 w-4 mr-1" />
                    Add Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleInlineImageUpload}
                  />
                </div>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={editorTab === 'visual' ? "Start writing your article..." : "Enter HTML content..."}
                className="h-64 font-mono"
                required
              />
              {editorTab === 'code' && (
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;img&gt;, etc.
                </p>
              )}
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
              <p className="text-sm text-muted-foreground">
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
                        <p className="text-sm text-muted-foreground">No categories available</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <div className="flex items-center gap-2">
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
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </div>
                    
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
