import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useBorrowStore, Equipment } from '../store/borrowStore';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EquipmentModalProps {
  equipmentId: string | null;
  onClose: () => void;
}

export function EquipmentModal({ equipmentId, onClose }: EquipmentModalProps) {
  const { equipment, addEquipment, updateEquipment } = useBorrowStore();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    serialNumber: '',
    quantity: 1,
    available: 1,
    status: 'available' as const,
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (equipmentId) {
      const item = equipment.find((eq) => eq.id === equipmentId);
      if (item) {
        setFormData({
          code: item.code,
          name: item.name,
          category: item.category,
          serialNumber: item.serialNumber,
          quantity: item.quantity,
          available: item.available,
          status: item.status,
          image: item.image || '',
        });
        setImagePreview(item.image || '');
      }
    }
  }, [equipmentId, equipment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (equipmentId) {
      updateEquipment(equipmentId, formData);
    } else {
      const newEquipment: Equipment = {
        id: 'eq' + Date.now(),
        ...formData,
      };
      addEquipment(newEquipment);
    }
    
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-800">{equipmentId ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">รหัสสินค้า</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">ชื่อสินค้า</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">หมวดหมู่</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">หมายเลข Serial</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">จำนวนทั้งหมด</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">จำนวนคงเหลือ</label>
              <input
                type="number"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="0"
                max={formData.quantity}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 mb-2">สถานะ</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="available">พร้อมใช้งาน</option>
                <option value="borrowed">ถูกยืม</option>
                <option value="maintenance">ซ่อมบำรุง</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 mb-2">รูปภาพ</label>
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={imagePreview}
                      alt="Equipment Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="equipment-image"
                  />
                  <label
                    htmlFor="equipment-image"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    อัปโหลดรูปภาพ
                  </label>
                  <p className="text-sm text-gray-500 mt-2">รองรับ JPG, PNG ขนาดไม่เกิน 5MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {equipmentId ? 'บันทึกการแก้ไข' : 'เพิ่มอุปกรณ์'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}