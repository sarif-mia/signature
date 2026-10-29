export const templates = [
  { id: "classic", name: "Classic", note: "Versatile & balanced" },
  { id: "modern", name: "Modern", note: "Clean photo layout" },
  { id: "minimal", name: "Minimal", note: "Simple & focused" },
  { id: "executive", name: "Executive", note: "Premium centered style" },
  { id: "creative", name: "Creative", note: "Bold color block" },
  { id: "corporate", name: "Corporate", note: "Logo-led profile" },
];

export const defaultSignature = {
  template: "classic", name: "Sarif Mia", pronouns: "", title: "Software Engineer", department: "Product & Engineering", company: "Signature Studio", email: "hello@example.com", phone: "+880 1700 000000", mobile: "", website: "example.com", address: "Dhaka, Bangladesh", photo: "", logo: "", linkedin: "", facebook: "", instagram: "", x: "", youtube: "", github: "", color: "#0f766e", textColor: "#101828", font: "Arial", size: "medium", ctaText: "Book a meeting", ctaUrl: "", bannerUrl: "", bannerLink: "", disclaimer: "", showIcons: true,
};

const esc = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
const url = (value = "") => { if (!value.trim()) return ""; const candidate = /^(https?:|mailto:|tel:|data:image\/)/i.test(value) ? value : `https://${value}`; try { const parsed = new URL(candidate); return ["http:", "https:", "mailto:", "tel:", "data:"].includes(parsed.protocol) ? esc(candidate) : ""; } catch { return ""; } };
const fontSize = { small: 11, medium: 12, large: 13 };

function avatar(data, square = false) { const image = url(data.photo); return image ? `<img src="${image}" width="76" height="76" alt="${esc(data.name)}" style="display:block;width:76px;height:76px;border:0;border-radius:${square ? "12px" : "50%"};object-fit:cover">` : `<div style="width:76px;height:76px;border-radius:${square ? "12px" : "50%"};background:${data.color};color:#fff;font:bold 25px/76px Arial;text-align:center">${esc((data.name || "S").trim().charAt(0).toUpperCase())}</div>`; }
function logo(data) { const src = url(data.logo); return src ? `<img src="${src}" height="28" alt="${esc(data.company)}" style="display:block;max-width:120px;height:28px;object-fit:contain">` : ""; }
function social(data) { const entries = [["in", data.linkedin], ["f", data.facebook], ["ig", data.instagram], ["x", data.x], ["yt", data.youtube], ["gh", data.github]]; return entries.filter(([, href]) => href).map(([label, href]) => `<a href="${url(href)}" style="display:inline-block;margin-right:5px;padding:4px 6px;color:#fff;background:${data.color};border-radius:3px;text-decoration:none;font:bold 9px Arial">${label}</a>`).join(""); }
function contacts(data, size) { const rows = [["E", data.email, `mailto:${data.email}`], ["P", data.phone, `tel:${data.phone.replace(/[^+\d]/g, "")}`], ["M", data.mobile, `tel:${data.mobile.replace(/[^+\d]/g, "")}`], ["W", data.website, data.website], ["A", data.address, ""]]; return rows.filter(([, value]) => value).map(([icon, value, href]) => `<span style="display:inline-block;margin:2px 12px 2px 0;color:#475467;font-size:${size}px;line-height:18px">${data.showIcons ? `<b style="color:${data.color};margin-right:4px">${icon}</b>` : ""}${href ? `<a href="${url(href)}" style="color:#475467;text-decoration:none">${esc(value)}</a>` : esc(value)}</span>`).join(""); }
function extras(data) { const cta = data.ctaText && data.ctaUrl ? `<a href="${url(data.ctaUrl)}" style="display:inline-block;margin-top:9px;padding:7px 11px;color:#fff;background:${data.color};border-radius:4px;text-decoration:none;font:bold 10px Arial">${esc(data.ctaText)}</a>` : ""; const banner = data.bannerUrl ? `<div style="padding-top:12px"><a href="${url(data.bannerLink || data.website)}"><img src="${url(data.bannerUrl)}" width="420" alt="Promotional banner" style="display:block;width:100%;max-width:420px;border:0"></a></div>` : ""; const disclaimer = data.disclaimer ? `<div style="max-width:480px;padding-top:10px;color:#98a2b3;font:9px/14px Arial">${esc(data.disclaimer)}</div>` : ""; return cta + banner + disclaimer; }

export function createSignatureHtml(data) {
  const size = fontSize[data.size] || 12; const family = esc(data.font); const name = esc(data.name); const role = [data.title, data.department].filter(Boolean).map(esc).join(" · "); const company = esc(data.company); const info = contacts(data, size); const socials = social(data); const add = extras(data); const mark = logo(data);
  const details = `<strong style="display:block;color:${data.textColor};font-size:${size + 8}px;line-height:25px">${name}${data.pronouns ? ` <small style="color:#98a2b3;font-size:10px">${esc(data.pronouns)}</small>` : ""}</strong><span style="display:block;color:${data.color};font-size:${size}px;font-weight:bold;line-height:18px">${role}</span><span style="display:block;padding-bottom:6px;color:#667085;font-size:${size}px;line-height:18px">${company}</span><div>${info}</div>${socials ? `<div style="padding-top:7px">${socials}</div>` : ""}${add}`;
  const table = (inner) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${family},Arial,sans-serif">${inner}</table>`;
  if (data.template === "minimal") return table(`<tr><td style="padding-left:12px;border-left:3px solid ${data.color}">${details}</td></tr>`);
  if (data.template === "executive") return table(`<tr><td align="center">${avatar(data)}<div style="padding-top:8px;text-align:center">${details}</div></td></tr>`);
  if (data.template === "creative") return table(`<tr><td style="padding:14px;background:${data.color};vertical-align:top">${avatar(data, true)}</td><td style="padding:14px 18px;background:#f8fafc;vertical-align:top">${details}</td></tr>`);
  if (data.template === "corporate") return table(`<tr><td colspan="2" style="padding-bottom:10px;border-bottom:1px solid #d0d5dd">${mark || `<b style="color:${data.color};letter-spacing:2px">${company}</b>`}</td></tr><tr><td style="padding-top:12px;vertical-align:top">${avatar(data, true)}</td><td style="padding:12px 0 0 16px;vertical-align:top">${details}</td></tr>`);
  if (data.template === "modern") return table(`<tr><td style="padding-bottom:10px;vertical-align:top">${avatar(data, true)}</td><td style="padding:0 0 10px 16px;vertical-align:top">${details}</td></tr><tr><td colspan="2" style="border-bottom:3px solid ${data.color}"></td></tr>`);
  return table(`<tr><td style="padding-right:17px;vertical-align:top">${avatar(data)}</td><td style="padding-left:17px;border-left:2px solid ${data.color};vertical-align:top">${mark ? `<div style="padding-bottom:7px">${mark}</div>` : ""}${details}</td></tr>`);
}
