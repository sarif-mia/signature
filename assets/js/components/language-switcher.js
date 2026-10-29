import { LOCALES, getLocale, onLocaleChange, setLocale } from "../i18n/index.js";

export function mountLanguageSwitchers(root = document) {
  root.querySelectorAll("[data-language-select]").forEach((select) => {
    const options = Object.entries(LOCALES).map(([code, { name }]) => {
      const option = new Option(name, code);
      option.lang = code;
      return option;
    });

    select.replaceChildren(...options);
    select.value = getLocale();
    select.addEventListener("change", () => setLocale(select.value));
    onLocaleChange((code) => {
      select.value = code;
    });
  });
}
