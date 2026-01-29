// components/StockUpdateModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface StockUpdateModalProps {
  product: any;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  isLoading?: boolean;
}

export default function StockUpdateModal({ 
  product, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: StockUpdateModalProps) {
  const [quantity, setQuantity] = useState<string>(product.quantity_available?.toString() || '0');
  const [reason, setReason] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      toast.error('Please enter a valid quantity (0 or higher)');
      return;
    }
    
    if (qty === product.quantity_available) {
      toast.error('No change in quantity');
      return;
    }
    
    onSubmit(qty);
  };
  
  const handleQuickAction = (action: 'increment' | 'decrement' | 'restock') => {
    let newQty = parseInt(quantity) || 0;
    
    switch (action) {
      case 'increment':
        newQty += 1;
        break;
      case 'decrement':
        if (newQty > 0) newQty -= 1;
        break;
      case 'restock':
        newQty = 50; // Default restock quantity
        break;
    }
    
    setQuantity(newQty.toString());
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Update Stock</h2>
              <p className="text-sm text-gray-600">{product.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Current Stock Info */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className={`text-2xl font-bold ${
                product.quantity_available === 0
                  ? 'text-red-600'
                  : product.quantity_available <= 10
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {product.quantity_available}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-sm font-medium mt-1">
                {product.quantity_available === 0 ? (
                  <span className="text-red-600">Out of Stock</span>
                ) : product.quantity_available <= 10 ? (
                  <span className="text-yellow-600">Low Stock</span>
                ) : (
                  <span className="text-green-600">In Stock</span>
                )}
              </p>
            </div>
          </div>
          
          {product.quantity_available <= 10 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                {product.quantity_available === 0 
                  ? 'This product is out of stock. Consider restocking.'
                  : `Low stock warning! Only ${product.quantity_available} units remaining.`
                }
              </p>
            </div>
          )}
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Quick Actions */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick Actions</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('increment')}
                >
                  +1 Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('decrement')}
                  disabled={parseInt(quantity) <= 0}
                >
                  -1 Remove
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('restock')}
                >
                  Restock to 50
                </Button>
              </div>
            </div>
            
            {/* Quantity Input */}
            <div className="mb-6">
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 mb-2 block">
                New Stock Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full"
                placeholder="Enter new quantity"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the exact number of units available in inventory
              </p>
            </div>
            
            {/* Reason (Optional) */}
            <div className="mb-6">
              <Label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2 block">
                Reason for Update (Optional)
              </Label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Select a reason</option>
                <option value="new_shipment">New shipment received</option>
                <option value="inventory_count">Inventory count adjustment</option>
                <option value="damaged">Damaged items removed</option>
                <option value="returned">Customer returns</option>
                <option value="sale">Sale/Promotion</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-medium">{product.quantity_available} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New:</span>
                  <span className="font-medium">{parseInt(quantity) || 0} units</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Change:</span>
                  <span className={`font-medium ${
                    (parseInt(quantity) || 0) > product.quantity_available
                      ? 'text-green-600'
                      : (parseInt(quantity) || 0) < product.quantity_available
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {((parseInt(quantity) || 0) - product.quantity_available) > 0 ? '+' : ''}
                    {(parseInt(quantity) || 0) - product.quantity_available} units
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || (parseInt(quantity) || 0) === product.quantity_available}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : 'Update Stock'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}