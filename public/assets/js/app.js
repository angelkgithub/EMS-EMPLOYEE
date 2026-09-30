"use strict";
/* EMS Team Hub. Content lives in assets/js/data.js; this file is the behavior. */
const { TOOLS, GROUPS, DEFAULT_PINS, VIDEOS, RECORDINGS, ORG, RULES_PDF, RULE_SECTIONS } = window.EMS_DATA;

/* Images can't use inline onerror under our Content-Security-Policy, so failed images are removed here. */
document.addEventListener("error", e => { const t=e.target; if(t && t.tagName==="IMG" && t.hasAttribute("data-fallback")) t.remove(); }, true);

(function(){
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const store={ get(k,d){ try{ const v=localStorage.getItem("ems-hub:"+k); return v?JSON.parse(v):d; }catch(e){ return d; } },
                set(k,v){ try{ localStorage.setItem("ems-hub:"+k,JSON.stringify(v)); }catch(e){} } };
  const TYPE = { sheet:{label:"Google Sheets",icon:"i-sheet"},form:{label:"Google Forms",icon:"i-rules"}, canva:{label:"Canva",icon:"i-canva"}, pdf:{label:"PDF",icon:"i-pdf"}, ghl:{label:"GoHighLevel",icon:"i-rocket"}, multi:{label:"Sheet, Canva and PDF",icon:"i-book"} };
  const toolIcon=t=> t.group==="inventory" ? "i-box" : TYPE[t.type].icon;
  const hasLink=t=> t.formats ? t.formats.some(f=>f.url) : !!t.url;
  const firstUrl=t=> t.formats ? (t.formats.find(f=>f.url)||{}).url : t.url;

  let tt; function toast(m){ const t=$("#toast"); t.textContent=m; t.classList.add("show"); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove("show"),2400); }
  function openUrl(u){ window.open(u,"_blank","noopener"); }
  async function copy(u,name){ try{ await navigator.clipboard.writeText(u); toast(`Copied link to ${name}`); }catch(e){ toast("Couldn't copy. Open the link and copy it from the address bar."); } }

  /* ---------- Home ---------- */
  const h=new Date().getHours();
  $("#greet").textContent = h<12 ? "Good morning, team" : h<18 ? "Good afternoon, team" : "Good evening, team";
  let pins=store.get("pins",DEFAULT_PINS);
  function renderQuick(){
    const list=pins.map(id=>TOOLS.find(t=>t.id===id)).filter(Boolean);
    if(!list.length){ $("#quick").innerHTML=`<div class="empty" style="grid-column:1/-1">Star a tool on <a href="#tools">Tools and links</a> to keep it here.</div>`; return; }
    $("#quick").innerHTML=list.map(t=>`<button class="qtile" type="button" data-id="${t.id}"><span class="mark"><svg><use href="#${toolIcon(t)}"/></svg></span><strong>${esc(t.name)}</strong><small>${hasLink(t)?TYPE[t.type].label:"Link not added yet"}</small></button>`).join("");
    $$("#quick .qtile").forEach(b=>b.onclick=()=>{ const t=TOOLS.find(x=>x.id===b.dataset.id); if(t.formats){ go("tools",t.id); } else if(t.url){ openUrl(t.url); } else toast(`The link for ${t.name} hasn't been added yet.`); });
  }
  const STEPS=[
    {label:"Read the house rules", href:"#rules"},
    {label:"Read the EMS Bible", href:"#tools", focus:"bible"},
    {label:"Watch the cold calling lesson", href:"#training"},
    {label:"Listen to the sample calls", href:"#training"},
    {label:"Get to know the team", href:"#org"}
  ];
  let done=store.get("steps",[]);
  function renderSteps(){
    $("#steps").innerHTML=STEPS.map((s,i)=>`<li class="${done.includes(i)?"done":""}"><span class="num" aria-hidden="true"></span><a class="step-link" href="${s.href}" ${s.focus?`data-focus="${s.focus}"`:""}>${s.label}</a><label class="check"><input type="checkbox" data-i="${i}" ${done.includes(i)?"checked":""}><span class="sr">Mark "${s.label}" as done</span>Done</label></li>`).join("");
    $("#stepCount").textContent=`${done.length} of ${STEPS.length} done`;
    $("#stepBar").style.width=(done.length/STEPS.length*100)+"%";
    $$("#steps input").forEach(c=>c.onchange=()=>{ const i=+c.dataset.i; done=c.checked?[...new Set([...done,i])]:done.filter(x=>x!==i); store.set("steps",done); renderSteps(); $(`#steps input[data-i="${i}"]`).focus(); if(done.length===STEPS.length) toast("All done. Welcome to the team!"); });
    $$("#steps [data-focus]").forEach(a=>a.addEventListener("click",()=>pendingFocus=a.dataset.focus));
  }

  /* ---------- Tools ---------- */
  let gFilter="all", tq="", pendingFocus=null;
  function renderChips(){
    $("#chips").innerHTML=[{id:"all",name:"All"},...GROUPS].map(g=>`<button class="chip" type="button" data-g="${g.id}" aria-pressed="${gFilter===g.id}">${g.name}</button>`).join("");
    $$("#chips .chip").forEach(b=>b.onclick=()=>{ gFilter=b.dataset.g; renderChips(); renderTools(); });
  }
  function toolCard(t,i){
    const pinned=pins.includes(t.id);
    let actions;
    if(t.formats){
      actions=t.formats.map(f=> f.url ? `<a class="btn ${f===t.formats[0]?"btn-primary":"btn-ghost"}" href="${esc(f.url)}" target="_blank" rel="noopener"><svg><use href="#${TYPE[f.type].icon}"/></svg>${f.label}</a>` : `<button class="btn btn-ghost" type="button" disabled title="Link not added yet"><svg><use href="#${TYPE[f.type].icon}"/></svg>${f.label}</button>`).join("");
      if(!hasLink(t)) actions+=`<span class="pending">Links not added yet</span>`;
    } else if(t.url){
      actions=`<a class="btn btn-primary" href="${esc(t.url)}" target="_blank" rel="noopener">Open<svg><use href="#i-ext"/></svg></a><button class="icon-btn" type="button" data-copy="${t.id}" aria-label="Copy link to ${esc(t.name)}"><svg><use href="#i-copy"/></svg></button>`;
    } else {
      actions=`<span class="pending">Link not added yet</span>`;
    }
    return `<article class="tool" id="tool-${t.id}" style="animation-delay:${Math.min(i,10)*40}ms">
      <div class="tool-top"><span class="mark"><svg><use href="#${toolIcon(t)}"/></svg></span><div><h3>${esc(t.name)}</h3><span class="tool-type">${TYPE[t.type].label}</span></div>
      <button class="icon-btn" type="button" data-pin="${t.id}" aria-pressed="${pinned}" aria-label="${pinned?"Remove":"Add"} ${esc(t.name)} ${pinned?"from":"to"} quick access"><svg><use href="#i-star"/></svg></button></div>
      <p>${esc(t.desc)}</p>
      <div class="tool-actions">${actions}</div></article>`;
  }
  function renderTools(){
    const q=tq.trim().toLowerCase(); let i=0;
    const html=GROUPS.filter(g=>gFilter==="all"||g.id===gFilter).map(g=>{
      const items=TOOLS.filter(t=>t.group===g.id && (!q || (t.name+" "+t.desc+" "+TYPE[t.type].label).toLowerCase().includes(q)));
      if(!items.length) return "";
      return `<section class="group"><h2>${g.name}</h2><div class="cards">${items.map(t=>toolCard(t,i++)).join("")}</div></section>`;
    }).join("");
    $("#toolGroups").innerHTML = html || `<div class="empty" style="margin-top:24px">No tools match "${esc(tq)}". <button class="btn btn-ghost" type="button" id="clearTools" style="margin-left:8px">Clear filter</button></div>`;
    const c=$("#clearTools"); if(c) c.onclick=()=>{ tq=""; $("#toolQ").value=""; gFilter="all"; renderChips(); renderTools(); $("#toolQ").focus(); };
    $$("[data-pin]").forEach(b=>b.onclick=()=>{
      const id=b.dataset.pin, t=TOOLS.find(x=>x.id===id);
      if(pins.includes(id)){ pins=pins.filter(x=>x!==id); toast(`Removed ${t.name} from quick access`); } else { pins=[...pins,id]; toast(`Added ${t.name} to quick access`); }
      store.set("pins",pins); b.setAttribute("aria-pressed",pins.includes(id)); b.setAttribute("aria-label",`${pins.includes(id)?"Remove":"Add"} ${t.name} ${pins.includes(id)?"from":"to"} quick access`); renderQuick();
    });
    $$("[data-copy]").forEach(b=>b.onclick=()=>{ const t=TOOLS.find(x=>x.id===b.dataset.copy); copy(t.url,t.name); });
  }
  $("#toolQ").addEventListener("input",e=>{ tq=e.target.value; renderTools(); });
  function flashTool(id){ const el=$("#tool-"+id); if(!el) return; el.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"}); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }

  /* ---------- Training ---------- */
  const ytId=u=>{ if(!u) return ""; const m=u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/); return m?m[1]:(/^[\w-]{11}$/.test(u)?u:""); };
  function renderVideos(){
    $("#videos").innerHTML=VIDEOS.map((v,i)=>{
      const id=ytId(v.youtube);
      const inner = id
        ? `<button class="facade" type="button" data-v="${i}" aria-label="Play video: ${esc(v.title)}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" data-fallback><span class="playbig"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg></span><span class="vt">${esc(v.title)}</span></button>`
        : `<div class="video-empty"><div><svg width="44" height="44" style="color:#fff;opacity:.8"><use href="#i-play"/></svg><p style="margin-top:8px;font-weight:650">${esc(v.title)}</p><p style="opacity:.8">Video link not added yet</p></div></div>`;
      return `<div style="${i?"margin-top:28px":""}"><div class="video" id="video-${i}">${inner}</div>
        <div class="video-meta"><p class="muted">${esc(v.notes)}</p>${id?`<a class="btn btn-ghost" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">Watch on YouTube<svg><use href="#i-ext"/></svg></a>`:""}</div></div>`;
    }).join("");
    $$("[data-v]").forEach(b=>b.onclick=()=>{
      const v=VIDEOS[+b.dataset.v], id=ytId(v.youtube), box=$("#video-"+b.dataset.v);
      box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(v.title)}" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"></iframe>`;
    });
  }
  let listened=store.get("listened",[]);
  const fmt=s=>!isFinite(s)?"0:00":`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  const SPEEDS=[1,1.25,1.5,0.75];
  function renderRecs(){
    $("#recs").innerHTML=RECORDINGS.map((r,i)=>`<div class="rec" id="rec-${i}">
      <button class="play" type="button" data-play="${i}" ${r.src?"":"disabled"} aria-label="Play ${esc(r.title)}"><svg><use href="#i-pp"/></svg></button>
      <div style="min-width:0"><div class="rec-title"><strong>${esc(r.title)}</strong><span>${esc(r.agent)}</span><span class="eq" hidden aria-hidden="true"><i></i><i></i><i></i></span></div>
        ${r.src ? `<div class="bar"><button class="mini" type="button" data-back="${i}" aria-label="Back 10 seconds">−10s</button><input type="range" min="0" max="1000" value="0" data-seek="${i}" aria-label="Position in ${esc(r.title)}"><span class="time" data-time="${i}">0:00</span><button class="mini" type="button" data-speed="${i}" aria-label="Playback speed">1×</button></div><audio preload="metadata" src="${esc(r.src)}" data-audio="${i}"></audio>`
                : `<p class="notes"><span class="pending">Recording not added yet</span></p>`}
        <p class="notes">${esc(r.notes)}</p></div>
      <label class="check"><input type="checkbox" data-heard="${i}" ${listened.includes(i)?"checked":""}>Listened</label></div>`).join("");
    const audios=$$("[data-audio]");
    audios.forEach(a=>{
      const i=a.dataset.audio, seek=$(`[data-seek="${i}"]`), time=$(`[data-time="${i}"]`), btn=$(`[data-play="${i}"]`), card=$("#rec-"+i), eq=card.querySelector(".eq");
      const upd=()=>{ const p=a.duration?a.currentTime/a.duration:0; seek.value=Math.round(p*1000); seek.style.setProperty("--p",(p*100)+"%"); time.textContent=`${fmt(a.currentTime)} / ${fmt(a.duration)}`; };
      a.addEventListener("loadedmetadata",upd); a.addEventListener("timeupdate",upd);
      a.addEventListener("play",()=>{ audios.forEach(o=>{ if(o!==a) o.pause(); }); btn.innerHTML=`<svg><use href="#i-pause"/></svg>`; btn.setAttribute("aria-label","Pause "+RECORDINGS[i].title); card.classList.add("playing"); eq.hidden=false; });
      a.addEventListener("pause",()=>{ btn.innerHTML=`<svg><use href="#i-pp"/></svg>`; btn.setAttribute("aria-label","Play "+RECORDINGS[i].title); card.classList.remove("playing"); eq.hidden=true; });
      a.addEventListener("ended",()=>{ const box=$(`[data-heard="${i}"]`); if(!box.checked){ box.checked=true; box.dispatchEvent(new Event("change")); } });
      a.addEventListener("error",()=>{ btn.disabled=true; time.textContent="Can't load file"; });
      btn.onclick=()=> a.paused ? a.play().catch(()=>toast("This recording couldn't play. Check the file link.")) : a.pause();
      seek.oninput=()=>{ if(a.duration) a.currentTime=seek.value/1000*a.duration; upd(); };
      $(`[data-back="${i}"]`).onclick=()=>{ a.currentTime=Math.max(0,a.currentTime-10); };
      const sb=$(`[data-speed="${i}"]`); sb.onclick=()=>{ const n=SPEEDS[(SPEEDS.indexOf(a.playbackRate)+1)%SPEEDS.length]; a.playbackRate=n; sb.textContent=n+"×"; };
    });
    $$("[data-heard]").forEach(c=>c.onchange=()=>{ const i=+c.dataset.heard; listened=c.checked?[...new Set([...listened,i])]:listened.filter(x=>x!==i); store.set("listened",listened); });
  }

  /* ---------- Org chart ---------- */
  const people=[]; (function walk(p,parent){ p._id=people.length; p._parent=parent; people.push(p); (p.children||[]).forEach(c=>walk(c,p)); })(ORG,null);
  const initials=p=>{ const n=p.name.replace(/[\[\]]/g,"").trim(); if(!n||n==="Name") return p.role.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); return n.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase(); };
  const avatar=p=>`<span class="avatar"><span aria-hidden="true">${initials(p)}</span>${p.photo?`<img src="${esc(p.photo)}" alt="" loading="lazy" data-fallback>`:""}</span>`;
  function orgNode(p,depth){ return `<li><button class="person ${depth<2&&p.children?"lead":""}" type="button" data-pid="${p._id}" style="animation-delay:${depth*120}ms">${avatar(p)}<span class="who"><strong>${esc(p.name)}</strong><span>${esc(p.role)}</span></span></button>${p.children?`<ul>${p.children.map(c=>orgNode(c,depth+1)).join("")}</ul>`:""}</li>`; }
  function renderOrg(){ $("#tree").innerHTML=orgNode(ORG,0); $$("[data-pid]").forEach(b=>b.onclick=()=>openPerson(+b.dataset.pid,b)); }
  const drawer=$("#person"), scrim=$("#scrim"), appRoot=$(".app"); let returnFocus=null;
  const lock=on=>{ appRoot.inert=on; };
  function openPerson(id,from){
    const p=people[id]; returnFocus=from||document.activeElement;
    const row=(k,v)=>`<div><dt>${k}</dt><dd>${v}</dd></div>`;
    $("#personBody").innerHTML=`${avatar(p)}<h2 style="font-size:1.6rem">${esc(p.name)}</h2><p class="muted" style="margin-top:4px">${esc(p.role)}</p>
      <dl class="facts">${row("Department",esc(p.dept||"—"))}${row("Reports to",p._parent?`${esc(p._parent.name)}, ${esc(p._parent.role)}`:"—")}${row("Email",p.email?`<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`:`<span class="placeholder">[Email]</span>`)}${row("Phone",p.phone?`<a href="tel:${esc(p.phone)}">${esc(p.phone)}</a>`:`<span class="placeholder">[Phone]</span>`)}</dl>`;
    lock(true); drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); scrim.classList.add("show"); $("#closePerson").focus();
  }
  function closePerson(){ lock(false); drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); if(!side.classList.contains("open")) scrim.classList.remove("show"); if(returnFocus) returnFocus.focus(); }
  $("#closePerson").onclick=closePerson;
  drawer.addEventListener("keydown",e=>{ if(e.key==="Escape") closePerson(); });

  /* ---------- House rules ---------- */
  function renderRules(){
    $("#docMeta").textContent = RULES_PDF.updated ? `PDF document, last updated ${RULES_PDF.updated}` : "PDF document";
    $("#docActions").innerHTML = RULES_PDF.url
      ? `<a class="btn btn-primary" href="${esc(RULES_PDF.url)}" target="_blank" rel="noopener">Open PDF<svg><use href="#i-ext"/></svg></a><a class="btn btn-ghost" href="${esc(RULES_PDF.url)}" download>Download<svg><use href="#i-dl"/></svg></a>`
      : `<span class="pending">PDF not added yet</span>`;
    $("#acc").innerHTML=RULE_SECTIONS.map((s,i)=>`<div class="acc-item"><button type="button" aria-expanded="false" aria-controls="accp-${i}" id="acch-${i}">${esc(s.title)}<svg><use href="#i-chev"/></svg></button><div class="acc-panel" id="accp-${i}" role="region" aria-labelledby="acch-${i}"><div><p>${esc(s.body)}</p></div></div></div>`).join("");
    $$("#acc button").forEach(b=>b.onclick=()=>{ const open=b.getAttribute("aria-expanded")==="true"; b.setAttribute("aria-expanded",!open); b.parentElement.classList.toggle("open",!open); });
    const ack=store.get("ack",null); $("#ackBox").checked=!!ack; $("#ackNote").textContent=ack?`Confirmed on ${ack}. Saved on this device only.`:"Saved on this device only";
  }
  $("#ackBox").onchange=e=>{ const d=new Date().toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}); store.set("ack",e.target.checked?d:null); renderRules(); if(e.target.checked) toast("Thanks for reading the house rules."); };

  /* ---------- Mobile sidebar ---------- */
  const side=$("#side"), menuBtn=$("#menuBtn");
  function openSide(){ side.classList.add("open"); scrim.classList.add("show"); menuBtn.setAttribute("aria-expanded","true"); side.querySelector(".nav a").focus(); }
  function closeSide(){ side.classList.remove("open"); if(!drawer.classList.contains("open")) scrim.classList.remove("show"); menuBtn.setAttribute("aria-expanded","false"); }
  menuBtn.onclick=openSide;
  $$(".nav a").forEach(a=>a.addEventListener("click",closeSide));
  side.addEventListener("keydown",e=>{ if(e.key==="Escape" && side.classList.contains("open")){ closeSide(); menuBtn.focus(); } });
  scrim.onclick=()=>{ closeSide(); if(drawer.classList.contains("open")) closePerson(); };
  addEventListener("scroll",()=>$("#topbar").classList.toggle("scrolled",scrollY>6),{passive:true});

  /* ---------- Command palette ---------- */
  const isMac=/Mac|iPhone|iPad/.test(navigator.userAgentData?.platform||navigator.platform||""); $("#kbd").textContent=isMac?"⌘ K":"Ctrl K";
  const PAGES=[["home","Home","i-home"],["tools","Tools and links","i-link"],["training","Training","i-play"],["org","Org chart","i-org"],["rules","House rules","i-rules"]];
  function paletteItems(){
    const items=PAGES.map(([id,label,icon])=>({label,kind:"Page",icon,run:()=>go(id)}));
    TOOLS.forEach(t=>{
      if(t.formats) t.formats.forEach(f=>items.push({label:`${t.name} (${f.label})`,kind:TYPE[f.type].label,icon:TYPE[f.type].icon,run:()=> f.url?openUrl(f.url):(go("tools",t.id),toast(`The ${f.label} link hasn't been added yet.`))}));
      else items.push({label:t.name,kind:TYPE[t.type].label,icon:toolIcon(t),run:()=> t.url?openUrl(t.url):(go("tools",t.id),toast(`The link for ${t.name} hasn't been added yet.`))});
    });
    VIDEOS.forEach(v=>items.push({label:v.title,kind:"Video",icon:"i-play",run:()=>go("training")}));
    RECORDINGS.forEach((r,i)=>items.push({label:r.title,kind:"Recording",icon:"i-head",run:()=>{ go("training"); setTimeout(()=>{ const el=$("#rec-"+i); if(el) el.scrollIntoView({block:"center",behavior:reduce?"auto":"smooth"}); },260); }}));
    people.forEach(p=>items.push({label:`${p.name}, ${p.role}`,kind:"Person",icon:"i-user",run:()=>{ go("org"); setTimeout(()=>openPerson(p._id,$(`[data-pid="${p._id}"]`)),260); }}));
    items.push({label:"House rules PDF",kind:"PDF",icon:"i-pdf",run:()=>RULES_PDF.url?openUrl(RULES_PDF.url):go("rules")});
    return items;
  }
  const pal=$("#palette"), palQ=$("#palQ"), palList=$("#palList"); let palItems=[], palSel=0, palRet=null;
  function renderPal(){
    const q=palQ.value.trim().toLowerCase();
    palItems=paletteItems().filter(it=>!q||(it.label+" "+it.kind).toLowerCase().includes(q)).slice(0,30);
    palSel=Math.min(palSel,Math.max(0,palItems.length-1));
    palList.innerHTML=palItems.length ? palItems.map((it,i)=>`<li role="option" id="po-${i}" aria-selected="${i===palSel}" data-i="${i}"><span class="mark"><svg><use href="#${it.icon}"/></svg></span><span>${esc(it.label)}</span><small>${esc(it.kind)}</small></li>`).join("") : `<li class="pal-none" role="option" aria-disabled="true">Nothing matches "${esc(palQ.value)}". Try a tool name or a person's role.</li>`;
    palQ.setAttribute("aria-activedescendant",palItems.length?"po-"+palSel:"");
    $$("#palList [data-i]").forEach(li=>{ li.onclick=()=>runPal(+li.dataset.i); li.onmousemove=()=>{ if(palSel!==+li.dataset.i){ palSel=+li.dataset.i; renderPal(); } }; });
  }
  function openPal(){ palRet=document.activeElement; closeSide(); lock(true); pal.classList.add("open"); palQ.value=""; palSel=0; renderPal(); palQ.focus(); }
  function closePal(){ lock(false); pal.classList.remove("open"); if(palRet) palRet.focus(); }
  function runPal(i){ const it=palItems[i]; if(!it) return; lock(false); pal.classList.remove("open"); it.run(); }
  $("#findBtn").onclick=openPal;
  palQ.addEventListener("input",()=>{ palSel=0; renderPal(); });
  palQ.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"){ e.preventDefault(); palSel=Math.min(palSel+1,palItems.length-1); renderPal(); $("#po-"+palSel)?.scrollIntoView({block:"nearest"}); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); palSel=Math.max(palSel-1,0); renderPal(); $("#po-"+palSel)?.scrollIntoView({block:"nearest"}); }
    else if(e.key==="Enter"){ e.preventDefault(); runPal(palSel); }
    else if(e.key==="Escape"){ closePal(); }
  });
  pal.addEventListener("mousedown",e=>{ if(e.target===pal) closePal(); });
  addEventListener("keydown",e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){ e.preventDefault(); pal.classList.contains("open")?closePal():openPal(); } });

  /* ---------- Router ---------- */
  const pages=$$(".page"); let current=null, first=true;
  function go(id,focusTool){ if(focusTool) pendingFocus=focusTool; if(location.hash==="#"+id) { route(true); } else location.hash=id; }
  function route(force){
    const id=(location.hash||"#home").slice(1), next=pages.find(p=>p.dataset.page===id);
    if(!next) return;
    const after=()=>{ if(id==="tools" && pendingFocus){ const f=pendingFocus; pendingFocus=null; setTimeout(()=>flashTool(f),reduce?0:120); } };
    if(next===current){ if(force) after(); return; }
    const show=()=>{
      pages.forEach(p=>p.classList.remove("active","leaving")); next.classList.add("active"); current=next;
      document.title=next.dataset.title;
      $$(".nav a").forEach(a=> a.getAttribute("href")==="#"+id ? a.setAttribute("aria-current","page") : a.removeAttribute("aria-current"));
      scrollTo({top:0,behavior:"instant"});
      if(id==="tools"){ renderChips(); renderTools(); }
      if(id==="org") renderOrg();
      if(!first){ const h1=next.querySelector("h1"); if(h1) h1.focus({preventScroll:true}); }
      first=false; after();
    };
    if(current && !reduce){ current.classList.add("leaving"); setTimeout(show,160); } else show();
  }
  addEventListener("hashchange",()=>route());

  renderQuick(); renderSteps(); renderVideos(); renderRecs(); renderRules(); route();
})();
