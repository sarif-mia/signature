import { FALLBACK_COLOR } from "./config.js";
import { escapeHtml, safeUrl } from "./utils.js";

function contactLink(label, href) {
  if (!label || !href) return "";
  return `<a href="${href}" style="color:#475467;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;line-height:20px;">${escapeHtml(label)}</a>`;
}

function socialLink(label, url, color) {
  const href = safeUrl(url);
  if (!href) return "";
  return `<a href="${href}" style="color:${color};text-decoration:none;font-family:Arial,sans-serif;font-size:11px;font-weight:700;margin-right:12px;">${label}</a>`;
}

function profileImage(data, color) {
  const imageUrl = safeUrl(data.image);
  const radius = data.layout === "compact" ? "12px" : "50%";

  if (imageUrl) {
    return `<img src="${imageUrl}" width="76" height="76" alt="${escapeHtml(data.name || data.company || "Profile")}" style="display:block;width:76px;height:76px;border:0;border-radius:${radius};object-fit:cover;" />`;
  }

  const initial = (data.name || data.company || "S").trim().charAt(0).toUpperCase();
  return `<div style="width:76px;height:76px;border-radius:${radius};background:${color};color:#ffffff;font:700 26px/76px Arial,sans-serif;text-align:center;">${escapeHtml(initial)}</div>`;
}

function contactDetails(data) {
  const website = safeUrl(data.website);
  const email = data.email ? `mailto:${encodeURIComponent(data.email.trim())}` : "";
  const phone = data.phone ? `tel:${data.phone.replace(/[^+\d]/g, "")}` : "";

  return [
    contactLink(data.email, email),
    contactLink(data.phone, phone),
    contactLink(data.website, website),
    data.location ? `<span style="color:#475467;font-family:Arial,sans-serif;font-size:12px;line-height:20px;">${escapeHtml(data.location)}</span>` : "",
  ].filter(Boolean).join('<span style="color:#c4cbd4;padding:0 6px;">•</span>');
}

export function createSignatureHtml(data) {
  const color = /^#[0-9a-f]{6}$/i.test(data.color) ? data.color : FALLBACK_COLOR;
  const details = contactDetails(data);
  const socials = [
    socialLink("LINKEDIN", data.linkedin, color),
    socialLink("GITHUB", data.github, color),
  ].filter(Boolean).join("");

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
      <td style="vertical-align:top;padding:0 ${compact ? "14px" : "18px"} 0 0;">${profileImage(data, color)}</td>
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
