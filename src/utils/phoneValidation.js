import { countries, defaultCountryCode } from "../data/countries.js";

export const normalizePhoneDigits = (value) => value.replace(/\D/g, "");

export const getPhoneCountry = (code) =>
  countries.find((country) => country.code === code) || countries.find((country) => country.code === defaultCountryCode) || countries[0];

export const toInternationalPhone = (countryCode, localNumber) => {
  const country = getPhoneCountry(countryCode || defaultCountryCode);
  const digits = normalizePhoneDigits(localNumber);
  return digits ? `${country.dialCode}${digits}` : "";
};

export const validateInternationalPhone = (countryCode, localNumber) => {
  const country = getPhoneCountry(countryCode || defaultCountryCode);
  const digits = normalizePhoneDigits(localNumber);

  if (!digits) return "Phone number is required.";
  if (digits.length < country.minDigits || digits.length > country.maxDigits) {
    return `Enter a valid ${country.name} phone number.`;
  }

  const phone = `${country.dialCode}${digits}`;
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    return "Enter a valid international phone number.";
  }

  return "";
};
