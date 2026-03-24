import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";

//Lấy danh sách tableId đang bị reservation giữ

export const getReservedTableIds = async (reservationDateTime, excludeReservationId = null) => {
  const startOfDay = new Date(reservationDateTime);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(reservationDateTime);
  endOfDay.setHours(23, 59, 59, 999);

  const query = {
    status: { $in: ["confirmed", "seated"] },
    reservationDateTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  };

  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const reservations = await Reservation.find(query).select("tables");

  return reservations.flatMap((r) =>
    r.tables.map((tableId) => tableId.toString()),
  );
};

// Lấy danh sách bàn đang available

export const getAvailableTables = async (reservationDateTime, excludeReservationId = null) => {
  const reservedTableIds = await getReservedTableIds(reservationDateTime, excludeReservationId);

  const tables = await Table.find({
    _id: { $nin: reservedTableIds },
    tableStatus: "active",
  })
    .populate("area", "areaName")
    .sort({ tableNumber: 1 });

  return tables;
};

// Validate danh sách bàn có hợp lệ để đặt không

export const validateTablesForReservation = async (tableIds, reservationDateTime, excludeReservationId = null) => {
  const reservedTableIds = await getReservedTableIds(reservationDateTime, excludeReservationId);

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
