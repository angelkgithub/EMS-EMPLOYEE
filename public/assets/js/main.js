/* MIL CITY Team Hub entry point. Content lives in data.js (window.MILCITY_DATA); each page has its own module. */
import { initNav } from "./nav.js";
import { initHome } from "./home.js";
import { initTools } from "./tools.js";
import { initTraining } from "./training.js";
import { initOrg } from "./org.js";
import { initRules } from "./rules.js";
import { initSearch } from "./search.js";
import { initRouter } from "./router.js";

/* Images can't use inline onerror under our Content-Security-Policy, so failed images are removed here. */
document.addEventListener("error", e => {
  const t = e.target;
  if (t.tagName === "IMG" && t.hasAttribute("data-fallback")) t.remove();
}, true);

initNav();
initHome();
initTools();
initTraining();
initOrg();
initRules();
initSearch();
initRouter();
document.documentElement.classList.add("ready");
