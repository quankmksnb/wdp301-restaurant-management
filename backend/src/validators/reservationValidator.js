import { z } from "zod";

export const createReservationSchema = z.object({
  reservationDateTime: z.string({
    required_error: "Thời gian đặt bàn là bắt buộc",
  }),

  numberOfGuests: z
    .number({
      required_error: "Số lượng khách là bắt buộc",
    })
    .min(1, "Số khách phải ít nhất 1"),

  tables: z.array(z.string()).min(1, "Phải chọn ít nhất 1 bàn"),

  customer: z.object({
    customer: z.string({
      required_error: "Tên khách hàng là bắt buộc",
    }),
    phone: z.string({
      required_error: "Số điện thoại là bắt buộc",
    }),
  }),

  note: z.string().max(500).optional(),
});

const sameItems = z.object({
  menuItem: z.string(),
  quantity: z.number().min(1),
  note: z.string().optional(),
});

const separateItems = z.object({
  table: z.string(),
  items: z.array(sameItems).min(1),
});

export const preOrderReservationSchema = z.object({
  reservationDateTime: z.string(),
  numberOfGuests: z.number().min(1),
  tables: z.array(z.string()).min(1),
  orderMode: z.enum(["same", "separate"]),
  items: z.array(z.union([sameItems, separateItems])).min(1),
  customer: z.object({
    customer: z.string(),
    phone: z.string(),
  }),
  note: z.string().optional(),
});
