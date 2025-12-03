import { useState } from 'react';
import { Calendar, User, Package } from 'lucide-react';
import { useBorrowStore, BorrowRecord } from '../store/borrowStore';

export function BorrowEquipment() {
  const { equipment, users, addBorrowRecord, updateEquipment } = useBorrowStore();
  const [formData, setFormData] = useState({
    userId: '',
    equipmentId: '',
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    quantity: 1,
    notes: '',
  });

  const selectedEquipment = equipment.find((eq) => eq.id === formData.equipmentId);
  const selectedUser = users.find((u) => u.id === formData.userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEquipment || selectedEquipment.available < formData.quantity) {
      alert('อุปกรณ์ไม่เพียงพอสำหรับการยืม');
      return;
    }

    const newRecord: BorrowRecord = {
      id: 'br' + Date.now(),
      userId: formData.userId,
      equipmentId: formData.equipmentId,
      borrowDate: new Date(formData.borrowDate).toLocaleDateString('th-TH'),
      dueDate: new Date(formData.dueDate).toLocaleDateString('th-TH'),
      quantity: formData.quantity,
      status: 'pending', // เปลี่ยนเป็น pending เพื่อให้มีการอนุมัติก่อน
      notes: formData.notes,
    };

    addBorrowRecord(newRecord);
    
    // ไม่หักจำนวนอุปกรณ์ทันที รอให้ admin อนุมัติก่อน
    // updateEquipment(formData.equipmentId, {
    //   available: selectedEquipment.available - formData.quantity,
    // });

    alert('ส่งคำขอยืมอุปกรณ์เรียบร้อยแล้ว กรุณารอการอนุมัติ');
    setFormData({
      userId: '',
      equipmentId: '',
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      quantity: 1,
      notes: '',
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-gray-800 mb-2">ยืมอุปกรณ์</h1>
            <p className="text-gray-600">กรอกข้อมูลเพื่อบันทึกการยืมอุปกรณ์</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  เลือกผู้ยืม
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">-- เลือกผู้ยืม --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.studentId} - {user.name}
                    </option>
                  ))}
                </select>
                {selectedUser && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>ชื่อ:</strong> {selectedUser.name}</p>
                    <p className="text-sm text-gray-700"><strong>แผนก:</strong> {selectedUser.department}</p>
                    <p className="text-sm text-gray-700"><strong>เบอร์โทร:</strong> {selectedUser.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Package className="inline w-4 h-4 mr-2" />
                  เลือกอุปกรณ์
                </label>
                <select
                  value={formData.equipmentId}
                  onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">-- เลือกอุปกรณ์ --</option>
                  {equipment
                    .filter((eq) => eq.available > 0)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (เหลือ {item.available})
                      </option>
                    ))}
                </select>
                {selectedEquipment && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>รหัส:</strong> {selectedEquipment.code}</p>
                    <p className="text-sm text-gray-700"><strong>Serial:</strong> {selectedEquipment.serialNumber}</p>
                    <p className="text-sm text-gray-700"><strong>คงเหลือ:</strong> {selectedEquipment.available} ชิ้น</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  วันที่ยืม
                </label>
                <input
                  type="date"
                  value={formData.borrowDate}
                  onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  กำหนดคืน
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  min={formData.borrowDate}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">จำนวนที่ยืม</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  min="1"
                  max={selectedEquipment?.available || 1}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">หมายเหตุ (ถ้ามี)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="ระบุหมายเหตุ..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    userId: '',
                    equipmentId: '',
                    borrowDate: new Date().toISOString().split('T')[0],
                    dueDate: '',
                    quantity: 1,
                    notes: '',
                  });
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ล้างข้อมูล
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                บันทึกการยืม
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}