import locale from "antd/es/date-picker/locale/en_US";

export const formatWaitingTime = (minutes) => {
  if (!minutes || minutes < 1) {
    return "mới đặt";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} phút trước`;
  }

  if (remainingMinutes === 0) {
    return `${hours} giờ trước`;
  }

  return `${hours} giờ ${remainingMinutes} phút trước`;
};

export const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
  if (amount == null) return "0";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export const getYesterDayISOString = () => {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};
