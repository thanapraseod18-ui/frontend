import { useState } from 'react';
import { Clock, Plus, Search, CheckCircle, XCircle, Bell } from 'lucide-react';
import { useBorrowStore, WaitingList } from '../store/borrowStore';

export function WaitingListPage() {
  const { waitingList, equipment, users, addWaitingList, updateWaitingList, addNotification } = useBorrowStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'notified' | 'fulfilled' | 'cancelled'>('all');
  const [formData, setFormData] = useState({
    userId: '',
    equipmentId: '',
    quantity: 1,
  });

  const filteredList = waitingList.filter((item) => {
    const user = users.find(u => u.id === item.userId);
    const eq = equipment.find(e => e.id === item.equipmentId);
    const matchesSearch = user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          eq?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddToWaitingList = (e: React.FormEvent) => {
    e.preventDefault();

    const newWaiting: WaitingList = {
      id: 'wl' + Date.now(),
      userId: formData.userId,
      equipmentId: formData.equipmentId,
      requestDate: new Date().toLocaleDateString('th-TH'),
      quantity: formData.quantity,
      status: 'waiting',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH'), // หมดอายุใน 7 วัน
    };

    addWaitingList(newWaiting);
    setShowAddModal(false);
    setFormData({
      userId: '',
      equipmentId: '',
      quantity: 1,
    });
    alert('เพิ่มเข้าคิวรอเรียบร้อยแล้ว');
  };

  const handleNotify = (id: string) => {
    const item = waitingList.find(w => w.id === id);
    if (!item) return;

    updateWaitingList(id, {
      status: 'notified',
      notifiedDate: new Date().toLocaleDateString('th-TH'),
    });

    const user = users.find(u => u.id === item.userId);
    const eq = equipment.find(e => e.id === item.equipmentId);

    addNotification({
      id: 'not' + Date.now(),
      type: 'reservation',
      title: 'อุปกรณ์พร้อมให้ยืมแล้ว',
      message: `อุปกรณ์ ${eq?.name} พร้อมให้ ${user?.name} ยืมแล้ว กรุณามารับภายใน 3 วัน`,
      date: new Date().toLocaleDateString('th-TH'),
      isRead: false,
      relatedId: id,
    });

    alert('แจ้งเตือนผู้ใช้เรียบร้อยแล้ว');
  };

  const handleFulfill = (id: string) => {
    if (confirm('ยืนยันการยืมอุปกรณ์?')) {
      updateWaitingList(id, { status: 'fulfilled' });
      alert('บันทึกการยืมเรียบร้อยแล้ว');
    }
  };

  const handleCancel = (id: string) => {
    if (confirm('ยกเลิกรายการคิวรอ?')) {
      updateWaitingList(id, { status: 'cancelled' });
    }
  };

  const stats = {
    waiting: waitingList.filter(w => w.status === 'waiting').length,
    notified: waitingList.filter(w => w.status === 'notified').length,
    fulfilled: waitingList.filter(w => w.status === 'fulfilled').length,
  };

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-800 dark:text-white flex items-center gap-2">
                <Clock className="w-6 h-6" />
                คิวรออุปกรณ์
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">จัดการคิวรอสำหรับอุปกรณ์ที่ถูกยืมหมด</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              เพิ่มคิวรอ
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-600 dark:text-orange-400">กำลังรอ</span>
              </div>
              <p className="text-2xl text-orange-800 dark:text-orange-300">{stats.waiting}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400">แจ้งเตือนแล้ว</span>
              </div>
              <p className="text-2xl text-blue-800 dark:text-blue-300">{stats.notified}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">ยืมแล้ว</span>
              </div>
              <p className="text-2xl text-green-800 dark:text-green-300">{stats.fulfilled}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">กรอง:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
              >
                <option value="all">ทั้งหมด</option>
                <option value="waiting">กำลังรอ</option>
                <option value="notified">แจ้งเตือนแล้ว</option>
                <option value="fulfilled">ยืมแล้ว</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>

            <div className="flex-1"></div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                placeholder="ค้นหา..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">ลำดับคิว</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">รหัสสมาชิก</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">ชื่อผู้รอ</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">อุปกรณ์</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">จำนวน</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">วันที่ขอ</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">วันหมดอายุ</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">สถานะ</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    ไม่มีรายการคิวรอ
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => {
                  const user = users.find(u => u.id === item.userId);
                  const eq = equipment.find(e => e.id === item.equipmentId);

                  return (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{user?.studentId}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{user?.name}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{eq?.name}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{item.requestDate}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {item.expiryDate || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.status === 'waiting' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40' :
                          item.status === 'notified' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40' :
                          item.status === 'fulfilled' ? 'bg-green-100 text-green-700 dark:bg-green-900/40' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700'
                        }`}>
                          {item.status === 'waiting' ? 'กำลังรอ' :
                           item.status === 'notified' ? 'แจ้งเตือนแล้ว' :
                           item.status === 'fulfilled' ? 'ยืมแล้ว' : 'ยกเลิก'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {item.status === 'waiting' && (
                            <>
                              <button
                                onClick={() => handleNotify(item.id)}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                title="แจ้งเตือนผู้ใช้ว่าอุปกรณ์พร้อมแล้ว"
                              >
                                <Bell className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancel(item.id)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {item.status === 'notified' && (
                            <button
                              onClick={() => handleFulfill(item.id)}
                              className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal เพิ่มคิวรอ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-800 dark:text-white">เพิ่มคิวรอ</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddToWaitingList} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">เลือกผู้รอ</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    required
                  >
                    <option value="">-- เลือกผู้รอ --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.studentId} - {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">เลือกอุปกรณ์</label>
                  <select
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    required
                  >
                    <option value="">-- เลือกอุปกรณ์ --</option>
                    {equipment.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (คงเหลือ {item.available})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">จำนวน</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  เพิ่มคิวรอ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* คำแนะนำการใช้งาน */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-lg p-6 text-white">
        <h3 className="mb-3">💡 วิธีใช้งานคิวรอ</h3>
        <div className="space-y-2 text-sm text-blue-100">
          <p>1. เมื่ออุปกรณ์ถูกยืมหมด ผู้ใช้สามารถเข้าคิวรอได้</p>
          <p>2. เมื่อมีอุปกรณ์ว่าง ระบบจะเรียงลำดับคิวอัตโนมัติ</p>
          <p>3. กดปุ่ม "แจ้งเตือน" เพื่อแจ้งให้ผู้รอทราบ</p>
          <p>4. ผู้รอมี 3 วันในการมารับอุปกรณ์</p>
          <p>5. หากไม่มารับภายในเวลาที่กำหนด คิวจะหมดอายุ</p>
        </div>
      </div>
    </div>
  );
}
