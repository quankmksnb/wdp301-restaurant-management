import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import app from "./app.js";
import connectDB from "./configs/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
