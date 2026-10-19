import { $, delegate, esc, NEWTAB, toast } from "./util.js";
import { D, store } from "./store.js";

const ytId = u => {
  if (!u) return "";
  const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(u) ? u : "";
};
const fmt = s => (!isFinite(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`);
const SPEEDS = [1, 1.25, 1.5, 0.75];
let listened = store.get("listened", []);

function renderVideos() {
  $("#videos").innerHTML = D.VIDEOS.map((v, i) => {
    const id = ytId(v.youtube);
    const inner = id
      ? `<button class="facade" type="button" data-action="play-video" data-v="${i}" aria-label="Play video: ${esc(v.title)}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" data-fallback><span class="playbig"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg></span><span class="vt">${esc(v.title)}</span></button>`
      : `<div class="video-empty"><div><svg width="44" height="44" style="color:#fff;opacity:.8"><use href="#i-play"/></svg><p style="margin-top:8px;font-weight:650">${esc(v.title)}</p><p style="opacity:.8">Video link not added yet</p></div></div>`;
    return `<div style="${i ? "margin-top:28px" : ""}"><div class="video" id="video-${i}">${inner}</div>
        <div class="video-meta"><p class="muted">${esc(v.notes)}</p>${id ? `<a class="btn btn-ghost" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Watch on YouTube${NEWTAB}<svg aria-hidden="true"><use href="#i-ext"/></svg></a>` : ""}</div></div>`;
  }).join("");
}

function renderRecs() {
  $("#recs").innerHTML = D.RECORDINGS.map(
    (r, i) => `<div class="rec" id="rec-${i}">
      <button class="play" type="button" data-action="play" data-i="${i}" ${r.src ? "" : "disabled"} aria-label="Play ${esc(r.title)}"><svg><use href="#i-pp"/></svg></button>
      <div style="min-width:0"><div class="rec-title"><strong>${esc(r.title)}</strong><span>${esc(r.agent)}</span><span class="eq" hidden aria-hidden="true"><i></i><i></i><i></i></span></div>
        ${
          r.src
            ? `<div class="bar"><button class="mini" type="button" data-action="back" data-i="${i}" aria-label="Back 10 seconds">−10s</button><input type="range" min="0" max="1000" value="0" data-action="seek" data-i="${i}" aria-label="Position in ${esc(r.title)}"><span class="time" data-time="${i}">0:00</span><button class="mini" type="button" data-action="speed" data-i="${i}" aria-label="Playback speed">1×</button></div><audio preload="metadata" src="${esc(r.src)}" data-i="${i}"></audio>`
            : `<p class="notes"><span class="pending">Recording not added yet</span></p>`
        }
        <p class="notes">${esc(r.notes)}</p></div>
      <label class="check"><input type="checkbox" data-action="heard" data-i="${i}" ${listened.includes(i) ? "checked" : ""}>Listened</label></div>`
  ).join("");
}

export function initTraining() {
  renderVideos();
  renderRecs();

  delegate($("#videos"), "click", {
    "play-video": el => {
      const v = D.VIDEOS[+el.dataset.v];
      $("#video-" + el.dataset.v).innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId(v.youtube)}?autoplay=1&rel=0" title="${esc(v.title)}" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>`;
    }
  });

  const recs = $("#recs");
  const parts = i => ({
    a: $(`#rec-${i} audio`),
    seek: $(`#rec-${i} [data-action="seek"]`),
    time: $(`#rec-${i} [data-time]`),
    btn: $(`#rec-${i} [data-action="play"]`),
    card: $(`#rec-${i}`)
  });
  const update = i => {
    const { a, seek, time } = parts(i);
    const p = a.duration ? a.currentTime / a.duration : 0;
    seek.value = Math.round(p * 1000);
    seek.style.setProperty("--p", p * 100 + "%");
    time.textContent = `${fmt(a.currentTime)} / ${fmt(a.duration)}`;
  };

  delegate(recs, "click", {
    play: el => {
      const { a } = parts(el.dataset.i);
      if (a.paused) a.play().catch(() => toast("This recording couldn't play. Check the file link."));
      else a.pause();
    },
    back: el => { const { a } = parts(el.dataset.i); a.currentTime = Math.max(0, a.currentTime - 10); },
    speed: el => {
      const { a } = parts(el.dataset.i);
      const n = SPEEDS[(SPEEDS.indexOf(a.playbackRate) + 1) % SPEEDS.length];
      a.playbackRate = n;
      el.textContent = n + "×";
    }
  });
  delegate(recs, "input", {
    seek: el => {
      const { a } = parts(el.dataset.i);
      if (a.duration) a.currentTime = (el.value / 1000) * a.duration;
      update(el.dataset.i);
    }
  });
  delegate(recs, "change", {
    heard: el => {
      const i = +el.dataset.i;
      listened = el.checked ? [...new Set([...listened, i])] : listened.filter(x => x !== i);
      store.set("listened", listened);
    }
  });

  /* Media events don't bubble, so listen in the capture phase on the container. */
  const onMedia = (type, fn) => recs.addEventListener(type, e => { if (e.target.matches("audio")) fn(e.target, e.target.dataset.i); }, true);
  onMedia("loadedmetadata", (a, i) => update(i));
  onMedia("timeupdate", (a, i) => update(i));
  onMedia("play", (a, i) => {
    recs.querySelectorAll("audio").forEach(o => { if (o !== a) o.pause(); });
    const { btn, card } = parts(i);
    btn.innerHTML = `<svg><use href="#i-pause"/></svg>`;
    btn.setAttribute("aria-label", "Pause " + D.RECORDINGS[i].title);
    card.classList.add("playing");
    card.querySelector(".eq").hidden = false;
  });
  onMedia("pause", (a, i) => {
    const { btn, card } = parts(i);
    btn.innerHTML = `<svg><use href="#i-pp"/></svg>`;
    btn.setAttribute("aria-label", "Play " + D.RECORDINGS[i].title);
    card.classList.remove("playing");
    card.querySelector(".eq").hidden = true;
  });
  onMedia("ended", (a, i) => {
    const box = $(`#rec-${i} [data-action="heard"]`);
    if (!box.checked) { box.checked = true; box.dispatchEvent(new Event("change", { bubbles: true })); }
  });
  onMedia("error", (a, i) => { const { btn, time } = parts(i); btn.disabled = true; time.textContent = "Can't load file"; });
}
