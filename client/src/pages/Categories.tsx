import { useState, useEffect } from 'react';
import { Eye, Trash2, Plus, X } from 'lucide-react';
import { adminApi, resolveMediaUrl } from '../api';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  });

  // Separate state for image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCategories();
      setCategories(response);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Prefill form for edit
  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name || '',
        slug: selectedCategory.slug || '',
        description: selectedCategory.description || '',
        is_active: selectedCategory.is_active ?? true,
      });
      setImageUrl(selectedCategory.image || null);
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
      });
      setImageFile(null);
      setImageUrl(null);
    }
  }, [selectedCategory]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Category deleted');
      loadCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (imageFile) data.append('image', imageFile);

      if (selectedCategory?.id) {
        data.append('id', selectedCategory.id);
        await adminApi.updateCategory(data);
        toast.success('Category updated');
      } else {
        await adminApi.createCategory(data);
        toast.success('Category created');
      }

      setSelectedCategory(null);
      loadCategories();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setSelectedCategory({})}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-64">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-16">No categories found</div>
        ) : (
          categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md overflow-hidden cursor-pointer group"
            >
              <div className="relative aspect-[3/2]">
                {category.image ? (
                  <img
                    src={resolveMediaUrl(category.image)}
                    className="w-full h-full object-cover"
                    alt={category.name}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 bg-white/80 rounded-full shadow-sm"
                    title="Edit"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 bg-white/80 rounded-full shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {!category.is_active && (
                  <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                    Inactive
                  </span>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{category.name}</h3>
                {category.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {selectedCategory.id ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setSelectedCategory(null)}>
                <X />
              </button>
            </div>

            {/* Media Preview */}
            <div className="mb-4">
              {(imageUrl || imageFile) && (
                <div className="relative w-full h-48 mb-2">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : resolveMediaUrl(imageUrl!)}
                    className="w-full h-full object-cover rounded border border-gray-300"
                    alt="Category"
                  />
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
                  if (file) setImageUrl(null);
                }}
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
