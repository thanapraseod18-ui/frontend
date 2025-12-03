import { create } from 'zustand';

export interface Equipment {
  id: string;
  code: string;
  name: string;
  category: string;
  serialNumber: string;
  quantity: number;
  available: number;
  status: 'available' | 'borrowed' | 'maintenance';
  image?: string; // เพิ่มรูปภาพ
  qrCode?: string; // QR Code สำหรับอุปกรณ์
}

export interface User {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  equipmentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  quantity: number;
  status: 'pending' | 'approved' | 'borrowed' | 'returned' | 'overdue' | 'rejected';
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  renewalCount?: number; // จำนวนครั้งที่ต่ออายุ
}

export interface Reservation {
  id: string;
  userId: string;
  equipmentId: string;
  reservationDate: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  quantity: number;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'due_soon' | 'overdue' | 'new_borrow' | 'new_return' | 'reservation';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  relatedId?: string; // ID ของรายการที่เกี่ยวข้อง
}

export interface MaintenanceRequest {
  id: string;
  equipmentId: string;
  reportedBy: string;
  reportDate: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  completedDate?: string;
  cost?: number;
  notes?: string;
}

export interface WaitingList {
  id: string;
  userId: string;
  equipmentId: string;
  requestDate: string;
  quantity: number;
  status: 'waiting' | 'notified' | 'fulfilled' | 'cancelled';
  notifiedDate?: string;
  expiryDate?: string; // วันหมดอายุการรอ
}

interface BorrowStore {
  equipment: Equipment[];
  users: User[];
  borrowRecords: BorrowRecord[];
  reservations: Reservation[];
  notifications: Notification[];
  maintenanceRequests: MaintenanceRequest[];
  waitingList: WaitingList[];
  darkMode: boolean;
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addBorrowRecord: (record: BorrowRecord) => void;
  updateBorrowRecord: (id: string, record: Partial<BorrowRecord>) => void;
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, notification: Partial<Notification>) => void;
  addMaintenanceRequest: (request: MaintenanceRequest) => void;
  updateMaintenanceRequest: (id: string, request: Partial<MaintenanceRequest>) => void;
  addWaitingList: (waiting: WaitingList) => void;
  updateWaitingList: (id: string, waiting: Partial<WaitingList>) => void;
  toggleDarkMode: () => void;
}

const mockEquipment: Equipment[] = [
  {
    id: 'eq1',
    code: 'AC032948234',
    name: 'คอมพิวเตอร์ Acer',
    category: 'อิเล็กทรอนิกส์',
    serialNumber: 'AC001',
    quantity: 5,
    available: 5,
    status: 'available',
  },
  {
    id: 'eq2',
    code: 'AC032948235',
    name: 'คอมพิวเตอร์ Acer',
    category: 'อิเล็กทรอนิกส์',
    serialNumber: 'AC002',
    quantity: 5,
    available: 4,
    status: 'available',
  },
  {
    id: 'eq3',
    code: 'AE30424027',
    name: 'หูฟังไร้สาย 1',
    category: 'อุปกรณ์เสียงวาน',
    serialNumber: 'SLSOI08342-23489327',
    quantity: 3,
    available: 1,
    status: 'available',
  },
  {
    id: 'eq4',
    code: 'AC924709',
    name: 'เครื่องคิดเลขอเนกฯ',
    category: 'อิเล็กทรอนิกส์',
    serialNumber: 'B320474',
    quantity: 10,
    available: 5,
    status: 'available',
  },
  {
    id: 'eq5',
    code: 'IP001',
    name: 'iPhone 8 Plus',
    category: 'โทรศัพท์',
    serialNumber: 'I0234170',
    quantity: 2,
    available: 1,
    status: 'available',
  },
  {
    id: 'eq6',
    code: 'SK001',
    name: 'เครื่องยิงกาวแท่ง',
    category: 'เครื่องมือ',
    serialNumber: 'SK0239089B',
    quantity: 15,
    available: 12,
    status: 'available',
  },
  {
    id: 'eq7',
    code: 'LG001',
    name: 'เครื่องฉีกกล้อง I.co1',
    category: 'เครื่องมือ',
    serialNumber: 'LG024324240',
    quantity: 8,
    available: 3,
    status: 'available',
  },
  {
    id: 'eq8',
    code: 'SK002',
    name: 'ปากกาดินไทย',
    category: 'เครื่องเขียน',
    serialNumber: 'SK0032950',
    quantity: 20,
    available: 17,
    status: 'available',
  },
];

