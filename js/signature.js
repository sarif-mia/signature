import { FALLBACK_COLOR } from "./config.js";
import { escapeHtml, safeUrl } from "./utils.js";

const fontSizes = { small: 11, medium: 12, large: 13 };

function link(label, href, style = "") {
  return label && href ? `<a href="${href}" style="color:#475467;text-decoration:none;${style}">${escapeHtml(label)}</a>` : "";
}

function photo(data, color, size = 76, square = false) {
  const url = safeUrl(data.image);
  const radius = square ? "12px" : "50%";
  if (url) return `<img src="${url}" width="${size}" height="${size}" alt="${escapeHtml(data.name || "Profile")}" style="display:block;width:${size}px;height:${size}px;border:0;border-radius:${radius};object-fit:cover;" />`;
  const initial = (data.name || data.company || "S").trim().charAt(0).toUpperCase();
  return `<div style="width:${size}px;height:${size}px;border-radius:${radius};background:${color};color:#fff;font:700 ${Math.round(size * .34)}px/${size}px Arial,sans-serif;text-align:center;">${escapeHtml(initial)}</div>`;
}

function logo(data) {
  const url = safeUrl(data.logo);
  return url ? `<img src="${url}" height="28" alt="${escapeHtml(data.company || "Company")}" style="display:block;max-width:110px;height:28px;border:0;object-fit:contain;object-position:left center;" />` : "";
}

function details(data, size, separator = " • ") {
  const email = data.email ? `mailto:${encodeURIComponent(data.email.trim())}` : "";
  const phone = data.phone ? `tel:${data.phone.replace(/[^+\d]/g, "")}` : "";
  const items = [link(data.email, email), link(data.phone, phone), link(data.website, safeUrl(data.website)), data.location ? `<span style="color:#475467;">${escapeHtml(data.location)}</span>` : ""].filter(Boolean);
  return `<span style="font-size:${size}px;line-height:${size + 8}px;">${items.join(`<span style="color:#c4cbd4;padding:0 5px;">${separator}</span>`)}</span>`;
}

function extras(data, color, font) {
  const social = [["LINKEDIN", data.linkedin], ["GITHUB", data.github]].map(([label, url]) => {
    const href = safeUrl(url);
    return href ? `<a href="${href}" style="color:${color};text-decoration:none;font:700 10px ${font},Arial,sans-serif;margin-right:12px;">${label}</a>` : "";
  }).join("");
  const ctaUrl = safeUrl(data.ctaUrl);
  const cta = data.ctaText && ctaUrl ? `<a href="${ctaUrl}" style="display:inline-block;margin-top:10px;padding:7px 11px;color:#fff;background:${color};border-radius:4px;text-decoration:none;font:700 10px ${font},Arial,sans-serif;">${escapeHtml(data.ctaText)}</a>` : "";
  return { social, cta };
}

export function createSignatureHtml(data) {
  const color = /^#[0-9a-f]{6}$/i.test(data.color) ? data.color : FALLBACK_COLOR;
  const font = ["Arial", "Verdana", "Georgia", "Tahoma", "Trebuchet MS"].includes(data.font) ? data.font : "Arial";
  const size = fontSizes[data.size] || fontSizes.medium;
  const roleLine = [data.role, data.department].filter(Boolean).map(escapeHtml).join(" · ");
  const company = escapeHtml(data.company);
  const contact = details(data, size);
  const { social, cta } = extras(data, color, font);
  const brandLogo = logo(data);

  if (data.layout === "minimal") return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td><strong style="color:#101828;font-size:${size + 6}px;line-height:24px;">${escapeHtml(data.name)}</strong></td></tr><tr><td style="padding:0 0 8px;color:#667085;font-size:${size}px;">${roleLine}${roleLine && company ? " · " : ""}${company}</td></tr><tr><td style="padding-left:10px;border-left:3px solid ${color};">${contact}</td></tr>${social || cta ? `<tr><td style="padding-top:8px;">${social}${cta}</td></tr>` : ""}</table>`;

  if (data.layout === "modern") return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="padding-bottom:12px;">${photo(data,color,66,true)}</td><td style="padding:0 0 12px 15px;"><strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:24px;">${escapeHtml(data.name)}</strong><span style="color:${color};font-size:${size}px;font-weight:700;">${roleLine}</span><span style="display:block;color:#667085;font-size:${size - 1}px;">${company}</span></td></tr><tr><td colspan="2" style="padding-top:9px;border-top:3px solid ${color};">${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`;

  if (data.layout === "sidebar") return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="width:14px;background:${color};border-radius:5px;"></td><td style="padding-left:16px;">${brandLogo ? `<div style="padding-bottom:8px;">${brandLogo}</div>` : ""}<strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:23px;">${escapeHtml(data.name)}</strong><span style="display:block;color:${color};font-size:${size}px;font-weight:700;">${roleLine}</span><span style="display:block;padding-bottom:6px;color:#667085;font-size:${size - 1}px;">${company}</span>${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`;

  if (data.layout === "executive") return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;text-align:center;font-family:${font},Arial,sans-serif;"><tr><td align="center">${photo(data,color,68)}</td></tr><tr><td style="padding-top:8px;"><strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:23px;">${escapeHtml(data.name)}</strong><span style="color:${color};font-size:${size}px;font-weight:700;">${roleLine}</span><span style="display:block;color:#667085;font-size:${size - 1}px;">${company}</span></td></tr><tr><td style="padding-top:8px;border-bottom:2px solid ${color};"></td></tr><tr><td style="padding-top:8px;">${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`;

  const compact = data.layout === "compact";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="vertical-align:top;padding-right:${compact ? 12 : 17}px;">${photo(data,color,compact ? 62 : 76,compact)}</td><td style="vertical-align:top;padding-left:${compact ? 12 : 17}px;border-left:2px solid ${color};">${brandLogo ? `<div style="padding-bottom:6px;">${brandLogo}</div>` : ""}<strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:23px;">${escapeHtml(data.name)}</strong><span style="display:block;color:${color};font-size:${size}px;font-weight:700;line-height:18px;">${roleLine}</span><span style="display:block;margin-bottom:6px;color:#667085;font-size:${size - 1}px;line-height:17px;">${company}</span>${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`;
}
