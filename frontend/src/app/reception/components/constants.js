// ─── Constants ───────────────────────────────────────────────────
export const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
export const CELL_WIDTH = 120;
export const ROW_HEIGHT = 36;
export const SIDEBAR_WIDTH = 150;
export const HEADER_HOURS = [6, 9, 12, 15, 18, 21];
export const HEADER_CELL_WIDTH = CELL_WIDTH * 3;
export const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
export const MONTH_NAMES = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

export const STATUS_COLORS = {
    confirmed: { bg: "#dcfce7", border: "#4ade80", text: "#166534", dot: "#22c55e" },
    seated: { bg: "#dbeafe", border: "#60a5fa", text: "#1e40af", dot: "#3b82f6" },
    no_show: { bg: "#e5e7eb", border: "#9ca3af", text: "#374151", dot: "#9ca3af" },
    cancelled: { bg: "#fee2e2", border: "#fca5a5", text: "#dc2626", dot: "#ef4444" },
};

// ─── Helper: Calendar ────────────────────────────────────────────
export function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
export function getFirstDayOfMonth(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
