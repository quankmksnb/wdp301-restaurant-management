import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/wdp";

mongoose.connect(uri)
    .then(() => {
        console.log("Connected to MongoDB for querying users.");
        const db = mongoose.connection.db;
        db.collection("users").find({ role: "manager" }).toArray().then(users => {
            console.log("Found managers:");
            users.forEach(u => console.log(`- ${u.email}`));
            mongoose.disconnect();
        });
    })
    .catch(err => console.error(err));
