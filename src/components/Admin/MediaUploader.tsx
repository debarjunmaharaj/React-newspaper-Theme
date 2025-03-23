
import { useState } from 'react';
import { useSite } from '@/context/SiteContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Trash2, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const MediaUploader = () => {
  const { media, addMedia, deleteMedia } = useSite();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        continue;
      }
      
      // Check size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 5MB size limit.`,
          variant: "destructive",
        });
        continue;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          addMedia({
            name: file.name,
            type: file.type,
            url: e.target.result,
            size: file.size,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteMedia = (id: string) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      deleteMedia(id);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Media URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">
          Upload and manage images for your content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-700'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Image className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                Drag and drop image files here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to select files
              </p>
              <input 
                type="file" 
                id="media-upload" 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange}
              />
              <Button asChild>
                <label htmlFor="media-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
        </CardHeader>
        <CardContent>
          {media.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="group relative border rounded-md overflow-hidden">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-2 bg-white dark:bg-gray-800">
                    <div className="truncate text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {(item.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopyUrl(item.url)}
                    >
                      <Copy size={16} />
                    </Button>
                    <Button 
                      size="sm"
                      variant="secondary"
                      asChild
                    >
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} />
                      </a>
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteMedia(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No media files uploaded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
