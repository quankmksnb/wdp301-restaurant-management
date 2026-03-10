import { z } from "zod";

export const createAreaSchema = z.object({
  areaName: z
    .string({
      required_error: "Tên khu vực là bắt buộc",
      invalid_type_error: "Tên khu vực phải là chuỗi",
    })
    .min(2, "Tên khu vực phải có ít nhất 2 ký tự")
    .max(100, "Tên khu vực tối đa 100 ký tự"),

  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
});

export const updateAreaSchema = z.object({
  areaName: z
    .string()
    .min(2, "Tên khu vực phải có ít nhất 2 ký tự")
    .max(100, "Tên khu vực tối đa 100 ký tự")
    .optional(),

  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
});
