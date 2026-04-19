import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

// Initialize exporters
import "./services/exporters/employeeExporter.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "https://rms.name.vn", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép requests không có origin (như Postman hoặc mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API is running with ES Modules 🚀");
});

export default app;
