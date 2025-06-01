
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, FolderPlus, Image, Video, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: string;
  url: string;
  uploadDate: string;
  folder: string;
}

const mockMedia: MediaItem[] = [
  {
    id: '1',
    name: 'product-garam-masala.jpg',
    type: 'image',
    size: '245 KB',
    url: '/placeholder.svg',
    uploadDate: '2024-01-15',
    folder: 'products'
  },
  {
    id: '2',
    name: 'hero-banner.jpg',
    type: 'image',
    size: '1.2 MB',
    url: '/placeholder.svg',
    uploadDate: '2024-01-14',
    folder: 'banners'
  },
  {
    id: '3',
    name: 'cooking-demo.mp4',
    type: 'video',
    size: '15.8 MB',
    url: '/placeholder.svg',
    uploadDate: '2024-01-13',
    folder: 'videos'
  },
];

export const MediaManagement = () => {
  const [media, setMedia] = useState<MediaItem[]>(mockMedia);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const folders = ['all', 'products', 'banners', 'videos', 'documents'];

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    return matchesSearch && matchesFolder;
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

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      const newMedia: MediaItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: formatFileSize(file.size),
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString().split('T')[0],
        folder: 'products'
      };
      setMedia(prev => [...prev, newMedia]);
    });

    toast({
      title: "Files Uploaded",
      description: `Successfully uploaded ${files.length} file(s)`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDelete = (id: string) => {
    setMedia(media.filter(item => item.id !== id));
    toast({
      title: "File Deleted",
      description: "Media file has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
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
              {folders.map(folder => (
                <Button
                  key={folder}
                  variant={selectedFolder === folder ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFolder(folder)}
                  className="capitalize"
                >
                  {folder}
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
                  <p className="text-xs text-gray-500">{item.size}</p>
                  <p className="text-xs text-gray-400">{item.uploadDate}</p>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
