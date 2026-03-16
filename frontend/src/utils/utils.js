export const formatWaitingTime = (minutes) => {
  if (!minutes || minutes <= 1) {
    return "1 phút trước";
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
