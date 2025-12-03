import { useState } from 'react';
import { Search, Download, Filter, FileText, RefreshCw } from 'lucide-react';
import { useBorrowStore } from '../store/borrowStore';
import { ReceiptModal } from './ReceiptModal';

export function BorrowHistory() {
  const { borrowRecords, equipment, users, updateBorrowRecord } = useBorrowStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const filteredRecords = borrowRecords.filter((record) => {
    const user = users.find((u) => u.id === record.userId);
    const item = equipment.find((e) => e.id === record.equipmentId);
    
    const matchesSearch =
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.studentId.includes(searchTerm) ||
      item?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + entriesPerPage);

  const handleExport = () => {
    alert('ส่งออกข้อมูลเป็น Excel');
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-800">ประวัติการยืม-คืน</h1>
              <p className="text-gray-600 mt-1">บันทึกการยืมและคืนอุปกรณ์ทั้งหมด</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              ส่งออก Excel
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
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
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="borrowed">กำลังยืม</option>
                <option value="returned">คืนแล้ว</option>
                <option value="overdue">เกินกำหนด</option>
              </select>
            </div>

            <div className="flex-1"></div>

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
                <th className="px-6 py-3 text-left text-gray-600">รหัสสมาชิก</th>
                <th className="px-6 py-3 text-left text-gray-600">ชื่อผู้ยืม</th>
                <th className="px-6 py-3 text-left text-gray-600">อุปกรณ์</th>
                <th className="px-6 py-3 text-left text-gray-600">จำนวน</th>
                <th className="px-6 py-3 text-left text-gray-600">วันที่ยืม</th>
                <th className="px-6 py-3 text-left text-gray-600">กำหนดคืน</th>
                <th className="px-6 py-3 text-left text-gray-600">วันที่คืน</th>
                <th className="px-6 py-3 text-left text-gray-600">สถานะ</th>
                <th className="px-6 py-3 text-left text-gray-600">ใบเสร็จ</th>
                <th className="px-6 py-3 text-left text-gray-600">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => {
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
                    <td className="px-6 py-4 text-gray-800">{record.returnDate || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          record.status === 'borrowed'
                            ? 'bg-orange-100 text-orange-700'
                            : record.status === 'returned'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {record.status === 'borrowed'
                          ? 'กำลังยืม'
                          : record.status === 'returned'
                          ? 'คืนแล้ว'
                          : 'เกินกำหนด'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedReceipt(record.id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <FileText className="w-4 h-4" />
                        ดูใบเสร็จ
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {(record.status === 'borrowed' || record.status === 'overdue') && (
                        <button
                          onClick={() => {
                            const newDueDate = new Date();
                            newDueDate.setDate(newDueDate.getDate() + 7);
                            updateBorrowRecord(record.id, {
                              dueDate: newDueDate.toLocaleDateString('th-TH'),
                              renewalCount: (record.renewalCount || 0) + 1,
                            });
                            alert('ต่ออายุการยืมเรียบร้อยแล้ว');
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          <RefreshCw className="w-4 h-4" />
                          ต่ออายุ
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-6 flex items-center justify-between border-t border-gray-200">
          <div className="text-gray-600">
            แสดง {startIndex + 1} ถึง {Math.min(startIndex + entriesPerPage, filteredRecords.length)} จาก{' '}
            {filteredRecords.length} รายการ
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              ก่อนหน้า
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
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

      {selectedReceipt && (
        <ReceiptModal
          recordId={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}