const mockUsers: User[] = [
  {
    id: 'u1',
    studentId: '569789467',
    name: 'สมชาย ใจยดี',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    department: 'วิศวกรรมศาสตร์',
  },
  {
    id: 'u2',
    studentId: '01544542101',
    name: 'สมปอง มากดี',
    email: 'sompong@example.com',
    phone: '082-345-6789',
    department: 'วิทยาศาสตร์',
  },
  {
    id: 'u3',
    studentId: '2904240724',
    name: 'หรรษรม มหาดี',
    email: 'hansorn@example.com',
    phone: '083-456-7890',
    department: 'บริหารธุรกิจ',
  },
  {
    id: 'u4',
    studentId: '0932840234',
    name: 'สมาญจ์ แท้ไทย',
    email: 'saman@example.com',
    phone: '084-567-8901',
    department: 'ศิลปศาสตร์',
  },
  {
    id: 'u5',
    studentId: '588514561',
    name: 'สกลศก มาหาล',
    email: 'sakolsak@example.com',
    phone: '085-678-9012',
    department: 'วิศวกรรมศาสตร์',
  },
];

const mockBorrowRecords: BorrowRecord[] = [
  {
    id: 'br1',
    userId: 'u1',
    equipmentId: 'eq1',
    borrowDate: '21/04/2018',
    dueDate: '26/04/2018',
    returnDate: '26/04/2018',
    quantity: 1,
    status: 'returned',
  },
  {
    id: 'br2',
    userId: 'u2',
    equipmentId: 'eq2',
    borrowDate: '21/04/2018',
    dueDate: '21/04/2018',
    quantity: 1,
    status: 'borrowed',
  },
  {
    id: 'br3',
    userId: 'u3',
    equipmentId: 'eq3',
    borrowDate: '21/04/2018',
    dueDate: '25/04/2018',
    quantity: 1,
    status: 'borrowed',
  },
  {
    id: 'br4',
    userId: 'u4',
    equipmentId: 'eq4',
    borrowDate: '21/04/2018',
    dueDate: '28/04/2018',
    returnDate: '28/04/2018',
    quantity: 3,
    status: 'returned',
  },
  {
    id: 'br5',
    userId: 'u5',
    equipmentId: 'eq5',
    borrowDate: '21/04/2018',
    dueDate: '28/04/2018',
    quantity: 1,
    status: 'overdue',
  },
  {
    id: 'br6',
    userId: 'u5',
    equipmentId: 'eq6',
    borrowDate: '21/04/2018',
    dueDate: '24/04/2018',
    returnDate: '24/04/2018',
    quantity: 2,
    status: 'returned',
  },
  {
    id: 'br7',
    userId: 'u1',
    equipmentId: 'eq7',
    borrowDate: '02/12/2025',
    dueDate: '09/12/2025',
    quantity: 1,
    status: 'pending',
  },
  {
    id: 'br8',
    userId: 'u2',
    equipmentId: 'eq8',
    borrowDate: '02/12/2025',
    dueDate: '10/12/2025',
    quantity: 2,
    status: 'pending',
  },
];

