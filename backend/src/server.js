import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { createServer } from "http";
import app from "./app.js";
import connectDB from "./configs/db.js";
import { startReservationAutoCancelJob } from "./jobs/reservationAutoCancel.js";
import { initSocket } from "./configs/socket.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

await connectDB();

const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Khởi động job tự động hủy đặt bàn quá giờ
startReservationAutoCancelJob();
