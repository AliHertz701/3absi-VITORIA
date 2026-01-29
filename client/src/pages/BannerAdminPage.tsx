// admin/pages/Banners.tsx
import { useState, useEffect, useRef } from 'react';
import { Eye, Trash2, Plus, X } from 'lucide-react';
import { adminApi, resolveMediaUrl } from '../api';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Banners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
const [formData, setFormData] = useState<any>({
  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  text_color: 'white',
  order: 0,
  is_active: true,
});

// Separate state for media
const [imageFile, setImageFile] = useState<File | null>(null);
const [videoFile, setVideoFile] = useState<File | null>(null);
const [imageUrl, setImageUrl] = useState<string | null>(null);
const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getBanners();
      setBanners(response);
    } catch (error) {
      console.error('Failed to load banners', error);
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  // Prefill form for edit
  useEffect(() => {
  if (selectedBanner) {
    setFormData({
      title: selectedBanner.title || '',
      subtitle: selectedBanner.subtitle || '',
      button_text: selectedBanner.button_text || '',
      button_link: selectedBanner.button_link || '',
      text_color: selectedBanner.text_color || 'white',
      order: selectedBanner.order ?? 0,
      is_active: selectedBanner.is_active ?? true,
    });

    // Set existing media URLs
    setImageUrl(selectedBanner.image || null);
    setVideoUrl(selectedBanner.video || null);
    setImageFile(null); // clear any previously selected file
    setVideoFile(null);
  } else {
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
      text_color: 'white',
      order: 0,
      is_active: true,
    });
    setImageUrl(null);
    setVideoUrl(null);
    setImageFile(null);
    setVideoFile(null);
  }
}, [selectedBanner]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await adminApi.deleteBanner(id);
      toast.success('Banner deleted');
      loadBanners();
    } catch {
      toast.error('Failed to delete banner');
    }
  };

  const handleSubmit = async () => {
  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (imageFile) data.append('image', imageFile);
    if (videoFile) data.append('video', videoFile);

    if (selectedBanner?.id) {
      data.append('id', selectedBanner.id);
      await adminApi.updateBanner(data);
      toast.success('Banner updated');
    } else {
      await adminApi.createBanner(data);
      toast.success('Banner created');
    }

    setSelectedBanner(null);
    loadBanners();
  } catch (err: any) {
    console.error(err);
    toast.error('Failed to save banner');
  }
};



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banners</h1>
        <button
          onClick={() => setSelectedBanner({})}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">Loading...</div>
        ) : banners.length === 0 ? (
          <div className="col-span-full text-center py-16">No banners found</div>
        ) : (
          banners.map((banner) => {
            const imageUrl = resolveMediaUrl(banner.image);
            const videoUrl = resolveMediaUrl(banner.video);
            return (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md overflow-hidden cursor-pointer group"
              >
                <div className="relative aspect-[3/2]">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={imageUrl || 'https://via.placeholder.com/400x250?text=No+Image'}
                      className="w-full h-full object-cover"
                      alt={banner.title}
                    />
                  )}

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedBanner(banner)}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 bg-white/80 rounded-full shadow-sm"
                      title="Edit"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 bg-white/80 rounded-full shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Status */}
                  {!banner.is_active && (
                    <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-xs text-gray-500 line-clamp-2">{banner.subtitle}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">Order: {banner.order}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

{/* Banner Modal */}
{selectedBanner && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          {selectedBanner.id ? 'Edit Banner' : 'Add Banner'}
        </h2>
        <button onClick={() => setSelectedBanner(null)}><X /></button>
      </div>

      {/* Media Previews */}
      <div className="mb-4 space-y-4">
        {/* Current Media */}
        {(imageUrl || videoUrl) && (
          <div>
            <h3 className="text-sm font-medium mb-1">Current Media</h3>
            {videoUrl ? (
              <video
                src={resolveMediaUrl(videoUrl)}
                className="w-full h-48 object-cover rounded mb-2"
                controls
              />
            ) : (
              <img
                src={resolveMediaUrl(imageUrl!)}
                className="w-full h-48 object-cover rounded mb-2"
                alt="Current Banner"
              />
            )}
          </div>
        )}

        {/* New Selected Media */}
        {(imageFile || videoFile) && (
          <div>
            <h3 className="text-sm font-medium mb-1">Selected New Media</h3>
            {videoFile ? (
              <video
                src={URL.createObjectURL(videoFile)}
                className="w-full h-48 object-cover rounded mb-2"
                controls
              />
            ) : (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : undefined}
                className="w-full h-48 object-cover rounded mb-2"
                alt="Selected New Media"
              />
            )}
          </div>
        )}

        {/* If nothing selected */}
        {!imageUrl && !videoUrl && !imageFile && !videoFile && (
          <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            No media selected
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Order"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Button Text"
          value={formData.button_text}
          onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Button Link"
          value={formData.button_link}
          onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <span>Active</span>
        </div>

       {/* Upload / Replace Media */}
{/* Upload / Replace Media */}
<div className="flex flex-col gap-4">
  {/* Image */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">Image</label>

    {/* Current or selected image preview */}
    {(imageUrl || imageFile) && (
      <div className="relative w-full h-48">
        <img
          src={imageFile ? URL.createObjectURL(imageFile) : resolveMediaUrl(imageUrl!)}
          className="w-full h-full object-cover rounded border border-gray-300"
          alt="Banner Image"
        />
        {/* Delete button */}
        <button
          type="button"
          onClick={() => {
            setImageFile(null);
            setImageUrl(null);
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600"
          title="Remove Image"
        >
          X
        </button>
      </div>
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) setImageUrl(null); // clear previous image if a new one is selected
      }}
    />
  </div>

  {/* Video */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">Video</label>

    {/* Current or selected video preview */}
    {(videoUrl || videoFile) && (
      <div className="relative w-full h-48">
        <video
          src={videoFile ? URL.createObjectURL(videoFile) : resolveMediaUrl(videoUrl!)}
          className="w-full h-full object-cover rounded border border-gray-300"
          controls
        />
        {/* Delete button */}
        <button
          type="button"
          onClick={() => {
            setVideoFile(null);
            setVideoUrl(null);
          }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600"
          title="Remove Video"
        >
          X
        </button>
      </div>
    )}

    <input
      type="file"
      accept="video/*"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setVideoFile(file);
        if (file) setVideoUrl(null); // clear previous video if a new one is selected
      }}
    />
  </div>
</div>


        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded shadow hover:shadow-md transition-all"
        >
          Save
        </button>
      </div>
    </motion.div>
  </div>
)}
    </div>
  );
}
