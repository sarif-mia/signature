import { mountLanguageSwitchers } from "../components/language-switcher.js";
import { STATUS_DURATION, STORAGE_KEYS } from "../core/config.js";
import { createStore } from "../core/storage.js";
import { downloadFile } from "../core/utils.js";
import { initI18n, onLocaleChange, t } from "../i18n/index.js";
import { createSignatureHtml } from "../signature/templates.js";

const NEXT_LABEL_KEYS = [
  "builder.actions.nextDetails",
  "builder.actions.nextImages",
  "builder.actions.nextStyle",
  "builder.actions.copy",
];

const elements = {
  form: document.querySelector("#signature-form"),
  preview: document.querySelector("#signature-preview"),
  colorValue: document.querySelector("#color-value"),
  status: document.querySelector("#status-message"),
  copyButton: document.querySelector("#copy-button"),
  downloadButton: document.querySelector("#download-button"),
  resetButton: document.querySelector("#reset-button"),
  backButton: document.querySelector("#back-button"),
  nextButton: document.querySelector("#next-button"),
  navSteps: [...document.querySelectorAll(".nav-step")],
  panels: [...document.querySelectorAll(".form-panel")],
};

const settingsStore = createStore(STORAGE_KEYS.settings);
const defaults = readForm();
let activePanel = 0;
let statusTimer;

function readForm() {
  return Object.fromEntries(new FormData(elements.form).entries());
}

function writeForm(settings) {
  Object.entries(settings).forEach(([name, value]) => {
    const field = elements.form.elements.namedItem(name);
    if (field) field.value = value;
  });
}

function render() {
  const settings = readForm();
  const root = document.documentElement.style;
  root.setProperty("--accent", settings.color);
  root.setProperty("--accent-soft", `${settings.color}18`);
  elements.colorValue.value = settings.color.toUpperCase();
  elements.preview.innerHTML = createSignatureHtml(settings);
  settingsStore.save(settings);
}

function showStatus(messageKey, isError = false) {
  elements.status.textContent = t(messageKey);
  elements.status.classList.toggle("is-error", isError);
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    elements.status.textContent = "";
  }, STATUS_DURATION);
}

function updateNextButton() {
  const isLast = activePanel === elements.panels.length - 1;
  const label = document.createElement("span");
  const icon = document.createElement("span");
  label.textContent = t(NEXT_LABEL_KEYS[activePanel]);
  icon.className = isLast ? "" : "arrow";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = isLast ? "▣" : "→";
  elements.nextButton.replaceChildren(label, " ", icon);
}

function showPanel(index) {
  activePanel = Math.max(0, Math.min(index, elements.panels.length - 1));

  elements.navSteps.forEach((button, i) => {
    const isActive = i === activePanel;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });

  elements.panels.forEach((panel, i) => {
    panel.hidden = i !== activePanel;
    panel.classList.toggle("is-active", i === activePanel);
  });

  elements.backButton.disabled = activePanel === 0;
  updateNextButton();
}

async function copySignature() {
  const html = createSignatureHtml(readForm());
  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([elements.preview.innerText], { type: "text/plain" }),
        }),
      ]);
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(elements.preview);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }
    showStatus("builder.status.copied");
  } catch {
    showStatus("builder.status.copyBlocked", true);
  }
}

function downloadSignature() {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Email Signature</title></head><body>${createSignatureHtml(readForm())}</body></html>`;
  downloadFile(html, "email-signature.html", "text/html");
  showStatus("builder.status.downloaded");
}

function resetBuilder() {
  settingsStore.clear();
  writeForm(defaults);
  showPanel(0);
  render();
  showStatus("builder.status.reset");
}

function bindEvents() {
  elements.form.addEventListener("input", render);
  elements.form.addEventListener("submit", (event) => event.preventDefault());
  elements.copyButton.addEventListener("click", copySignature);
  elements.downloadButton.addEventListener("click", downloadSignature);
  elements.resetButton.addEventListener("click", resetBuilder);
  elements.backButton.addEventListener("click", () => showPanel(activePanel - 1));
  elements.nextButton.addEventListener("click", () => {
    if (activePanel === elements.panels.length - 1) copySignature();
    else showPanel(activePanel + 1);
  });
  elements.navSteps.forEach((button, index) => button.addEventListener("click", () => showPanel(index)));
  onLocaleChange(updateNextButton);
}

initI18n();
mountLanguageSwitchers();
bindEvents();

const saved = settingsStore.load();
if (saved) writeForm(saved);
const requestedLayout = new URLSearchParams(window.location.search).get("template");
const requestedField = elements.form.querySelector(`input[name="layout"][value="${CSS.escape(requestedLayout || "")}"]`);
if (requestedField) requestedField.checked = true;
showPanel(0);
render();
