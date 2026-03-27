"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PaymentResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const status = params.get("status");
  const orderId = params.get("orderId");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = {
    success: {
      icon: (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeDasharray="239"
            strokeDashoffset={mounted ? "0" : "239"}
            style={{
              transition:
                "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          />
          <polyline
            points="24,42 35,53 56,30"
            stroke="#22c55e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="50"
            strokeDashoffset={mounted ? "0" : "50"}
            style={{
              transition:
                "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1) 0.8s",
            }}
          />
        </svg>
      ),
      label: "THÀNH CÔNG",
      heading: "Thanh toán hoàn tất",
      sub: "Đơn hàng của bạn đã được xác nhận và đang được xử lý.",
      accent: "#22c55e",
      bg: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.10) 0%, transparent 70%)",
      badgeBg: "rgba(34,197,94,0.10)",
      badgeColor: "#16a34a",
      btnBg: "#22c55e",
      btnHover: "#16a34a",
    },
    fail: {
      icon: (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeDasharray="239"
            strokeDashoffset={mounted ? "0" : "239"}
            style={{
              transition:
                "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          />
          <line
            x1="27"
            y1="27"
            x2="53"
            y2="53"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="37"
            strokeDashoffset={mounted ? "0" : "37"}
            style={{
              transition:
                "stroke-dashoffset 0.4s cubic-bezier(0.4,0,0.2,1) 0.8s",
            }}
          />
          <line
            x1="53"
            y1="27"
            x2="27"
            y2="53"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="37"
            strokeDashoffset={mounted ? "0" : "37"}
            style={{
              transition:
                "stroke-dashoffset 0.4s cubic-bezier(0.4,0,0.2,1) 1.0s",
            }}
          />
        </svg>
      ),
      label: "THẤT BẠI",
      heading: "Thanh toán thất bại",
      sub: "Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
      accent: "#ef4444",
      bg: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,68,68,0.10) 0%, transparent 70%)",
      badgeBg: "rgba(239,68,68,0.10)",
      badgeColor: "#dc2626",
      btnBg: "#ef4444",
      btnHover: "#dc2626",
    },
    default: {
      icon: (
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="239"
            strokeDashoffset={mounted ? "0" : "239"}
            style={{
              transition:
                "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          />
          <line
            x1="40"
            y1="26"
            x2="40"
            y2="44"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="40" cy="53" r="2.5" fill="#f59e0b" />
        </svg>
      ),
      label: "ERROR",
      heading: "Có lỗi xảy ra",
      sub: "Không thể xác định trạng thái giao dịch. Vui lòng kiểm tra lại.",
      accent: "#f59e0b",
      bg: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.10) 0%, transparent 70%)",
      badgeBg: "rgba(245,158,11,0.10)",
      badgeColor: "#d97706",
      btnBg: "#f59e0b",
      btnHover: "#d97706",
    },
  };

  const c =
    status === "success"
      ? config.success
      : status === "fail"
        ? config.fail
        : config.default;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        .pr-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #ffffff; font-family: 'Be Vietnam Pro', sans-serif; padding: 24px; }
        .pr-card { position: relative; width: 100%; max-width: 420px; background: #16181f; border: 1px solid rgba(255,255,255,0.07); border-radius: 24px; padding: 48px 40px 40px; text-align: center; overflow: hidden; opacity: 0; transform: translateY(24px) scale(0.97); transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        .pr-card.visible { opacity: 1; transform: translateY(0) scale(1); }
        .pr-glow { position: absolute; top: 0; left: 0; right: 0; height: 280px; pointer-events: none; border-radius: 24px 24px 0 0; }
        .pr-icon-wrap { width: 80px; height: 80px; margin: 0 auto 28px; position: relative; z-index: 1; }
        .pr-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; padding: 4px 12px; border-radius: 100px; margin-bottom: 12px; position: relative; z-index: 1; }
        .pr-heading { font-size: 24px; font-weight: 700; color: #f1f5f9; margin: 0 0 10px; position: relative; z-index: 1; letter-spacing: -0.02em; }
        .pr-sub { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 28px; position: relative; z-index: 1; }
        .pr-order-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; position: relative; z-index: 1; }
        .pr-order-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: #475569; text-transform: uppercase; }
        .pr-order-value { font-size: 14px; font-weight: 600; color: #cbd5e1; font-variant-numeric: tabular-nums; }
        .pr-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-family: 'Be Vietnam Pro', sans-serif; font-size: 15px; font-weight: 600; color: #fff; cursor: pointer; position: relative; z-index: 1; transition: filter 0.2s, transform 0.15s; letter-spacing: 0.01em; }
        .pr-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .pr-btn:active { transform: translateY(0); filter: brightness(0.95); }
        .pr-divider { width: 40px; height: 2px; border-radius: 2px; margin: 0 auto 20px; opacity: 0.25; position: relative; z-index: 1; }
        .pr-dots { position: absolute; bottom: 0; right: 0; width: 120px; height: 120px; opacity: 0.04; pointer-events: none; }
      `}</style>

      <div className="pr-root">
        <div className={`pr-card ${mounted ? "visible" : ""}`}>
          <div className="pr-glow" style={{ background: c.bg }} />
          <svg className="pr-dots" viewBox="0 0 120 120" fill="none">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={col * 20 + 10}
                  cy={row * 20 + 10}
                  r="2"
                  fill="white"
                />
              )),
            )}
          </svg>
          <div className="pr-icon-wrap">{c.icon}</div>
          <div
            className="pr-badge"
            style={{ background: c.badgeBg, color: c.badgeColor }}
          >
            {c.label}
          </div>
          <h1 className="pr-heading">{c.heading}</h1>
          <div className="pr-divider" style={{ background: c.accent }} />
          <p className="pr-sub">{c.sub}</p>
          {orderId && (
            <div className="pr-order-box">
              <span className="pr-order-label">Mã đơn hàng</span>
              <span className="pr-order-value">{orderId}</span>
            </div>
          )}
          <button
            className="pr-btn"
            style={{
              background: `linear-gradient(135deg, ${c.btnBg}, ${c.btnHover})`,
            }}
            onClick={() => router.push("/waiter")}
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    </>
  );
}

// ✅ Page export bọc Suspense ở đây
export default function PaymentResult() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
          }}
        >
          <div style={{ color: "#64748b" }}>Đang tải...</div>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
