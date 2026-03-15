"use client";

import TooltipIcon from "@/app/components/TooltipIcon";
import {
  ArrowDown, ArrowUp, Bell, CheckSquare, DollarSign,
  Edit2, History, Minus, Plus, Search, ShoppingCart,
  Trash2, User, Utensils,
} from "lucide-react";
import { useState } from "react";
import GuestModal from "./GuestModel";
import NoteModal from "./NoteModal";
import PaymentModal from "./PaymentModal";

const STATUS_CONFIG = {
  pending:      { label: "Chờ xác nhận", bg: "bg-yellow-100", text: "text-yellow-600" },
  preparing:    { label: "Đang làm",      bg: "bg-blue-100",   text: "text-blue-600"   },
  ready:        { label: "Sẵn sàng",      bg: "bg-green-100",  text: "text-green-600"  },
  served:       { label: "Đã phục vụ",    bg: "bg-slate-100",  text: "text-slate-500"  },
  cancelled:    { label: "Đã hủy",        bg: "bg-red-100",    text: "text-red-500"    },
  out_of_stock: { label: "Hết hàng",      bg: "bg-orange-100", text: "text-orange-500" },
};

// Các status không cho chỉnh sửa
const LOCKED_STATUSES = ["preparing", "ready", "served", "cancelled", "out_of_stock"];