const mockReservations: Reservation[] = [
  {
    id: 'res1',
    userId: 'u1',
    equipmentId: 'eq1',
    reservationDate: '20/04/2018',
    startDate: '21/04/2018',
    endDate: '26/04/2018',
    status: 'confirmed',
    quantity: 1,
  },
  {
    id: 'res2',
    userId: 'u2',
    equipmentId: 'eq2',
    reservationDate: '20/04/2018',
    startDate: '21/04/2018',
    endDate: '21/04/2018',
    status: 'pending',
    quantity: 1,
  },
  {
    id: 'res3',
    userId: 'u3',
    equipmentId: 'eq3',
    reservationDate: '20/04/2018',
    startDate: '21/04/2018',
    endDate: '25/04/2018',
    status: 'confirmed',
    quantity: 1,
  },
  {
    id: 'res4',
    userId: 'u4',
    equipmentId: 'eq4',
    reservationDate: '20/04/2018',
    startDate: '21/04/2018',
    endDate: '28/04/2018',
    status: 'confirmed',
    quantity: 3,
  },
  {
    id: 'res5',
    userId: 'u5',
    equipmentId: 'eq5',
    reservationDate: '20/04/2018',
    startDate: '21/04/2018',
    endDate: '28/04/2018',
    status: 'pending',
    quantity: 1,
  },
  {
    id: 'res6',
    userId: 'u5',
    equipmentId: 'eq6',
    reservationDate: '20/04/2018',
    startDate: '21/04/2018',
    endDate: '24/04/2018',
    status: 'confirmed',
    quantity: 2,
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'not1',
    type: 'due_soon',
    title: 'อุปกรณ์กำลังจะถึงวันคืน',
    message: 'อุปกรณ์คอมพิวเตอร์ Acer (AC032948234) กำลังจะถึงวันคืนใน 3 วัน',
    date: '20/04/2018',
    isRead: false,
    relatedId: 'br1',
  },
  {
    id: 'not2',
    type: 'overdue',
    title: 'อุปกรณ์คืนล่าช้า',
    message: 'อุปกรณ์คอมพิวเตอร์ Acer (AC032948235) คืนล่าช้าแล้ว 1 วัน',
    date: '20/04/2018',
    isRead: false,
    relatedId: 'br2',
  },
  {
    id: 'not3',
    type: 'new_borrow',
    title: 'ยืมอุปกรณ์ใหม่',
    message: 'สมชาย ใจยดี ยืมอุปกรณ์คอมพิวเตอร์ Acer (AC032948234) จำนวน 1 ชิ้น',
    date: '20/04/2018',
    isRead: false,
    relatedId: 'br1',
  },
  {
    id: 'not4',
    type: 'new_return',
    title: 'คืนอุปกรณ์ใหม่',
    message: 'สมชาย ใจยดี คืนอุปกรณ์คอมพิวเตอร์ Acer (AC032948234) จำนวน 1 ชิ้น',
    date: '20/04/2018',
    isRead: false,
    relatedId: 'br1',
  },
  {
    id: 'not5',
    type: 'reservation',
    title: 'การจองอุปกรณ์ใหม่',
    message: 'สมชาย ใจยดี จองอุปกรณ์คอมพิวเตอร์ Acer (AC032948234) จำนวน 1 ชิ้น',
    date: '20/04/2018',
    isRead: false,
    relatedId: 'res1',
  },
];

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr1',
    equipmentId: 'eq1',
    reportedBy: 'u1',
    reportDate: '20/04/2018',
    issue: 'ไม่สามารถเปิดเครื่องได้',
    priority: 'high',
    status: 'pending',
    assignedTo: 'admin1',
    completedDate: '25/04/2018',
    cost: 500,
    notes: 'เปลี่ยนแบตเตอรี่ใหม่',
  },
  {
    id: 'mr2',
    equipmentId: 'eq2',
    reportedBy: 'u2',
    reportDate: '21/04/2018',
    issue: 'ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'admin2',
    completedDate: '26/04/2018',
    cost: 300,
    notes: 'ตรวจสอบและติดตั้งซอฟต์แวร์ใหม่',
  },
  {
    id: 'mr3',
    equipmentId: 'eq3',
    reportedBy: 'u3',
    reportDate: '22/04/2018',
    issue: 'เสียงไม่ชัดเจน',
    priority: 'low',
    status: 'completed',
    assignedTo: 'admin3',
    completedDate: '27/04/2018',
    cost: 100,
    notes: 'ทำความสะอาดและปรับเสียง',
  },
  {
    id: 'mr4',
    equipmentId: 'eq4',
    reportedBy: 'u4',
    reportDate: '23/04/2018',
    issue: 'ไม่สามารถทำงานได้',
    priority: 'urgent',
    status: 'cancelled',
    assignedTo: 'admin4',
    completedDate: '28/04/2018',
    cost: 0,
    notes: 'ยกเลิกการซ่อมแซม',
  },
  {
    id: 'mr5',
    equipmentId: 'eq5',
    reportedBy: 'u5',
    reportDate: '24/04/2018',
    issue: 'แบตเตอรี่เสื่อมสภาพ',
    priority: 'high',
    status: 'pending',
    assignedTo: 'admin5',
    completedDate: '29/04/2018',
    cost: 400,
    notes: 'เปลี่ยนแบตเตอรี่ใหม่',
  },
];

