// Verifies every locale has exactly the same keys and {placeholders} as en.js.
// Usage: npm run check:i18n
import { readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const localesDir = fileURLToPath(new URL("../assets/js/i18n/locales/", import.meta.url));
const SOURCE = "en";

function flatten(messages, prefix = "") {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" ? flatten(value, path) : [[path, value]];
  });
}

function placeholders(message) {
  return [...message.matchAll(/\{(\w+)\}/g)].map(([, name]) => name).sort().join(",");
}

async function loadLocale(code) {
  const module = await import(pathToFileURL(`${localesDir}${code}.js`).href);
  return new Map(flatten(module.default));
}

const codes = (await readdir(localesDir)).filter((file) => file.endsWith(".js")).map((file) => file.replace(/\.js$/, ""));
const source = await loadLocale(SOURCE);
let problems = 0;

for (const code of codes.filter((code) => code !== SOURCE)) {
  const locale = await loadLocale(code);
  const report = (message) => {
    problems += 1;
    console.error(`[${code}] ${message}`);
  };

  for (const [key, message] of source) {
    if (!locale.has(key)) report(`missing key "${key}"`);
    else if (typeof locale.get(key) !== "string" || !locale.get(key).trim()) report(`empty value for "${key}"`);
    else if (placeholders(locale.get(key)) !== placeholders(message)) report(`placeholder mismatch in "${key}"`);
  }
  for (const key of locale.keys()) {
    if (!source.has(key)) report(`unknown key "${key}"`);
  }
}

if (problems) {
  console.error(`\n${problems} locale problem(s) found.`);
  process.exit(1);
}
console.log(`All ${codes.length} locales match ${SOURCE}.js (${source.size} keys).`);
