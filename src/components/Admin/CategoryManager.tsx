
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export const CategoryManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, deleteCategory } = useSite();
  
  const isNew = id === 'new';
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      const category = categories.find(c => c.id === id);
      if (category) {
        setName(category.name);
        setDescription(category.description || '');
      }
    }
  }, [id, categories, isNew]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      return;
    }
    
    if (isNew) {
      addCategory({
        name,
        description,
      });
    } else if (id) {
      updateCategory(id, {
        name,
        description,
      });
    }
    
    navigate('/admin/categories');
  };

  const handleDelete = () => {
    if (id && !isNew && window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      navigate('/admin/categories');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNew ? 'Create New Category' : 'Edit Category'}
        </h1>
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            type="submit"
            form="category-form"
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

      <Card>
        <CardContent className="pt-6">
          <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category description (optional)"
                rows={3}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
