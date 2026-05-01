export const NOTE_MIN = 0;
export const NOTE_MAX = 20;

export const isValidNote = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const numericValue = Number(value);
  return !Number.isNaN(numericValue) && numericValue >= NOTE_MIN && numericValue <= NOTE_MAX;
};
