"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Clock, MoreVertical } from "lucide-react";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { getOrderBill } from "@/services/orderService";
import { payByCash as payByCashAPI, createVNPayPayment } from "@/services/paymentService";
import BillPreviewModal from "./BillPreviewModal.jsx";

export default function PaymentModal({
  open,
  onClose,
  fmt,
  selTable,
  floorLabel,
  orderId,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerPaid, setCustomerPaid] = useState(0);
  const [customerPaidRaw, setCustomerPaidRaw] = useState("");
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  // ── Bill preview modal ──────────────────────────────────────────────────────
  const [showBillPreview, setShowBillPreview] = useState(false);

  // ── JWT helper ──────────────────────────────────────────────────────────────
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id || decoded.userId || null;
    } catch {
      return null;
    }
  };

  // ── Fetch bill ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open || !orderId) return;
    const fetchBill = async () => {
      setLoading(true);
      try {
        const res = await getOrderBill(orderId);
        if (res.success && res.data) {
          setBillData(res.data);
          setPaymentMethod("cash");
        }
      } catch (err) {
        console.error("Lỗi lấy bill:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [open, orderId]);

  // ── Date / time display ─────────────────────────────────────────────────────
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // ── Process tables / items ──────────────────────────────────────────────────
  const processedTables = billData?.tables?.map((tableData) => {
    const itemMap = {};
    const kitchenItems = tableData.items.filter((item) =>
      ["preparing", "ready", "served"].includes(item.status)
    );
    kitchenItems.forEach((item) => {
      const key =
        item.status !== "pending"
          ? `${item.itemId}-${item.status}`
          : `${item.itemId}-${item.status}-${Math.random()}`;
      if (itemMap[key]) {
        itemMap[key].quantity += item.quantity;
        itemMap[key].total = itemMap[key].price * itemMap[key].quantity;
      } else {
        itemMap[key] = { ...item };
      }
    });
    const calculatedSubTotal = kitchenItems.reduce(
      (sum, item) => sum + (item.total || item.quantity * (item.unitPrice || item.price)),
      0
    );
    return { table: tableData.table, items: Object.values(itemMap), subTotal: calculatedSubTotal };
  }) ?? [];

  const allItems = processedTables.flatMap((t) => t.items);
  const finalTotal = processedTables.reduce((sum, t) => sum + t.subTotal, 0);

  useEffect(() => {
    if (billData && finalTotal > 0 && customerPaid === 0) {
      setCustomerPaid(finalTotal);
      setCustomerPaidRaw(String(finalTotal));
    }
  }, [finalTotal, billData, customerPaid]);

  const change = Math.max(0, customerPaid - finalTotal);

  const quickAmounts = [
    finalTotal,
    Math.ceil(finalTotal / 1000) * 1000 + 1000,
    Math.ceil(finalTotal / 5000) * 5000,
    Math.ceil(finalTotal / 10000) * 10000,
    Math.ceil(finalTotal / 50000) * 50000,
    200000,
    500000,
  ]
    .filter((v, i, arr) => arr.indexOf(v) === i && v >= finalTotal)
    .slice(0, 6);

  // ── Step 1: validate → mở bill preview ─────────────────────────────────────
  const handleOpenBillPreview = () => {
    if (paymentMethod === "cash" && customerPaid < finalTotal) {
      message.warning("Tiền khách đưa không đủ");
      return;
    }
    setShowBillPreview(true);
  };

  // ── Step 2: gọi API thanh toán (được trigger từ BillPreviewModal) ───────────
  const handleConfirmPayment = async (shouldPrint) => {
    // shouldPrint chỉ dùng để BillPreviewModal tự gọi window.print() trước khi gọi hàm này
    try {
      setPaying(true);

      const userId = getUserIdFromToken();
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng");
        return;
      }

      // ── Tiền mặt ────────────────────────────────────────────────────────────
      if (paymentMethod === "cash") {
        const res = await payByCashAPI(orderId, {
          amount: finalTotal,
          cashReceived: customerPaid,
          change,
          user: userId,
        });

        if (res.success) {
          message.success({
            content: (
              <div>
                <p style={{ marginBottom: 4, fontWeight: 600 }}>✓ Thanh toán thành công</p>
                <p style={{ marginBottom: 0, fontSize: 13 }}>Tiền thừa: {fmt(change)}</p>
              </div>
            ),
            duration: 3,
          });
          setTimeout(() => {
            setShowBillPreview(false);
            onClose?.();
            window.location.reload();
          }, 800);
        } else {
          throw new Error(res.message);
        }
      }

      // ── VNPay ────────────────────────────────────────────────────────────────
      else if (paymentMethod === "transfer") {
        const res = await createVNPayPayment({ orderId, amount: finalTotal, user: userId });
        if (res?.paymentUrl) {
          window.location.href = res.paymentUrl;
          return;
        }
        throw new Error("Không tạo được link thanh toán");
      }

      // ── Khác ─────────────────────────────────────────────────────────────────
      else {
        message.info("Chưa hỗ trợ phương thức này");
      }
    } catch (err) {
      console.error("Payment error:", err);
      message.error({
        content: (
          <div>
            <p style={{ marginBottom: 4, fontWeight: 600 }}>✗ Thanh toán thất bại</p>
            <p style={{ marginBottom: 0, fontSize: 13 }}>{err?.message || "Vui lòng thử lại sau"}</p>
          </div>
        ),
        duration: 4,
      });
    } finally {
      setPaying(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Main payment drawer ── */}
      <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Overlay */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        />

        {/* Drawer */}
        <div className={`
          absolute right-0 top-0 h-full w-[66vw] max-w-[1200px]
          bg-white shadow-2xl flex overflow-hidden
          transform transition-all duration-500 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}>

          {/* ── LEFT: danh sách món ── */}
          <div className="flex-1 border-r border-slate-200 flex flex-col min-w-0">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[14px] text-slate-800">Thanh toán</span>
                <span className="text-slate-500 text-[13px] flex items-center gap-1">
                  {dateStr} {timeStr}
                  <Calendar size={13} className="ml-1 text-slate-400" />
                  <Clock size={13} className="text-slate-400" />
                </span>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
                  Đang tải bill...
                </div>
              ) : processedTables.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 text-[13px]">
                  Không có món nào
                </div>
              ) : (
                processedTables.map((tableData) => (
                  <div key={tableData.table._id} className="mb-6">
                    {/* Header bàn */}
                    <div className="py-3 px-3 bg-slate-50 rounded border border-slate-200 mb-3">
                      <span className="font-semibold text-[13px] text-slate-800">
                        {tableData.table.tableName || tableData.table.name} — {tableData.items.length} món
                      </span>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <div className="py-2 px-3 grid grid-cols-[2fr_50px_90px_90px] text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200 gap-2 mb-2">
                        <span>Tên món</span>
                        <span className="text-center">SL</span>
                        <span className="text-right">Đơn giá</span>
                        <span className="text-right">Thành tiền</span>
                      </div>
                      <div className="space-y-1">
                        {tableData.items.map((item, itemIdx) => (
                          <div
                            key={`${tableData.table._id}-${item.itemId}-${item.status}-${itemIdx}`}
                            className="py-2 px-3 grid grid-cols-[2fr_50px_90px_90px] text-[12px] text-slate-700 border-b border-slate-50 gap-2"
                          >
                            <span className="text-slate-800">{item.itemName || item.name}</span>
                            <span className="text-center font-medium text-slate-600">{item.quantity}</span>
                            <span className="text-right text-slate-600">{fmt(item.unitPrice || item.price)}</span>
                            <span className="text-right font-semibold text-slate-800">
                              {fmt(item.total || item.quantity * (item.unitPrice || item.price))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subtotal bàn */}
                    <div className="py-2 px-3 flex justify-between text-[12px] font-semibold text-slate-800 bg-slate-50 rounded mb-4 border border-slate-200">
                      <span>Bàn: {tableData.table.tableName || tableData.table.name}</span>
                      <span>{fmt(tableData.subTotal)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-200 px-5 py-3 flex justify-between items-center text-[13px] font-semibold text-slate-800 bg-slate-50">
              <div className="flex items-center gap-2">
                <span>Tổng tiền hàng</span>
                <span className="bg-white text-slate-600 rounded-full text-[11px] px-2 py-0.5 font-normal border border-slate-200">
                  {allItems.length} món
                </span>
              </div>
              <span>{fmt(finalTotal)}</span>
            </div>
          </div>

          {/* ── RIGHT: chi tiết giao dịch ── */}
          <div className="w-[360px] flex flex-col bg-white">
            <div className="px-5 py-3 border-b border-slate-200">
              <span className="font-semibold text-[14px] text-slate-800">Chi tiết giao dịch</span>
            </div>

            <div className="flex-1 px-5 py-4 space-y-3 text-[13px] overflow-y-auto">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  Tổng tiền hàng
                  <span className="bg-slate-100 text-slate-500 rounded-full text-[11px] px-1.5 py-0.5">
                    {allItems.length} món
                  </span>
                </span>
                <span className="font-medium text-slate-800">{fmt(finalTotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Giảm giá</span>
                <span>0</span>
              </div>

              <div className="flex justify-between font-semibold text-slate-800">
                <span>Khách cần trả</span>
                <span className="text-blue-700">{fmt(finalTotal)}</span>
              </div>

              <div className="pt-1">
                <div className="text-[12px] text-slate-500 mb-1.5">Khách thanh toán</div>
                <input
                  className="border-2 border-slate-200 rounded w-full px-3 py-2 text-right font-semibold text-[14px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={customerPaidRaw}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setCustomerPaidRaw(raw);
                    setCustomerPaid(Number(raw) || 0);
                  }}
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                {[
                  { id: "cash", label: "Tiền mặt" },
                  { id: "transfer", label: "Chuyển khoản" },
                  { id: "card", label: "Thẻ" },
                ].map((m) => (
                  <label key={m.id} className="flex items-center gap-1.5 cursor-pointer text-[13px]">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)}
                      className="accent-blue-700"
                    />
                    <span className={paymentMethod === m.id ? "text-slate-800 font-medium" : "text-slate-500"}>
                      {m.label}
                    </span>
                  </label>
                ))}
                <button className="ml-auto text-slate-400 hover:text-slate-600">
                  <MoreVertical size={15} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setCustomerPaid(amt); setCustomerPaidRaw(String(amt)); }}
                    className={`py-1.5 text-[12px] font-medium rounded border transition-colors ${customerPaid === amt
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                  >
                    {fmt(amt)}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-slate-600 pt-1">
                <span>Tiền thừa trả khách</span>
                <span className="font-medium text-slate-800">{change > 0 ? fmt(change) : 0}</span>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-200">
              <button
                disabled={loading || finalTotal === 0 || paying || (paymentMethod === "cash" && customerPaid < finalTotal)}
                onClick={handleOpenBillPreview}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-lg font-semibold text-[14px] transition-colors disabled:opacity-40"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bill preview modal (tách component riêng) ── */}
      <BillPreviewModal
        open={showBillPreview}
        onClose={() => setShowBillPreview(false)}
        onConfirm={handleConfirmPayment}
        fmt={fmt}
        billData={billData}
        processedTables={processedTables}
        finalTotal={finalTotal}
        paymentMethod={paymentMethod}
        customerPaid={customerPaid}
        change={change}
        paying={paying}
      />
    </>
  );
}