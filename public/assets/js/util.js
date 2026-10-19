/* Small shared helpers: DOM shortcuts, escaping, link types, toast. */
export const $ = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = s => String(s).replace(/[&<>"']/g, c => ENTITIES[c]);

export const TYPE = {
  sheet: { label: "Google Sheet", icon: "i-sheet" },
  form: { label: "Google Form", icon: "i-form" },
  canva: { label: "Canva", icon: "i-canva" },
  pdf: { label: "PDF", icon: "i-pdf" },
  ghl: { label: "GoHighLevel", icon: "i-rocket" },
  multi: { label: "Sheet, Canva and PDF", icon: "i-book" }
};
export const toolIcon = t => (t.group === "team" ? "i-user" : TYPE[t.type].icon);
export const NEWTAB = `<span class="sr"> (opens in a new tab)</span>`;
export const statusTag = t => (t.status === "update" ? `<span class="tag-update">To be updated</span>` : "");
export const hasLink = t => (t.formats ? t.formats.some(f => f.url) : !!t.url);

let toastTimer;
export function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}
export const openUrl = url => window.open(url, "_blank", "noopener,noreferrer");
export async function copyText(url, name) {
  try {
    await navigator.clipboard.writeText(url);
    toast(`Copied link to ${name}`);
  } catch {
    toast("Couldn't copy. Open the link and copy it from the address bar.");
  }
}

/* One delegated listener per section: runs handlers[data-action] for the nearest [data-action]. */
export function delegate(root, type, handlers) {
  root.addEventListener(type, e => {
    const el = e.target.closest("[data-action]");
    if (!el || !root.contains(el)) return;
    handlers[el.dataset.action]?.(el, e);
  });
}
