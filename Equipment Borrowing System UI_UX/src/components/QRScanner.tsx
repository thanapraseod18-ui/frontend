import { useState } from 'react';
import { QrCode, Camera, Package, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useBorrowStore } from '../store/borrowStore';

export function QRScanner() {
  const { equipment, users } = useBorrowStore();
  const [scanMode, setScanMode] = useState<'equipment' | 'user'>('equipment');
  const [selectedId, setSelectedId] = useState('');
  const [scannedData, setScannedData] = useState<any>(null);

  const handleScan = () => {
    // จำลองการสแกน QR Code
    if (scanMode === 'equipment' && selectedId) {
      const item = equipment.find(e => e.id === selectedId);
      setScannedData({ type: 'equipment', data: item });
      alert(`สแกนอุปกรณ์: ${item?.name}`);
    } else if (scanMode === 'user' && selectedId) {
      const user = users.find(u => u.id === selectedId);
      setScannedData({ type: 'user', data: user });
      alert(`สแกนผู้ใช้: ${user?.name}`);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h1 className="mb-2">ระบบ QR Code</h1>
              <p className="text-blue-100">สแกน QR Code สำหรับการยืม-คืนอุปกรณ์ได้อย่างรวดเร็ว</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-gray-800 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              สแกน QR Code
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">เลือกโหมด</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setScanMode('equipment')}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
                    scanMode === 'equipment'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  อุปกรณ์
                </button>
                <button
                  onClick={() => setScanMode('user')}
                  className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
                    scanMode === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  ผู้ใช้
                </button>
              </div>
            </div>

            {/* จำลองกล้องสแกน */}
            <div className="bg-gray-900 rounded-lg p-8 mb-4 flex items-center justify-center" style={{ height: '300px' }}>
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">กล้องสแกน QR Code</p>
                <p className="text-sm text-gray-500 mt-2">(Demo Mode)</p>
              </div>
            </div>

            {/* Demo: เลือกแทนการสแกน */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">เลือก {scanMode === 'equipment' ? 'อุปกรณ์' : 'ผู้ใช้'} เพื่อทดสอบ</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">-- เลือก --</option>
                {scanMode === 'equipment' ? (
                  equipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} - {item.name}
                    </option>
                  ))
                ) : (
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.studentId} - {user.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              onClick={handleScan}
              disabled={!selectedId}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <QrCode className="w-5 h-5 inline mr-2" />
              สแกน QR Code
            </button>

            {scannedData && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Camera className="w-5 h-5" />
                  <span>สแกนสำเร็จ!</span>
                </div>
                {scannedData.type === 'equipment' ? (
                  <div className="text-gray-700">
                    <p><strong>อุปกรณ์:</strong> {scannedData.data.name}</p>
                    <p><strong>รหัส:</strong> {scannedData.data.code}</p>
                    <p><strong>คงเหลือ:</strong> {scannedData.data.available} ชิ้น</p>
                  </div>
                ) : (
                  <div className="text-gray-700">
                    <p><strong>ผู้ใช้:</strong> {scannedData.data.name}</p>
                    <p><strong>รหัส:</strong> {scannedData.data.studentId}</p>
                    <p><strong>แผนก:</strong> {scannedData.data.department}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* QR Code Generator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-gray-800 mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              สร้าง QR Code
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">เลือก {scanMode === 'equipment' ? 'อุปกรณ์' : 'ผู้ใช้'}</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">-- เลือก --</option>
                {scanMode === 'equipment' ? (
                  equipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} - {item.name}
                    </option>
                  ))
                ) : (
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.studentId} - {user.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {selectedId && (
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block mb-4">
                  <QRCodeSVG
                    value={JSON.stringify({
                      type: scanMode,
                      id: selectedId,
                      timestamp: new Date().getTime(),
                    })}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                {scanMode === 'equipment' ? (
                  (() => {
                    const item = equipment.find(e => e.id === selectedId);
                    return (
                      <div className="text-gray-700 mb-4">
                        <p className="text-sm text-gray-500">อุปกรณ์</p>
                        <p>{item?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">รหัส: {item?.code}</p>
                      </div>
                    );
                  })()
                ) : (
                  (() => {
                    const user = users.find(u => u.id === selectedId);
                    return (
                      <div className="text-gray-700 mb-4">
                        <p className="text-sm text-gray-500">ผู้ใช้</p>
                        <p>{user?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">รหัส: {user?.studentId}</p>
                      </div>
                    );
                  })()
                )}

                <button
                  onClick={() => alert('ดาวน์โหลด QR Code')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  ดาวน์โหลด QR Code
                </button>
              </div>
            )}
          </div>
        </div>

        {/* คำแนะนำการใช้งาน */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-800 mb-4">วิธีใช้งาน QR Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600">1</span>
              </div>
              <h3 className="text-gray-800 mb-2">สร้าง QR Code</h3>
              <p className="text-gray-600 text-sm">สร้าง QR Code สำหรับอุปกรณ์หรือผู้ใช้ และพิมพ์ติดไว้</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600">2</span>
              </div>
              <h3 className="text-gray-800 mb-2">สแกนเพื่อยืม</h3>
              <p className="text-gray-600 text-sm">สแกน QR Code อุปกรณ์และผู้ใช้เพื่อบันทึกการยืม</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600">3</span>
              </div>
              <h3 className="text-gray-800 mb-2">สแกนเพื่อคืน</h3>
              <p className="text-gray-600 text-sm">สแกน QR Code เพื่อบันทึกการคืนอุปกรณ์อย่างรวดเร็ว</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
