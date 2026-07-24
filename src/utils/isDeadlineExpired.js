export const isDeadlineExpired = (deadline) => {
  if (!deadline) {
    return false;
  }

  const value = new Date(deadline);

  if (Number.isNaN(value.getTime())) {
    return false;
  }

  value.setHours(23, 59, 59, 999);
  return value < new Date();
};
