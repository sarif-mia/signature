import { FALLBACK_COLOR, SIGNATURE_FONTS, SIGNATURE_FONT_SIZES } from "../core/config.js";
import { escapeHtml, safeUrl } from "../core/utils.js";

// Email clients only render tables and inline styles reliably, so every
// layout below is plain HTML strings with inline CSS.

function link(label, href, style = "") {
  return label && href ? `<a href="${href}" style="color:#475467;text-decoration:none;${style}">${escapeHtml(label)}</a>` : "";
}

function photo(data, color, size = 76, square = false) {
  const url = safeUrl(data.image);
  const radius = square ? "12px" : "50%";
  if (url) {
    return `<img src="${url}" width="${size}" height="${size}" alt="${escapeHtml(data.name || "Profile")}" style="display:block;width:${size}px;height:${size}px;border:0;border-radius:${radius};object-fit:cover;" />`;
  }
  const initial = (data.name || data.company || "S").trim().charAt(0).toUpperCase();
  return `<div style="width:${size}px;height:${size}px;border-radius:${radius};background:${color};color:#fff;font:700 ${Math.round(size * 0.34)}px/${size}px Arial,sans-serif;text-align:center;">${escapeHtml(initial)}</div>`;
}

function logo(data) {
  const url = safeUrl(data.logo);
  return url
    ? `<img src="${url}" height="28" alt="${escapeHtml(data.company || "Company")}" style="display:block;max-width:110px;height:28px;border:0;object-fit:contain;object-position:left center;" />`
    : "";
}

function details(data, size, separator = " • ") {
  const email = data.email ? `mailto:${encodeURIComponent(data.email.trim())}` : "";
  const phone = data.phone ? `tel:${data.phone.replace(/[^+\d]/g, "")}` : "";
  const items = [
    link(data.email, email),
    link(data.phone, phone),
    link(data.website, safeUrl(data.website)),
    data.location ? `<span style="color:#475467;">${escapeHtml(data.location)}</span>` : "",
  ].filter(Boolean);
  return `<span style="font-size:${size}px;line-height:${size + 8}px;">${items.join(`<span style="color:#c4cbd4;padding:0 5px;">${separator}</span>`)}</span>`;
}

function extras(data, color, font) {
  const social = [
    ["LINKEDIN", data.linkedin],
    ["GITHUB", data.github],
  ]
    .map(([label, url]) => {
      const href = safeUrl(url);
      return href ? `<a href="${href}" style="color:${color};text-decoration:none;font:700 10px ${font},Arial,sans-serif;margin-right:12px;">${label}</a>` : "";
    })
    .join("");
  const ctaUrl = safeUrl(data.ctaUrl);
  const cta =
    data.ctaText && ctaUrl
      ? `<a href="${ctaUrl}" style="display:inline-block;margin-top:10px;padding:7px 11px;color:#fff;background:${color};border-radius:4px;text-decoration:none;font:700 10px ${font},Arial,sans-serif;">${escapeHtml(data.ctaText)}</a>`
      : "";
  return { social, cta };
}

const TABLE = `<table role="presentation" cellpadding="0" cellspacing="0" border="0"`;

