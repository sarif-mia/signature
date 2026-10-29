import { STATUS_DURATION } from "./config.js";
import { clearSettings, loadSettings, saveSettings } from "./storage.js";
import { createSignatureHtml } from "./signature.js";
import { downloadFile } from "./utils.js";

const elements = {
  form: document.querySelector("#signature-form"),
  preview: document.querySelector("#signature-preview"),
  colorValue: document.querySelector("#color-value"),
  status: document.querySelector("#status-message"),
  copyButton: document.querySelector("#copy-button"),
  downloadButton: document.querySelector("#download-button"),
  resetButton: document.querySelector("#reset-button"),
};

const defaultSettings = readForm();
let statusTimer;

function readForm() {
  return Object.fromEntries(new FormData(elements.form).entries());
}

function writeForm(settings) {
  Object.entries(settings).forEach(([name, value]) => {
    const field = elements.form.elements.namedItem(name);
    if (!field) return;
    field.value = value;
  });
}

function render() {
  const settings = readForm();
  document.documentElement.style.setProperty("--accent", settings.color);
  document.documentElement.style.setProperty("--accent-soft", `${settings.color}18`);
  elements.colorValue.value = settings.color.toUpperCase();
  elements.preview.innerHTML = createSignatureHtml(settings);
  saveSettings(settings);
}

function showStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("is-error", isError);
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { elements.status.textContent = ""; }, STATUS_DURATION);
}

async function copySignature() {
  const html = createSignatureHtml(readForm());

  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([elements.preview.innerText], { type: "text/plain" }),
      })]);
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(elements.preview);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }
    showStatus("Signature copied — it’s ready to paste.");
  } catch {
    showStatus("Copy was blocked. Select the preview and copy it manually.", true);
  }
}

function downloadSignature() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Email Signature</title></head><body>${createSignatureHtml(readForm())}</body></html>`;
  downloadFile(html, "email-signature.html", "text/html");
  showStatus("HTML file downloaded.");
}

function resetBuilder() {
  clearSettings();
  writeForm(defaultSettings);
  render();
  showStatus("Builder reset to the default example.");
}

elements.form.addEventListener("input", render);
elements.form.addEventListener("submit", (event) => event.preventDefault());
elements.copyButton.addEventListener("click", copySignature);
elements.downloadButton.addEventListener("click", downloadSignature);
elements.resetButton.addEventListener("click", resetBuilder);

const savedSettings = loadSettings();
if (savedSettings) writeForm(savedSettings);
render();
