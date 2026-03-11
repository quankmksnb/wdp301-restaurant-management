import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.routes.js";
import exportRoutes from "./routes/export.routes.js";
import routes from "./routes/index.js";

// Initialize exporters (self-register with exportService)
import "./services/exporters/employeeExporter.js";


const app = express();

app.use(cors());
app.use(express.json());

// Sử dụng routes
app.use("/api", routes);

app.use("/uploads", express.static("uploads")); // Cho phép truy cập file trong thư mục uploads

app.get("/", (req, res) => {
  res.send("API is running with ES Modules 🚀");
});

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/export", exportRoutes);

export default app;
