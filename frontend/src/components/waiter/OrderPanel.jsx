"use client";

import { useState } from "react";
import PaymentModal from "./PaymentModal";
import {
  Bell,
  Edit2,
  Minus,
  Plus,
  Utensils,
  Search,
  ShoppingCart,
  Trash2,
  User,
  History,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  DollarSign,
} from "lucide-react";
import TooltipIcon from "@/components/auth/TooltipIcon";
import GuestModal from "./GuestModel";
import NoteModal from "./NoteModal";

export default function OrderPanel({
  selTable,
  floorLabel,
  cart,
  orderId,
  inc,
  dec,
  removeItem,
  fmt,
  total,
  kitchenDone,
  onSendToKitchen,
  onRefreshCart,
}) {
  const [priceSort, setPriceSort] = useState("asc");
  const [openPay, setOpenPay] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [openGuest, setOpenGuest] = useState(false);
  const [note, setNote] = useState("");
  const [openNote, setOpenNote] = useState(false);
  const [sendingKitchen, setSendingKitchen] = useState(false);

  // ✅ Filter items có id hợp lệ (loại cancelled)
  const validCart = cart.filter(
    (item) => item?.id && item.qty > 0 && item.status !== "cancelled",
  );

  const sortedCart = [...validCart].sort((a, b) =>
    priceSort === "asc" ? a.price - b.price : b.price - a.price,
  );

  const handleSendToKitchen = async () => {
    if (!onSendToKitchen) return;
    setSendingKitchen(true);
    try {
      await onSendToKitchen();
    } finally {
      setSendingKitchen(false);
    }
  };

  const handleClosePay = () => {
    setOpenPay(false);
    onRefreshCart?.();
  };

  const statusConfig = {
    "pre-order": {
      label: "Đặt trước",
      bg: "bg-amber-100",
      text: "text-amber-700",
    },
    pending: { label: "Chờ", bg: "bg-yellow-100", text: "text-yellow-600" },
    order_sent: {
      label: "Đã báo bếp",
      bg: "bg-cyan-100",
      text: "text-cyan-600",
    },
    preparing: { label: "Đang làm", bg: "bg-blue-100", text: "text-blue-600" },
    ready: { label: "Đã xong", bg: "bg-purple-100", text: "text-purple-600" },
    served: { label: "Đã phục vụ", bg: "bg-green-100", text: "text-green-600" },
    out_of_stock: { label: "Hết hàng", bg: "bg-red-100", text: "text-red-600" },
  };

  const validStatuses = [
    "pre-order",
    "pending",
    "order_sent",
    "preparing",
    "ready",
    "served",
    "out_of_stock",
  ];

  return (
    <div className="flex-1 bg-white border-l border-slate-200 flex flex-col min-w-0">
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-200 flex items-center gap-2">
        <Utensils size={15} />
        <span className="font-bold text-[13px] text-slate-800 whitespace-nowrap">
          {selTable
            ? `${selTable.tableName ?? selTable.name} / ${floorLabel || ""}`
            : "Chọn bàn"}
        </span>

        <div className="flex-1 flex items-center gap-1"></div>

        <TooltipIcon
          label="Giá"
          onClick={() => setPriceSort(priceSort === "asc" ? "desc" : "asc")}
        >
          {priceSort === "asc" ? (
            <ArrowUp size={13} />
          ) : (
            <ArrowDown size={13} />
          )}
        </TooltipIcon>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto">
        {validCart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pb-10 text-slate-400">
            <ShoppingCart size={42} className="mb-3 text-blue-300" />
            <div className="text-[13px] font-semibold text-slate-500 mb-1">
              Chưa có món trong đơn
            </div>
          </div>
        ) : (
          sortedCart.map((item, idx) => {
            // ✅ Chỉ hiển thị những status có trong validStatuses
            if (!validStatuses.includes(item.status)) {
              return null;
            }

            // ✅ isDone: preparing, ready, served (không bao gồm pre-order, out_of_stock)
            const isDone =
              kitchenDone.includes(item.id) ||
              item.status === "preparing" ||
              item.status === "ready" ||
              item.status === "served";

            const status = statusConfig[item.status];

            return (
              <div
                key={item.id}
                className={`flex items-center px-3 py-2 border-b border-slate-100 gap-1
                  transition hover:bg-slate-50 ${isDone ? "bg-green-50" : ""}`}
              >
                <span className="text-blue-500 font-semibold min-w-[18px] text-[13px]">
                  {idx + 1}.
                </span>

                <div className="flex-1 min-w-0">
                  <div
                    className={`flex items-center gap-1 text-[13px] font-medium
                    ${isDone ? "text-green-600" : "text-slate-800"}`}
                  >
                    {isDone && <Bell size={13} />}
                    <span className="truncate">{item.name}</span>
                    {item.status && status && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ml-1 ${status.bg} ${status.text}`}
                      >
                        {status.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* ✅ Khóa chỉnh khi isDone hoặc out_of_stock */}
                <TooltipIcon
                  label={
                    isDone || item.status === "out_of_stock"
                      ? "Không thể chỉnh"
                      : item.qty === 1
                        ? "Không thể giảm thêm"
                        : "Giảm số lượng"
                  }
                >
                  <QtyBtn
                    onClick={() =>
                      !isDone && item.status !== "out_of_stock" && dec(item.id)
                    }
                    disabled={
                      isDone || item.status === "out_of_stock" || item.qty === 1
                    }
                  >
                    <Minus size={11} />
                  </QtyBtn>
                </TooltipIcon>

                <span className="min-w-[18px] text-center text-[13px] font-medium">
                  {item.qty}
                </span>

                <TooltipIcon
                  label={
                    isDone || item.status === "out_of_stock"
                      ? "Không thể chỉnh"
                      : "Tăng số lượng"
                  }
                >
                  <QtyBtn
                    onClick={() =>
                      !isDone && item.status !== "out_of_stock" && inc(item.id)
                    }
                    disabled={isDone || item.status === "out_of_stock"}
                  >
                    <Plus size={11} />
                  </QtyBtn>
                </TooltipIcon>

                <TooltipIcon
                  label={
                    isDone || item.status === "out_of_stock"
                      ? "Không thể xóa"
                      : "Xóa món"
                  }
                >
                  <div
                    onClick={() =>
                      !isDone &&
                      item.status !== "out_of_stock" &&
                      removeItem(item.id)
                    }
                    disabled={isDone || item.status === "out_of_stock"}
                    className={`w-5 h-5 flex items-center justify-center
                      ${isDone || item.status === "out_of_stock" ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-600"}`}
                  >
                    <Trash2 size={13} />
                  </div>
                </TooltipIcon>

                <span className="min-w-[52px] text-right text-slate-400 text-[12px]">
                  {fmt(item.price)}
                </span>
                <span className="min-w-[58px] text-right font-semibold text-[13px] text-slate-900">
                  {fmt(item.qty * item.price)}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200">
        <div className="flex items-center px-3 py-2 gap-1">

          <div className="flex-1" />
          <span className="text-slate-500 text-[13px]">Tổng tiền</span>
          <div className="bg-slate-200 rounded px-2 text-[11px] font-bold text-slate-700">
            {validCart.length}
          </div>
          <span className="font-bold text-[15px] text-slate-900">
            {fmt(total)}
          </span>
        </div>

        <div className="px-3 pb-3 flex gap-2">
          <button
            onClick={handleSendToKitchen}
            disabled={
              sendingKitchen ||
              !selTable ||
              !orderId ||
              validCart.filter(
                (i) => i.status === "pending" || i.status === "pre-order",
              ).length === 0
            }
            className="
              flex-1 py-3 rounded-lg border border-blue-500 text-blue-700
              flex items-center justify-center gap-2 font-semibold text-[14px]
              transition hover:bg-blue-700 hover:text-white hover:border-blue-600
              active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <Bell size={15} />
            {sendingKitchen ? "Đang gửi..." : "Thông báo bếp"}
          </button>

          <button
            onClick={() => setOpenPay(true)}
            disabled={!selTable || !orderId || validCart.length === 0}
            className="
              flex-[2] py-3 rounded-lg bg-blue-700 text-white
              flex items-center justify-center gap-2 font-semibold text-[14px]
              transition hover:bg-blue-800 active:bg-blue-900 active:scale-[0.97]
              shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <DollarSign size={15} />
            Thanh toán
          </button>
        </div>
      </div>

      <PaymentModal
        open={openPay}
        onClose={handleClosePay}
        fmt={fmt}
        selTable={selTable}
        floorLabel={floorLabel}
        orderId={orderId}
      />
      <GuestModal
        open={openGuest}
        onClose={() => setOpenGuest(false)}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
      />
      <NoteModal
        open={openNote}
        onClose={() => setOpenNote(false)}
        note={note}
        setNote={setNote}
      />
    </div>
  );
}

function IconBtn({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center w-5 h-5
        border border-slate-200 rounded-md bg-slate-50 text-slate-600
        cursor-pointer transition hover:bg-slate-100 hover:text-slate-800
        hover:border-slate-300 active:scale-95"
    >
      {children}
    </div>
  );
}

function QtyBtn({ children, onClick, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`w-5 h-5 flex items-center justify-center
        border border-slate-300 rounded text-slate-700 transition
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100 hover:border-slate-400 active:scale-95 cursor-pointer"}`}
    >
      {children}
    </div>
  );
}
