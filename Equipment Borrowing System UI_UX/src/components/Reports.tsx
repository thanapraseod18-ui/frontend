import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { useBorrowStore } from '../store/borrowStore';

export function Reports() {
  const { equipment, borrowRecords, users } = useBorrowStore();

  // สถิติการยืมตามหมวดหมู่
  const categoryStats = equipment.reduce((acc, item) => {
    const borrowCount = borrowRecords.filter((r) => r.equipmentId === item.id).length;
    const existing = acc.find((stat) => stat.category === item.category);
    
    if (existing) {
      existing.count += borrowCount;
    } else {
      acc.push({ category: item.category, count: borrowCount });
    }
    
    return acc;
  }, [] as { category: string; count: number }[]);

  // สถิติการยืมรายเดือน (mock data)
  const monthlyStats = [
    { month: 'ม.ค.', borrowed: 45, returned: 40 },
    { month: 'ก.พ.', borrowed: 52, returned: 48 },
    { month: 'มี.ค.', borrowed: 61, returned: 55 },
    { month: 'เม.ย.', borrowed: 58, returned: 52 },
    { month: 'พ.ค.', borrowed: 65, returned: 60 },
    { month: 'มิ.ย.', borrowed: 70, returned: 65 },
  ];

  // สถิติสถานะการยืม
  const statusStats = [
    { name: 'กำลังยืม', value: borrowRecords.filter(r => r.status === 'borrowed').length },
    { name: 'คืนแล้ว', value: borrowRecords.filter(r => r.status === 'returned').length },
    { name: 'เกินกำหนด', value: borrowRecords.filter(r => r.status === 'overdue').length },
  ];

  const COLORS = ['#f59e0b', '#10b981', '#ef4444'];

  // อุปกรณ์ที่ยืมบ่อยที่สุด
  const topEquipment = equipment
    .map((item) => ({
      ...item,
      borrowCount: borrowRecords.filter((r) => r.equipmentId === item.id).length,
    }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-800 mb-2">รายงานและสถิติ</h1>
            <p className="text-gray-600">ข้อมูลสถิติการยืม-คืนอุปกรณ์</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            ส่งออกรายงาน
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">ยืมทั้งหมด</p>
              <p className="text-gray-800">{borrowRecords.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">ยืมเดือนนี้</p>
              <p className="text-gray-800">70</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500">อัตราการคืนตรงเวลา</p>
              <p className="text-gray-800">92.5%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-800 mb-4">สถิติการยืมรายเดือน</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrowed" fill="#3b82f6" name="ยืม" />
              <Bar dataKey="returned" fill="#10b981" name="คืน" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-800 mb-4">สถานะการยืม</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-800 mb-4">อุปกรณ์ที่ยืมบ่อยที่สุด</h2>
          <div className="space-y-4">
            {topEquipment.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{item.name}</p>
                  <p className="text-gray-500 text-sm">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-800">{item.borrowCount} ครั้ง</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-800 mb-4">การยืมตามหมวดหมู่</h2>
          <div className="space-y-4">
            {categoryStats.map((stat, index) => {
              const total = categoryStats.reduce((sum, s) => sum + s.count, 0);
              const percentage = total > 0 ? (stat.count / total) * 100 : 0;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{stat.category}</span>
                    <span className="text-gray-600">{stat.count} ครั้ง</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
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
