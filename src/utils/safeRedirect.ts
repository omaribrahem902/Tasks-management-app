export const getSafeRedirectUrl = (url: string | null): string => {
  if (!url) return "/project";
  // Must start with a single slash, not protocol-relative "//" or "/\"
  if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) {
    return url;
  }
  return "/project";
};

