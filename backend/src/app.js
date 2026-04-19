import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

// Initialize exporters
import "./services/exporters/employeeExporter.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API is running with ES Modules 🚀");
});

export default app;
