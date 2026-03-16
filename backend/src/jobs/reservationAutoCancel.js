import cron from "node-cron";
import Reservation from "../models/Reservation.js";

/**
 * Job tự động hủy đặt bàn:
 * Quét mỗi 5 phút, tìm các reservation có status "confirmed"
 * mà reservationDateTime đã quá 30 phút → cập nhật thành "cancelled"
 * với lý do "Quá giờ 30 phút không nhận bàn"
 */
export function startReservationAutoCancelJob() {
  // Chạy mỗi 5 phút: */5 * * * *
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

      const result = await Reservation.updateMany(
        {
          status: "confirmed",
          reservationDateTime: { $lte: thirtyMinutesAgo },
        },
        {
          $set: {
            status: "cancelled",
            cancellationReason: "Quá giờ 30 phút không nhận bàn - Tự động hủy",
          },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `⏰ [Auto-Cancel] Đã tự động hủy ${result.modifiedCount} đặt bàn quá giờ`
        );
      }
    } catch (error) {
      console.error("❌ [Auto-Cancel] Lỗi khi chạy job:", error.message);
    }
  });

  console.log("✅ [Auto-Cancel] Job tự động hủy đặt bàn đã khởi động (mỗi 5 phút)");
}
