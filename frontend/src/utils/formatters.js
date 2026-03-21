export const formatLkr = (amount) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(amount || 0);

export const toWhatsAppUrl = (phone, message) => {
  const sanitized = String(phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message || "Hi")}`;
};
