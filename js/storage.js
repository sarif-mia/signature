import { STORAGE_KEY } from "./config.js";

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // The builder still works when storage is unavailable or full.
  }
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSettings() {
  localStorage.removeItem(STORAGE_KEY);
}
