import api from "./api";

export const loginUser = (data) => {
  return api.post("/users/login", data);
};

export const sendOtp = (data) => {
  return api.post("/users/send-otp", data);
};

export const verifyOtp = (data) => {
  return api.post("/users/verify-otp", data);
};

export const resetPassword = (data) => {
  return api.post("/users/reset-password", data);
};