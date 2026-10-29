export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeUrl(value = "", allowedProtocols = ["http:", "https:"]) {
  const raw = String(value).trim();
  if (!raw) return "";

  try {
    const normalized = /^[a-z]+:/i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(normalized);
    return allowedProtocols.includes(url.protocol) ? escapeHtml(url.href) : "";
  } catch {
    return "";
  }
}

export function downloadFile(content, filename, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
