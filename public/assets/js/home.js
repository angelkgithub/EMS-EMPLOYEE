import { $, delegate, esc, hasLink, NEWTAB, statusTag, toast, toolIcon, TYPE } from "./util.js";
import { D, getPins, store } from "./store.js";
import { go, setPending } from "./router.js";
import { people } from "./org.js";

const STEPS = [
  { label: "Read the house rules", href: "#rules" },
  { label: "Read the Bible", href: "#tools", focus: "bible" },
  { label: "Watch the cold calling lesson", href: "#training" },
  { label: "Listen to the sample calls", href: "#training" },
  { label: "Get to know the team", href: "#org" }
];
let done = store.get("steps", []);

export function renderQuick() {
  const list = getPins().map(id => D.TOOLS.find(t => t.id === id)).filter(Boolean);
  if (!list.length) {
    $("#quick").innerHTML = `<div class="empty" style="grid-column:1/-1">Star a tool on <a href="#tools">Tools and links</a> to keep it here.</div>`;
    return;
  }
  const inner = t => `<span class="mark"><svg><use href="#${toolIcon(t)}"/></svg></span><strong>${esc(t.name)}</strong><small>${hasLink(t) ? TYPE[t.type].label : "Link not added yet"}${statusTag(t)}</small>`;
  $("#quick").innerHTML = list
    .map(t =>
      t.url && !t.formats
        ? `<a class="qtile${t.primary ? " qtile-primary" : ""}" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">${inner(t)}<svg class="qext" aria-hidden="true"><use href="#i-ext"/></svg>${NEWTAB}</a>`
        : `<button class="qtile" type="button" data-action="quick-missing" data-id="${esc(t.id)}">${inner(t)}</button>`
    )
    .join("");
}

function renderSteps() {
  $("#steps").innerHTML = STEPS.map(
    (s, i) => `<li class="${done.includes(i) ? "done" : ""}"><span class="num" aria-hidden="true"></span><a class="step-link" href="${s.href}" ${s.focus ? `data-action="step-link" data-focus="${s.focus}"` : ""}>${s.label}</a><label class="check"><input type="checkbox" data-action="step-done" data-i="${i}" ${done.includes(i) ? "checked" : ""}><span class="sr">Mark "${s.label}" as done</span>Done</label></li>`
  ).join("");
  $("#stepBig").textContent = done.length;
  $("#stepOf").textContent = "/" + STEPS.length;
  $("#stepCount").textContent = done.length === STEPS.length ? "All start-here steps done" : "start-here steps done";
  $("#stepBar").style.transform = `scaleX(${done.length / STEPS.length})`;
}

export function initHome() {
  const h = new Date().getHours();
  $("#greet").textContent = h < 12 ? "Good morning, team" : h < 18 ? "Good afternoon, team" : "Good evening, team";

  delegate($("#quick"), "click", {
    "quick-missing": el => {
      const t = D.TOOLS.find(x => x.id === el.dataset.id);
      if (t.formats) go("tools", t.id);
      else toast(`The link for ${t.name} hasn't been added yet.`);
    }
  });
  const steps = $("#steps");
  delegate(steps, "click", { "step-link": el => setPending(el.dataset.focus) });
  delegate(steps, "change", {
    "step-done": el => {
      const i = +el.dataset.i;
      done = el.checked ? [...new Set([...done, i])] : done.filter(x => x !== i);
      store.set("steps", done);
      renderSteps();
      $(`#steps input[data-i="${i}"]`).focus();
      if (done.length === STEPS.length) toast("All done. Welcome to the team!");
    }
  });
  renderQuick();
  renderSteps();
  $("#nTraining").textContent = D.VIDEOS.length + D.RECORDINGS.length;
  $("#nTeam").textContent = people.length;
  if (D.RULES_PDF.updated) $("#rulesMeta").textContent = `Updated ${D.RULES_PDF.updated}. Read and confirm them.`;
}
