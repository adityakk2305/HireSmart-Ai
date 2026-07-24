import { ChevronDown, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { countries, defaultCountryCode } from "../../data/countries.js";
import { getPhoneCountry } from "../../utils/phoneValidation.js";

const PhoneInput = ({
  countryCode = defaultCountryCode,
  localNumber = "",
  onCountryChange,
  onNumberChange,
  error,
  required = false
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef(null);
  const selectedCountry = getPhoneCountry(countryCode);
  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return countries;
    return countries.filter((country) =>
      `${country.name} ${country.dialCode} ${country.code}`.toLowerCase().includes(term)
    );
  }, [search]);

  const selectCountry = (country) => {
    onCountryChange(country.code);
    setOpen(false);
    setSearch("");
    buttonRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        Phone number {required ? <span className="text-red-600">*</span> : null}
      </label>
      <div className="relative">
        <div className={`flex h-11 rounded-lg border bg-white transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:bg-slate-950 dark:focus-within:ring-blue-500/20 ${error ? "border-red-400" : "border-slate-300 dark:border-slate-600"}`}>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex min-w-[118px] items-center justify-between gap-2 rounded-l-lg border-r border-slate-200 px-3 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label="Select phone country code"
            aria-expanded={open}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{selectedCountry.flag}</span>
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            id="phone"
            name="phoneLocal"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={localNumber}
            onChange={(event) => onNumberChange(event.target.value)}
            placeholder="98765 43210"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "phone-error" : undefined}
            className="h-full min-w-0 flex-1 rounded-r-lg border-0 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {open ? (
          <div className="absolute left-0 top-12 z-30 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:w-[360px]">
            <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search country or code"
                className="h-9 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => selectCountry(country)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50 focus:bg-blue-50 focus:outline-none dark:text-slate-100 dark:hover:bg-blue-500/10 dark:focus:bg-blue-500/10"
                >
                  <span className="text-lg" aria-hidden="true">{country.flag}</span>
                  <span className="min-w-0 flex-1 truncate">{country.name}</span>
                  <span className="font-semibold text-slate-500 dark:text-slate-300">{country.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <p id="phone-error" className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
};

export default PhoneInput;
