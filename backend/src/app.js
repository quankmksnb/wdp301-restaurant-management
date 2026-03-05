import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

// Sử dụng routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API is running with ES Modules 🚀");
});

export default app;
