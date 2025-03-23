
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { CategoryManager } from '@/components/Admin/CategoryManager';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Categories = () => {
  const { id } = useParams<{ id: string }>();
  const { categories, articles } = useSite();
  const navigate = useNavigate();
  
  // Count articles in each category
  const getCategoryArticleCount = (categoryId: string) => {
    return articles.filter(article => article.categories.includes(categoryId)).length;
  };

  // If id is provided, show the category editor
  if (id) {
    return (
      <AdminLayout>
        <CategoryManager />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Categories</h1>
            <p className="text-muted-foreground">
              Organize your content with categories
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/categories/new">New Category</Link>
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/admin/categories/${category.id}`}
                        className="hover:text-news-accent transition-colors"
                      >
                        {category.name}
                      </Link>
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{getCategoryArticleCount(category.id)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || 'No description'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/categories/${category.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link to={`/category/${category.slug}`} target="_blank">
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
                    No categories found.
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

export default Categories;
