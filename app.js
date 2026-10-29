const form = document.querySelector("#signature-form");
const preview = document.querySelector("#signature-preview");
const colorValue = document.querySelector("#color-value");
const statusMessage = document.querySelector("#status-message");
const copyButton = document.querySelector("#copy-button");
const downloadButton = document.querySelector("#download-button");
const resetButton = document.querySelector("#reset-button");
const storageKey = "signature-studio-settings-v1";

const defaults = Object.fromEntries(new FormData(form).entries());

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value = "", allowMailOrTel = false) {
  const raw = String(value).trim();
  if (!raw) return "";
  try {
    const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(normalized);
    const allowed = allowMailOrTel ? ["http:", "https:", "mailto:", "tel:"] : ["http:", "https:"];
    return allowed.includes(url.protocol) ? escapeHtml(url.href) : "";
  } catch {
    return "";
  }
}

function values() {
  return Object.fromEntries(new FormData(form).entries());
}

function contactLink(label, href, color) {
  if (!label || !href) return "";
  return `<a href="${href}" style="color:#475467;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;line-height:20px;">${escapeHtml(label)}</a>`;
}

function socialLink(label, url, color) {
  const href = safeUrl(url);
  if (!href) return "";
  return `<a href="${href}" style="color:${color};text-decoration:none;font-family:Arial,sans-serif;font-size:11px;font-weight:700;margin-right:12px;">${label}</a>`;
}

function signatureHtml(data) {
  const color = /^#[0-9a-f]{6}$/i.test(data.color) ? data.color : "#0f766e";
  const websiteHref = safeUrl(data.website);
  const emailHref = data.email ? `mailto:${encodeURIComponent(data.email.trim())}` : "";
  const phoneHref = data.phone ? `tel:${data.phone.replace(/[^+\d]/g, "")}` : "";
  const imageHref = safeUrl(data.image);
  const socials = [socialLink("LINKEDIN", data.linkedin, color), socialLink("GITHUB", data.github, color)].filter(Boolean).join("");
  const image = imageHref
    ? `<img src="${imageHref}" width="76" height="76" alt="${escapeHtml(data.name || data.company || "Profile")}" style="display:block;width:76px;height:76px;border:0;border-radius:${data.layout === "compact" ? "12px" : "50%"};object-fit:cover;" />`
    : `<div style="width:76px;height:76px;border-radius:${data.layout === "compact" ? "12px" : "50%"};background:${color};color:#ffffff;font:700 26px/76px Arial,sans-serif;text-align:center;">${escapeHtml((data.name || data.company || "S").trim().charAt(0).toUpperCase())}</div>`;
  const details = [
    contactLink(data.email, emailHref, color),
    contactLink(data.phone, phoneHref, color),
    contactLink(data.website, websiteHref, color),
    data.location ? `<span style="color:#475467;font-family:Arial,sans-serif;font-size:12px;line-height:20px;">${escapeHtml(data.location)}</span>` : ""
  ].filter(Boolean).join(`<span style="color:#c4cbd4;padding:0 6px;">•</span>`);

  if (data.layout === "minimal") {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
      <tr><td style="padding:0 0 5px;"><strong style="color:#101828;font-size:18px;line-height:22px;">${escapeHtml(data.name)}</strong></td></tr>
      <tr><td style="padding:0 0 10px;color:#667085;font-size:12px;line-height:18px;">${escapeHtml(data.role)}${data.role && data.company ? " · " : ""}${escapeHtml(data.company)}</td></tr>
      <tr><td style="border-left:3px solid ${color};padding:1px 0 1px 11px;">${details}</td></tr>
      ${socials ? `<tr><td style="padding-top:10px;">${socials}</td></tr>` : ""}
    </table>`;
  }

  const compact = data.layout === "compact";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
    <tr>
      <td style="vertical-align:top;padding:${compact ? "0 14px 0 0" : "0 18px 0 0"};">${image}</td>
      <td style="vertical-align:top;border-left:2px solid ${color};padding-left:${compact ? "14px" : "18px"};">
        <div style="color:#101828;font-size:${compact ? "17px" : "19px"};font-weight:700;line-height:22px;">${escapeHtml(data.name)}</div>
        <div style="color:${color};font-size:12px;font-weight:700;line-height:18px;">${escapeHtml(data.role)}</div>
        <div style="color:#667085;font-size:11px;line-height:17px;margin-bottom:7px;">${escapeHtml(data.company)}</div>
        <div>${details}</div>
        ${socials ? `<div style="padding-top:7px;">${socials}</div>` : ""}
      </td>
    </tr>
  </table>`;
}

function render() {
  const data = values();
  document.documentElement.style.setProperty("--accent", data.color);
  document.documentElement.style.setProperty("--accent-soft", `${data.color}18`);
  colorValue.value = data.color.toUpperCase();
  preview.innerHTML = signatureHtml(data);
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "#b42318" : "#067647";
  clearTimeout(showStatus.timer);
  showStatus.timer = setTimeout(() => { statusMessage.textContent = ""; }, 3200);
}

async function copySignature() {
  const html = signatureHtml(values());
  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([preview.innerText], { type: "text/plain" })
      })]);
    } else {
      const range = document.createRange();
      range.selectNodeContents(preview);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }
    showStatus("Signature copied — paste it into your email settings.");
  } catch {
    showStatus("Copy was blocked. Select the preview and copy it manually.", true);
  }
}

function downloadSignature() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Email Signature</title></head><body>${signatureHtml(values())}</body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "email-signature.html";
  link.click();
  URL.revokeObjectURL(url);
  showStatus("HTML file downloaded.");
}

function restoreSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return;
    for (const [name, value] of Object.entries(saved)) {
      const input = form.elements.namedItem(name);
      if (!input) continue;
      if (input instanceof RadioNodeList) input.value = value;
      else input.value = value;
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
}

form.addEventListener("input", render);
form.addEventListener("submit", (event) => event.preventDefault());
copyButton.addEventListener("click", copySignature);
downloadButton.addEventListener("click", downloadSignature);
resetButton.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  for (const [name, value] of Object.entries(defaults)) {
    const input = form.elements.namedItem(name);
    if (input instanceof RadioNodeList) input.value = value;
    else if (input) input.value = value;
  }
  render();
  showStatus("Builder reset to the default example.");
});

restoreSaved();
render();
