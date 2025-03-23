
import { Link } from 'react-router-dom';
import { useSite } from '@/context/SiteContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FolderOpen, Menu as MenuIcon, Image, Settings } from 'lucide-react';

export const Dashboard = () => {
  const { articles, categories, pages, menuItems, media } = useSite();
  
  const publishedArticles = articles.filter(article => article.status === 'published');
  const draftArticles = articles.filter(article => article.status === 'draft');

  const stats = [
    {
      title: 'Total Articles',
      value: articles.length,
      description: `${publishedArticles.length} published, ${draftArticles.length} drafts`,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      link: '/admin/articles',
    },
    {
      title: 'Categories',
      value: categories.length,
      description: 'Content organization',
      icon: <FolderOpen className="h-5 w-5 text-green-500" />,
      link: '/admin/categories',
    },
    {
      title: 'Pages',
      value: pages.length,
      description: 'Static content',
      icon: <FileText className="h-5 w-5 text-purple-500" />,
      link: '/admin/pages',
    },
    {
      title: 'Menu Items',
      value: menuItems.length,
      description: 'Navigation elements',
      icon: <MenuIcon className="h-5 w-5 text-orange-500" />,
      link: '/admin/menus',
    },
    {
      title: 'Media',
      value: media.length,
      description: 'Uploaded files',
      icon: <Image className="h-5 w-5 text-red-500" />,
      link: '/admin/media',
    },
    {
      title: 'Settings',
      value: '',
      description: 'Configure website',
      icon: <Settings className="h-5 w-5 text-gray-500" />,
      link: '/admin/settings',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your newspaper admin dashboard.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link 
            key={stat.title} 
            to={stat.link}
            className="transition-transform duration-300 hover:translate-y-[-4px]"
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {typeof stat.value === 'number' ? stat.value : 'Configure'}
                </div>
                <CardDescription className="text-xs text-muted-foreground pt-1">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>
              Latest content updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.length > 0 ? (
                articles
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((article) => (
                    <div key={article.id} className="flex items-center justify-between">
                      <div>
                        <Link 
                          to={`/admin/articles/${article.id}`}
                          className="font-medium hover:underline"
                        >
                          {article.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {new Date(article.updatedAt).toLocaleDateString()} • 
                          <span className={`ml-1 ${
                            article.status === 'published' ? 'text-green-500' : 'text-amber-500'
                          }`}>
                            {article.status}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/admin/articles/${article.id}`}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No articles created yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link
                to="/admin/articles/new"
                className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                <FileText className="mr-2 h-4 w-4" />
                Create New Article
              </Link>
              <Link
                to="/admin/pages/new"
                className="inline-flex items-center justify-center rounded-md bg-purple-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-600"
              >
                <FileText className="mr-2 h-4 w-4" />
                Create New Page
              </Link>
              <Link
                to="/admin/categories/new"
                className="inline-flex items-center justify-center rounded-md bg-green-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-600"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Create New Category
              </Link>
              <Link
                to="/admin/media"
                className="inline-flex items-center justify-center rounded-md bg-red-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                <Image className="mr-2 h-4 w-4" />
                Upload Media
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
