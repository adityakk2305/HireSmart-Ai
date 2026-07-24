export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "Not provided";

  const size = Number(bytes);

  if (Number.isNaN(size)) return "Not provided";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};
