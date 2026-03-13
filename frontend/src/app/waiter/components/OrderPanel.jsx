"use client";

import { useState } from "react";
import PaymentModal from "./PaymentModal";
import {
  Bell,
  CreditCard,
  Edit2,
  Minus,
  Plus,
  Utensils,
  Search,
  ShoppingCart,
  Trash2,
  ArrowLeftRight,
  User,
  History,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  DollarSign,
} from "lucide-react";
import TooltipIcon from "@/app/components/TooltipIcon";
import GuestModal from "./GuestModel";
import NoteModal from "./NoteModal";

export default function OrderPanel({
  selTable,
  floorLabel,
  cart,
  inc,
  dec,
  removeItem,
  fmt,
  total,
  kitchenDone,
}) {
  const [priceSort, setPriceSort] = useState("asc");
  const [openPay, setOpenPay] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [openGuest, setOpenGuest] = useState(false);
  const [note, setNote] = useState("");
  const [openNote, setOpenNote] = useState(false);
  const sortedCart = [...cart].sort((a, b) => {
    return priceSort === "asc"
      ? a.price - b.price
      : b.price - a.price;
  });

  const FLOOR_LABELS = {
    lau2: "Lầu 2",
    lau3: "Lầu 3",
    vip: "Phòng VIP",
    all: "Tất cả"
  };
  return (
    <div className="flex-1 bg-white border-l border-slate-200 flex flex-col min-w-0">
      <div className="px-3 py-2 border-b border-slate-200 flex items-center gap-2">
        <Utensils size={15} />
        <span className="font-bold text-[13px] text-slate-800 whitespace-nowrap">
          {selTable
            ? `${selTable.name} / ${FLOOR_LABELS[selTable.floor] || ""}`
            : "Chọn bàn"}
        </span>

        <div className="flex-1 flex items-center gap-1 border border-slate-200 rounded px-2 py-[3px] text-[12px] text-slate-400">
          <Search size={12} />
          Tìm khách hàng
        </div>

        <TooltipIcon
          icon={<Plus size={14} />}
          label="Thêm khách"
        />
        <TooltipIcon
          icon={<ShoppingCart size={14} />}
          label="Giỏ hàng"
        />
        <TooltipIcon
          icon={
            priceSort === "asc"
              ? <ArrowUp size={13} />
              : <ArrowDown size={13} />
          }
          label="Giá"
          onClick={() =>
            setPriceSort(priceSort === "asc" ? "desc" : "asc")
          }
        />
      </div>

      {/* Cart */}
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
            const done = kitchenDone.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center px-3 py-2 border-b border-slate-100 gap-1
transition hover:bg-slate-50
${done ? "bg-green-50" : ""}`}
              >
                <span className="text-blue-500 font-semibold min-w-[18px] text-[13px]">
                  {idx + 1}.
                </span>

                <div className="flex-1 min-w-0">

                  <div
                    className={`flex items-center gap-1 text-[13px] font-medium
                    ${done ? "text-green-600" : "text-slate-800"}`}
                  >
                    {done && <Bell size={13} />}
                    <span className="truncate">{item.name}</span>
                  </div>

                </div>

                <TooltipIcon
                  label={
                    done
                      ? "Không thể chỉnh"
                      : item.qty === 1
                        ? "Không thể giảm thêm"
                        : "Giảm số lượng"
                  }
                >
                  <QtyBtn
                    onClick={() => !done && dec(item.id)}
                    disabled={done || item.qty === 1}
                  >
                    <Minus size={11} />
                  </QtyBtn>
                </TooltipIcon>

                <span className="min-w-[18px] text-center text-[13px] font-medium">
                  {item.qty}
                </span>

                <TooltipIcon
                  label={done ? "Không thể chỉnh" : "Tăng số lượng"}
                >
                  <QtyBtn
                    onClick={() => !done && inc(item.id)}
                    disabled={done}
                  >
                    <Plus size={11} />
                  </QtyBtn>
                </TooltipIcon>

                <TooltipIcon label={done ? "Không thể xóa" : "Xóa món"}>
                  <button
                    onClick={() => !done && removeItem(item.id)}
                    disabled={done}
                    className={`w-5 h-5 flex items-center justify-center
      ${done ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-600"}
    `}
                  >
                    <Trash2 size={13} />
                  </button>
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

      <div className="border-t border-slate-200">
        <div className="flex items-center px-3 py-2 gap-1">
          <div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-[3px] text-[12px] cursor-pointer">
            iem iem
            <span className="text-slate-400 text-[10px]">▾</span>
          </div>

          {/* nhap so luong khach */}
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
            { icon: <CheckSquare size={12} />, label: "Kiểm đồ" }
          ].map((b, i) => (
            <TooltipIcon key={i} label={b.label}>
              <IconBtn onClick={b.onClick}>
                {b.icon}
              </IconBtn>
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

          <button className="
  flex-1 py-3 rounded-lg
  border border-blue-500
  text-blue-700
  flex items-center justify-center gap-2
  font-semibold text-[14px]
  transition
  hover:bg-blue-700
  hover:text-white
  hover:border-blue-600
  active:scale-[0.97]
  ">

            <Bell size={15} />
            Thông báo bếp

          </button>

          <button
            onClick={() => setOpenPay(true)}
            className="
    flex-[2] py-3 rounded-lg
    bg-blue-700
    text-white
    flex items-center justify-center gap-2
    font-semibold text-[14px]
    transition
    hover:bg-blue-800
    active:bg-blue-900
    active:scale-[0.97]
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
    <button
      onClick={onClick}
      className={`flex items-center justify-center
      border border-slate-200
      rounded-md
      bg-slate-50
      text-slate-600
      cursor-pointer
      transition
      hover:bg-slate-100
      hover:text-slate-800
      hover:border-slate-300
      active:scale-95
      ${size === "sm" ? "w-4 h-4" : "w-5 h-5"}
      `}
    >
      {children}
    </button>
  );
}

function QtyBtn({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
      w-5 h-5
      flex items-center justify-center
      border border-slate-300
      rounded
      text-slate-700
      transition
      ${disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-slate-100 hover:border-slate-400 active:scale-95"}
      `}
    >
      {children}
    </button>
  );
}