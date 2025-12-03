import { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useBorrowStore, BorrowRecord } from '../store/borrowStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptModalProps {
  recordId: string;
  onClose: () => void;
}

export function ReceiptModal({ recordId, onClose }: ReceiptModalProps) {
  const { borrowRecords, equipment, users } = useBorrowStore();
  const receiptRef = useRef<HTMLDivElement>(null);

  const record = borrowRecords.find((r) => r.id === recordId);
  const user = users.find((u) => u.id === record?.userId);
  const item = equipment.find((e) => e.id === record?.equipmentId);

  if (!record || !user || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt-${record.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('ไม่สามารถสร้าง PDF ได้');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
          <h2 className="text-gray-800">ใบเสร็จการยืม-คืนอุปกรณ์</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              ดาวน์โหลด PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Printer className="w-4 h-4" />
              พิมพ์
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div ref={receiptRef} className="p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">B</span>
              </div>
              <div className="text-left">
                <h1 className="text-gray-900 mb-1">ระบบยืม-คืนอุปกรณ์</h1>
                <p className="text-gray-600">Borrow System Management</p>
              </div>
            </div>
            <p className="text-gray-600">123 ถนนพระราม 4 เขตปทุมวัน กรุงเทพฯ 10330</p>
            <p className="text-gray-600">โทร: 02-123-4567 | อีเมล: info@borrowsystem.com</p>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-6">
            <h2 className="text-gray-900 mb-2">
              {record.returnDate ? 'ใบเสร็จการคืนอุปกรณ์' : 'ใบเสร็จการยืมอุปกรณ์'}
            </h2>
            <p className="text-gray-600">เลขที่: {record.id}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Left Column - User Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-gray-800 mb-3 border-b border-blue-200 pb-2">ข้อมูลผู้ยืม</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">รหัสสมาชิก:</span>
                  <span className="text-gray-800">{user.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ชื่อ-นามสกุล:</span>
                  <span className="text-gray-800">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">แผนก/คณะ:</span>
                  <span className="text-gray-800">{user.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เบอร์โทร:</span>
                  <span className="text-gray-800">{user.phone}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Equipment Info */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-gray-800 mb-3 border-b border-green-200 pb-2">ข้อมูลอุปกรณ์</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">รหัสอุปกรณ์:</span>
                  <span className="text-gray-800">{item.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ชื่ออุปกรณ์:</span>
                  <span className="text-gray-800">{item.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serial Number:</span>
                  <span className="text-gray-800">{item.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">หมวดหมู่:</span>
                  <span className="text-gray-800">{item.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-gray-800 mb-3 border-b border-gray-200 pb-2">รายละเอียดการยืม-คืน</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">จำนวน:</span>
                <span className="text-gray-800">{record.quantity} ชิ้น</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">สถานะ:</span>
                <span className={`px-2 py-1 rounded ${
                  record.status === 'borrowed' ? 'bg-orange-100 text-orange-700' :
                  record.status === 'returned' ? 'bg-green-100 text-green-700' :
                  record.status === 'overdue' ? 'bg-red-100 text-red-700' :
                  record.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {record.status === 'borrowed' ? 'กำลังยืม' :
                   record.status === 'returned' ? 'คืนแล้ว' :
                   record.status === 'overdue' ? 'เกินกำหนด' :
                   record.status === 'approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">วันที่ยืม:</span>
                <span className="text-gray-800">{record.borrowDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">กำหนดคืน:</span>
                <span className="text-gray-800">{record.dueDate}</span>
              </div>
              {record.returnDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">วันที่คืน:</span>
                  <span className="text-gray-800">{record.returnDate}</span>
                </div>
              )}
              {record.renewalCount && record.renewalCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนครั้งที่ต่ออายุ:</span>
                  <span className="text-gray-800">{record.renewalCount} ครั้ง</span>
                </div>
              )}
              {record.notes && (
                <div className="col-span-2 flex justify-between">
                  <span className="text-gray-600">หมายเหตุ:</span>
                  <span className="text-gray-800">{record.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 border-2 border-gray-300 rounded-lg">
              <QRCodeSVG
                value={JSON.stringify({
                  type: 'borrow_record',
                  id: record.id,
                  userId: user.id,
                  equipmentId: item.id,
                })}
                size={120}
                level="H"
                includeMargin={false}
              />
              <p className="text-xs text-gray-500 text-center mt-2">Ref: {record.id}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-6">
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-16">
                  <p className="text-gray-700">ลายเซ็นผู้ยืม</p>
                  <p className="text-gray-500 text-sm">({user.name})</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 pt-2 mt-16">
                  <p className="text-gray-700">ลายเซ็นผู้อนุมัติ</p>
                  <p className="text-gray-500 text-sm">(เจ้าหน้าที่)</p>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
              <p>พิมพ์เมื่อ: {new Date().toLocaleDateString('th-TH')} {new Date().toLocaleTimeString('th-TH')}</p>
              <p className="mt-1">เอกสารนี้ออกโดยระบบอัตโนมัติ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
