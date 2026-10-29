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
  const html = createSignatureHtml({ ...defaultSignature, template: "editorial", logo: "", brandName: "NDS9", qrCode: "javascript:alert(1)" });
  assert.match(html, /NDS9/);
  assert.match(html, /QR CODE/);
  assert.doesNotMatch(html, /javascript:/i);
});
