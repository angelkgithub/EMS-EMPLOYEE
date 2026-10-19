/* Hash router. Page modules register hooks: show() when their page opens,
   after(arg) once it is visible (used to flash a tool card). */
import { $, $$, reduced } from "./util.js";

const pages = $$(".page");
const views = {};
let current = null;
let first = true;
let pending = null;

export const registerView = (id, hooks) => { views[id] = hooks; };
export const setPending = value => { pending = value; };

export function go(id, focusTool) {
  if (focusTool) pending = focusTool;
  if (location.hash === "#" + id) route(true);
  else location.hash = id;
}

function route(force) {
  const id = (location.hash || "#home").slice(1);
  const next = pages.find(p => p.dataset.page === id);
  if (!next) return;

  const after = () => {
    if (!pending || !views[id]?.after) return;
    const arg = pending;
    pending = null;
    setTimeout(() => views[id].after(arg), reduced() ? 0 : 120);
  };
  if (next === current) {
    if (force) after();
    return;
  }

  const show = () => {
    pages.forEach(p => p.classList.remove("active"));
    next.classList.add("active");
    current = next;
    document.title = next.dataset.title;
    $$(".nav a").forEach(a =>
      a.getAttribute("href") === "#" + id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")
    );
    scrollTo({ top: 0, behavior: "instant" });
    views[id]?.show?.();
    if (!first) next.querySelector("h1")?.focus({ preventScroll: true });
    first = false;
    after();
  };

  if (current && !reduced() && document.startViewTransition) document.startViewTransition(show);
  else show();
}

export function initRouter() {
  addEventListener("hashchange", () => route());
  route();
}
