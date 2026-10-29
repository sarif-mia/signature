import { DEFAULT_LOCALE, STORAGE_KEYS } from "../core/config.js";
import { createStore } from "../core/storage.js";
import ar from "./locales/ar.js";
import bn from "./locales/bn.js";
import de from "./locales/de.js";
import en from "./locales/en.js";
import es from "./locales/es.js";
import fr from "./locales/fr.js";

// To add a language: create locales/<code>.js mirroring en.js, register it
// here, then run `npm run check:i18n`.
export const LOCALES = {
  en: { name: "English", dir: "ltr", messages: en },
  es: { name: "Español", dir: "ltr", messages: es },
  fr: { name: "Français", dir: "ltr", messages: fr },
  de: { name: "Deutsch", dir: "ltr", messages: de },
  bn: { name: "বাংলা", dir: "ltr", messages: bn },
  ar: { name: "العربية", dir: "rtl", messages: ar },
};

const store = createStore(STORAGE_KEYS.locale);
const listeners = new Set();
let currentLocale = DEFAULT_LOCALE;

function lookup(messages, key) {
  return key.split(".").reduce((node, part) => node?.[part], messages);
}

function normalize(code) {
  return String(code || "").toLowerCase().split("-")[0];
}

export function t(key, params = {}) {
  const message = lookup(LOCALES[currentLocale].messages, key) ?? lookup(LOCALES[DEFAULT_LOCALE].messages, key);
  if (typeof message !== "string") return key;
  return message.replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match);
}

export function getLocale() {
  return currentLocale;
}

export function onLocaleChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Elements opt in with:
//   data-i18n="key"                      -> textContent
//   data-i18n-html="key"                 -> innerHTML (trusted locale strings only)
//   data-i18n-attr="placeholder:key;..." -> attributes
//   data-i18n-params='{"current":1}'     -> interpolation values for data-i18n
export function translatePage(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    const params = element.dataset.i18nParams ? JSON.parse(element.dataset.i18nParams) : {};
    element.textContent = t(element.dataset.i18n, params);
  });

  root.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  root.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attribute, key] = pair.split(":").map((part) => part.trim());
      if (attribute && key) element.setAttribute(attribute, t(key));
    });
  });
}

function applyLocale(code) {
  currentLocale = code;
  document.documentElement.lang = code;
  document.documentElement.dir = LOCALES[code].dir;
  translatePage();
  listeners.forEach((listener) => listener(code));
}

export function setLocale(code) {
  const locale = normalize(code);
  if (!(locale in LOCALES)) return;
  store.save(locale);
  applyLocale(locale);
}

// Priority: ?lang= query parameter, saved choice, browser languages, default.
function detectLocale() {
  const candidates = [
    new URLSearchParams(window.location.search).get("lang"),
    store.load(),
    ...(navigator.languages || [navigator.language]),
  ];
  return candidates.map(normalize).find((code) => code in LOCALES) || DEFAULT_LOCALE;
}

export function initI18n() {
  applyLocale(detectLocale());
}
