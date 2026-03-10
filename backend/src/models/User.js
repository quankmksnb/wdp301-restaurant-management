import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["receptionist", "waiter", "manager", "kitchenStaff"],
      required: true,
    },
    phone: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // Employee extended fields
    idNumber: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ["Nam", "Nữ", ""] },
    startDate: { type: Date },
    facebook: { type: String },
    address: { type: String },
    city: { type: String },
    notes: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema, "users");
