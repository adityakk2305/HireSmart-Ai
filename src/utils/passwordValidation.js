export const passwordRequirements = [
  { id: "length", label: "Minimum 8 characters", test: (value) => value.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { id: "lowercase", label: "At least one lowercase letter", test: (value) => /[a-z]/.test(value) },
  { id: "number", label: "At least one number", test: (value) => /[0-9]/.test(value) },
  { id: "special", label: "At least one special character", test: (value) => /[^A-Za-z0-9]/.test(value) }
];

export const getPasswordRequirementState = (password, confirmPassword = "") => [
  ...passwordRequirements.map((requirement) => ({
    ...requirement,
    valid: requirement.test(password)
  })),
  {
    id: "match",
    label: "Password and confirm password match",
    valid: Boolean(password) && password === confirmPassword
  }
];

export const isStrongPassword = (password, confirmPassword = password) =>
  getPasswordRequirementState(password, confirmPassword).every((requirement) => requirement.valid);
