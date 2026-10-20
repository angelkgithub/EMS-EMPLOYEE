import { $, $$, esc, openUrl, reduced, toast, toolIcon, TYPE } from "./util.js";
import { D } from "./store.js";
import { go } from "./router.js";
import { openPerson, people } from "./org.js";

const PAGES = [["home", "Home", "i-home"], ["tools", "Tools and links", "i-link"], ["training", "Training", "i-play"], ["org", "Leadership team", "i-org"], ["rules", "House rules", "i-rules"]];

function paletteItems() {
  const items = PAGES.map(([id, label, icon]) => ({ label, kind: "Page", icon, run: () => go(id) }));
  D.TOOLS.forEach(t => {
    if (t.formats) {
      t.formats.forEach(f => items.push({
        label: `${t.name} (${f.label})`, kind: TYPE[f.type].label, icon: TYPE[f.type].icon,
        run: () => (f.url ? openUrl(f.url) : (go("tools", t.id), toast(`The ${f.label} link hasn't been added yet.`)))
      }));
    } else {
      items.push({
        label: t.name, kind: TYPE[t.type].label, icon: toolIcon(t),
        run: () => (t.url ? openUrl(t.url) : (go("tools", t.id), toast(`The link for ${t.name} hasn't been added yet.`)))
      });
    }
  });
  D.VIDEOS.forEach(v => items.push({ label: v.title, kind: "Video", icon: "i-play", run: () => go("training") }));
  D.RECORDINGS.forEach((r, i) => items.push({
    label: r.title, kind: "Recording", icon: "i-head",
    run: () => { go("training"); setTimeout(() => $("#rec-" + i)?.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" }), 260); }
  }));
  people.forEach(p => items.push({
    label: `${p.name}, ${p.role}`, kind: "Person", icon: "i-user",
    run: () => { go("org"); setTimeout(() => openPerson(p._id), 260); }
  }));
  items.push({ label: "House rules PDF", kind: "PDF", icon: "i-pdf", run: () => (D.RULES_PDF.url ? openUrl(D.RULES_PDF.url) : go("rules")) });
  return items;
}

export function initSearch() {
  const pal = $("#palette"), input = $("#palQ"), list = $("#palList");
  let results = [], sel = 0;

  const isMac = /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform || "");
  $("#kbd").textContent = isMac ? "⌘ K" : "Ctrl K";

  function render() {
    const q = input.value.trim().toLowerCase();
    results = paletteItems().filter(it => !q || (it.label + " " + it.kind).toLowerCase().includes(q)).slice(0, 30);
    sel = Math.min(sel, Math.max(0, results.length - 1));
    list.innerHTML = results.length
      ? results.map((it, i) => `<li role="option" id="po-${i}" aria-selected="${i === sel}" data-i="${i}"><span class="mark"><svg><use href="#${it.icon}"/></svg></span><span>${esc(it.label)}</span><small>${esc(it.kind)}</small></li>`).join("")
      : `<li class="pal-none" role="presentation">No results for “${esc(input.value)}”</li>`;
    input.setAttribute("aria-activedescendant", results.length ? "po-" + sel : "");
  }
  const move = delta => {
    sel = Math.max(0, Math.min(sel + delta, results.length - 1));
    render();
    $("#po-" + sel)?.scrollIntoView({ block: "nearest" });
  };
  const run = i => {
    const it = results[i];
    if (!it) return;
    pal.close();
    it.run();
  };
  function open() {
    $("#nav").matches(":popover-open") && $("#nav").hidePopover();
    input.value = "";
    sel = 0;
    render();
    pal.showModal();
  }

  $("#findBtn").addEventListener("click", open);
  input.addEventListener("input", () => { sel = 0; render(); });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { e.preventDefault(); run(sel); }
  });
  list.addEventListener("click", e => { const li = e.target.closest("[data-i]"); if (li) run(+li.dataset.i); });
  list.addEventListener("mousemove", e => {
    const li = e.target.closest("[data-i]");
    if (li && sel !== +li.dataset.i) { sel = +li.dataset.i; render(); }
  });
  /* A click on the dialog itself (not its contents) is a click on the backdrop. */
  pal.addEventListener("click", e => { if (e.target === pal) pal.close(); });
  addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      pal.open ? pal.close() : open();
    }
  });
}
