import { $, delegate, esc } from "./util.js";
import { D } from "./store.js";
import { registerView } from "./router.js";

/* Flat list of everyone in the org chart, with a stable id and a link to their manager. */
export const people = [];
(function walk(p, parent) {
  p._id = people.length;
  p._parent = parent;
  people.push(p);
  if (p.partner) walk(p.partner, null);
  (p.children || []).forEach(c => walk(c, p));
})(D.ORG, null);

const DAY = 864e5;
const isNew = p => {
  const d = Date.parse(p.start || "");
  const age = Date.now() - d;
  return !isNaN(d) && age >= 0 && age < 30 * DAY;
};
const monthDay = s => {
  if (!s) return "Not added";
  const m = String(s).match(/^([A-Za-z]{3,})\.?\s+(\d{1,2})/);
  return m ? `${m[1].slice(0, 3)} ${+m[2]}` : s;
};
const telHref = n => "tel:" + String(n).replace(/[^\d+]/g, "");
const initials = p => {
  const n = p.name.replace(/\(.*?\)/g, "").replace(/[[\]]/g, "").trim();
  const words = !n || n === "Name" ? p.role.split(" ") : n.split(/\s+/);
  return words.map(w => w[0]).join("").slice(0, 2).toUpperCase();
};
const avatar = p => `<span class="avatar"><span aria-hidden="true">${initials(p)}</span>${p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy" data-fallback>` : ""}</span>`;
const photo = p => (p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy" data-fallback>` : "");
/* Hover and focus show a summary over the picture; the click opens the full drawer (touch and keyboard). */
const peek = p => `<span class="peek" aria-hidden="true"><strong>${esc(p.name)}</strong><span class="peek-role">${esc(p.designation || p.role)}</span>
    <span class="peek-row"><b>Email</b>${esc(p.email || "Not added")}</span><span class="peek-row"><b>Phone</b>${esc(p.phone || "Not added")}</span>
    <span class="peek-row"><b>Birthday</b>${esc(monthDay(p.birthday))}</span><span class="peek-row"><b>Started</b>${esc(p.start || "Not added")}</span></span>`;
const card = p => `<li><button class="person" type="button" data-action="open-person" data-pid="${p._id}">
    <span class="pic"><svg class="ghost" aria-hidden="true"><use href="#i-user"/></svg>${photo(p)}${peek(p)}</span>
    <span class="who"><strong>${esc(p.name)}</strong><span>${esc(p.role)}</span>${isNew(p) ? `<span class="tag-new">New</span>` : ""}</span></button></li>`;

/* People are grouped by dept, in the order they appear in data.js. */
function renderOrg() {
  const groups = new Map();
  people.forEach(p => groups.set(p.dept || "Team", [...(groups.get(p.dept || "Team") || []), p]));
  $("#tree").innerHTML = [...groups]
    .map(([dept, list]) => `<section class="org-group" aria-labelledby="og-${esc(dept)}"><h2 id="og-${esc(dept)}">${esc(dept)}</h2><ul class="team-grid">${list.map(card).join("")}</ul></section>`)
    .join("");
  const count = r => people.filter(p => p.role === r).length;
  $("#orgCount").textContent = `${people.length} people: 2 owners, ${count("Director")} director, ${count("Operations Manager (OM)")} operations manager, ${count("Sales Representative")} sales representatives`;
}

const drawer = $("#person");

export function openPerson(id) {
  const p = people[id];
  const row = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
  $("#personBody").innerHTML = `${avatar(p)}<h2 style="font-size:1.6rem">${esc(p.name)}</h2><p class="muted" style="margin-top:4px">${esc(p.role)}</p>
      <dl class="facts">${p.designation ? row("Designation", esc(p.designation)) : ""}${row("Department", esc(p.dept || "Not added"))}${row("Reports to", p._parent ? `${esc(p._parent.name)}, ${esc(p._parent.role)}` : "Not added")}${row("Work email", p.email ? `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : "Not added")}${row("Phone", p.phone ? `<a class="num" href="${telHref(p.phone)}">${esc(p.phone)}</a>` : "Not added")}${row("Birthday", esc(monthDay(p.birthday)))}${row("Start date", p.start ? `<span class="num">${esc(p.start)}</span>${isNew(p) ? ` <span class="tag-new">New</span>` : ""}` : "Not added")}${p.origin ? row("From", esc(p.origin)) : ""}</dl>
      ${p.email || p.phone ? `<div class="drawer-actions">${p.email ? `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Email<span class="sr"> ${esc(p.name)}</span></a>` : ""}${p.phone ? `<a class="btn btn-ghost" href="${telHref(p.phone)}">Call<span class="sr"> ${esc(p.name)}</span></a>` : ""}</div>` : ""}`;
  drawer.showModal();
}

export function initOrg() {
  registerView("org", { show: renderOrg });
  delegate($("#tree"), "click", { "open-person": el => openPerson(+el.dataset.pid) });
  delegate(drawer, "click", { "close-person": () => drawer.close() });
  /* showModal() already gives Escape, focus trapping and an inert page; a click on the backdrop closes it too. */
  drawer.addEventListener("click", e => {
    if (e.target !== drawer) return;
    const r = drawer.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) drawer.close();
  });
}
