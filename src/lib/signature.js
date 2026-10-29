export const templates = [
  { id: "classic", name: "Classic", note: "Versatile & balanced" },
  { id: "modern", name: "Modern", note: "Clean photo layout" },
  { id: "minimal", name: "Minimal", note: "Simple & focused" },
  { id: "executive", name: "Executive", note: "Premium centered style" },
  { id: "creative", name: "Creative", note: "Bold color block" },
  { id: "corporate", name: "Corporate", note: "Logo-led profile" },
  { id: "editorial", name: "Editorial", note: "Brand, profile & QR" },
  { id: "compact", name: "Compact", note: "Slim one-line for replies" },
  { id: "banner", name: "Banner", note: "Brand color header card" },
  { id: "split", name: "Split", note: "Identity left, contacts right" },
];

export const fonts = ["Arial", "Verdana", "Georgia", "Tahoma", "Trebuchet MS"];
export const sizes = [["small", "Small"], ["medium", "Medium"], ["large", "Large"]];
export const shapes = [["circle", "Circle"], ["rounded", "Rounded"], ["square", "Square"]];
export const photoLimits = { min: 48, max: 120 };
export const logoLimits = { min: 16, max: 64 };

export const defaultSignature = {
  template: "editorial", name: "Sarif Mia", pronouns: "", title: "IT Executive", department: "", company: "Information Technology", brandName: "NDS9", tagline: "CURATING FASHION · SPAIN", signOff: "Best Regards,", email: "hello@example.com", phone: "(+880) 1571447136", mobile: "", website: "www.nds9.co", address: "", photo: "", logo: "", qrCode: "", linkedin: "", facebook: "", instagram: "", x: "", youtube: "", github: "", color: "#111111", textColor: "#111111", mutedColor: "#667085", font: "Arial", size: "medium", iconShape: "rounded", photoShape: "auto", photoSize: 76, logoHeight: 28, ctaText: "", ctaUrl: "", bannerUrl: "", bannerLink: "", disclaimer: "", showIcons: true, showAvatar: true,
};

const icons = { linkedin: ["in", "LinkedIn"], facebook: ["f", "Facebook"], instagram: ["ig", "Instagram"], x: ["x", "X"], youtube: ["yt", "YouTube"], github: ["gh", "GitHub"], email: ["E", "Email"], phone: ["P", "Phone"], mobile: ["M", "Mobile"], website: ["W", "Website"], address: ["A", "Address"] };
const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
const url = (value = "") => { if (!value.trim()) return ""; const candidate = /^(https?:|mailto:|tel:|data:image\/)/i.test(value) ? value : `https://${value}`; try { const parsed = new URL(candidate); return ["http:", "https:", "mailto:", "tel:", "data:"].includes(parsed.protocol) ? esc(candidate) : ""; } catch { return ""; } };
const tel = (value) => `tel:${value.replace(/[^+\d]/g, "")}`;
const fontSize = { small: 11, medium: 12, large: 13 };
const shapeIds = shapes.map(([id]) => id);
const color = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
const clamp = (value, { min, max }, fallback) => { const number = Number(value); return Number.isFinite(number) && value !== "" ? Math.min(max, Math.max(min, Math.round(number))) : fallback; };
const radius = (shape, px) => ({ circle: "50%", rounded: `${Math.round(px * 0.16)}px`, square: "0" })[shape];
const initials = (name) => (name || "S").trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");

export function normalizeSignature(input = {}) {
  const d = defaultSignature;
  return {
    ...d,
    ...input,
    template: templates.some(({ id }) => id === input.template) ? input.template : d.template,
    color: color(input.color, d.color),
    textColor: color(input.textColor, d.textColor),
    mutedColor: color(input.mutedColor, d.mutedColor),
    font: fonts.includes(input.font) ? input.font : d.font,
    size: Object.hasOwn(fontSize, input.size) ? input.size : d.size,
    iconShape: shapeIds.includes(input.iconShape) ? input.iconShape : d.iconShape,
    photoShape: input.photoShape === "auto" || shapeIds.includes(input.photoShape) ? input.photoShape : d.photoShape,
    photoSize: clamp(input.photoSize, photoLimits, d.photoSize),
    logoHeight: clamp(input.logoHeight, logoLimits, d.logoHeight),
    showIcons: input.showIcons !== false,
    showAvatar: input.showAvatar !== false,
  };
}

