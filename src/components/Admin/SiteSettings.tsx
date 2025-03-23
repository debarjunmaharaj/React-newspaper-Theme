
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SiteSettings = () => {
  const { siteSettings, updateSiteSettings, media } = useSite();
  const [settings, setSettings] = useState({ ...siteSettings });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setSettings(siteSettings);
  }, [siteSettings]);

  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof typeof settings],
          [child]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
    
    setIsDirty(true);
  };

  const handleSave = () => {
    updateSiteSettings(settings);
    setIsDirty(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Configure your website settings
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={!isDirty}
        >
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Site Title</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Site Title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Site Tagline"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Site description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Visual elements of your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    {settings.logo ? (
                      <div className="border rounded-md p-2">
                        <img
                          src={settings.logo}
                          alt="Logo"
                          className="max-h-24 mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 text-center text-gray-500">
                        No logo selected
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                      {media
                        .filter(item => item.type.startsWith('image/'))
                        .map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex items-center p-2 rounded-md cursor-pointer ${
                              settings.logo === item.url ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => handleChange('logo', item.url)}
                          >
                            <img 
                              src={item.url} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded-sm mr-2" 
                            />
                            <div className="truncate">{item.name}</div>
                          </div>
                        ))}
                      {media.filter(item => item.type.startsWith('image/')).length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No images available. Upload some in the Media Library.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    {settings.favicon ? (
                      <div className="border rounded-md p-2">
                        <img
                          src={settings.favicon}
                          alt="Favicon"
                          className="max-h-24 mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 text-center text-gray-500">
                        No favicon selected
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                      {media
                        .filter(item => item.type.startsWith('image/'))
                        .map((item) => (
                          <div 
                            key={item.id} 
                            className={`flex items-center p-2 rounded-md cursor-pointer ${
                              settings.favicon === item.url ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => handleChange('favicon', item.url)}
                          >
                            <img 
                              src={item.url} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded-sm mr-2" 
                            />
                            <div className="truncate">{item.name}</div>
                          </div>
                        ))}
                      {media.filter(item => item.type.startsWith('image/')).length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No images available. Upload some in the Media Library.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.social.facebook || ''}
                  onChange={(e) => handleChange('social.facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.social.twitter || ''}
                  onChange={(e) => handleChange('social.twitter', e.target.value)}
                  placeholder="https://twitter.com/youraccount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.social.instagram || ''}
                  onChange={(e) => handleChange('social.instagram', e.target.value)}
                  placeholder="https://instagram.com/youraccount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.social.linkedin || ''}
                  onChange={(e) => handleChange('social.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/youraccount"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
