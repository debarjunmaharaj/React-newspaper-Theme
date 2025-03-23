
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Article,
  Category,
  Page,
  MenuItem,
  Media,
  SiteSettings,
  initialArticles,
  initialCategories,
  initialPages,
  initialMenuItems,
  initialSiteSettings,
} from '../data/initialData';
import { getLocalStorage, setLocalStorage, generateSlug, getRandomId } from '../lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface SiteContextType {
  articles: Article[];
  categories: Category[];
  pages: Page[];
  menuItems: MenuItem[];
  media: Media[];
  siteSettings: SiteSettings;
  
  // Article methods
  getArticle: (slug: string) => Article | undefined;
  getArticlesByCategory: (categorySlug: string) => Article[];
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  
  // Category methods
  getCategory: (slug: string) => Category | undefined;
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Page methods
  getPage: (slug: string) => Page | undefined;
  addPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, page: Partial<Page>) => void;
  deletePage: (id: string) => void;
  
  // Menu methods
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (items: MenuItem[]) => void;
  
  // Media methods
  addMedia: (media: Omit<Media, 'id' | 'uploadedAt'>) => void;
  deleteMedia: (id: string) => void;
  
  // Settings methods
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);

  // Load initial data from localStorage or use defaults
  useEffect(() => {
    setArticles(getLocalStorage<Article[]>('articles', initialArticles));
    setCategories(getLocalStorage<Category[]>('categories', initialCategories));
    setPages(getLocalStorage<Page[]>('pages', initialPages));
    setMenuItems(getLocalStorage<MenuItem[]>('menuItems', initialMenuItems));
    setMedia(getLocalStorage<Media[]>('media', []));
    setSiteSettings(getLocalStorage<SiteSettings>('siteSettings', initialSiteSettings));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    setLocalStorage('articles', articles);
  }, [articles]);

  useEffect(() => {
    setLocalStorage('categories', categories);
  }, [categories]);

  useEffect(() => {
    setLocalStorage('pages', pages);
  }, [pages]);

  useEffect(() => {
    setLocalStorage('menuItems', menuItems);
  }, [menuItems]);

  useEffect(() => {
    setLocalStorage('media', media);
  }, [media]);

  useEffect(() => {
    setLocalStorage('siteSettings', siteSettings);
  }, [siteSettings]);

  // Article methods
  const getArticle = (slug: string) => {
    return articles.find(article => article.slug === slug);
  };

  const getArticlesByCategory = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) return [];
    return articles.filter(article => 
      article.categories.includes(category.id) && 
      article.status === 'published'
    );
  };

  const addArticle = (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newArticle: Article = {
      ...article,
      id: getRandomId(),
      createdAt: now,
      updatedAt: now,
    };
    
    setArticles(prev => [...prev, newArticle]);
    toast({
      title: "Article Created",
      description: `"${article.title}" has been created successfully`,
    });
  };

  const updateArticle = (id: string, articleUpdate: Partial<Article>) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === id 
          ? { 
              ...article, 
              ...articleUpdate, 
              updatedAt: new Date().toISOString() 
            } 
          : article
      )
    );
    
    toast({
      title: "Article Updated",
      description: "The article has been updated successfully",
    });
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
    toast({
      title: "Article Deleted",
      description: "The article has been deleted",
    });
  };

  // Category methods
  const getCategory = (slug: string) => {
    return categories.find(category => category.slug === slug);
  };

  const addCategory = (category: Omit<Category, 'id' | 'slug'>) => {
    const newCategory: Category = {
      ...category,
      id: getRandomId(),
      slug: generateSlug(category.name),
    };
    
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Category Created",
      description: `"${category.name}" has been created successfully`,
    });
  };

  const updateCategory = (id: string, categoryUpdate: Partial<Category>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { 
              ...category, 
              ...categoryUpdate,
              slug: categoryUpdate.name 
                ? generateSlug(categoryUpdate.name) 
                : category.slug 
            } 
          : category
      )
    );
    
    toast({
      title: "Category Updated",
      description: "The category has been updated successfully",
    });
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    
    // Remove this category from all articles
    setArticles(prev => 
      prev.map(article => ({
        ...article,
        categories: article.categories.filter(catId => catId !== id),
      }))
    );
    
    toast({
      title: "Category Deleted",
      description: "The category has been deleted",
    });
  };

  // Page methods
  const getPage = (slug: string) => {
    return pages.find(page => page.slug === slug);
  };

  const addPage = (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPage: Page = {
      ...page,
      id: getRandomId(),
      createdAt: now,
      updatedAt: now,
    };
    
    setPages(prev => [...prev, newPage]);
    toast({
      title: "Page Created",
      description: `"${page.title}" has been created successfully`,
    });
  };

  const updatePage = (id: string, pageUpdate: Partial<Page>) => {
    setPages(prev => 
      prev.map(page => 
        page.id === id 
          ? { 
              ...page, 
              ...pageUpdate, 
              updatedAt: new Date().toISOString() 
            } 
          : page
      )
    );
    
    toast({
      title: "Page Updated",
      description: "The page has been updated successfully",
    });
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(page => page.id !== id));
    toast({
      title: "Page Deleted",
      description: "The page has been deleted",
    });
  };

  // Menu methods
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: getRandomId(),
    };
    
    setMenuItems(prev => [...prev, newItem]);
    toast({
      title: "Menu Item Added",
      description: `"${item.label}" has been added to the menu`,
    });
  };

  const updateMenuItem = (id: string, itemUpdate: Partial<MenuItem>) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...itemUpdate } 
          : item
      )
    );
    
    toast({
      title: "Menu Item Updated",
      description: "The menu item has been updated",
    });
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Menu Item Deleted",
      description: "The menu item has been deleted",
    });
  };

  const reorderMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
    toast({
      title: "Menu Reordered",
      description: "The menu order has been updated",
    });
  };

  // Media methods
  const addMedia = (media: Omit<Media, 'id' | 'uploadedAt'>) => {
    const newMedia: Media = {
      ...media,
      id: getRandomId(),
      uploadedAt: new Date().toISOString(),
    };
    
    setMedia(prev => [...prev, newMedia]);
    toast({
      title: "Media Uploaded",
      description: `"${media.name}" has been uploaded successfully`,
    });
  };

  const deleteMedia = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Media Deleted",
      description: "The media item has been deleted",
    });
  };

  // Settings methods
  const updateSiteSettings = (settingsUpdate: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settingsUpdate }));
    toast({
      title: "Settings Updated",
      description: "The site settings have been updated",
    });
  };

  return (
    <SiteContext.Provider
      value={{
        articles,
        categories,
        pages,
        menuItems,
        media,
        siteSettings,
        
        getArticle,
        getArticlesByCategory,
        addArticle,
        updateArticle,
        deleteArticle,
        
        getCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        
        getPage,
        addPage,
        updatePage,
        deletePage,
        
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        reorderMenuItems,
        
        addMedia,
        deleteMedia,
        
        updateSiteSettings,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
