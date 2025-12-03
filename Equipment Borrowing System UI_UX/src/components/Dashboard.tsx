import { Package, Users, TrendingUp, AlertCircle, Clock, CheckCircle, Bell, Calendar } from 'lucide-react';
import { useBorrowStore } from '../store/borrowStore';

export function Dashboard() {
  const { equipment, borrowRecords, users, notifications, reservations } = useBorrowStore();

  const stats = [
    {
      label: 'อุปกรณ์ทั้งหมด',
      value: equipment.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'กำลังยืม',
      value: borrowRecords.filter(r => r.status === 'borrowed' || r.status === 'approved').length,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      label: 'รออนุมัติ',
      value: borrowRecords.filter(r => r.status === 'pending').length,
      icon: AlertCircle,
      color: 'bg-purple-500',
    },
    {
      label: 'เกินกำหนด',
      value: borrowRecords.filter(r => r.status === 'overdue').length,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];

  const recentBorrows = borrowRecords.slice(0, 5);
  const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-800 mb-2">แดชบอร์ด</h1>
        <p className="text-gray-600">ภาพรวมระบบยืม-คืนอุปกรณ์</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 mb-2">{stat.label}</p>
                  <p className="text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-full p-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">การแจ้งเตือนล่าสุด</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {unreadNotifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">ไม่มีการแจ้งเตือนใหม่</p>
            ) : (
              unreadNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">{notification.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{notification.date}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800">การจองล่าสุด</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {reservations.slice(0, 5).map((reservation) => {
              const user = users.find(u => u.id === reservation.userId);
              const item = equipment.find(e => e.id === reservation.equipmentId);
              
              return (
                <div key={reservation.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex-1">
                    <p className="text-gray-800">{item?.name}</p>
                    <p className="text-gray-500 text-sm">{user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">{reservation.startDate}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      reservation.status === 'pending' ? 'bg-purple-100 text-purple-700' :
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {reservation.status === 'pending' ? 'รอยืนยัน' :
                       reservation.status === 'confirmed' ? 'ยืนยันแล้ว' : 'อื่นๆ'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-800 mb-4">รายการยืมล่าสุด</h2>
          <div className="space-y-4">
            {recentBorrows.map((record) => {
              const user = users.find(u => u.id === record.userId);
              const item = equipment.find(e => e.id === record.equipmentId);
              
              return (
                <div key={record.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex-1">
                    <p className="text-gray-800">{item?.name}</p>
                    <p className="text-gray-500 text-sm">{user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">{record.borrowDate}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      record.status === 'borrowed' ? 'bg-orange-100 text-orange-700' :
                      record.status === 'returned' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.status === 'borrowed' ? 'กำลังยืม' :
                       record.status === 'returned' ? 'คืนแล้ว' : 'เกินกำหนด'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-800 mb-4">อุปกรณ์ที่ยืมบ่อย</h2>
          <div className="space-y-4">
            {equipment.slice(0, 5).map((item) => {
              const borrowCount = borrowRecords.filter(r => r.equipmentId === item.id).length;
              
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-800">{item.name}</p>
                    <p className="text-gray-500 text-sm">{item.serialNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800">{borrowCount} ครั้ง</p>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(borrowCount * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}