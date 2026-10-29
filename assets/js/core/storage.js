// Small JSON wrapper around localStorage. Every call is guarded so the app
// keeps working in private windows or when storage is full or blocked.
export function createStore(key) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        this.clear();
        return null;
      }
    },

    save(value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Persistence is a convenience; ignore failures.
      }
    },

    clear() {
      try {
        localStorage.removeItem(key);
      } catch {
        // Storage is unavailable.
      }
    },
  };
}
