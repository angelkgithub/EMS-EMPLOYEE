import { $, copyText, delegate, esc, hasLink, NEWTAB, reduced, statusTag, toast, toolIcon, TYPE } from "./util.js";
import { D, getPins, setPins } from "./store.js";
import { registerView } from "./router.js";
import { renderQuick } from "./home.js";

let groupFilter = "all";
let query = "";

function renderChips() {
  $("#chips").innerHTML = [{ id: "all", name: "All" }, ...D.GROUPS]
    .map(g => `<button class="chip" type="button" data-action="filter" data-g="${esc(g.id)}" aria-pressed="${groupFilter === g.id}">${esc(g.name)}</button>`)
    .join("");
}

function toolCard(t, i) {
  const pinned = getPins().includes(t.id);
  let actions;
  if (t.formats) {
    actions = t.formats
      .map(f =>
        f.url
          ? `<a class="btn ${f === t.formats[0] ? "btn-primary" : "btn-ghost"}" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer"><svg><use href="#${TYPE[f.type].icon}"/></svg>${esc(f.label)}${NEWTAB}</a>`
          : `<button class="btn btn-ghost" type="button" disabled title="Link not added yet"><svg><use href="#${TYPE[f.type].icon}"/></svg>${esc(f.label)}</button>`
      )
      .join("");
    if (!hasLink(t)) actions += `<span class="pending">Links not added yet</span>`;
  } else if (t.url) {
    actions = `<a class="btn ${t.primary ? "btn-light" : "btn-primary"}" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">Open<span class="sr"> ${esc(t.name)}</span>${NEWTAB}<svg aria-hidden="true"><use href="#i-ext"/></svg></a><button class="icon-btn" type="button" data-action="copy" data-id="${esc(t.id)}" aria-label="Copy link to ${esc(t.name)}"><svg><use href="#i-copy"/></svg></button>`;
  } else {
    actions = `<span class="pending">Link not added yet</span>`;
  }
  const kind = TYPE[t.type];
  return `<article class="tool${t.primary ? " tool-primary" : ""}" id="tool-${esc(t.id)}" style="animation-delay:${Math.min(i, 10) * 40}ms">
      <div class="tool-head"><span class="ico-tile" aria-hidden="true"><svg><use href="#${toolIcon(t)}"/></svg></span>
        <div class="tool-txt"><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p></div>
        <button class="icon-btn" type="button" data-action="pin" data-id="${esc(t.id)}" aria-pressed="${pinned}" aria-label="${pinned ? "Remove" : "Add"} ${esc(t.name)} ${pinned ? "from" : "to"} quick access"><svg><use href="#i-star"/></svg></button></div>
      <div class="tool-foot"><span class="tool-type"><span class="chip-type"><svg aria-hidden="true"><use href="#${toolIcon(t)}"/></svg>${kind.label}</span>${statusTag(t)}</span>
        <div class="tool-actions">${actions}</div></div></article>`;
}

function renderTools() {
  const q = query.trim().toLowerCase();
  let i = 0;
  const html = D.GROUPS.filter(g => groupFilter === "all" || g.id === groupFilter)
    .map(g => {
      const items = D.TOOLS.filter(t => t.group === g.id && (!q || (t.name + " " + t.desc + " " + TYPE[t.type].label).toLowerCase().includes(q)));
      if (!items.length) return "";
      return `<section class="group"><h2>${esc(g.name)}</h2><div class="cards">${items.map(t => toolCard(t, i++)).join("")}</div></section>`;
    })
    .join("");
  $("#toolGroups").innerHTML =
    html ||
    `<div class="empty" style="margin-top:24px">No tools match “${esc(query)}”. <button class="btn btn-ghost" type="button" data-action="clear-filter" style="margin-left:8px">Clear filter</button></div>`;
}

function flashTool(id) {
  const el = $("#tool-" + id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

export function initTools() {
  registerView("tools", { show() { renderChips(); renderTools(); }, after: flashTool });

  delegate($("#chips"), "click", {
    filter: el => { groupFilter = el.dataset.g; renderChips(); renderTools(); }
  });
  delegate($("#toolGroups"), "click", {
    "clear-filter": () => {
      query = "";
      $("#toolQ").value = "";
      groupFilter = "all";
      renderChips();
      renderTools();
      $("#toolQ").focus();
    },
    pin: el => {
      const id = el.dataset.id;
      const t = D.TOOLS.find(x => x.id === id);
      const pins = getPins();
      const nowPinned = !pins.includes(id);
      setPins(nowPinned ? [...pins, id] : pins.filter(x => x !== id));
      toast(`${nowPinned ? "Added" : "Removed"} ${t.name} ${nowPinned ? "to" : "from"} quick access`);
      el.setAttribute("aria-pressed", nowPinned);
      el.setAttribute("aria-label", `${nowPinned ? "Remove" : "Add"} ${t.name} ${nowPinned ? "from" : "to"} quick access`);
      renderQuick();
    },
    copy: el => {
      const t = D.TOOLS.find(x => x.id === el.dataset.id);
      copyText(t.url, t.name);
    }
  });
  $("#toolQ").addEventListener("input", e => { query = e.target.value; renderTools(); });
}
