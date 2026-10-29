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

export const defaultSignature = {
  template: "editorial", name: "Sarif Mia", pronouns: "", title: "IT Executive", department: "", company: "Information Technology", brandName: "NDS9", tagline: "CURATING FASHION · SPAIN", signOff: "Best Regards,", email: "hello@example.com", phone: "(+880) 1571447136", mobile: "", website: "www.nds9.co", address: "", photo: "", logo: "", qrCode: "", linkedin: "", facebook: "", instagram: "", x: "", youtube: "", github: "", color: "#111111", textColor: "#111111", font: "Arial", size: "medium", ctaText: "", ctaUrl: "", bannerUrl: "", bannerLink: "", disclaimer: "", showIcons: true,
};

const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
const url = (value = "") => { if (!value.trim()) return ""; const candidate = /^(https?:|mailto:|tel:|data:image\/)/i.test(value) ? value : `https://${value}`; try { const parsed = new URL(candidate); return ["http:", "https:", "mailto:", "tel:", "data:"].includes(parsed.protocol) ? esc(candidate) : ""; } catch { return ""; } };
const fontSize = { small: 11, medium: 12, large: 13 };
const safeFonts = ["Arial", "Verdana", "Georgia", "Tahoma", "Trebuchet MS"];
const color = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;

export function normalizeSignature(input = {}) {
  return {
    ...defaultSignature,
    ...input,
    template: templates.some(({ id }) => id === input.template) ? input.template : defaultSignature.template,
    color: color(input.color, defaultSignature.color),
    textColor: color(input.textColor, defaultSignature.textColor),
    font: safeFonts.includes(input.font) ? input.font : defaultSignature.font,
    size: Object.hasOwn(fontSize, input.size) ? input.size : defaultSignature.size,
    showIcons: input.showIcons !== false,
  };
}

function avatar(data, square = false) { const image = url(data.photo); return image ? `<img src="${image}" width="76" height="76" alt="${esc(data.name)}" style="display:block;width:76px;height:76px;border:0;border-radius:${square ? "12px" : "50%"};object-fit:cover">` : `<div style="width:76px;height:76px;border-radius:${square ? "12px" : "50%"};background:${data.color};color:#fff;font:bold 25px/76px Arial;text-align:center">${esc((data.name || "S").trim().charAt(0).toUpperCase())}</div>`; }
function logo(data) { const src = url(data.logo); return src ? `<img src="${src}" height="28" alt="${esc(data.company)}" style="display:block;max-width:120px;height:28px;object-fit:contain">` : ""; }
function social(data) { const entries = [["in", data.linkedin], ["f", data.facebook], ["ig", data.instagram], ["x", data.x], ["yt", data.youtube], ["gh", data.github]]; return entries.map(([label, href]) => [label, url(href)]).filter(([, href]) => href).map(([label, href]) => `<a href="${href}" style="display:inline-block;margin-right:5px;padding:4px 6px;color:#fff;background:${data.color};border-radius:3px;text-decoration:none;font:bold 9px Arial">${label}</a>`).join(""); }
function contacts(data, size, stacked = false) { const rows = [["E", data.email, `mailto:${data.email}`], ["P", data.phone, `tel:${data.phone.replace(/[^+\d]/g, "")}`], ["M", data.mobile, `tel:${data.mobile.replace(/[^+\d]/g, "")}`], ["W", data.website, data.website], ["A", data.address, ""]]; return rows.filter(([, value]) => value).map(([icon, value, href]) => `<span style="${stacked ? "display:block;margin:3px 0" : "display:inline-block;margin:2px 12px 2px 0"};color:#475467;font-size:${size}px;line-height:18px">${data.showIcons ? `<b style="color:${data.color};margin-right:4px">${icon}</b>` : ""}${href ? `<a href="${url(href)}" style="color:#475467;text-decoration:none">${esc(value)}</a>` : esc(value)}</span>`).join(""); }
function extras(data) { const cta = data.ctaText && data.ctaUrl ? `<a href="${url(data.ctaUrl)}" style="display:inline-block;margin-top:9px;padding:7px 11px;color:#fff;background:${data.color};border-radius:4px;text-decoration:none;font:bold 10px Arial">${esc(data.ctaText)}</a>` : ""; const banner = data.bannerUrl ? `<div style="padding-top:12px"><a href="${url(data.bannerLink || data.website)}"><img src="${url(data.bannerUrl)}" width="420" alt="Promotional banner" style="display:block;width:100%;max-width:420px;border:0"></a></div>` : ""; const disclaimer = data.disclaimer ? `<div style="max-width:480px;padding-top:10px;color:#98a2b3;font:9px/14px Arial">${esc(data.disclaimer)}</div>` : ""; return cta + banner + disclaimer; }