export default function OrderPanel({
  selTable,
  floorLabel,
  cart,
  inc,
  dec,
  removeItem,
  fmt,
  total,
  onSendToKitchen,
}) {
  const [priceSort, setPriceSort] = useState("asc");
  const [openPay, setOpenPay] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [openGuest, setOpenGuest] = useState(false);
  const [note, setNote] = useState("");
  const [openNote, setOpenNote] = useState(false);

  const sortedCart = [...cart].sort((a, b) =>
    priceSort === "asc"
      ? a.unitPrice - b.unitPrice
      : b.unitPrice - a.unitPrice
  );

  // Row background theo status
  const getRowBg = (status) => {
    switch (status) {
      case "preparing":    return "bg-blue-50";
      case "ready":        return "bg-green-50";
      case "served":       return "bg-slate-50";
      case "out_of_stock": return "bg-orange-50";
      default:             return "";
    }
  };

  // Chỉ disable nút "Thông báo bếp" khi không còn món pending
  const hasPending = cart.some((i) => i.orderItemStatus === "pending");

  return (
    <div className="flex-1 bg-white border-l border-slate-200 flex flex-col min-w-0">
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-200 flex items-center gap-2">
        <Utensils size={15} />
        <span className="font-bold text-[13px] text-slate-800 whitespace-nowrap">
          {selTable ? `${selTable.tableName} / ${floorLabel}` : "Chọn bàn"}
        </span>
        <div className="flex-1 flex items-center gap-1 border border-slate-200 rounded px-2 py-[3px] text-[12px] text-slate-400">
          <Search size={12} />
          Tìm khách hàng
        </div>
        <TooltipIcon icon={<Plus size={14} />} label="Thêm khách" />
        <TooltipIcon icon={<ShoppingCart size={14} />} label="Giỏ hàng" />
        <TooltipIcon
          icon={priceSort === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
          label="Giá"
          onClick={() => setPriceSort(priceSort === "asc" ? "desc" : "asc")}
        />
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full pb-10 text-slate-400">
            <ShoppingCart size={42} className="mb-3 text-blue-300" />
            <div className="text-[13px] font-semibold text-slate-500 mb-1">
              Chưa có món trong đơn
            </div>
          </div>
        ) : (
          sortedCart.map((item, idx) => {
            const status = item.orderItemStatus;
            const isLocked = LOCKED_STATUSES.includes(status);
            const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

            return (
              <div
                key={item._id}
                className={`flex items-center px-3 py-2 border-b border-slate-100 gap-1 transition hover:bg-slate-50 ${getRowBg(status)}`}
              >
                <span className="text-blue-500 font-semibold min-w-[18px] text-[13px]">
                  {idx + 1}.
                </span>

                <div className="flex-1 min-w-0">
                  <div className={`flex items-center gap-1 text-[13px] font-medium
                    ${status === "preparing" || status === "ready" ? "text-green-700" : "text-slate-800"}`}>
                    {(status === "preparing" || status === "ready") && <Bell size={13} />}
                    <span className="truncate">{item.itemName}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                    {statusCfg.label}
                  </span>
                </div>

                <QtyBtn
                  onClick={() => !isLocked && dec(item._id)}
                  disabled={isLocked}
                  title={isLocked ? "Không thể chỉnh" : "Giảm số lượng"}
                >
                  <Minus size={11} />
                </QtyBtn>

                <span className="min-w-[18px] text-center text-[13px] font-medium">
                  {item.quantity}
                </span>

                <QtyBtn
                  onClick={() => !isLocked && inc(item._id)}
                  disabled={isLocked}
                  title={isLocked ? "Không thể chỉnh" : "Tăng số lượng"}
                >
                  <Plus size={11} />
                </QtyBtn>

                <div
                  onClick={() => !isLocked && removeItem(item._id)}
                  title={isLocked ? "Không thể xóa" : "Xóa món"}
                  className={`w-5 h-5 flex items-center justify-center
                    ${isLocked ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-600 cursor-pointer"}`}
                >
                  <Trash2 size={13} />
                </div>

                <span className="min-w-[52px] text-right text-slate-400 text-[12px]">
                  {fmt(item.unitPrice)}
                </span>
                <span className="min-w-[58px] text-right font-semibold text-[13px] text-slate-900">
                  {fmt(item.quantity * item.unitPrice)}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200">
        <div className="flex items-center px-3 py-2 gap-1">
          <TooltipIcon label="Số lượng khách">
            <div
              onClick={() => setOpenGuest(true)}
              className="flex items-center gap-1 bg-slate-100 rounded px-2 py-[3px] text-[12px] cursor-pointer"
            >
              <User size={12} />
              <span className="text-slate-700">{guestCount}</span>
            </div>
          </TooltipIcon>

          {[
            { icon: <Edit2 size={12} />, label: "Ghi chú", onClick: () => setOpenNote(true) },
            { icon: <History size={12} />, label: "Lịch sử báo bếp" },
            { icon: <CheckSquare size={12} />, label: "Kiểm đồ" },
          ].map((b, i) => (
            <TooltipIcon key={i} label={b.label}>
              <IconBtn onClick={b.onClick}>{b.icon}</IconBtn>
            </TooltipIcon>
          ))}

          <div className="flex-1" />
          <span className="text-slate-500 text-[13px]">Tổng tiền</span>
          <div className="bg-slate-200 rounded px-2 text-[11px] font-bold text-slate-700">
            {cart.length}
          </div>
          <span className="font-bold text-[15px] text-slate-900">
            {fmt(total)}
          </span>
        </div>

        <div className="px-3 pb-3 flex gap-2">
          <button
            onClick={onSendToKitchen}
            disabled={!hasPending}
            className="
              flex-1 py-3 rounded-lg
              border border-blue-500 text-blue-700
              flex items-center justify-center gap-2
              font-semibold text-[14px] transition
              hover:bg-blue-700 hover:text-white hover:border-blue-600
              active:scale-[0.97]
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <Bell size={15} />
            Thông báo bếp
          </button>

          <button
            onClick={() => setOpenPay(true)}
            className="
              flex-[2] py-3 rounded-lg bg-blue-700 text-white
              flex items-center justify-center gap-2
              font-semibold text-[14px] transition
              hover:bg-blue-800 active:bg-blue-900 active:scale-[0.97]
              shadow-sm hover:shadow
            "
          >
            <DollarSign size={15} />
            Thanh toán
          </button>
        </div>
      </div>

      <PaymentModal
        open={openPay}
        onClose={() => setOpenPay(false)}
        total={total}
        fmt={fmt}
        items={cart}
        selTable={selTable}
        floorLabel={floorLabel}
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

function IconBtn({ children, onClick, size }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center border border-slate-200 rounded-md bg-slate-50 text-slate-600 cursor-pointer transition hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 active:scale-95
        ${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`}
    >
      {children}
    </div>
  );
}

function QtyBtn({ children, onClick, disabled, title }) {
  return (
    <div
      onClick={onClick}
      title={title}
      className={`w-5 h-5 flex items-center justify-center border border-slate-300 rounded text-slate-700 transition select-none
        ${disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-slate-100 hover:border-slate-400 active:scale-95 cursor-pointer"}`}
    >
      {children}
    </div>
  );
}