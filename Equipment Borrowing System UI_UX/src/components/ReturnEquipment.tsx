import { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { useBorrowStore } from '../store/borrowStore';

export function ReturnEquipment() {
  const { borrowRecords, equipment, users, updateBorrowRecord, updateEquipment } = useBorrowStore();
  const [searchTerm, setSearchTerm] = useState('');

  const activeBorrows = borrowRecords.filter((record) => record.status === 'borrowed' || record.status === 'overdue');

  const filteredBorrows = activeBorrows.filter((record) => {
    const user = users.find((u) => u.id === record.userId);
    const item = equipment.find((e) => e.id === record.equipmentId);
    return (
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.studentId.includes(searchTerm) ||
      item?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleReturn = (recordId: string) => {
    const record = borrowRecords.find((r) => r.id === recordId);
    if (!record) return;

    const item = equipment.find((e) => e.id === record.equipmentId);
    if (!item) return;

    if (confirm('ยืนยันการคืนอุปกรณ์?')) {
      updateBorrowRecord(recordId, {
        status: 'returned',
        returnDate: new Date().toLocaleDateString('th-TH'),
      });

      updateEquipment(record.equipmentId, {
        available: item.available + record.quantity,
      });

      alert('บันทึกการคืนอุปกรณ์เรียบร้อยแล้ว');
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-800">คืนอุปกรณ์</h1>
              <p className="text-gray-600 mt-1">รายการอุปกรณ์ที่รอคืน</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">ค้นหา:</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="ค้นหาชื่อ, รหัส..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">รหัสสมาชิก</th>
                <th className="px-6 py-3 text-left text-gray-600">ชื่อผู้ยืม</th>
                <th className="px-6 py-3 text-left text-gray-600">อุปกรณ์</th>
                <th className="px-6 py-3 text-left text-gray-600">จำนวน</th>
                <th className="px-6 py-3 text-left text-gray-600">วันที่ยืม</th>
                <th className="px-6 py-3 text-left text-gray-600">กำหนดคืน</th>
                <th className="px-6 py-3 text-left text-gray-600">สถานะ</th>
                <th className="px-6 py-3 text-left text-gray-600">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    ไม่พบรายการที่รอคืน
                  </td>
                </tr>
              ) : (
                filteredBorrows.map((record) => {
                  const user = users.find((u) => u.id === record.userId);
                  const item = equipment.find((e) => e.id === record.equipmentId);

                  return (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{user?.studentId}</td>
                      <td className="px-6 py-4 text-gray-800">{user?.name}</td>
                      <td className="px-6 py-4 text-gray-800">{item?.name}</td>
                      <td className="px-6 py-4 text-gray-800">{record.quantity}</td>
                      <td className="px-6 py-4 text-gray-800">{record.borrowDate}</td>
                      <td className="px-6 py-4 text-gray-800">{record.dueDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            record.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {record.status === 'overdue' ? 'เกินกำหนด' : 'กำลังยืม'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleReturn(record.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          คืน
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200">
          <p className="text-gray-600">
            แสดง {filteredBorrows.length} รายการจาก {activeBorrows.length} รายการทั้งหมด
          </p>
        </div>
      </div>
    </div>
  );
}
