'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { createNewsArticle, updateNewsArticle } from '@/lib/actions/news-actions';
import { NewsArticle } from '@/types';
import { slugify } from '@/lib/utils';

interface NewsModalProps {
  open: boolean;
  onClose: () => void;
  article: NewsArticle | null;
  isCreating: boolean;
  onSave: () => void;
}

export default function NewsModal({ open, onClose, article, isCreating, onSave }: NewsModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article && !isCreating) {
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        image: article.image || '',
        published: article.published || false,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        published: false,
      });
    }
  }, [article, isCreating, open]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: isCreating ? slugify(value) : prev.slug,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (isCreating) {
        res = await createNewsArticle(formData);
      } else if (article) {
        res = await updateNewsArticle(article.id, formData);
      }

      if (res && 'error' in res) {
        alert(res.error || 'Failed to save article');
      } else if (res) {
        onSave();
        onClose();
      } else {
        alert('Failed to save article');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreating ? 'Create New Article' : 'Edit Article'}</DialogTitle>
          <DialogDescription>
            {isCreating ? 'Fill in the details for your new article' : 'Update the article details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="article-url-slug"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary of the article"
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Full article content (HTML supported)"
              rows={10}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="image">Featured Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="/images/article-image.jpg"
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <Label htmlFor="published" className="font-normal">
              Publish immediately
            </Label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : isCreating ? (
              'Create Article'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
