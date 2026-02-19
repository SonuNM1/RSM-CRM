export const normalizeWebsite = (url = "") => {
  if (!url) return "";

  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "") // remove http/https
    .replace(/^www\./, "")  // remove www
    .replace(/\/$/, "")  // remove trailing slash 
    .trim();
};