function editorialSocial(data) {
  const items = [["f", data.facebook], ["x", data.x], ["◎", data.instagram], ["in", data.linkedin], ["✉", data.email ? `mailto:${data.email}` : ""]];
  return items.map(([label, href]) => {
    const badge = `<span style="display:block;width:21px;height:21px;color:#fff;background:#4b4b4b;border-radius:4px;font:bold 10px/21px Arial;text-align:center">${label}</span>`;
    return href ? `<a href="${url(href)}" style="display:inline-block;margin-right:4px;text-decoration:none">${badge}</a>` : `<span style="display:inline-block;margin-right:4px">${badge}</span>`;
  }).join("");
}

function editorial(data, family, size) {
  const mark = logo(data);
  const qr = url(data.qrCode);
  const brand = mark || `<div style="color:${data.textColor};font:400 38px/38px Georgia,serif;letter-spacing:-3px">${esc(data.brandName || data.company)}</div>`;
  const qrBlock = qr ? `<img src="${qr}" width="72" height="72" alt="QR code" style="display:block;width:72px;height:72px;border:0">` : `<div style="width:68px;height:68px;padding:4px;color:#111;border:2px solid #111;font:bold 10px/14px Arial;text-align:center"><div style="font-size:25px;line-height:34px">▦</div>QR CODE</div>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${family},Arial,sans-serif;color:${data.textColor}"><tr><td style="width:165px;padding-right:20px;vertical-align:top"><div style="padding-bottom:27px;font-size:${size + 1}px">${esc(data.signOff)}</div>${brand}<div style="max-width:145px;padding-top:6px;font-size:7px;line-height:10px;letter-spacing:3px;text-align:center">${esc(data.tagline)}</div></td><td style="width:150px;padding:12px 14px 0 0;vertical-align:top"><strong style="display:block;font-size:${size + 7}px;line-height:22px">${esc(data.name)}</strong><span style="display:block;font-size:${size + 1}px;line-height:18px">${esc(data.title)}</span><span style="display:block;padding-bottom:9px;color:#555;font-size:${size + 1}px;line-height:18px">${esc(data.company)}</span><div style="height:25px;white-space:nowrap">${editorialSocial(data)}</div><div style="padding-top:5px;font-size:${size + 1}px;line-height:20px">${esc(data.phone)}</div><div style="font-size:${size + 1}px;line-height:20px"><a href="${url(data.website)}" style="color:${data.textColor};text-decoration:none">${esc(data.website)}</a></div></td><td style="padding-top:49px;vertical-align:top">${qrBlock}</td></tr></table>`;
}