const layouts = {
  minimal: ({ name, roleLine, company, contact, social, cta, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td><strong style="color:#101828;font-size:${size + 6}px;line-height:24px;">${name}</strong></td></tr><tr><td style="padding:0 0 8px;color:#667085;font-size:${size}px;">${roleLine}${roleLine && company ? " · " : ""}${company}</td></tr><tr><td style="padding-left:10px;border-left:3px solid ${color};">${contact}</td></tr>${social || cta ? `<tr><td style="padding-top:8px;">${social}${cta}</td></tr>` : ""}</table>`,

  modern: ({ data, name, roleLine, company, contact, social, cta, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="padding-bottom:12px;">${photo(data, color, 66, true)}</td><td style="padding:0 0 12px 15px;"><strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:24px;">${name}</strong><span style="color:${color};font-size:${size}px;font-weight:700;">${roleLine}</span><span style="display:block;color:#667085;font-size:${size - 1}px;">${company}</span></td></tr><tr><td colspan="2" style="padding-top:9px;border-top:3px solid ${color};">${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`,

  sidebar: ({ name, roleLine, company, contact, social, cta, brandLogo, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="width:14px;background:${color};border-radius:5px;"></td><td style="padding-left:16px;">${brandLogo ? `<div style="padding-bottom:8px;">${brandLogo}</div>` : ""}<strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:23px;">${name}</strong><span style="display:block;color:${color};font-size:${size}px;font-weight:700;">${roleLine}</span><span style="display:block;padding-bottom:6px;color:#667085;font-size:${size - 1}px;">${company}</span>${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`,

  executive: ({ data, name, roleLine, company, contact, social, cta, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;text-align:center;font-family:${font},Arial,sans-serif;"><tr><td align="center">${photo(data, color, 68)}</td></tr><tr><td style="padding-top:8px;"><strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:23px;">${name}</strong><span style="color:${color};font-size:${size}px;font-weight:700;">${roleLine}</span><span style="display:block;color:#667085;font-size:${size - 1}px;">${company}</span></td></tr><tr><td style="padding-top:8px;border-bottom:2px solid ${color};"></td></tr><tr><td style="padding-top:8px;">${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`,

  realtor: ({ data, name, roleLine, company, contact, social, cta, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="vertical-align:middle;padding-right:16px;">${photo(data, color, 82)}</td><td style="vertical-align:middle;padding-left:16px;border-left:1px solid #d0d5dd;"><span style="display:block;color:${color};font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${company}</span><strong style="display:block;margin:3px 0;color:#101828;font-size:${size + 8}px;line-height:25px;">${name}</strong><span style="display:block;padding-bottom:7px;color:#667085;font-size:${size}px;">${roleLine}</span>${contact}<div style="padding-top:7px;">${social}</div>${cta}</td></tr></table>`,

  creator: ({ data, name, roleLine, company, contact, social, cta, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="width:86px;padding:13px;background:${color};vertical-align:middle;" align="center">${photo(data, "#ffffff", 62, true)}</td><td style="padding:13px 17px;background:#f8fafc;vertical-align:middle;"><strong style="display:block;color:#101828;font-size:${size + 8}px;line-height:24px;">${name}</strong><span style="display:block;color:${color};font-size:${size}px;font-weight:700;">${roleLine}${roleLine && company ? " · " : ""}${company}</span><div style="padding-top:7px;">${contact}</div><div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`,

  consultant: ({ name, roleLine, company, contact, social, cta, brandLogo, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="padding-bottom:9px;border-bottom:1px solid #d0d5dd;">${brandLogo || `<span style="color:${color};font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">${company}</span>`}</td></tr><tr><td style="padding-top:10px;"><strong style="display:block;color:#101828;font-size:${size + 8}px;line-height:24px;">${name}</strong><span style="display:block;color:#667085;font-size:${size}px;">${roleLine}${roleLine && company ? " · " : ""}${company}</span><div style="padding-top:7px;">${contact}</div><div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`,

  banner: ({ data, name, roleLine, company, contact, social, cta, color, font, size }) =>
    `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="vertical-align:top;padding-right:14px;">${photo(data, color, 68, true)}</td><td style="vertical-align:top;"><strong style="display:block;color:#101828;font-size:${size + 8}px;line-height:24px;">${name}</strong><span style="display:block;color:${color};font-size:${size}px;font-weight:700;">${roleLine}</span><span style="display:block;padding-bottom:6px;color:#667085;font-size:${size - 1}px;">${company}</span>${contact}<div style="padding-top:6px;">${social}</div></td></tr><tr><td colspan="2" style="padding-top:11px;"><div style="padding:9px 13px;color:#fff;background:${color};font-size:11px;font-weight:700;">Let’s build something remarkable.${cta ? `<span style="float:right;">${cta}</span>` : ""}</div></td></tr></table>`,

  classic: (context) => sideBySide(context, false),

  compact: (context) => sideBySide(context, true),
};

function sideBySide({ data, name, roleLine, company, contact, social, cta, brandLogo, color, font, size }, compact) {
  const gap = compact ? 12 : 17;
  return `${TABLE} style="border-collapse:collapse;font-family:${font},Arial,sans-serif;"><tr><td style="vertical-align:top;padding-right:${gap}px;">${photo(data, color, compact ? 62 : 76, compact)}</td><td style="vertical-align:top;padding-left:${gap}px;border-left:2px solid ${color};">${brandLogo ? `<div style="padding-bottom:6px;">${brandLogo}</div>` : ""}<strong style="display:block;color:#101828;font-size:${size + 7}px;line-height:23px;">${name}</strong><span style="display:block;color:${color};font-size:${size}px;font-weight:700;line-height:18px;">${roleLine}</span><span style="display:block;margin-bottom:6px;color:#667085;font-size:${size - 1}px;line-height:17px;">${company}</span>${contact}<div style="padding-top:6px;">${social}</div>${cta}</td></tr></table>`;
}

export const LAYOUTS = Object.keys(layouts);

export function createSignatureHtml(data) {
  const color = /^#[0-9a-f]{6}$/i.test(data.color) ? data.color : FALLBACK_COLOR;
  const font = SIGNATURE_FONTS.includes(data.font) ? data.font : "Arial";
  const size = SIGNATURE_FONT_SIZES[data.size] || SIGNATURE_FONT_SIZES.medium;
  const render = layouts[data.layout] || layouts.classic;

  return render({
    data,
    color,
    font,
    size,
    name: escapeHtml(data.name),
    roleLine: [data.role, data.department].filter(Boolean).map(escapeHtml).join(" · "),
    company: escapeHtml(data.company),
    contact: details(data, size),
    brandLogo: logo(data),
    ...extras(data, color, font),
  });
}
