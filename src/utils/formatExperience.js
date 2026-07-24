export const formatExperience = (min = 0, max = 0) => {
  if (min === null || min === undefined || max === null || max === undefined) {
    return "Not provided";
  }

  if (Number(min) === 0 && Number(max) === 0) {
    return "Fresher";
  }

  if (Number(min) === Number(max)) {
    return `${min} years`;
  }

  return `${min}-${max} years`;
};
