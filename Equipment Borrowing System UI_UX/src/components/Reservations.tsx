import { useState } from 'react';
import { Calendar, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useBorrowStore, Reservation } from '../store/borrowStore';

export function Reservations() {
  const { reservations, equipment, users, updateReservation, addReservation } = useBorrowStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    equipmentId: '',
    startDate: '',
    endDate: '',
    quantity: 1,
    notes: '',
  });

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();

    const newReservation: Reservation = {
      id: 'res' + Date.now(),
      userId: formData.userId,
      equipmentId: formData.equipmentId,
      reservationDate: new Date().toLocaleDateString('th-TH'),
      startDate: new Date(formData.startDate).toLocaleDateString('th-TH'),
      endDate: new Date(formData.endDate).toLocaleDateString('th-TH'),
      status: 'pending',
      quantity: formData.quantity,
      notes: formData.notes,
    };

    addReservation(newReservation);
    setShowAddModal(false);
    setFormData({
      userId: '',
      equipmentId: '',
      startDate: '',
      endDate: '',
      quantity: 1,
      notes: '',
    });
    alert('บันทึกการจองเรียบร้อยแล้ว');
  };

  const handleConfirm = (id: string) => {
    if (confirm('ยืนยันการจอง?')) {
      updateReservation(id, { status: 'confirmed' });
    }
  };

  const handleCancel = (id: string) => {
    if (confirm('ยกเลิกการจอง?')) {
      updateReservation(id, { status: 'cancelled' });
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                จองอุปกรณ์
              </h1>
              <p className="text-gray-600 mt-1">จองอุปกรณ์ล่วงหน้าสำหรับอุปกรณ์ที่ถูกยืมอยู่</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              จองใหม่
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600">รอยืนยัน</span>
              </div>
              <p className="text-purple-800">{reservations.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600">ยืนยันแล้ว</span>
              </div>
              <p className="text-green-800">{reservations.filter(r => r.status === 'confirmed').length}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-600">ยกเลิก</span>
              </div>
              <p className="text-red-800">{reservations.filter(r => r.status === 'cancelled').length}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600">เสร็จสิ้น</span>
              </div>
              <p className="text-blue-800">{reservations.filter(r => r.status === 'completed').length}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">รหัสสมาชิก</th>
                <th className="px-6 py-3 text-left text-gray-600">ชื่อผู้จอง</th>
                <th className="px-6 py-3 text-left text-gray-600">อุปกรณ์</th>
                <th className="px-6 py-3 text-left text-gray-600">จำนวน</th>
                <th className="px-6 py-3 text-left text-gray-600">วันที่จอง</th>
                <th className="px-6 py-3 text-left text-gray-600">วันเริ่มใช้</th>
                <th className="px-6 py-3 text-left text-gray-600">วันคืน</th>
                <th className="px-6 py-3 text-left text-gray-600">สถานะ</th>
                <th className="px-6 py-3 text-left text-gray-600">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    ไม่มีรายการจอง
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => {
                  const user = users.find((u) => u.id === reservation.userId);
                  const item = equipment.find((e) => e.id === reservation.equipmentId);

                  return (
                    <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-800">{user?.studentId}</td>
                      <td className="px-6 py-4 text-gray-800">{user?.name}</td>
                      <td className="px-6 py-4 text-gray-800">{item?.name}</td>
                      <td className="px-6 py-4 text-gray-800">{reservation.quantity}</td>
                      <td className="px-6 py-4 text-gray-800">{reservation.reservationDate}</td>
                      <td className="px-6 py-4 text-gray-800">{reservation.startDate}</td>
                      <td className="px-6 py-4 text-gray-800">{reservation.endDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            reservation.status === 'pending'
                              ? 'bg-purple-100 text-purple-700'
                              : reservation.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : reservation.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {reservation.status === 'pending' ? 'รอยืนยัน' :
                           reservation.status === 'confirmed' ? 'ยืนยันแล้ว' :
                           reservation.status === 'cancelled' ? 'ยกเลิก' : 'เสร็จสิ้น'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {reservation.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirm(reservation.id)}
                              className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              ยืนยัน
                            </button>
                            <button
                              onClick={() => handleCancel(reservation.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal เพิ่มการจอง */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-gray-800">จองอุปกรณ์ใหม่</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddReservation} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">เลือกผู้จอง</label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">-- เลือกผู้จอง --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.studentId} - {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">เลือกอุปกรณ์</label>
                  <select
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                  <label className="block text-gray-700 mb-2">วันเริ่มใช้</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">วันคืน</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min={formData.startDate}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">จำนวน</label>
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
                  <label className="block text-gray-700 mb-2">หมายเหตุ</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="ระบุหมายเหตุ..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  บันทึกการจอง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
