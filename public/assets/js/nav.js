/* Top navigation. On wide screens the pill nav is always visible. On phones the same element is a
   popover opened by the menu button, so Escape, outside click and focus return come from the browser. */
import { $, $$ } from "./util.js";

export function initNav() {
  const nav = $("#nav"), btn = $("#menuBtn"), bar = $("#topbar");

  nav.addEventListener("toggle", e => {
    const open = e.newState === "open";
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) nav.querySelector("a")?.focus();
  });
  $$(".nav a").forEach(a => a.addEventListener("click", () => nav.matches(":popover-open") && nav.hidePopover()));

  addEventListener("scroll", () => bar.classList.toggle("scrolled", scrollY > 6), { passive: true });
}
