// components/admin/BannerFormModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { fetchWithAuth, resolveMediaUrl } from '@/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface BannerFormModalProps {
  banner?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BannerFormModal({ banner, onClose, onSuccess }: BannerFormModalProps) {
  const isEditing = !!banner;

  // Banner fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [textColor, setTextColor] = useState('white');

  // Files
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // Initialize form with existing banner data
  useEffect(() => {
    if (banner) {
      setTitle(banner.title || '');
      setSubtitle(banner.subtitle || '');
      setButtonText(banner.button_text || '');
      setButtonLink(banner.button_link || '');
      setOrder(banner.order || 0);
      setIsActive(banner.is_active ?? true);
      setTextColor(banner.text_color || 'white');
      setImagePreview(resolveMediaUrl(banner.image));
      setVideoPreview(resolveMediaUrl(banner.video));
    }
  }, [banner]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('button_text', buttonText);
    formData.append('button_link', buttonLink);
    formData.append('order', String(order));
    formData.append('is_active', isActive ? 'true' : 'false');
    formData.append('text_color', textColor);

    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);

    const url = isEditing
      ? `${API_BASE_URL}/api/admin/banners/${banner.id}/`
      : `${API_BASE_URL}/api/admin/banners/`;

    const response = await fetchWithAuth(url, {
      method: isEditing ? 'PUT' : 'POST',
      body: formData,
      // DO NOT set Content-Type! Let the browser set multipart automatically
    });

    const result = await response.json();

    if (result.success) {
      toast.success(isEditing ? 'Banner updated' : 'Banner created');
      onSuccess();
    } else {
      console.error(result.errors);
      toast.error('Failed to save banner');
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to save banner');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Banner' : 'Add Banner'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="block mb-1">Subtitle</label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">Button Text</label>
            <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">Button Link</label>
            <Input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block mb-1">Order</label>
              <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-2">
              <label>Active</label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          <div>
            <label className="block mb-1">Text Color</label>
            <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} className="mt-2 w-40 h-40 object-cover rounded" />}
          </div>

          <div>
            <label className="block mb-1">Video</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} />
            {videoPreview && <video src={videoPreview} controls className="mt-2 w-full max-w-md h-40 rounded" />}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
