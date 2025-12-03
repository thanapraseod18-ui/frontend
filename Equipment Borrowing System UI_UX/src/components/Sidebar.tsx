import { Home, Package, LogIn, LogOut, History, Users, FileText, Menu, CheckSquare, Calendar, Bell, QrCode, Wrench, CalendarDays, Clock, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useBorrowStore } from '../store/borrowStore';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { notifications, darkMode, toggleDarkMode } = useBorrowStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'หน้าหลัก' },
    { id: 'equipment', icon: Package, label: 'จัดการอุปกรณ์' },
    { id: 'borrow', icon: LogIn, label: 'ยืมอุปกรณ์' },
    { id: 'return', icon: LogOut, label: 'คืนอุปกรณ์' },
    { id: 'approvals', icon: CheckSquare, label: 'อนุมัติการยืม-คืน' },
    { id: 'reservations', icon: Calendar, label: 'จองอุปกรณ์' },
    { id: 'waiting-list', icon: Clock, label: 'คิวรอ', badge: 'new' },
    { id: 'calendar', icon: CalendarDays, label: 'ปฏิทิน', badge: 'new' },
    { id: 'maintenance', icon: Wrench, label: 'แจ้งซ่อม/บำรุงรักษา', badge: 'new' },
    { id: 'history', icon: History, label: 'ประวัติการยืม-คืน' },
    { id: 'users', icon: Users, label: 'จัดการผู้ใช้' },
    { id: 'notifications', icon: Bell, label: 'แจ้งเตือน', badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'qr-scanner', icon: QrCode, label: 'สแกน QR Code' },
    { id: 'reports', icon: FileText, label: 'รายงาน' },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 text-white h-screen flex flex-col transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span>B</span>
            </div>
            <span>Borrow System</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="bg-[#34495e] rounded-lg p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="text-sm">ธนาวัตน์ แคลเจียม</div>
                <div className="text-xs text-gray-400">ADMIN</div>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
                {item.badge && (
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">
                    {item.badge}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!isCollapsed && <span>{darkMode ? 'โหมดสว่าง' : 'โหมดมืด'}</span>}
        </button>
      </div>
    </div>
  );
}