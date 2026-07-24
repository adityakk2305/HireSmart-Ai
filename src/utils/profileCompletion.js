const companyFields = [
  { key: "name", label: "Company name" },
  { key: "industry", label: "Industry" },
  { key: "size", label: "Company size" },
  { key: "website", label: "Website" },
  { key: "logo", label: "Logo" },
  { key: "contactEmail", label: "Contact email" },
  { key: "contactPhone", label: "Contact phone" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "description", label: "Description" }
];

export const calculateCompanyProfileCompletion = (company) => {
  if (!company) {
    return { percentage: 0, missingFields: companyFields.map((field) => field.label) };
  }

  const missingFields = companyFields
    .filter((field) => !String(company[field.key] || "").trim())
    .map((field) => field.label);

  const completed = companyFields.length - missingFields.length;

  return {
    percentage: Math.round((completed / companyFields.length) * 100),
    missingFields
  };
};
