// components/admin/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Upload, Plus, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLocale } from '@/contexts/LocaleContext'; // Import locale context
import { resolveMediaUrl } from '@/api';
interface ProductFormProps {
  product?: any;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
}
import {
  getAvailableColors,
  getColorCode,
  getColorDisplayName,
  isPatternColor
} from '@/lib/colors';
import { getAvailableSizes } from '@/lib/sizes';
import { getMaterials } from '@/lib/materials';
import { fetchWithAuth } from '@/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ProductForm({ product: initialProduct, categories, onClose, onSuccess }: ProductFormProps) {
  const { t } = useLocale(); // Get translation function
  const isEditing = !!initialProduct?.id;
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEditing);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      quantity_available: 0,
      price: '',
      discount_percentage: 0,
      sku: '',
      sizes: [] as string[],
      material: '',
      season: '',
      gender: 'unisex',
      brand: '',
      color: [] as string[],
      care_instructions: '',
      show_quantity: true,
      show_price: true,
      place_orders: true,
      is_featured: false,
      is_new_arrival: false,
      is_active: true,
      category: '',
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<any[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  const sizes = watch('sizes') || [];
  const colors = watch('color') || [];

  // Fetch product data when editing
  useEffect(() => {
    if (isEditing && initialProduct?.id) {
      fetchProductData(initialProduct.id);
    } else if (!isEditing) {
      // Reset form for new product
      reset();
      setImagePreview(null);
      setVideoPreview(null);
      setAdditionalImages([]);
      setAdditionalFiles([]);
      setFetchingProduct(false);
    }
  }, [isEditing, initialProduct]);

  const fetchProductData = async (productId: number) => {
    try {
      setFetchingProduct(true);
      const token = localStorage.getItem('auth_tokens');
      const accessToken = token ? JSON.parse(token).access : null;
      
      const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/products/${productId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        populateFormWithProductData(data.product);
      } else {
        toast.error(data.error || t('admin.products.load_error'));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error(t('admin.products.load_error'));
    } finally {
      setFetchingProduct(false);
    }
  };

  const populateFormWithProductData = (productData: any) => {
  if (!productData) return;

  // Helper function to parse JSON or return array
  const parseField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If it's not valid JSON, treat it as a single string
        return field.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const sizesArray = parseField(productData.sizes);
  const colorsArray = parseField(productData.color);

  // Reset form with product data
  reset({
    name: productData.name || '',
    description: productData.description || '',
    quantity_available: productData.quantity_available || 0,
    price: productData.price ? String(productData.price) : '',
    discount_percentage: productData.discount_percentage || 0,
    sku: productData.sku || '',
    sizes: sizesArray,
    material: productData.material || '',
    season: productData.season || '',
    gender: productData.gender || 'unisex',
    brand: productData.brand || '',
    color: colorsArray,
    care_instructions: productData.care_instructions || '',
    show_quantity: productData.show_quantity ?? true,
    show_price: productData.show_price ?? true,
    place_orders: productData.place_orders ?? true,
    is_featured: productData.is_featured ?? false,
    is_new_arrival: productData.is_new_arrival ?? false,
    is_active: productData.is_active ?? true,
    category: productData.category ? String(productData.category.id || productData.category) : '',
  });

  // Set image previews
  if (productData.image) {
    setImagePreview(resolveMediaUrl(productData.image));
  }

  if (productData.video) {
    setVideoPreview(resolveMediaUrl(productData.video));
  }

  if (productData.additional_images?.length) {
    // Map additional images to include full URLs
    const mappedImages = productData.additional_images.map((img: string) => ({
      image_url: resolveMediaUrl(img),
      id: img
    }));
    setAdditionalImages(mappedImages);
  }
};

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('admin.images.size_error'));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error('Video size should be less than 50MB');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = additionalImages.length + additionalFiles.length + files.length;
    
    if (totalImages > 10) {
      toast.error(t('admin.images.max_upload_error'));
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: ${t('admin.images.size_error')}`);
        return false;
      }
      return true;
    });
    
    setAdditionalFiles(prev => [...prev, ...validFiles]);
  };

  const removeAdditionalImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setValue('sizes', [...sizes, sizeInput.trim()]);
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    setValue('sizes', sizes.filter(s => s !== size));
  };

  const addColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setValue('color', [...colors, colorInput.trim()]);
      setColorInput('');
    }
  };

  const removeColor = (color: string) => {
    setValue('color', colors.filter(c => c !== color));
  };

  const onSubmit = async (data: any) => {
  try {
    setLoading(true);
    const token = localStorage.getItem('auth_tokens');
    const accessToken = token ? JSON.parse(token).access : null;

    const formData = new FormData();
    
    // Handle JSON fields - only stringify if they have values
    const jsonFields = ['sizes', 'color'];
    const preparedData = { ...data };
    
    jsonFields.forEach(field => {
      if (Array.isArray(preparedData[field]) && preparedData[field].length > 0) {
        preparedData[field] = JSON.stringify(preparedData[field]);
      } else if (preparedData[field] && preparedData[field].length === 0) {
        // Send empty array as JSON
        preparedData[field] = '[]';
      } else {
        // If it's already a string (when editing), keep it as is
        preparedData[field] = preparedData[field] || '[]';
      }
    });

    // Add all form fields to FormData
    Object.entries(preparedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Handle main image
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Handle video
    if (videoFile) {
      formData.append('video', videoFile);
    }

    // Handle additional images
    additionalFiles.forEach(file => {
      formData.append('additional_images', file);
    });

    // API endpoint and method
    const url = isEditing 
      ? `${API_BASE_URL}/api/admin/products/${initialProduct.id}/update/`
      : `${API_BASE_URL}/api/admin/products/create/`;
    
    const method = isEditing ? 'PUT' : 'POST';

    console.log('Submitting data:', Object.fromEntries(formData)); // Debug log

    // Make API request
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success(isEditing ? t('admin.products.update_success') : t('admin.products.create_success'));
      onSuccess();
      onClose();
    } else {
      console.error('API Error:', result);
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => {
              toast.error(`${field}: ${message}`);
            });
          } else if (typeof messages === 'string') {
            toast.error(`${field}: ${messages}`);
          } else {
            toast.error(`${field}: ${JSON.stringify(messages)}`);
          }
        });
      } else if (result.error) {
        toast.error(result.error);
      } else {
        toast.error(t('admin.products.save_error'));
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error(t('admin.products.save_error'));
  } finally {
    setLoading(false);
  }
};

  // Show loading state while fetching product data
  if (fetchingProduct) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 min-w-80">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3">{t('general.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? t('admin.products.edit') : t('admin.products.add_product')}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('admin.products.basic_info')}</h3>
                  
                  <div>
                    <Label htmlFor="name">{t('admin.products.name')} *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: t('validation.required') })}
                      placeholder={t('admin.products.name_placeholder')}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="sku">{t('product.sku')}</Label>
                    <Input
                      id="sku"
                      {...register('sku')}
                      placeholder={t('admin.products.sku_placeholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">{t('product.category')}</Label>
                    <Select
                      value={watch('category')}
                      onValueChange={(value) => setValue('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.products.select_category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">{t('product.description')}</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder={t('admin.products.description_placeholder')}
                      rows={4}
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('admin.products.pricing_inventory')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">{t('product.price')}</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register('price')}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="discount_percentage">{t('product.discount')}</Label>
                      <Input
                        id="discount_percentage"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...register('discount_percentage')}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quantity_available">{t('product.stock')} *</Label>
                    <Input
                      id="quantity_available"
                      type="number"
                      {...register('quantity_available', { 
                        required: t('validation.required'),
                        min: { value: 0, message: t('admin.products.stock_min_error') }
                      })}
                      placeholder="0"
                    />
                    {errors.quantity_available && (
                      <p className="text-sm text-red-600 mt-1">{errors.quantity_available.message}</p>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('product.specifications')}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                   <div>
  <Label htmlFor="material">{t('product.material')}</Label>
  <Select
    value={watch('material')}
    onValueChange={(value) => setValue('material', value)}
  >
    <SelectTrigger>
      <SelectValue placeholder={t('admin.products.material_placeholder')} />
    </SelectTrigger>
    <SelectContent>
      {getMaterials().map((material) => (
        <SelectItem key={material} value={material}>
          {material}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


                    <div>
                      <Label htmlFor="season">{t('product.season')}</Label>
                      <Input
                        id="season"
                        {...register('season')}
                        placeholder={t('admin.products.season_placeholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="brand">{t('product.brand')}</Label>
                    <Input
                      id="brand"
                      {...register('brand')}
                      placeholder={t('admin.products.brand_placeholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">{t('product.gender')}</Label>
                    <Select
                      value={watch('gender')}
                      onValueChange={(value) => setValue('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.products.select_gender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unisex">{t('product.gender.unisex')}</SelectItem>
                        <SelectItem value="male">{t('product.gender.male')}</SelectItem>
                        <SelectItem value="female">{t('product.gender.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="care_instructions">{t('product.care_instructions')}</Label>
                    <Textarea
                      id="care_instructions"
                      {...register('care_instructions')}
                      placeholder={t('admin.products.care_placeholder')}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Media, Variants, Settings */}
              <div className="space-y-6">
                {/* Media Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('admin.images.title')}</h3>
                  
                  {/* Main Image */}
                  <div>
                    <Label>{t('admin.images.main_image')}</Label>
                    <div className="mt-2">
                      {imagePreview ? (
                        <div className="relative w-40 h-40">
                          <img
                            src={imagePreview}
                            alt={t('admin.images.product_image')}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">{t('admin.images.upload_image')}</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Video */}
                  <div>
                    <Label>{t('product.video')}</Label>
                    <div className="mt-2">
                      {videoPreview ? (
                        <div className="relative">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full max-w-md rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVideoPreview(null);
                              setVideoFile(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">{t('admin.images.upload_video')}</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={handleVideoChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div>
                    <Label>{t('admin.images.additional_images')}</Label>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {additionalImages.map((img, index) => (
                          <div key={img.id || index} className="relative w-20 h-20">
                            <img
                              src={img.image_url || img}
                              alt={t('admin.images.product_image')}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index, true)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        
                        {additionalFiles.map((file, index) => (
                          <div key={index} className="relative w-20 h-20">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={t('admin.images.product_image')}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index, false)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        {t('admin.images.add_images')}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImages}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {t('admin.images.upload_guidelines')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sizes & Colors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('product.variants')}</h3>
                  
                  {/* Sizes */}
                  <div>
                    <Label>{t('product.size')}</Label>
                    <div className="flex gap-2 mt-2">
                      <div>
  <Label>{t('product.size')}</Label>

  <div className="flex flex-wrap gap-2 mt-2">
    {getAvailableSizes().map((size) => {
      const selected = sizes.includes(size);

      return (
        <button
          key={size}
          type="button"
          onClick={() => {
            if (selected) {
              removeSize(size);
            } else {
              setValue('sizes', [...sizes, size]);
            }
          }}
          className={`px-3 py-1 rounded border text-sm
            ${selected
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-500'
            }
          `}
        >
          {size}
        </button>
      );
    })}
  </div>
</div>

                    </div>
                    {sizes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sizes.map((size) => (
                          <Badge key={size} variant="secondary" className="pl-3 pr-2 py-1">
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colors */}
                  <div>
                    <Label>{t('product.color')}</Label>
                    <div className="flex gap-2 mt-2">
                      <div>
  <Label>{t('product.color')}</Label>

  <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto">
    {getAvailableColors().map((color) => {
      const selected = colors.includes(color);

      return (
        <button
          key={color}
          type="button"
          onClick={() => {
            if (selected) {
              removeColor(color);
            } else {
              setValue('color', [...colors, color]);
            }
          }}
          className={`flex items-center gap-2 p-2 rounded border text-sm
            ${selected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-400'}
          `}
        >
          <span
            className="w-4 h-4 rounded-full border"
            style={{
              background: isPatternColor(color)
                ? getColorCode(color)
                : getColorCode(color),
            }}
          />
          <span className="truncate">
            {getColorDisplayName(color)}
          </span>
        </button>
      );
    })}
  </div>

  {colors.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-3">
      {colors.map((color) => (
        <Badge key={color} variant="secondary" className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full border"
            style={{ background: getColorCode(color) }}
          />
          {getColorDisplayName(color)}
          <button onClick={() => removeColor(color)}>
            <X className="w-3 h-3 ml-1" />
          </button>
        </Badge>
      ))}
    </div>
  )}
</div>

                    </div>
                    {colors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {colors.map((color) => (
                          <Badge key={color} variant="secondary" className="pl-3 pr-2 py-1">
                            {t(`color.${color.toLowerCase()}`) || color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="ml-2 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('admin.products.settings')}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show_price">{t('product.show_price')}</Label>
                        <p className="text-sm text-gray-500">{t('admin.products.show_price_desc')}</p>
                      </div>
                      <Switch
                        id="show_price"
                        checked={watch('show_price')}
                        onCheckedChange={(checked) => setValue('show_price', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show_quantity">{t('product.show_quantity')}</Label>
                        <p className="text-sm text-gray-500">{t('admin.products.show_quantity_desc')}</p>
                      </div>
                      <Switch
                        id="show_quantity"
                        checked={watch('show_quantity')}
                        onCheckedChange={(checked) => setValue('show_quantity', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="place_orders">{t('product.allow_orders')}</Label>
                        <p className="text-sm text-gray-500">{t('admin.products.allow_orders_desc')}</p>
                      </div>
                      <Switch
                        id="place_orders"
                        checked={watch('place_orders')}
                        onCheckedChange={(checked) => setValue('place_orders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="is_featured">{t('product.featured')}</Label>
                        <p className="text-sm text-gray-500">{t('admin.products.featured_desc')}</p>
                      </div>
                      <Switch
                        id="is_featured"
                        checked={watch('is_featured')}
                        onCheckedChange={(checked) => setValue('is_featured', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="is_new_arrival">{t('product.new_arrival')}</Label>
                        <p className="text-sm text-gray-500">{t('admin.products.new_arrival_desc')}</p>
                      </div>
                      <Switch
                        id="is_new_arrival"
                        checked={watch('is_new_arrival')}
                        onCheckedChange={(checked) => setValue('is_new_arrival', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="is_active">{t('product.active')}</Label>
                        <p className="text-sm text-gray-500">{t('admin.products.active_desc')}</p>
                      </div>
                      <Switch
                        id="is_active"
                        checked={watch('is_active')}
                        onCheckedChange={(checked) => setValue('is_active', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('general.close')}
            </Button>
            <Button type="submit" disabled={loading || fetchingProduct} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? t('general.loading') : isEditing ? t('admin.products.update') : t('admin.products.create')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}