function avatar(data, fallbackShape = "circle", photoOnly = false) { const size = data.photoSize; const corner = radius(data.photoShape === "auto" ? fallbackShape : data.photoShape, size); const image = url(data.photo); if (image) return `<img src="${image}" width="${size}" height="${size}" alt="${esc(data.name)}" style="display:block;width:${size}px;height:${size}px;border:0;border-radius:${corner};object-fit:cover">`; return data.showAvatar && !photoOnly ? `<div style="width:${size}px;height:${size}px;border-radius:${corner};background:${data.color};color:#fff;font:bold ${Math.round(size / 3)}px/${size}px Arial;text-align:center">${esc(initials(data.name))}</div>` : ""; }
function logo(data, center = false) { const src = url(data.logo); const height = data.logoHeight; return src ? `<img src="${src}" height="${height}" alt="${esc(data.brandName || data.company)}" style="display:block;${center ? "margin:0 auto;" : ""}max-width:${height * 5}px;height:${height}px;border:0;object-fit:contain">` : ""; }
function badge(data, key, box, assets) { const glyph = Math.round(box * 0.58); const [label, alt] = icons[key]; const inner = assets ? `<img src="${assets}/icons/${key}.png" width="${glyph}" height="${glyph}" alt="${alt}" style="display:inline-block;width:${glyph}px;height:${glyph}px;border:0;vertical-align:middle">` : label; return `<span style="display:inline-block;width:${box}px;height:${box}px;color:#fff;background:${data.color};border-radius:${radius(data.iconShape, box)};font:bold ${Math.round(box * 0.42)}px/${box}px Arial;text-align:center;vertical-align:middle">${inner}</span>`; }
function social(data, assets, keys = ["linkedin", "facebook", "instagram", "x", "youtube", "github"], box = 22) { return keys.map((key) => [key, key === "email" ? (data.email ? url(`mailto:${data.email}`) : "") : url(data[key])]).filter(([, href]) => href).map(([key, href]) => `<a href="${href}" style="display:inline-block;margin-right:5px;text-decoration:none">${badge(data, key, box, assets)}</a>`).join(""); }
function contacts(data, size, assets, stacked = false) { const rows = [["email", data.email, `mailto:${data.email}`], ["phone", data.phone, tel(data.phone)], ["mobile", data.mobile, tel(data.mobile)], ["website", data.website, data.website], ["address", data.address, ""]]; return rows.filter(([, value]) => value).map(([key, value, href]) => `<span style="${stacked ? "display:block;margin:4px 0" : "display:inline-block;margin:2px 12px 2px 0"};color:${data.mutedColor};font-size:${size}px;line-height:18px">${data.showIcons ? `${badge(data, key, size + 4, assets)}&nbsp; ` : ""}${href ? `<a href="${url(href)}" style="color:${data.mutedColor};text-decoration:none">${esc(value)}</a>` : esc(value)}</span>`).join(""); }
function extras(data) { const cta = data.ctaText && data.ctaUrl ? `<a href="${url(data.ctaUrl)}" style="display:inline-block;margin-top:9px;padding:7px 11px;color:#fff;background:${data.color};border-radius:4px;text-decoration:none;font:bold 10px Arial">${esc(data.ctaText)}</a>` : ""; const banner = data.bannerUrl ? `<div style="padding-top:12px"><a href="${url(data.bannerLink || data.website)}"><img src="${url(data.bannerUrl)}" width="420" alt="Promotional banner" style="display:block;width:100%;max-width:420px;border:0"></a></div>` : ""; const disclaimer = data.disclaimer ? `<div style="max-width:480px;padding-top:10px;color:#98a2b3;font:9px/14px Arial">${esc(data.disclaimer)}</div>` : ""; return cta + banner + disclaimer; }

