import { $, delegate, esc, NEWTAB, toast } from "./util.js";
import { D, store } from "./store.js";

function renderAck() {
  const ack = store.get("ack", null);
  $("#ackBox").checked = !!ack;
  $("#ackNote").textContent = ack ? `Confirmed on ${ack}. Saved on this device only.` : "Saved on this device only";
}

/* Adding ?v=<updated date> makes browsers fetch the new file when the PDF is replaced. */
const versioned = pdf => (pdf.updated ? `${pdf.url}?v=${encodeURIComponent(pdf.updated)}` : pdf.url);

function renderRules() {
  const pdf = D.RULES_PDF;
  const href = versioned(pdf);
  $("#docMeta").textContent = pdf.updated ? `PDF document, last updated ${pdf.updated}` : "PDF document";
  $("#docActions").innerHTML = pdf.url
    ? `<a class="btn btn-primary" href="${esc(href)}" target="_blank" rel="noopener noreferrer">Open PDF${NEWTAB}<svg aria-hidden="true"><use href="#i-ext"/></svg></a><a class="btn btn-ghost" href="${esc(href)}" download>Download<svg><use href="#i-dl"/></svg></a>`
    : `<span class="pending">PDF not added yet</span>`;
  $("#acc").innerHTML = D.RULE_SECTIONS.map(
    (s, i) => `<div class="acc-item"><button type="button" data-action="toggle" aria-expanded="false" aria-controls="accp-${i}" id="acch-${i}">${esc(s.title)}<svg><use href="#i-chev"/></svg></button><div class="acc-panel" id="accp-${i}" role="region" aria-labelledby="acch-${i}"><div><p>${esc(s.body)}</p></div></div></div>`
  ).join("");
  $("#pdfView").innerHTML = pdf.url ? `<iframe src="${esc(href)}#view=FitH" title="MIL CITY House Rules PDF"></iframe>` : "";
}

export function initRules() {
  renderRules();
  renderAck();
  delegate($("#acc"), "click", {
    toggle: el => {
      const open = el.getAttribute("aria-expanded") === "true";
      el.setAttribute("aria-expanded", !open);
      el.parentElement.classList.toggle("open", !open);
    }
  });
  $("#ackBox").addEventListener("change", e => {
    const d = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    store.set("ack", e.target.checked ? d : null);
    renderAck();
    if (e.target.checked) toast("Thanks for reading the house rules.");
  });
}
