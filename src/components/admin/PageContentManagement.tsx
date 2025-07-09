
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Eye, Edit, Plus, Image, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pageService, Page, ContentBlock } from '@/services/pageService';
import { mediaService } from '@/services/mediaService';

export const PageContentManagement = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableMedia, setAvailableMedia] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
    loadMedia();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      const pagesData = await pageService.getAllPages();
      setPages(pagesData);
      if (pagesData.length > 0) {
        setSelectedPage(pagesData[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMedia = async () => {
    try {
      const mediaData = await mediaService.getAllMedia();
      setAvailableMedia(mediaData);
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  const handleSave = async () => {
    if (selectedPage) {
      try {
        const updatedPage = await pageService.updatePage(selectedPage.id, {
          title: selectedPage.title,
          slug: selectedPage.slug,
          content_blocks: selectedPage.content_blocks,
          status: selectedPage.status
        });
        
        if (updatedPage) {
          setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
          setSelectedPage(updatedPage);
          setIsEditing(false);
          toast({
            title: "Page Saved",
            description: "Page content has been updated successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save page",
          variant: "destructive",
        });
      }
    }
  };

  const handlePageSelect = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setSelectedPage(page);
      setIsEditing(false);
    }
  };

  const handleCreateNewPage = async () => {
    try {
      const newPage = await pageService.createPage({
        title: 'New Page',
        slug: `new-page-${Date.now()}`,
        content_blocks: [
          {
            type: 'content',
            title: 'New Page',
            content: 'Page content goes here...'
          }
        ],
        status: 'draft'
      });
      
      if (newPage) {
        setPages([newPage, ...pages]);
        setSelectedPage(newPage);
        setIsEditing(true);
        toast({
          title: "New Page Created",
          description: "New page created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new page",
        variant: "destructive",
      });
    }
  };

  const addContentBlock = () => {
    if (selectedPage) {
      const newBlock: ContentBlock = {
        type: 'content',
        title: 'New Section',
        content: 'Enter your content here...'
      };
      setSelectedPage({
        ...selectedPage,
        content_blocks: [...selectedPage.content_blocks, newBlock]
      });
    }
  };

  const updateContentBlock = (index: number, updates: Partial<ContentBlock>) => {
    if (selectedPage) {
      const updatedBlocks = [...selectedPage.content_blocks];
      updatedBlocks[index] = { ...updatedBlocks[index], ...updates };
      setSelectedPage({
        ...selectedPage,
        content_blocks: updatedBlocks
      });
    }
  };

  const removeContentBlock = (index: number) => {
    if (selectedPage) {
      const updatedBlocks = selectedPage.content_blocks.filter((_, i) => i !== index);
      setSelectedPage({
        ...selectedPage,
        content_blocks: updatedBlocks
      });
    }
  };

  const renderContentPreview = () => {
    if (!selectedPage) return null;
    
    return (
      <div className="space-y-4">
        {selectedPage.content_blocks.map((block, index) => (
          <div key={index} className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
            {block.type === 'hero' && (
              <>
                <h1 className="text-2xl font-bold mb-2">{block.title}</h1>
                <p className="text-gray-600 mb-4">{block.subtitle}</p>
                {block.image && <img src={block.image} alt={block.title} className="w-full h-48 object-cover rounded" />}
                {block.button && (
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded">
                    {block.button.text}
                  </button>
                )}
              </>
            )}
            {block.type === 'content' && (
              <>
                <h2 className="text-xl font-semibold mb-2">{block.title}</h2>
                <p className="text-gray-600">{block.content}</p>
                {block.image && <img src={block.image} alt={block.title} className="w-full h-32 object-cover rounded mt-2" />}
              </>
            )}
            {block.type === 'contact' && (
              <>
                <h2 className="text-xl font-semibold mb-2">{block.title}</h2>
                <p className="text-gray-600 mb-2">{block.content}</p>
                {block.email && <p className="text-sm">Email: {block.email}</p>}
                {block.phone && <p className="text-sm">Phone: {block.phone}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Content Management</h1>
        <Button onClick={handleCreateNewPage}>
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-1">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageSelect(page.id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedPage?.id === page.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                    }`}
                  >
                    <div className="font-medium">{page.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">/{page.slug}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {page.status}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(page.updated_at).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Editor */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedPage ? `Edit: ${selectedPage.title}` : 'Select a page'}
              </CardTitle>
              {selectedPage && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'View' : 'Edit'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPage && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={selectedPage.title}
                      onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={selectedPage.slug}
                      onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Content Blocks</Label>
                    {isEditing && (
                      <Button variant="outline" size="sm" onClick={addContentBlock}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Block
                      </Button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      {selectedPage.content_blocks.map((block, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Select
                                value={block.type}
                                onValueChange={(value) => updateContentBlock(index, { type: value })}
                              >
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hero">Hero Section</SelectItem>
                                  <SelectItem value="content">Content Section</SelectItem>
                                  <SelectItem value="contact">Contact Section</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeContentBlock(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                            
                            <Input
                              placeholder="Block title"
                              value={block.title || ''}
                              onChange={(e) => updateContentBlock(index, { title: e.target.value })}
                            />
                            
                            {block.type === 'hero' && (
                              <Input
                                placeholder="Subtitle"
                                value={block.subtitle || ''}
                                onChange={(e) => updateContentBlock(index, { subtitle: e.target.value })}
                              />
                            )}
                            
                            <Textarea
                              placeholder="Content"
                              value={block.content || ''}
                              onChange={(e) => updateContentBlock(index, { content: e.target.value })}
                              rows={3}
                            />
                            
                            <div className="flex gap-2">
                              <Input
                                placeholder="Image URL"
                                value={block.image || ''}
                                onChange={(e) => updateContentBlock(index, { image: e.target.value })}
                              />
                              {availableMedia.length > 0 && (
                                <Select onValueChange={(url) => updateContentBlock(index, { image: url })}>
                                  <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select media" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableMedia.filter(m => m.type === 'image').map((media) => (
                                      <SelectItem key={media.id} value={media.url}>
                                        {media.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                            
                            {(block.type === 'contact') && (
                              <>
                                <Input
                                  placeholder="Email"
                                  value={block.email || ''}
                                  onChange={(e) => updateContentBlock(index, { email: e.target.value })}
                                />
                                <Input
                                  placeholder="Phone"
                                  value={block.phone || ''}
                                  onChange={(e) => updateContentBlock(index, { phone: e.target.value })}
                                />
                              </>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    renderContentPreview()
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={selectedPage.status}
                      onValueChange={(value) => setSelectedPage({ ...selectedPage, status: value as 'published' | 'draft' })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Modified</Label>
                    <Input value={new Date(selectedPage.updated_at).toLocaleString()} disabled />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
