import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running with ES Modules 🚀");
});

// Routes
app.use("/api/employees", employeeRoutes);

export default app;