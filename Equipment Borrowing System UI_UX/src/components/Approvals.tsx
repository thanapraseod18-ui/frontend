import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Check,
} from "lucide-react";
import { useBorrowStore } from "../store/borrowStore";

export function Approvals() {
  const {
    borrowRecords,
    equipment,
    users,
    updateBorrowRecord,
    updateEquipment,
    addNotification,
  } = useBorrowStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedRecords, setSelectedRecords] = useState<
    string[]
  >([]);

  const pendingBorrows = borrowRecords.filter((record) =>
    filterStatus === "all"
      ? record.status === "pending" ||
        record.status === "approved" ||
        record.status === "rejected"
      : record.status === filterStatus,
  );

  const filteredBorrows = pendingBorrows.filter((record) => {
    const user = users.find((u) => u.id === record.userId);
    const item = equipment.find(
      (e) => e.id === record.equipmentId,
    );
    return (
      user?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user?.studentId.includes(searchTerm) ||
      item?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const handleApprove = (recordId: string) => {
    const record = borrowRecords.find((r) => r.id === recordId);
    if (!record) return;

    const item = equipment.find(
      (e) => e.id === record.equipmentId,
    );
    if (!item || item.available < record.quantity) {
      alert("อุปกรณ์ไม่เพียงพอสำหรับการอนุมัติ");
      return;
    }

    if (confirm("ยืนยันการอนุมัติการยืม?")) {
      updateBorrowRecord(recordId, {
        status: "approved",
        approvedBy: "ADMIN",
        approvedDate: new Date().toLocaleDateString("th-TH"),
      });

      updateEquipment(record.equipmentId, {
        available: item.available - record.quantity,
      });

      // เพิ่มการแจ้งเตือน
      const user = users.find((u) => u.id === record.userId);
      addNotification({
        id: "not" + Date.now(),
        type: "new_borrow",
        title: "อนุมัติการยืมแล้ว",
        message: `อนุมัติการยืม ${item?.name} ให้กับ ${user?.name} เรียบร้อยแล้ว`,
        date: new Date().toLocaleDateString("th-TH"),
        isRead: false,
        relatedId: recordId,
      });

      alert("อนุมัติการยืมเรียบร้อยแล้ว");
    }
  };

  const handleReject = (recordId: string) => {
    if (confirm("ยืนยันการปฏิเสธการยืม?")) {
      updateBorrowRecord(recordId, {
        status: "rejected",
        approvedBy: "ADMIN",
        approvedDate: new Date().toLocaleDateString("th-TH"),
      });

      alert("ปฏิเสธการยืมเรียบร้อยแล้ว");
    }
  };

  const handleSelectRecord = (recordId: string) => {
    if (selectedRecords.includes(recordId)) {
      setSelectedRecords(
        selectedRecords.filter((id) => id !== recordId),
      );
    } else {
      setSelectedRecords([...selectedRecords, recordId]);
    }
  };

  const handleApproveSelected = () => {
    selectedRecords.forEach((recordId) =>
      handleApprove(recordId),
    );
    setSelectedRecords([]);
  };

  const handleRejectSelected = () => {
    if (selectedRecords.length === 0) {
      alert("กรุณาเลือกรายการที่ต้องการปฏิเสธ");
      return;
    }
    if (
      confirm(
        `ยืนยันการปฏิเสธ ${selectedRecords.length} รายการ?`,
      )
    ) {
      selectedRecords.forEach((recordId) => {
        updateBorrowRecord(recordId, {
          status: "rejected",
          approvedBy: "ADMIN",
          approvedDate: new Date().toLocaleDateString("th-TH"),
        });
      });
      setSelectedRecords([]);
      alert("ปฏิเสธการยืมเรียบร้อยแล้ว");
    }
  };

  const handleSelectAll = () => {
    const pendingRecords = filteredBorrows
      .filter((r) => r.status === "pending")
      .map((r) => r.id);
    if (selectedRecords.length === pendingRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(pendingRecords);
    }
  };

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-800 dark:text-white">
                อนุมัติการยืม-คืน
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                รายการที่รออนุมัติจากผู้ดูแลระบบ
              </p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 rounded-lg">
                <span>
                  รออนุมัติ:{" "}
                  {
                    borrowRecords.filter(
                      (r) => r.status === "pending",
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>

          {selectedRecords.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-400">
                เลือก {selectedRecords.length} รายการ
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleApproveSelected}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  อนุมัติทั้งหมด
                </button>
                <button
                  onClick={handleRejectSelected}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4" />
                  ปฏิเสธทั้งหมด
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">กรอง:</span>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as any)
                }
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="all">ทั้งหมด</option>
                <option value="pending">รออนุมัติ</option>
                <option value="approved">อนุมัติแล้ว</option>
                <option value="rejected">ปฏิเสธ</option>
              </select>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">ค้นหา:</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="ค้นหา..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedRecords.length ===
                        filteredBorrows.filter(
                          (r) => r.status === "pending",
                        ).length &&
                      filteredBorrows.filter(
                        (r) => r.status === "pending",
                      ).length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  รหัสสมาชิก
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  ชื่อผู้ยืม
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  อุปกรณ์
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  จำนวน
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  วันที่ยืม
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  กำหนดคืน
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-gray-600 dark:text-gray-300">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    ไม่พบรายการที่รออนุมัติ
                  </td>
                </tr>
              ) : (
                filteredBorrows.map((record) => {
                  const user = users.find(
                    (u) => u.id === record.userId,
                  );
                  const item = equipment.find(
                    (e) => e.id === record.equipmentId,
                  );

                  return (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        {record.status === "pending" && (
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(
                              record.id,
                            )}
                            onChange={() =>
                              handleSelectRecord(record.id)
                            }
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {user?.studentId}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {user?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {item?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {record.quantity}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {record.borrowDate}
                      </td>
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                        {record.dueDate}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            record.status === "pending"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40"
                              : record.status === "approved"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40"
                                : "bg-red-100 text-red-700 dark:bg-red-900/40"
                          }`}
                        >
                          {record.status === "pending"
                            ? "รออนุมัติ"
                            : record.status === "approved"
                              ? "อนุมัติแล้ว"
                              : "ปฏิเสธ"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {record.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleApprove(record.id)
                              }
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                              อนุมัติ
                            </button>
                            <button
                              onClick={() =>
                                handleReject(record.id)
                              }
                              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                              ปฏิเสธ
                            </button>
                          </div>
                        )}
                        {record.status === "approved" && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            อนุมัติโดย {record.approvedBy}
                          </span>
                        )}
                        {record.status === "rejected" && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            ปฏิเสธโดย {record.approvedBy}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            แสดง {filteredBorrows.length} รายการ
          </p>
        </div>
      </div>
    </div>
  );
}