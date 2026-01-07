import { useState, useEffect } from 'react';
import { X, Clock, Sparkles } from 'lucide-react';
import api from '@/utils/axios';
import { toast } from 'sonner';

export default function EditExtensionPopup({ isOpen, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    extendThreshold: 300,
    extendDuration: 600,
    newProductTime: 86400
  });

  useEffect(() => {
    if (isOpen) {
      fetchCurrentConfig();
    }
  }, [isOpen]);

  const fetchCurrentConfig = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await api.get("/admin/auction/config");
      const data = await response.data;
      console.log(data.config.extendThreshold);
      
      if (data.config) {
        setFormData({
          extendThreshold: data.config.extendThreshold / 1000 || 300,
          extendDuration: data.config.extendDuration / 1000 || 600,
          newProductTime: data.config.newProductTime / 1000 || 86400
        });
      }
    } catch (error) {
      console.log('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const dataToSend = {
        extendThreshold: formData.extendThreshold * 1000,
        extendDuration: formData.extendDuration * 1000,
        newProductTime: formData.newProductTime * 1000
      };
      // Replace with your actual API endpoint
      const response = await api.put('/admin/auction/config', dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.data;
      
      if (data.success) {
        onSave?.(data.config);
        onClose();
        toast.success("Update extension time successfully")
      }
    } catch (error) {
      console.log('Error updating config:', error);
      toast.error("Update extension time successfully")
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const formatSeconds = (seconds) => {
    if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)} days`;
    if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)} hours`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark/50 flex items-center justify-center z-50 p-4">
      <div className="bg-light rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Extension Time</h2>
              <p className="text-sm text-gray-500">Configure auction extension settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-dark">
                  New Auction Duration
                </label>
                <p className="text-xs text-gray-500">
                  How long an auction is marked as "New" after creation
                </p>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.newProductTime}
                    onChange={(e) => handleInputChange('newProductTime', e.target.value)}
                    className="w-full text-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="86400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    seconds
                  </span>
                </div>
                <div className="text-xs text-primary font-medium">
                  = {formatSeconds(formData.newProductTime)}
                </div>
              </div>
              {/* Extend Threshold */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-dark">
                  Extend Threshold
                </label>
                <p className="text-xs text-gray-500">
                  Time before auction end when bids trigger extension (seconds)
                </p>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.extendThreshold}
                    onChange={(e) => handleInputChange('extendThreshold', e.target.value)}
                    className="w-full text-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="300"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    seconds
                  </span>
                </div>
                <div className="text-xs text-primary font-medium">
                  = {formatSeconds(formData.extendThreshold)}
                </div>
              </div>

              {/* Extend Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-dark">
                  Extend Duration
                </label>
                <p className="text-xs text-gray-500">
                  Additional time added to auction when extended (seconds)
                </p>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.extendDuration}
                    onChange={(e) => handleInputChange('extendDuration', e.target.value)}
                    className="w-full text-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="600"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    seconds
                  </span>
                </div>
                <div className="text-xs text-amber-600 font-medium">
                  = {formatSeconds(formData.extendDuration)}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> If a bid is placed within the last{' '}
                  <span className="font-semibold">{formatSeconds(formData.extendThreshold)}</span> of the auction,
                  the end time will be extended by{' '}
                  <span className="font-semibold">{formatSeconds(formData.extendDuration)}</span>.
                </p>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 cursor-pointer text-dark rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || loading}
              className="flex-1 px-4 py-3 bg-primary cursor-pointer text-light rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-light"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}