export const FOLDERS = {
  images: {
    label: "Images",
    icon: "🖼️",
    accept: "image/*",
    mimePrefix: "image/",
  },
  videos: {
    label: "Videos",
    icon: "🎬",
    accept: "video/*",
    mimePrefix: "video/",
  },
  pdfs: {
    label: "PDFs",
    icon: "📄",
    accept: "application/pdf",
    exact: ["application/pdf"],
  },
  texts: {
    label: "Text",
    icon: "📝",
    accept: "text/plain,.txt",
    exact: ["text/plain"],
  },
};

export function folderForMime(mime = "") {
  if (mime.startsWith("image/")) return "images";
  if (mime.startsWith("video/")) return "videos";
  if (mime === "application/pdf") return "pdfs";
  if (mime === "text/plain") return "texts";
  return null;
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
