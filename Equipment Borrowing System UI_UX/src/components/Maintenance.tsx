import { useState } from 'react';
import { Wrench, Plus, Search, Filter, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useBorrowStore, MaintenanceRequest } from '../store/borrowStore';

export function Maintenance() {
  const { maintenanceRequests, equipment, users, addMaintenanceRequest, updateMaintenanceRequest } = useBorrowStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    equipmentId: '',
    reportedBy: '',
    issue: '',
    priority: 'medium' as const,
    assignedTo: '',
    cost: 0,
    notes: '',
  });

  const filteredRequests = maintenanceRequests.filter((request) => {
    const item = equipment.find((e) => e.id === request.equipmentId);
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    const matchesSearch = item?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item?.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: MaintenanceRequest = {
      id: 'mr' + Date.now(),
      equipmentId: formData.equipmentId,
      reportedBy: formData.reportedBy,
      reportDate: new Date().toLocaleDateString('th-TH'),
      issue: formData.issue,
      priority: formData.priority,
      status: 'pending',
      assignedTo: formData.assignedTo || undefined,
      cost: formData.cost,
      notes: formData.notes,
    };

    addMaintenanceRequest(newRequest);
    setShowAddModal(false);
    setFormData({
      equipmentId: '',
      reportedBy: '',
      issue: '',
      priority: 'medium',
      assignedTo: '',
      cost: 0,
      notes: '',
    });
    alert('บันทึกการแจ้งซ่อมเรียบร้อยแล้ว');
  };

  const handleUpdateStatus = (id: string, status: MaintenanceRequest['status']) => {
    const updates: Partial<MaintenanceRequest> = { status };
    if (status === 'completed') {
      updates.completedDate = new Date().toLocaleDateString('th-TH');
    }
    updateMaintenanceRequest(id, updates);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const stats = {
    pending: maintenanceRequests.filter(r => r.status === 'pending').length,
    in_progress: maintenanceRequests.filter(r => r.status === 'in_progress').length,
    completed: maintenanceRequests.filter(r => r.status === 'completed').length,
    urgent: maintenanceRequests.filter(r => r.priority === 'urgent' && r.status !== 'completed').length,
  };

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-gray-800 dark:text-white flex items-center gap-2">
                <Wrench className="w-6 h-6" />
                ระบบแจ้งซ่อม/บำรุงรักษา
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">จัดการการซ่อมแซมและบำรุงรักษาอุปกรณ์</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              แจ้งซ่อมใหม่
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-600 dark:text-orange-400">รอดำเนินการ</span>
              </div>
              <p className="text-2xl text-orange-800 dark:text-orange-300">{stats.pending}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400">กำลังดำเนินการ</span>
              </div>
              <p className="text-2xl text-blue-800 dark:text-blue-300">{stats.in_progress}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">เสร็จสิ้น</span>
              </div>
              <p className="text-2xl text-green-800 dark:text-green-300">{stats.completed}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400">ด่วน</span>
              </div>
              <p className="text-2xl text-red-800 dark:text-red-300">{stats.urgent}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2"
            >
              <option value="all">ความสำคัญทั้งหมด</option>
              <option value="urgent">ด่วนมาก</option>
              <option value="high">สูง</option>
              <option value="medium">ปานกลาง</option>
              <option value="low">ต่ำ</option>
            </select>

            <div className="flex-1"></div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                placeholder="ค้นหาอุปกรณ์..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">รหัสอุปกรณ์</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">ชื่ออุปกรณ์</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">ปัญหา</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">ผู้แจ้ง</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">วันที่แจ้ง</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">ความสำคัญ</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">สถานะ</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">ค่าใช้จ่าย</th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    ไม่มีรายการแจ้งซ่อม
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const item = equipment.find((e) => e.id === request.equipmentId);
                  const user = users.find((u) => u.id === request.reportedBy);

                  return (
                    <tr key={request.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{item?.code}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{item?.name}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200 max-w-xs truncate">{request.issue}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{user?.name || request.reportedBy}</td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{request.reportDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(request.priority)}`}>
                          {request.priority === 'urgent' ? 'ด่วนมาก' :
                           request.priority === 'high' ? 'สูง' :
                           request.priority === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className="text-gray-800 dark:text-gray-200">
                            {request.status === 'pending' ? 'รอดำเนินการ' :
                             request.status === 'in_progress' ? 'กำลังดำเนินการ' :
                             request.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {request.cost ? `฿${request.cost.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(request.id, 'in_progress')}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            เริ่มดำเนินการ
                          </button>
                        )}
                        {request.status === 'in_progress' && (
                          <button
                            onClick={() => handleUpdateStatus(request.id, 'completed')}
                            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            เสร็จสิ้น
                          </button>
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

      {/* Modal เพิ่มการแจ้งซ่อม */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-800 dark:text-white">แจ้งซ่อม/บำรุงรักษา</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddRequest} className="p-6">
              <div className="grid grid-cols-2 gap-4">
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
                        {item.code} - {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">ผู้แจ้ง</label>
                  <select
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    required
                  >
                    <option value="">-- เลือกผู้แจ้ง --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">รายละเอียดปัญหา</label>
                  <textarea
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    rows={3}
                    placeholder="อธิบายปัญหาที่พบ..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">ความสำคัญ</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                  >
                    <option value="low">ต่ำ</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="high">สูง</option>
                    <option value="urgent">ด่วนมาก</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">มอบหมายให้</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    placeholder="ชื่อช่าง/เจ้าหน้าที่"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">ค่าใช้จ่ายโดยประมาณ (บาท)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">หมายเหตุ</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    placeholder="หมายเหตุเพิ่มเติม..."
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
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
