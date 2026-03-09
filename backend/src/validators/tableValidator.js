import { z } from "zod";

export const createTableSchema = z.object({
  tableName: z
    .string({
      required_error: "Tên bàn là bắt buộc",
    })
    .min(2, "Tên bàn phải ít nhất 2 ký tự"),

  tableNumber: z.number({
    required_error: "Số bàn là bắt buộc",
  }),

  capacity: z.number({
    required_error: "Sức chứa là bắt buộc",
  }),

  area: z.string({
    required_error: "Khu vực là bắt buộc",
  }),
});

export const updateTableSchema = z.object({
  tableName: z.string().optional(),
  tableNumber: z.number().optional(),
  capacity: z.number().optional(),
  area: z.string().optional(),
});
