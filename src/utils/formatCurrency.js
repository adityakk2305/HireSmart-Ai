const currencyLabels = {
  INR: "₹",
  USD: "$",
  EUR: "EUR ",
  GBP: "GBP ",
  AED: "AED "
};

export const formatCurrency = (min, max, currency = "INR", period = "Yearly") => {
  if (min === null && max === null) {
    return "Not provided";
  }

  const label = currencyLabels[currency] || `${currency || ""} `;
  const formatValue = (value) =>
    value === null || value === undefined
      ? null
      : `${label}${new Intl.NumberFormat("en-IN").format(Number(value))}`;

  const formattedMin = formatValue(min);
  const formattedMax = formatValue(max);
  const range = formattedMin && formattedMax ? `${formattedMin} - ${formattedMax}` : formattedMin || formattedMax;

  return `${range} / ${period}`;
};
