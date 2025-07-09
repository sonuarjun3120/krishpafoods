
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Search, FolderPlus, Image, Video, Trash2, Download, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mediaService, MediaItem } from '@/services/mediaService';

export const MediaManagement = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const categories = ['all', 'products', 'banners', 'videos', 'general'];

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const mediaData = await mediaService.getAllMedia();
      setMedia(mediaData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load media files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      try {
        const category = selectedCategory === 'all' ? 'general' : selectedCategory;
        const url = await mediaService.uploadToStorage(file, category);
        
        if (url) {
          const mediaData = {
            name: file.name,
            url,
            type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
            category
          };

          const newMedia = await mediaService.createMediaRecord(mediaData);
          if (newMedia) {
            setMedia(prev => [newMedia, ...prev]);
            successCount++;
          }
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setUploading(false);
    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${successCount} of ${files.length} file(s)`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await mediaService.deleteMedia(id);
      if (success) {
        setMedia(media.filter(item => item.id !== id));
        toast({
          title: "File Deleted",
          description: "Media file has been removed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete media file",
        variant: "destructive",
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Media URL copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Management</h1>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Media'}
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 dark:border-gray-600 hover:border-primary'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drag and drop files here
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              or click to browse and upload images and videos
            </p>
            <Button variant="outline">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
              <div key={item.id} className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Video className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Video</span>
                    </div>
                  )}
                </div>
                
                <div className="p-2">
                  <h4 className="text-sm font-medium truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                  <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1 flex-col">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={() => copyUrl(item.url)}
                      title="Copy URL"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
