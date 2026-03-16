import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";

//Lấy danh sách tableId đang bị reservation giữ

export const getReservedTableIds = async (reservationDateTime) => {
  const startOfDay = new Date(reservationDateTime);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(reservationDateTime);
  endOfDay.setHours(23, 59, 59, 999);

  const reservations = await Reservation.find({
    status: { $in: ["confirmed", "seated"] },
    reservationDateTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).select("tables");

  return reservations.flatMap((r) =>
    r.tables.map((tableId) => tableId.toString()),
  );
};

// Lấy danh sách bàn đang available

export const getAvailableTables = async (reservationDateTime) => {
  const reservedTableIds = await getReservedTableIds(reservationDateTime);

  const tables = await Table.find({
    _id: { $nin: reservedTableIds },
    tableStatus: "active",
  })
    .populate("area", "areaName")
    .sort({ tableNumber: 1 });

  return tables;
};

// Validate danh sách bàn có hợp lệ để đặt không

export const validateTablesForReservation = async (tableIds) => {
  const reservedTableIds = await getReservedTableIds();

  // check bàn đã bị đặt
  const reserved = tableIds.filter((id) =>
    reservedTableIds.includes(id.toString()),
  );

  if (reserved.length > 0) {
    return {
      valid: false,
      message: "Một hoặc nhiều bàn đã được đặt",
      tables: reserved,
    };
  }

  // check bàn tồn tại và active
  const tables = await Table.find({
    _id: { $in: tableIds },
    tableStatus: "active",
  });

  if (tables.length !== tableIds.length) {
    return {
      valid: false,
      message: "Một hoặc nhiều bàn không tồn tại hoặc đã ngừng hoạt động",
    };
  }

  return { valid: true };
};
