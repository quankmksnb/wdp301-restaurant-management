import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  phone: String,
});

export default mongoose.model("User", userSchema, "users");