const mockWaitingList: WaitingList[] = [
  {
    id: 'wl1',
    userId: 'u1',
    equipmentId: 'eq1',
    requestDate: '20/04/2018',
    quantity: 1,
    status: 'waiting',
    notifiedDate: '25/04/2018',
    expiryDate: '30/04/2018',
  },
  {
    id: 'wl2',
    userId: 'u2',
    equipmentId: 'eq2',
    requestDate: '21/04/2018',
    quantity: 1,
    status: 'notified',
    notifiedDate: '26/04/2018',
    expiryDate: '31/04/2018',
  },
  {
    id: 'wl3',
    userId: 'u3',
    equipmentId: 'eq3',
    requestDate: '22/04/2018',
    quantity: 1,
    status: 'fulfilled',
    notifiedDate: '27/04/2018',
    expiryDate: '02/05/2018',
  },
  {
    id: 'wl4',
    userId: 'u4',
    equipmentId: 'eq4',
    requestDate: '23/04/2018',
    quantity: 3,
    status: 'cancelled',
    notifiedDate: '28/04/2018',
    expiryDate: '03/05/2018',
  },
  {
    id: 'wl5',
    userId: 'u5',
    equipmentId: 'eq5',
    requestDate: '24/04/2018',
    quantity: 1,
    status: 'waiting',
    notifiedDate: '29/04/2018',
    expiryDate: '04/05/2018',
  },
  {
    id: 'wl6',
    userId: 'u5',
    equipmentId: 'eq6',
    requestDate: '25/04/2018',
    quantity: 2,
    status: 'notified',
    notifiedDate: '30/04/2018',
    expiryDate: '05/05/2018',
  },
];

export const useBorrowStore = create<BorrowStore>((set) => ({
  equipment: mockEquipment,
  users: mockUsers,
  borrowRecords: mockBorrowRecords,
  reservations: mockReservations,
  notifications: mockNotifications,
  maintenanceRequests: mockMaintenanceRequests,
  waitingList: mockWaitingList,
  darkMode: false,
  
  addEquipment: (equipment) =>
    set((state) => ({ equipment: [...state.equipment, equipment] })),
  
  updateEquipment: (id, updatedEquipment) =>
    set((state) => ({
      equipment: state.equipment.map((eq) =>
        eq.id === id ? { ...eq, ...updatedEquipment } : eq
      ),
    })),
  
  deleteEquipment: (id) =>
    set((state) => ({
      equipment: state.equipment.filter((eq) => eq.id !== id),
    })),
  
  addUser: (user) =>
    set((state) => ({ users: [...state.users, user] })),
  
  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, ...updatedUser } : u
      ),
    })),
  
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  
  addBorrowRecord: (record) =>
    set((state) => ({ borrowRecords: [...state.borrowRecords, record] })),
  
  updateBorrowRecord: (id, updatedRecord) =>
    set((state) => ({
      borrowRecords: state.borrowRecords.map((r) =>
        r.id === id ? { ...r, ...updatedRecord } : r
      ),
    })),
  
  addReservation: (reservation) =>
    set((state) => ({ reservations: [...state.reservations, reservation] })),
  
  updateReservation: (id, updatedReservation) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, ...updatedReservation } : r
      ),
    })),
  
  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  
  updateNotification: (id, updatedNotification) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, ...updatedNotification } : n
      ),
    })),
  
  addMaintenanceRequest: (request) =>
    set((state) => ({ maintenanceRequests: [...state.maintenanceRequests, request] })),
  
  updateMaintenanceRequest: (id, request) =>
    set((state) => ({
      maintenanceRequests: state.maintenanceRequests.map((r) =>
        r.id === id ? { ...r, ...request } : r
      ),
    })),
  
  addWaitingList: (waiting) =>
    set((state) => ({ waitingList: [...state.waitingList, waiting] })),
  
  updateWaitingList: (id, waiting) =>
    set((state) => ({
      waitingList: state.waitingList.map((w) =>
        w.id === id ? { ...w, ...waiting } : w
      ),
    })),
  
  toggleDarkMode: () =>
    set((state) => ({ darkMode: !state.darkMode })),
}));