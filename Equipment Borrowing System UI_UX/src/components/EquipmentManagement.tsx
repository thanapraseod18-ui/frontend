import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Download } from 'lucide-react';
import { useBorrowStore } from '../store/borrowStore';
import { EquipmentModal } from './EquipmentModal';

export function EquipmentManagement() {
  const { equipment, deleteEquipment } = useBorrowStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEquipment = equipment.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredEquipment.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEquipment = filteredEquipment.slice(startIndex, startIndex + entriesPerPage);

  const handleEdit = (id: string) => {
    setEditingEquipment(id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบอุปกรณ์นี้ใช่หรือไม่?')) {
      deleteEquipment(id);
    }
  };

  const handleExport = () => {
    alert('ส่งออกข้อมูลเป็น Excel');
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-gray-800">จัดการอุปกรณ์</h1>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                ส่งออก Excel
              </button>
              <button
                onClick={() => {
                  setEditingEquipment(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                เพิ่มอุปกรณ์
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">แสดง</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-600">รายการ</span>
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
                  placeholder="ค้นหา..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">รหัสสินค้า</th>
                <th className="px-6 py-3 text-left text-gray-600">ชื่อสินค้า</th>
                <th className="px-6 py-3 text-left text-gray-600">ชื่อหมวดหมู่สินค้า</th>
                <th className="px-6 py-3 text-left text-gray-600">หมายเลข Serial No.</th>
                <th className="px-6 py-3 text-left text-gray-600">จำนวน</th>
                <th className="px-6 py-3 text-left text-gray-600">คงเหลือ</th>
                <th className="px-6 py-3 text-left text-gray-600">สถานะ</th>
                <th className="px-6 py-3 text-left text-gray-600">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEquipment.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{item.code}</td>
                  <td className="px-6 py-4 text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-gray-800">{item.category}</td>
                  <td className="px-6 py-4 text-gray-800">{item.serialNumber}</td>
                  <td className="px-6 py-4 text-gray-800">{item.quantity}</td>
                  <td className="px-6 py-4 text-gray-800">{item.available}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'available' ? 'bg-green-100 text-green-700' :
                      item.status === 'borrowed' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'available' ? 'พร้อมใช้งาน' :
                       item.status === 'borrowed' ? 'ถูกยืม' : 'ซ่อมบำรุง'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 flex items-center justify-between border-t border-gray-200">
          <div className="text-gray-600">
            แสดง {startIndex + 1} ถึง {Math.min(startIndex + entriesPerPage, filteredEquipment.length)} จาก {filteredEquipment.length} รายการ
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              ก่อนหน้า
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <EquipmentModal
          equipmentId={editingEquipment}
          onClose={() => {
            setShowModal(false);
            setEditingEquipment(null);
          }}
        />
      )}
    </div>
  );
}