export function createSignatureHtml(data) {
  data = normalizeSignature(data);
  const size = fontSize[data.size] || 12; const family = esc(data.font); const name = esc(data.name); const role = [data.title, data.department].filter(Boolean).map(esc).join(" · "); const company = esc(data.company); const info = contacts(data, size); const socials = social(data); const add = extras(data); const mark = logo(data);
  const details = `<strong style="display:block;color:${data.textColor};font-size:${size + 8}px;line-height:25px">${name}${data.pronouns ? ` <small style="color:#98a2b3;font-size:10px">${esc(data.pronouns)}</small>` : ""}</strong><span style="display:block;color:${data.color};font-size:${size}px;font-weight:bold;line-height:18px">${role}</span><span style="display:block;padding-bottom:6px;color:#667085;font-size:${size}px;line-height:18px">${company}</span><div>${info}</div>${socials ? `<div style="padding-top:7px">${socials}</div>` : ""}${add}`;
  const table = (inner) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${family},Arial,sans-serif">${inner}</table>`;
  if (data.template === "editorial") return editorial(data, family, size);
  if (data.template === "compact") return table(`<tr><td style="padding-top:8px;border-top:1px solid #e4e7ec"><div style="font-size:${size + 2}px;line-height:20px"><strong style="color:${data.textColor}">${name}</strong>${role ? `<span style="color:#d0d5dd"> | </span><span style="color:${data.color};font-weight:bold">${role}</span>` : ""}${company ? `<span style="color:#d0d5dd"> | </span><span style="color:#667085">${company}</span>` : ""}</div><div style="padding-top:2px">${info}</div>${socials ? `<div style="padding-top:5px">${socials}</div>` : ""}${add}</td></tr>`);
  if (data.template === "banner") return table(`<tr><td style="width:440px;padding:14px 18px;background:${data.color};border-radius:8px 8px 0 0"><strong style="display:block;color:#fff;font-size:${size + 8}px;line-height:25px">${name}</strong><span style="display:block;color:#f2f4f7;font-size:${size}px;line-height:18px">${[role, company].filter(Boolean).join(" · ")}</span></td></tr><tr><td style="padding:12px 18px;border:1px solid #e4e7ec;border-top:0;border-radius:0 0 8px 8px">${mark ? `<div style="padding-bottom:8px">${mark}</div>` : ""}<div>${info}</div>${socials ? `<div style="padding-top:7px">${socials}</div>` : ""}${add}</td></tr>`);
  if (data.template === "split") return table(`<tr><td style="padding-right:20px;vertical-align:top">${mark ? `<div style="padding-bottom:10px">${mark}</div>` : ""}<strong style="display:block;color:${data.textColor};font-size:${size + 8}px;line-height:25px">${name}${data.pronouns ? ` <small style="color:#98a2b3;font-size:10px">${esc(data.pronouns)}</small>` : ""}</strong><span style="display:block;color:${data.color};font-size:${size}px;font-weight:bold;line-height:18px">${role}</span><span style="display:block;color:#667085;font-size:${size}px;line-height:18px">${company}</span>${socials ? `<div style="padding-top:9px">${socials}</div>` : ""}</td><td style="padding-left:20px;border-left:2px solid ${data.color};vertical-align:top">${contacts(data, size, true)}</td></tr>${add ? `<tr><td colspan="2">${add}</td></tr>` : ""}`);
  if (data.template === "minimal") return table(`<tr><td style="padding-left:12px;border-left:3px solid ${data.color}">${details}</td></tr>`);
  if (data.template === "executive") return table(`<tr><td align="center">${avatar(data)}<div style="padding-top:8px;text-align:center">${details}</div></td></tr>`);
  if (data.template === "creative") return table(`<tr><td style="padding:14px;background:${data.color};vertical-align:top">${avatar(data, true)}</td><td style="padding:14px 18px;background:#f8fafc;vertical-align:top">${details}</td></tr>`);
  if (data.template === "corporate") return table(`<tr><td colspan="2" style="padding-bottom:10px;border-bottom:1px solid #d0d5dd">${mark || `<b style="color:${data.color};letter-spacing:2px">${company}</b>`}</td></tr><tr><td style="padding-top:12px;vertical-align:top">${avatar(data, true)}</td><td style="padding:12px 0 0 16px;vertical-align:top">${details}</td></tr>`);
  if (data.template === "modern") return table(`<tr><td style="padding-bottom:10px;vertical-align:top">${avatar(data, true)}</td><td style="padding:0 0 10px 16px;vertical-align:top">${details}</td></tr><tr><td colspan="2" style="border-bottom:3px solid ${data.color}"></td></tr>`);
  return table(`<tr><td style="padding-right:17px;vertical-align:top">${avatar(data)}</td><td style="padding-left:17px;border-left:2px solid ${data.color};vertical-align:top">${mark ? `<div style="padding-bottom:7px">${mark}</div>` : ""}${details}</td></tr>`);
}