function editorial(data, family, size, assets, add) {
  const mark = logo(data, true); const qr = url(data.qrCode); const brandText = data.brandName || data.company; const text = `font-size:${size + 1}px;line-height:20px`;
  const brand = mark || (brandText ? `<div style="color:${data.textColor};font:400 38px/38px Georgia,serif;letter-spacing:-3px;text-align:center">${esc(brandText)}</div>` : "");
  const left = data.signOff || brand || data.tagline ? `<td style="width:165px;padding-right:20px;vertical-align:top">${data.signOff ? `<div style="padding-bottom:27px;font-size:${size + 1}px">${esc(data.signOff)}</div>` : ""}${brand}${data.tagline ? `<div style="max-width:165px;padding-top:6px;font-size:7px;line-height:10px;letter-spacing:3px;text-align:center">${esc(data.tagline)}</div>` : ""}</td>` : "";
  const socials = social(data, assets, ["facebook", "x", "instagram", "linkedin", "youtube", "github", "email"], 21);
  const lines = [[data.phone, tel(data.phone)], [data.mobile, tel(data.mobile)], [data.website, data.website], [data.address, ""]].filter(([value]) => value).map(([value, href]) => `<div style="${text}">${href ? `<a href="${url(href)}" style="color:${data.textColor};text-decoration:none">${esc(value)}</a>` : esc(value)}</div>`).join("");
  const role = [data.title, data.department].filter(Boolean).map(esc).join(" · ");
  const middle = `<td style="padding:${left ? "12px" : "0"} 14px 0 0;vertical-align:top"><strong style="display:block;font-size:${size + 7}px;line-height:22px">${esc(data.name)}${data.pronouns ? ` <small style="color:${data.mutedColor};font-size:10px;font-weight:normal">${esc(data.pronouns)}</small>` : ""}</strong>${role ? `<span style="display:block;font-size:${size + 1}px;line-height:18px">${role}</span>` : ""}${data.company && data.company !== brandText ? `<span style="display:block;color:${data.mutedColor};font-size:${size + 1}px;line-height:18px">${esc(data.company)}</span>` : ""}${socials ? `<div style="padding-top:9px;white-space:nowrap">${socials}</div>` : ""}<div style="padding-top:5px">${lines}</div></td>`;
  const qrCell = qr ? `<td style="padding-top:${left ? 49 : 0}px;vertical-align:top"><img src="${qr}" width="72" height="72" alt="QR code" style="display:block;width:72px;height:72px;border:0"></td>` : "";
  const columns = [left, middle, qrCell].filter(Boolean).length;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${family},Arial,sans-serif;color:${data.textColor}"><tr>${left}${middle}${qrCell}</tr>${add ? `<tr><td colspan="${columns}">${add}</td></tr>` : ""}</table>`;
}

