'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, Plus, Trash, Edit, ImageIcon } from 'lucide-react';
import {
  fetchGalleryPhotos,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
} from '@/lib/actions/gallery-actions';
import { GalleryPhoto } from '@/types';
import Image from 'next/image';

export default function GalleryManagementPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [formUrl, setFormUrl] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formOrder, setFormOrder] = useState('0');
  const [saving, setSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const loadPhotos = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchGalleryPhotos();
      if ('error' in res) {
        setError(true);
      } else {
        setPhotos(res);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const resetForm = () => {
    setFormUrl('');
    setFormCaption('');
    setFormOrder('0');
    setEditingPhoto(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setFormUrl(photo.url);
    setFormCaption(photo.caption || '');
    setFormOrder(String(photo.sortOrder || 0));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formUrl.trim()) return;

    setSaving(true);
    try {
      if (editingPhoto) {
        const res = await updateGalleryPhoto(editingPhoto.id, {
          url: formUrl.trim(),
          caption: formCaption.trim() || undefined,
          sortOrder: parseInt(formOrder) || 0,
        });
        if (!('error' in res)) {
          await loadPhotos();
          resetForm();
        }
      } else {
        const res = await createGalleryPhoto({
          url: formUrl.trim(),
          caption: formCaption.trim() || undefined,
          sortOrder: parseInt(formOrder) || 0,
        });
        if (!('error' in res)) {
          await loadPhotos();
          resetForm();
        }
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const res = await deleteGalleryPhoto(id);
      if (!('error' in res)) {
        setPhotos(photos.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Photo Gallery</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={loadPhotos} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleAdd} className="flex-shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Photo</span>
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg border p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <Input
                placeholder="https://example.com/photo.jpg"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the full URL of the image. You can use image hosting services like Imgur, Cloudinary, or direct links.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <Input
                placeholder="Photo description (optional)"
                value={formCaption}
                onChange={(e) => setFormCaption(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <Input
                type="number"
                placeholder="0"
                value={formOrder}
                onChange={(e) => setFormOrder(e.target.value)}
                className="w-24"
              />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
            </div>

            {/* Preview */}
            {formUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving || !formUrl.trim()}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingPhoto ? (
                'Update Photo'
              ) : (
                'Add Photo'
              )}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          <p>Error fetching photos. Please try again.</p>
          <Button variant="outline" className="mt-2" onClick={loadPhotos}>
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !error && photos.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No photos yet</h3>
          <p className="text-sm text-gray-500 mt-2">Add photos to display in the media gallery</p>
          <Button className="mt-4" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Photo
          </Button>
        </div>
      )}

      {!loading && !error && photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg border overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                {!imageErrors[photo.id] ? (
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Gallery photo'}
                    fill
                    className="object-cover"
                    onError={() => setImageErrors((prev) => ({ ...prev, [photo.id]: true }))}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(photo)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDelete(photo.id)}
                    className="h-8 w-8 p-0 text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">
                  {photo.caption || 'No caption'}
                </p>
                {/* Mobile action buttons */}
                <div className="flex gap-1 mt-1 sm:hidden">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(photo)}
                    className="h-7 flex-1 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(photo.id)}
                    className="h-7 flex-1 text-xs text-red-600"
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
