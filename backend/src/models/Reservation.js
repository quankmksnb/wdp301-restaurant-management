import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // Thời gian
    reservationDateTime: {
      type: Date,
      required: [true, "Reservation time is required"],
    },

    // Thời gian khách vào bàn
    checkInTime: { type: Date },
    // Thời gian khách rời đi
    checkOutTime: { type: Date },

    // Số lương khách
    numberOfGuests: {
      type: Number,
      required: [true, "The number of guests is required"],
      min: [1, "The number of guests must be at least 1"],
    },

    // Trạng thái
    status: {
      type: String,
      enum: [
        "confirmed", // Đã xác nhận/Đã giữ chỗ
        "seated", // Khách đã ngồi vào bàn - nhận bàn
        "no_show", // Khách không đến (quá giờ)
        "completed", // Đã thanh toán & rời đi
        "cancelled", // Đã hủy (bởi khách hoặc hệ thống)
      ],
      default: "confirmed",
    },

    // Lý do bị hủy
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },

    // Khách hàng
    customer: {
      customer: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // Mảng chứa danh sách các bàn (1 reservation có thể đặt nhiều bàn)
    tables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true,
      },
    ],

    // Nhân viên thực hiện thao tác (tạo/cập nhật đơn)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Ghi chú thêm (ví dụ: khách muốn trang trí sinh nhật)
    note: { type: String, trim: true },
  },
  { timestamps: true },
);

// INDEX 1:
// Kiểm tra xem bàn cụ thể có bị trùng lịch trong một khoảng thời gian hay không.
// Ví dụ truy vấn:
/*
  const checkTableBusy = await Reservation.find({
    tables: { $in: [ObjectId('ID_BAN_A'), ObjectId('ID_BAN_B')] },
    reservationDateTime: { 
      $gte: new Date('2023-10-27T18:00:00'), 
      $lte: new Date('2023-10-27T20:00:00') 
    },
    status: { $in: ['confirmed', 'seated'] }
  });
*/
reservationSchema.index({ tables: 1, reservationDateTime: 1, status: 1 });

// INDEX 2: { status: 1, reservationDateTime: 1 }
// Hiển thị danh sách vận hành tại nhà hàng theo thời gian thực.
// Ví dụ truy vấn: "Lấy tất cả các khách đã xác nhận sẽ đến trong ngày hôm nay để chuẩn bị bàn"
/*
  const todaysArrivals = await Reservation.find({
    status: 'confirmed',
    reservationDateTime: {
      $gte: new Date('2023-10-27T00:00:00'),
      $lte: new Date('2023-10-27T23:59:59')
    }
  }).sort({ reservationDateTime: 1 });
*/
reservationSchema.index({ status: 1, reservationDateTime: 1 });

export default mongoose.model("Reservation", reservationSchema);
