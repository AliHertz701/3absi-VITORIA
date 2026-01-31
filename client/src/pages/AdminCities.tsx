import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Plus, X, MapPin, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale } from '@/contexts/LocaleContext';

type City = {
  id: number;
  name: string;
  delivery_fee?: string;
};

export default function AdminCities() {
  const { t, isRTL } = useLocale();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [name, setName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');

  const loadCities = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCities();
      setCities(res.data ?? res);
    } catch {
      toast.error(t('admin.cities.fetch_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const resetForm = () => {
    setEditingCity(null);
    setName('');
    setDeliveryFee('');
  };

  const submitCity = async () => {
    if (!name.trim()) return toast.error(t('admin.cities.name_required'));

    try {
      if (editingCity) {
        await adminApi.updateCity(editingCity.id, {
          name,
          delivery_fee: deliveryFee,
        });
        toast.success(t('admin.cities.updated'));
      } else {
        await adminApi.createCity({
          name,
          delivery_fee: deliveryFee,
        });
        toast.success(t('admin.cities.created'));
      }
      resetForm();
      loadCities();
    } catch {
      toast.error(t('admin.cities.save_error'));
    }
  };

  const deleteCity = async (id: number) => {
    if (!confirm(t('admin.cities.confirm_delete'))) return;
    try {
      await adminApi.deleteCity(id);
      toast.success(t('admin.cities.deleted'));
      loadCities();
    } catch {
      toast.error(t('admin.cities.delete_error'));
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.cities.title')}</h1>
          <p className="text-gray-600">{t('admin.cities.subtitle', { count: cities.length })}</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-xl border">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('admin.cities.city_name')}
              </label>
              <Input
                placeholder={t('admin.cities.name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('admin.cities.delivery_fee')}
              </label>
              <Input
                placeholder={t('admin.cities.fee_placeholder')}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={submitCity} className="gap-2">
              {editingCity ? <Edit size={16} /> : <Plus size={16} />}
              {editingCity ? t('admin.cities.update') : t('admin.cities.add')}
            </Button>
            {editingCity && (
              <Button variant="outline" onClick={resetForm} className="gap-2">
                <X size={16} />
                {t('admin.cities.cancel')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium text-gray-600">
                  {t('admin.cities.city_name')}
                </th>
                <th className="p-4 text-left font-medium text-gray-600">
                  {t('admin.cities.delivery_fee')}
                </th>
                <th className="p-4 w-32 text-right font-medium text-gray-600">
                  {t('admin.cities.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cities.map((city) => (
                <tr key={city.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{city.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>{city.delivery_fee || t('admin.cities.free')}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCity(city);
                          setName(city.name);
                          setDeliveryFee(city.delivery_fee || '');
                        }}
                        className="gap-1"
                      >
                        <Edit size={14} />
                        {t('admin.cities.edit')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCity(city.id)}
                        className="gap-1"
                      >
                        <Trash2 size={14} />
                        {t('admin.cities.delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!cities.length && !loading && (
            <div className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('admin.cities.no_cities')}
              </h3>
              <p className="text-gray-600">{t('admin.cities.no_cities_desc')}</p>
            </div>
          )}
          
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">{t('general.loading')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}