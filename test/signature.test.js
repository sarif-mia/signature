import test from "node:test";
import assert from "node:assert/strict";
import { createSignatureHtml, defaultSignature, normalizeSignature, templates } from "../src/lib/signature.js";

test("every template produces an email-safe presentation table", () => {
  templates.forEach(({ id }) => {
    const html = createSignatureHtml({ ...defaultSignature, template: id });
    assert.match(html, /<table role="presentation"/);
    assert.match(html, /style="/);
    assert.doesNotMatch(html, /<script/i);
  });
});

test("escapes visible user content", () => {
  const html = createSignatureHtml({ ...defaultSignature, name: '<script>alert("x")</script>' });
  assert.doesNotMatch(html, /<script>/i);
  assert.match(html, /&lt;script&gt;/);
});

test("rejects unsafe URLs and invalid style values", () => {
  const data = normalizeSignature({ template: "unknown", color: "red;position:fixed", font: "Comic Sans", linkedin: "javascript:alert(1)" });
  const html = createSignatureHtml(data);
  assert.equal(data.template, defaultSignature.template);
  assert.equal(data.color, defaultSignature.color);
  assert.equal(data.font, defaultSignature.font);
  assert.doesNotMatch(html, /javascript:/i);
});

test("editorial template renders brand fallback and safe QR code", () => {
  const html = createSignatureHtml({ ...defaultSignature, template: "editorial", logo: "", brandName: "ACME", qrCode: "javascript:alert(1)" });
  assert.match(html, /ACME/);
  assert.doesNotMatch(html, /alt="QR code"/);
  assert.doesNotMatch(html, /javascript:/i);
});

test("uses hosted PNG icons only for a valid http asset base", () => {
  const data = { ...defaultSignature, template: "classic", linkedin: "linkedin.com/in/name" };
  const hosted = createSignatureHtml(data, { assetBase: "https://signature.example/" });
  assert.match(hosted, /src="https:\/\/signature\.example\/icons\/linkedin\.png"/);
  assert.match(hosted, /src="https:\/\/signature\.example\/icons\/email\.png"/);
  const unsafe = createSignatureHtml(data, { assetBase: "javascript:alert(1)" });
  assert.doesNotMatch(unsafe, /icons\//);
  assert.doesNotMatch(unsafe, /javascript:/i);
});

test("clamps sizes and shapes to supported values", () => {
  const data = normalizeSignature({ photoSize: "999", logoHeight: "abc", iconShape: "star", photoShape: "auto", mutedColor: "blue" });
  assert.equal(data.photoSize, 120);
  assert.equal(data.logoHeight, defaultSignature.logoHeight);
  assert.equal(data.iconShape, defaultSignature.iconShape);
  assert.equal(data.photoShape, "auto");
  assert.equal(data.mutedColor, defaultSignature.mutedColor);
});

test("hides the initials avatar when disabled", () => {
  const html = createSignatureHtml({ ...defaultSignature, template: "classic", name: "Ada Lovelace", photo: "", showAvatar: false });
  assert.doesNotMatch(html, />AL</);
  assert.match(createSignatureHtml({ ...defaultSignature, template: "classic", name: "Ada Lovelace" }), />AL</);
});
