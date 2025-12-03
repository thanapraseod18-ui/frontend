import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EquipmentManagement } from './components/EquipmentManagement';
import { BorrowEquipment } from './components/BorrowEquipment';
import { ReturnEquipment } from './components/ReturnEquipment';
import { BorrowHistory } from './components/BorrowHistory';
import { UserManagement } from './components/UserManagement';
import { Reports } from './components/Reports';
import { Approvals } from './components/Approvals';
import { Reservations } from './components/Reservations';
import { Notifications } from './components/Notifications';
import { QRScanner } from './components/QRScanner';
import { Maintenance } from './components/Maintenance';
import { CalendarView } from './components/CalendarView';
import { WaitingListPage } from './components/WaitingListPage';
import { useBorrowStore } from './store/borrowStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { darkMode } = useBorrowStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'borrow':
        return <BorrowEquipment />;
      case 'return':
        return <ReturnEquipment />;
      case 'history':
        return <BorrowHistory />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      case 'approvals':
        return <Approvals />;
      case 'reservations':
        return <Reservations />;
      case 'notifications':
        return <Notifications />;
      case 'qr-scanner':
        return <QRScanner />;
      case 'maintenance':
        return <Maintenance />;
      case 'calendar':
        return <CalendarView />;
      case 'waiting-list':
        return <WaitingListPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}