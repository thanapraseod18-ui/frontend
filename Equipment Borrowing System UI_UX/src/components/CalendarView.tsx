import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Package, User } from 'lucide-react';
import { useBorrowStore } from '../store/borrowStore';

export function CalendarView() {
  const { borrowRecords, equipment, users, reservations } = useBorrowStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(year, month, day).toLocaleDateString('th-TH');
    
    const borrows = borrowRecords.filter(r => 
      r.borrowDate === dateStr || r.dueDate === dateStr || r.returnDate === dateStr
    );
    
    const reserves = reservations.filter(r => 
      r.startDate === dateStr || r.endDate === dateStr
    );

    return { borrows, reserves };
  };

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate.getDate()) : null;

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800 rounded-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <h1 className="mb-2">ปฏิทินการยืม-คืน</h1>
              <p className="text-blue-100">ดูตารางเวลาการยืม-คืนและการจองอุปกรณ์</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h2 className="text-gray-800 dark:text-white">
                {monthNames[month]} {year + 543}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const { borrows, reserves } = getEventsForDate(day);
                const hasEvents = borrows.length > 0 || reserves.length > 0;
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === month && 
                               new Date().getFullYear() === year;
                const isSelected = selectedDate?.getDate() === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                      isToday 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : hasEvents
                        ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-1">{day}</div>
                    {hasEvents && (
                      <div className="space-y-1">
                        {borrows.length > 0 && (
                          <div className="w-full h-1 bg-blue-500 rounded"></div>
                        )}
                        {reserves.length > 0 && (
                          <div className="w-full h-1 bg-purple-500 rounded"></div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">การยืม-คืน</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">การจอง</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">วันนี้</span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-gray-800 dark:text-white mb-4">
              {selectedDate ? (
                <>รายการวันที่ {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}</>
              ) : (
                <>เลือกวันที่เพื่อดูรายละเอียด</>
              )}
            </h3>

            {selectedDateEvents ? (
              <div className="space-y-4">
                {selectedDateEvents.borrows.length === 0 && selectedDateEvents.reserves.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    ไม่มีกิจกรรมในวันนี้
                  </p>
                ) : (
                  <>
                    {selectedDateEvents.borrows.length > 0 && (
                      <div>
                        <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          การยืม-คืน ({selectedDateEvents.borrows.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedDateEvents.borrows.map((record) => {
                            const user = users.find(u => u.id === record.userId);
                            const item = equipment.find(e => e.id === record.equipmentId);
                            
                            return (
                              <div key={record.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{item?.name}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{user?.name}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    record.status === 'borrowed' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40' :
                                    record.status === 'returned' ? 'bg-green-100 text-green-700 dark:bg-green-900/40' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-700'
                                  }`}>
                                    {record.status === 'borrowed' ? 'ยืม' :
                                     record.status === 'returned' ? 'คืน' : record.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {record.borrowDate} - {record.dueDate}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedDateEvents.reserves.length > 0 && (
                      <div>
                        <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          การจอง ({selectedDateEvents.reserves.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedDateEvents.reserves.map((reservation) => {
                            const user = users.find(u => u.id === reservation.userId);
                            const item = equipment.find(e => e.id === reservation.equipmentId);
                            
                            return (
                              <div key={reservation.id} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{item?.name}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{user?.name}</p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    reservation.status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40' :
                                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-700'
                                  }`}>
                                    {reservation.status === 'pending' ? 'รอยืนยัน' :
                                     reservation.status === 'confirmed' ? 'ยืนยันแล้ว' : reservation.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {reservation.startDate} - {reservation.endDate}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">คลิกที่วันในปฏิทินเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 dark:text-gray-400 mb-2">การยืมในเดือนนี้</h3>
            <p className="text-3xl text-blue-600 dark:text-blue-400">
              {borrowRecords.filter(r => {
                const date = new Date(r.borrowDate);
                return date.getMonth() === month && date.getFullYear() === year;
              }).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 dark:text-gray-400 mb-2">การจองในเดือนนี้</h3>
            <p className="text-3xl text-purple-600 dark:text-purple-400">
              {reservations.filter(r => {
                const date = new Date(r.startDate);
                return date.getMonth() === month && date.getFullYear() === year;
              }).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 dark:text-gray-400 mb-2">อุปกรณ์ว่างพร้อมใช้</h3>
            <p className="text-3xl text-green-600 dark:text-green-400">
              {equipment.filter(e => e.available > 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
