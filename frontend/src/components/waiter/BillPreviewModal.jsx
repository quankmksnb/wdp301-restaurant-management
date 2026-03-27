"use client";

import { useRef } from "react";
import { X, Printer, CreditCard } from "lucide-react";

/**
 * BillPreviewModal
 *
 * Props:
 *  - open           : boolean
 *  - onClose        : () => void
 *  - onConfirm      : (print: boolean) => void   ← gọi API thanh toán bên ngoài
 *  - fmt            : (number) => string
 *  - billData       : object  (raw từ API)
 *  - processedTables: array   (đã xử lý từ PaymentModal)
 *  - finalTotal     : number
 *  - paymentMethod  : "cash" | "transfer" | "card"
 *  - customerPaid   : number
 *  - change         : number
 *  - paying         : boolean
 *  - storeName?     : string
 *  - branchName?    : string
 *  - phone?         : string
 */
export default function BillPreviewModal({
    open,
    onClose,
    onConfirm,
    fmt,
    billData,
    processedTables = [],
    finalTotal = 0,
    paymentMethod,
    customerPaid,
    change,
    paying,
    storeName = "Tên cửa hàng",
    branchName = "Chi nhánh trung tâm",
    phone = "1900 6522",
}) {
    const printRef = useRef(null);

    const now = new Date();
    const dateStr = [
        String(now.getDate()).padStart(2, "0"),
        String(now.getMonth() + 1).padStart(2, "0"),
        now.getFullYear(),
    ].join("/") + " " + [
        String(now.getHours()).padStart(2, "0"),
        String(now.getMinutes()).padStart(2, "0"),
    ].join(":");

    const allItems = processedTables.flatMap((t) => t.items);
    const invoiceNumber = billData?.invoiceNumber || billData?._id?.slice(-6)?.toUpperCase() || "------";
    const customerName = billData?.reservation?.customer?.customer || billData?.customerName || "Khách hàng";
    const customerPhone = billData?.reservation?.customer?.phone || billData?.customerPhone || "";
    const cashierName = billData?.user?.fullName || billData?.cashierName || "";

    const payMethodLabel =
        paymentMethod === "cash" ? "Tiền mặt" :
            paymentMethod === "transfer" ? "Chuyển khoản" : "Thẻ";

    // ─── In hóa đơn ───────────────────────────────────────────────────────────
    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;

        const printWindow = window.open("", "_blank", "width=600,height=900");
        printWindow.document.write(`
      <!DOCTYPE html><html>
      <head>
        <meta charset="utf-8"/>
        <title>Hóa đơn bán hàng</title>
        <style>
          *    { margin:0; padding:0; box-sizing:border-box; }
          body { font-family:'Courier New',monospace; font-size:12px; color:#000;
                 padding:16px; max-width:400px; margin:0 auto; }
          .g3  { display:grid; grid-template-columns:2fr 36px 80px; gap:4px; }
          .r   { text-align:right; }
          .c   { text-align:center; }
          .b   { font-weight:bold; }
          .dash{ border-top:1px dashed #999; margin:8px 0; }
          .line{ border-top:2px solid #000;  margin:8px 0; }
          @media print { @page { margin:0.5cm; size:80mm auto; } }
        </style>
      </head>
      <body>${content.innerHTML}
        <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
        printWindow.document.close();
    };

    if (!open) return null;

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div
                className="relative z-10 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
                style={{ width: 480, maxHeight: "90vh" }}
            >

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
                    <span className="font-semibold text-[14px] text-slate-800">Xem trước hóa đơn</span>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* ── Bill preview (scrollable) ── */}
                <div className="flex-1 overflow-y-auto p-5">
                    <div
                        ref={printRef}
                        style={{ fontFamily: "'Courier New',Courier,monospace", fontSize: 12, color: "#111", lineHeight: 1.6 }}
                    >
                        {/* Store info */}
                        <div style={{ textAlign: "center", marginBottom: 8 }}>
                            <div style={{ fontWeight: "bold", fontSize: 13 }}>{storeName}</div>
                            <div>Chi nhánh: {branchName}</div>
                            <div>Điện thoại: {phone}</div>
                        </div>
                        <div style={{ borderTop: "1px dashed #999", margin: "8px 0" }} />

                        <div style={{ fontSize: 11, marginBottom: 4 }}>Liên số: Liên 1</div>
                        <div style={{ fontSize: 11, marginBottom: 8 }}>Ngày bán: {dateStr}</div>

                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>
                            HÓA ĐƠN BÁN HÀNG
                        </div>
                        <div style={{ textAlign: "center", fontSize: 11, marginBottom: 8 }}>HD{invoiceNumber}</div>

                        <div style={{ borderTop: "1px dashed #999", margin: "8px 0" }} />

                        {/* Customer */}
                        <div style={{ marginBottom: 8 }}>
                            <div><strong>Khách hàng:</strong> {customerName}</div>
                            {customerPhone && <div>Điện thoại: {customerPhone}</div>}
                            {cashierName && <div><strong>Người bán:</strong> {cashierName}</div>}
                        </div>

                        <div style={{ borderTop: "1px dashed #999", margin: "8px 0" }} />

                        {/* Table header */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "2fr 36px 80px", gap: 4,
                            fontWeight: "bold", paddingBottom: 4,
                            borderBottom: "1px dashed #999", marginBottom: 4
                        }}>
                            <span>Tên món</span>
                            <span style={{ textAlign: "center" }}>SL</span>
                            <span style={{ textAlign: "right" }}>Thành tiền</span>
                        </div>

                        {/* Items */}
                        {allItems.map((item, idx) => (
                            <div key={idx} style={{ marginBottom: 6 }}>
                                <div style={{ fontWeight: "bold" }}>{item.itemName || item.name}</div>
                                <div style={{ display: "grid", gridTemplateColumns: "2fr 36px 80px", gap: 4 }}>
                                    <span>{fmt(item.unitPrice || item.price)}</span>
                                    <span style={{ textAlign: "center" }}>{item.quantity}</span>
                                    <span style={{ textAlign: "right" }}>
                                        {fmt(item.total || item.quantity * (item.unitPrice || item.price))}
                                    </span>
                                </div>
                                {idx < allItems.length - 1 && (
                                    <div style={{ borderTop: "1px dashed #ddd", marginTop: 4 }} />
                                )}
                            </div>
                        ))}

                        <div style={{ borderTop: "1px dashed #999", margin: "8px 0" }} />

                        {/* Summary rows */}
                        {[
                            { label: "Tổng tiền hàng:", value: fmt(finalTotal) },
                            { label: "Chiết khấu:", value: "0" },
                            { label: "Phương thức:", value: payMethodLabel },
                            ...(paymentMethod === "cash" ? [
                                { label: "Khách đưa:", value: fmt(customerPaid) },
                                { label: "Tiền thừa:", value: fmt(change) },
                            ] : []),
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                <span>{label}</span><span>{value}</span>
                            </div>
                        ))}

                        <div style={{ borderTop: "2px solid #000", margin: "8px 0" }} />

                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 14 }}>
                            <span>Tổng cộng:</span><span>{fmt(finalTotal)}</span>
                        </div>

                        <div style={{ borderTop: "1px dashed #999", margin: "10px 0" }} />

                        <div style={{ textAlign: "center", fontSize: 11, color: "#555" }}>
                            Cảm ơn quý khách. Hẹn gặp lại!
                        </div>
                    </div>
                </div>

                {/* ── Action buttons ── */}
                <div className="border-t border-slate-200 px-5 py-4 bg-slate-50 flex gap-3">
                    <button
                        disabled={paying}
                        onClick={() => { handlePrint(); onConfirm(true); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5
                       bg-blue-700 hover:bg-blue-800 active:bg-blue-900
                       text-white rounded-lg font-semibold text-[13px]
                       transition-colors disabled:opacity-40"
                    >
                        <Printer size={15} />
                        {paying ? "Đang xử lý..." : "Thanh toán & In hóa đơn"}
                    </button>

                    <button
                        disabled={paying}
                        onClick={() => onConfirm(false)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5
                       bg-white hover:bg-slate-100 border border-slate-300
                       text-slate-700 rounded-lg font-semibold text-[13px]
                       transition-colors disabled:opacity-40"
                    >
                        <CreditCard size={15} />
                        {paying ? "Đang xử lý..." : "Thanh toán không in"}
                    </button>
                </div>
            </div>
        </div>
    );
}