export function createSignatureHtml(input, { assetBase = "" } = {}) {
  const data = normalizeSignature(input);
  const assets = /^https?:\/\/[^\s"'<>]+$/i.test(assetBase) ? esc(assetBase.replace(/\/+$/, "")) : "";
  const size = fontSize[data.size] || 12; const family = esc(data.font); const name = esc(data.name); const role = [data.title, data.department].filter(Boolean).map(esc).join(" · "); const company = esc(data.company); const info = contacts(data, size, assets); const socials = social(data, assets); const add = extras(data); const mark = logo(data);
  const pronouns = data.pronouns ? ` <small style="color:${data.mutedColor};font-size:10px;font-weight:normal">${esc(data.pronouns)}</small>` : "";
  const identity = `<strong style="display:block;color:${data.textColor};font-size:${size + 8}px;line-height:25px">${name}${pronouns}</strong><span style="display:block;color:${data.color};font-size:${size}px;font-weight:bold;line-height:18px">${role}</span><span style="display:block;padding-bottom:6px;color:${data.mutedColor};font-size:${size}px;line-height:18px">${company}</span>`;
  const details = `${identity}<div>${info}</div>${socials ? `<div style="padding-top:7px">${socials}</div>` : ""}${add}`;
  const brandMark = (pad = 7) => mark ? `<div style="padding-bottom:${pad}px">${mark}</div>` : "";
  const table = (inner) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${family},Arial,sans-serif">${inner}</table>`;
  if (data.template === "editorial") return editorial(data, family, size, assets, add);
  if (data.template === "compact") return table(`<tr><td style="padding-top:8px;border-top:1px solid #e4e7ec"><div style="font-size:${size + 2}px;line-height:20px"><strong style="color:${data.textColor}">${name}</strong>${pronouns}${role ? `<span style="color:#d0d5dd"> | </span><span style="color:${data.color};font-weight:bold">${role}</span>` : ""}${company ? `<span style="color:#d0d5dd"> | </span><span style="color:${data.mutedColor}">${company}</span>` : ""}</div><div style="padding-top:2px">${info}</div>${socials ? `<div style="padding-top:5px">${socials}</div>` : ""}${add}</td></tr>`);
  if (data.template === "banner") { const photo = avatar(data, "circle", true); const heading = `<strong style="display:block;color:#fff;font-size:${size + 8}px;line-height:25px">${name}</strong><span style="display:block;color:#f2f4f7;font-size:${size}px;line-height:18px">${[role, company].filter(Boolean).join(" · ")}</span>`; return table(`<tr><td style="width:440px;padding:14px 18px;background:${data.color};border-radius:8px 8px 0 0">${photo ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tr><td style="padding-right:14px;vertical-align:middle">${photo}</td><td style="vertical-align:middle">${heading}</td></tr></table>` : heading}</td></tr><tr><td style="padding:12px 18px;border:1px solid #e4e7ec;border-top:0;border-radius:0 0 8px 8px">${brandMark(8)}<div>${info}</div>${socials ? `<div style="padding-top:7px">${socials}</div>` : ""}${add}</td></tr>`); }
  if (data.template === "split") { const photo = avatar(data, "circle", true); return table(`<tr><td style="padding-right:20px;vertical-align:top">${brandMark(10)}${photo ? `<div style="padding-bottom:10px">${photo}</div>` : ""}${identity}${socials ? `<div style="padding-top:3px">${socials}</div>` : ""}</td><td style="padding-left:20px;border-left:2px solid ${data.color};vertical-align:top">${contacts(data, size, assets, true)}</td></tr>${add ? `<tr><td colspan="2">${add}</td></tr>` : ""}`); }
  if (data.template === "minimal") return table(`<tr><td style="padding-left:12px;border-left:3px solid ${data.color}">${brandMark()}${details}</td></tr>`);
  if (data.template === "executive") { const photo = avatar(data, "circle"); return table(`<tr><td align="center">${photo}<div style="padding-top:8px;text-align:center">${mark ? `<div style="padding-bottom:8px">${logo(data, true)}</div>` : ""}${details}</div></td></tr>`); }
  if (data.template === "creative") { const photo = avatar(data, "rounded"); return table(`<tr><td style="${photo ? "padding:14px" : "width:8px;padding:0"};background:${data.color};vertical-align:top">${photo}</td><td style="padding:14px 18px;background:#f8fafc;vertical-align:top">${brandMark()}${details}</td></tr>`); }
  if (data.template === "corporate") { const photo = avatar(data, "rounded"); return table(`<tr><td colspan="${photo ? 2 : 1}" style="padding-bottom:10px;border-bottom:1px solid #d0d5dd">${mark || `<b style="color:${data.color};letter-spacing:2px">${company}</b>`}</td></tr><tr>${photo ? `<td style="padding-top:12px;vertical-align:top">${photo}</td>` : ""}<td style="padding:12px 0 0 ${photo ? 16 : 0}px;vertical-align:top">${details}</td></tr>`); }
  if (data.template === "modern") { const photo = avatar(data, "rounded"); return table(`<tr>${photo ? `<td style="padding-bottom:10px;vertical-align:top">${photo}</td>` : ""}<td style="padding:0 0 10px ${photo ? 16 : 0}px;vertical-align:top">${brandMark()}${details}</td></tr><tr><td colspan="${photo ? 2 : 1}" style="border-bottom:3px solid ${data.color}"></td></tr>`); }
  const photo = avatar(data, "circle");
  return table(`<tr>${photo ? `<td style="padding-right:17px;vertical-align:top">${photo}</td>` : ""}<td style="padding-left:${photo ? 17 : 12}px;border-left:2px solid ${data.color};vertical-align:top">${brandMark()}${details}</td></tr>`);
}
