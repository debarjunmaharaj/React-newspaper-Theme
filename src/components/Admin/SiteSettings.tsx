
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const SiteSettings = () => {
  const { siteSettings, updateSiteSettings, media } = useSite();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(siteSettings.title);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [description, setDescription] = useState(siteSettings.description);
  const [logo, setLogo] = useState(siteSettings.logo);
  const [footerText, setFooterText] = useState(siteSettings.footerText);
  
  useEffect(() => {
    setTitle(siteSettings.title);
    setTagline(siteSettings.tagline);
    setDescription(siteSettings.description);
    setLogo(siteSettings.logo);
    setFooterText(siteSettings.footerText);
  }, [siteSettings]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateSiteSettings({
      title,
      tagline,
      description,
      logo,
      footerText
    });
    
    toast({
      title: "Settings Saved",
      description: "Your site settings have been updated",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">
          Configure your website settings
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Site Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your Site Title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Your Site Tagline"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Site Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your site"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center gap-4">
                <select
                  id="logo"
                  value={logo || ''}
                  onChange={(e) => setLogo(e.target.value === '' ? undefined : e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">No Logo</option>
                  {media
                    .filter(item => item.type.startsWith('image/'))
                    .map((item) => (
                      <option key={item.id} value={item.url}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              
              {logo && (
                <div className="mt-2 rounded-md overflow-hidden border w-40 h-40">
                  <img 
                    src={logo} 
                    alt="Site Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Footer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Textarea
                id="footerText"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Footer text or copyright information"
              />
            </div>
          </CardContent>
        </Card>
        
        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </form>
    </div>
  );
};
