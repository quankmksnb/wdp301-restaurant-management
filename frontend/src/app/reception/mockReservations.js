// Mock reservation data for testing timeline display
// Will be replaced with real backend API calls later

const today = new Date();
const yyyy = today.getFullYear();
const mm = today.getMonth();
const dd = today.getDate();

const mockReservations = [
  {
    _id: "res001",
    customerName: "Nguyễn Văn A",
    phone: "0912345678",
    tableId: "table_vip1",
    tableName: "Phòng VIP 1",
    startTime: new Date(yyyy, mm, dd, 10, 0),
    endTime: new Date(yyyy, mm, dd, 12, 0),
    guests: { adults: 4, children: 1 },
    status: "confirmed", // Đã xếp bàn
    deposit: 500000,
    note: "Tiệc sinh nhật",
  },
  {
    _id: "res002",
    customerName: "Trần Thị B",
    phone: "0987654321",
    tableId: "table_vip3",
    tableName: "Phòng VIP 3",
    startTime: new Date(yyyy, mm, dd, 11, 30),
    endTime: new Date(yyyy, mm, dd, 13, 30),
    guests: { adults: 6, children: 0 },
    status: "seated", // Đã nhận bàn
    deposit: 0,
    note: "",
  },
  {
    _id: "res003",
    customerName: "Lê Văn C",
    phone: "0909123456",
    tableId: "table_vip5",
    tableName: "Phòng VIP 5",
    startTime: new Date(yyyy, mm, dd, 7, 0),
    endTime: new Date(yyyy, mm, dd, 8, 30),
    guests: { adults: 2, children: 0 },
    status: "no_show", // Quá giờ / Không đến
    deposit: 200000,
    note: "",
  },
  {
    _id: "res004",
    customerName: "Phạm Thị D",
    phone: "0922334455",
    tableId: "table2",
    tableName: "Bàn 2",
    startTime: new Date(yyyy, mm, dd, 12, 0),
    endTime: new Date(yyyy, mm, dd, 14, 0),
    guests: { adults: 3, children: 2 },
    status: "confirmed",
    deposit: 300000,
    note: "Kỷ niệm ngày cưới",
  },
  {
    _id: "res005",
    customerName: "Hoàng Văn E",
    phone: "0933445566",
    tableId: "table5",
    tableName: "Bàn 5",
    startTime: new Date(yyyy, mm, dd, 18, 0),
    endTime: new Date(yyyy, mm, dd, 20, 0),
    guests: { adults: 8, children: 3 },
    status: "confirmed",
    deposit: 1000000,
    note: "Tiệc công ty",
  },
  {
    _id: "res006",
    customerName: "Đỗ Thị F",
    phone: "0944556677",
    tableId: "table_vip8",
    tableName: "Phòng VIP 8",
    startTime: new Date(yyyy, mm, dd, 6, 0),
    endTime: new Date(yyyy, mm, dd, 7, 30),
    guests: { adults: 2, children: 0 },
    status: "cancelled", // Đã hủy
    deposit: 0,
    note: "Khách hủy vì lý do cá nhân",
  },
];

export default mockReservations;
