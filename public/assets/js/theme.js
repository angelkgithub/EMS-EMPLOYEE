/* EMS Team Hub: light / dark theme.
   Loaded in <head> WITHOUT "defer" so a saved choice is applied before the
   first paint (no flash of the wrong theme). Until someone taps the button,
   the site follows the device setting. */
(function () {
  "use strict";
  var KEY = "ems-hub:theme";
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function read() {
    try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : null; }
    catch (e) { return null; }
  }
  var chosen = read();                                   // null = follow the device
  if (chosen) root.setAttribute("data-theme", chosen);   // apply immediately

  function effective() { return chosen || (mq.matches ? "dark" : "light"); }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeBtn");
    if (!btn) return;
    var use = btn.querySelector("use");
    var metas = [].slice.call(document.querySelectorAll('meta[name="theme-color"]'));
    var originals = metas.map(function (m) { return m.getAttribute("content"); });
    var BAR = { light: "#F3F5F9", dark: "#0A1124" };

    function sync() {
      var dark = effective() === "dark";
      var label = dark ? "Switch to light mode" : "Switch to dark mode";
      use.setAttribute("href", dark ? "#i-sun" : "#i-moon");
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
      // Keep the phone's browser bar in step with a manual choice.
      metas.forEach(function (m, i) { m.setAttribute("content", chosen ? BAR[effective()] : originals[i]); });
    }

    btn.addEventListener("click", function () {
      chosen = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", chosen);
      try { localStorage.setItem(KEY, chosen); } catch (e) { /* private mode: still works this visit */ }
      sync();
    });

    // While nobody has chosen, follow the device if it switches (for example at sunset).
    var follow = function () { if (!chosen) sync(); };
    if (mq.addEventListener) mq.addEventListener("change", follow); else mq.addListener(follow);

    sync();
  });
})();