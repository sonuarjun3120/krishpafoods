
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Eye, Edit, Plus, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastModified: string;
}

const mockPages: PageContent[] = [
  {
    id: '1',
    title: 'Home Page',
    slug: 'home',
    content: '<h1>Welcome to Our Spice Store</h1><p>Discover the finest spices from around the world...</p>',
    status: 'published',
    lastModified: '2024-01-15'
  },
  {
    id: '2',
    title: 'About Us',
    slug: 'about',
    content: '<h1>About Our Company</h1><p>We have been sourcing premium spices for over 20 years...</p>',
    status: 'published',
    lastModified: '2024-01-14'
  },
  {
    id: '3',
    title: 'Contact',
    slug: 'contact',
    content: '<h1>Get in Touch</h1><p>Contact us for any inquiries about our products...</p>',
    status: 'draft',
    lastModified: '2024-01-13'
  },
];

export const PageContentManagement = () => {
  const [pages, setPages] = useState<PageContent[]>(mockPages);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(pages[0]);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (selectedPage) {
      setPages(pages.map(page =>
        page.id === selectedPage.id
          ? { ...selectedPage, lastModified: new Date().toISOString().split('T')[0] }
          : page
      ));
      setIsEditing(false);
      toast({
        title: "Page Saved",
        description: "Page content has been updated successfully",
      });
    }
  };

  const handlePageSelect = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setSelectedPage(page);
      setIsEditing(false);
    }
  };

  const insertImage = () => {
    if (selectedPage) {
      const imageHtml = '<img src="/placeholder.svg" alt="Image description" class="max-w-full h-auto" />';
      setSelectedPage({
        ...selectedPage,
        content: selectedPage.content + imageHtml
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Content Management</h1>
        <Button>
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
                    <span className="text-xs text-gray-500">{page.lastModified}</span>
                  </div>
                </button>
              ))}
            </div>
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Page Content</Label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={insertImage}>
                          <Image className="h-4 w-4 mr-1" />
                          Insert Image
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <Textarea
                      id="content"
                      value={selectedPage.content}
                      onChange={(e) => setSelectedPage({ ...selectedPage, content: e.target.value })}
                      rows={15}
                      className="font-mono text-sm"
                      placeholder="Enter HTML content here..."
                    />
                  ) : (
                    <div
                      className="border rounded-md p-4 min-h-[300px] bg-gray-50 dark:bg-gray-900"
                      dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                    />
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
                    <Input value={selectedPage.lastModified} disabled />
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
