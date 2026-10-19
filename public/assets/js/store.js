/* Content (from data.js) and saved state.
   localStorage keys keep the old "ems-hub:" prefix on purpose so people keep their saved progress. */
export const D = window.MILCITY_DATA;

export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem("ems-hub:" + key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("ems-hub:" + key, JSON.stringify(value));
    } catch {
      /* private mode: still works this visit */
    }
  }
};

/* Starred tools shown in Quick access. */
let pins = store.get("pins-v2", D.DEFAULT_PINS);
export const getPins = () => pins;
export function setPins(next) {
  pins = next;
  store.set("pins-v2", pins);
}
