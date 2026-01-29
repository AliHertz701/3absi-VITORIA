// components/ImageUploadModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocale } from '@/contexts/LocaleContext'; // Add this import

interface ImageUploadModalProps {
  product: any;
  onClose: () => void;
}

export default function ImageUploadModal({ product, onClose }: ImageUploadModalProps) {
  const { t, locale } = useLocale(); // Add localization
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  
  // Fix: Handle different image data formats
  const [existingImages, setExistingImages] = useState<any[]>(() => {
    // Handle different formats of additional_images
    if (!product.additional_images) return [];
    
    if (Array.isArray(product.additional_images)) {
      return product.additional_images.map((img: any) => {
        // Check if image has proper structure
        if (typeof img === 'string') {
          return {
            id: Math.random(), // Temporary ID for string URLs
            image_url: img
          };
        }
        if (img && img.image) {
          return {
            id: img.id || Math.random(),
            image_url: img.image
          };
        }
        if (img && img.image_url) {
          return img;
        }
        return img;
      });
    }
    return [];
  });
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Debug: Log product data
  useEffect(() => {
    console.log('Product data:', product);
    console.log('Existing images:', existingImages);
  }, [product, existingImages]);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file count
    if (selectedFiles.length + files.length > 10) {
      toast.error(t('admin.images.max_upload_error'));
      return;
    }
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} ${t('admin.images.not_image_error')}`);
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`${file.name} ${t('admin.images.size_error')}`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };
  
  // Remove file from upload queue
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]); // Clean up memory
      return prev.filter((_, i) => i !== index);
    });
  };
  
  // Get image URL from different data formats
  const getImageUrl = (image: any): string => {
    if (!image) return '';
    
    // Handle different image data formats
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    if (image.image_url) return image.image_url;
    if (image.image) {
      if (typeof image.image === 'string') return image.image;
      if (image.image.url) return image.image.url;
    }
    
    return '';
  };
  
  // Get image ID from different data formats
  const getImageId = (image: any, index: number): number => {
    if (image.id) return image.id;
    if (image.pk) return image.pk;
    return index; // Use index as fallback ID
  };
  
  // Delete existing image
  const deleteExistingImage = async (image: any, index: number) => {
    const imageId = getImageId(image, index);
    
    if (!window.confirm(t('admin.images.confirm_delete'))) return;
    
    setDeletingIds(prev => [...prev, imageId]);
    
    try {
      const token = localStorage.getItem('auth_tokens');
      const accessToken = token ? JSON.parse(token).access : null;
      
      const response = await fetch(
        `${API_BASE_URL}/api/admin/products/${product.id}/delete-image/${imageId}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        toast.success(t('admin.images.delete_success'));
      } else {
        toast.error(result.error || t('admin.images.delete_error'));
      }
    } catch (error) {
      toast.error(t('admin.images.delete_error'));
      console.error('Delete error:', error);
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== imageId));
    }
  };
  
  // Upload new images
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error(t('admin.images.no_images_error'));
      return;
    }
    
    setUploading(true);
    
    try {
      const token = localStorage.getItem('auth_tokens');
      const accessToken = token ? JSON.parse(token).access : null;
      
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch(
        `${API_BASE_URL}/api/admin/products/${product.id}/upload-images/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        // Add new images to existing images
        const newImages = result.images || result.data?.images || [];
        const formattedImages = newImages.map((img: any, index: number) => ({
          id: img.id || Math.random() + index,
          image_url: getImageUrl(img),
          ...img
        }));
        
        setExistingImages(prev => [...prev, ...formattedImages]);
        
        // Clear upload queue
        setFiles([]);
        previews.forEach(preview => URL.revokeObjectURL(preview));
        setPreviews([]);
        
        toast.success(t('admin.images.upload_success', { count: newImages.length }));
      } else {
        toast.error(result.error || t('admin.images.upload_error'));
      }
    } catch (error) {
      toast.error(t('admin.images.upload_error'));
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };
  
  // View image in full screen
  const viewImage = (url: string) => {
    if (!url) {
      toast.error(t('admin.images.invalid_url'));
      return;
    }
    window.open(url, '_blank');
  };
  
  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        dir={locale === 'ar' ? 'rtl' : 'ltr'} // Add RTL support
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('admin.images.title')}
              </h2>
              <p className="text-sm text-gray-600">{product.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Existing Images */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('admin.images.existing_images')}
            </h3>
            
            {existingImages.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  {t('admin.images.no_existing_images')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image, index) => {
                  const imageUrl = getImageUrl(image);
                  const imageId = getImageId(image, index);
                  
                  return (
                    <div key={imageId} className="relative group">
                      <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`${t('admin.images.product_image')} ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/400x400?text=Image+Error';
                              console.error('Image failed to load:', imageUrl);
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {imageUrl && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white hover:bg-gray-100"
                            onClick={() => viewImage(imageUrl)}
                            title={t('admin.images.view_full')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteExistingImage(image, index)}
                          disabled={deletingIds.includes(imageId)}
                          title={t('admin.images.delete')}
                        >
                          {deletingIds.includes(imageId) ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Debug info (remove in production) */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs p-1 rounded">
                          #{index + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 inline-block mr-1" />
              {t('admin.images.reorder_note')}
            </div>
          </div>
          
          {/* Upload New Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('admin.images.upload_new')}
            </h3>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                id="image-upload"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {files.length === 0 ? (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    {t('admin.images.drop_zone_title')}
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('admin.images.supported_formats')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    {t('admin.images.select_images')}
                  </Button>
                </>
              ) : (
                <div>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    {t('admin.images.selected_count', { 
                      count: files.length, 
                      singular: t('admin.images.image_singular'),
                      plural: t('admin.images.image_plural')
                    })}
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('admin.images.ready_to_upload')}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {t('admin.images.add_more')}
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          {t('admin.images.uploading')}
                        </>
                      ) : (
                        t('admin.images.upload_now')
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Files Preview */}
            {files.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {t('admin.images.selected_preview', { count: files.length })}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {files.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        <img
                          src={previews[index]}
                          alt={`${t('admin.images.preview')} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title={t('admin.images.remove')}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {file.name.length > 20 
                          ? `${file.name.substring(0, 20)}...` 
                          : file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                {t('admin.images.guidelines_title')}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {t('admin.images.guideline_quality')}
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {t('admin.images.guideline_size')}
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {t('admin.images.guideline_angles')}
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {t('admin.images.guideline_details')}
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {t('admin.images.guideline_max')}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>
              {t('admin.images.total_count', { 
                existing: existingImages.length, 
                new: files.length 
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              {t('admin.images.done')}
            </Button>
            {files.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    {t('admin.images.uploading')}
                  </>
                ) : (
                  t('admin.images.upload_button', { 
                    count: files.length,
                    singular: t('admin.images.image_singular'),
                    plural: t('admin.images.image_plural')
                  })
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}