/**
 * Formats a number into Vietnamese Currency string
 * Example: 1000000 -> "1.000.000"
 */
export const formatCurrency = (value) => {
  if (!value) return "";
  // Check if it's already a string with dots to avoid double formatting
  const num = typeof value === 'string' ? parseCurrency(value) : value;
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Parses a Vietnamese currency string back to a number
 * Example: "1.000.000" -> 1000000
 */
export const parseCurrency = (value) => {
  if (!value) return "";
  // Remove all non-digit characters
  return value.toString().replace(/\./g, "");
};

/**
 * Formats with symbol for final display
 * Example: 1000000 -> "1.000.000 ₫"
 */
export const formatCurrencyWithSymbol = (value) => {
  if (!value) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(value);
};