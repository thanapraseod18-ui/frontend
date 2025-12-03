import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, Calendar, Filter, Trash2 } from 'lucide-react';
import { useBorrowStore } from '../store/borrowStore';

export function Notifications() {
  const { notifications, updateNotification } = useBorrowStore();
  const [filterType, setFilterType] = useState<'all' | 'due_soon' | 'overdue' | 'new_borrow' | 'new_return' | 'reservation'>('all');

  const filteredNotifications = notifications.filter(
    (notification) => filterType === 'all' || notification.type === filterType
  );

  const handleMarkAsRead = (id: string) => {
    updateNotification(id, { isRead: true });
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach((notification) => {
      if (!notification.isRead) {
        updateNotification(notification.id, { isRead: true });
      }
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'due_soon':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'new_borrow':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'new_return':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reservation':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'due_soon':
        return 'ใกล้ถึงกำหนด';
      case 'overdue':
        return 'เกินกำหนด';
      case 'new_borrow':
        return 'การยืมใหม่';
      case 'new_return':
        return 'การคืนใหม่';
      case 'reservation':
        return 'การจอง';
      default:
        return 'อื่นๆ';
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gray-800 flex items-center gap-2">
                  <Bell className="w-6 h-6" />
                  การแจ้งเตือน
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">รายการแจ้งเตือนทั้งหมด</p>
              </div>
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                อ่านทั้งหมด
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">ทั้งหมด</option>
                <option value="due_soon">ใกล้ถึงกำหนด</option>
                <option value="overdue">เกินกำหนด</option>
                <option value="new_borrow">การยืมใหม่</option>
                <option value="new_return">การคืนใหม่</option>
                <option value="reservation">การจอง</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>ไม่มีการแจ้งเตือน</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-gray-800">{notification.title}</h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{notification.date}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {getTypeLabel(notification.type)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="mb-2">การตั้งค่าการแจ้งเตือน</h3>
              <p className="text-sm text-blue-100 mb-4">
                ระบบจะแจ้งเตือนอัตโนมัติเมื่อ:
              </p>
              <ul className="text-sm text-blue-100 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  อุปกรณ์ใกล้ถึงกำหนดคืน (3 วันก่อน)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  อุปกรณ์เกินกำหนดคืน
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  มีการยืม-คืนอุปกรณ์ใหม่
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  มีการจองอุปกรณ์
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
