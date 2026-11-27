/* WECHEE — language switch, mobile menu, reveal */
(function () {
  const WA_LINK = "https://wa.me/message/ZXRXPZMZC7HIM1";
  const dict = window.I18N || {};
  let lang = "fa";
  try { lang = localStorage.getItem("wechee-lang") || "fa"; } catch (e) {}

  function apply(l) {
    const d = dict[l] || {};
    document.documentElement.lang = l;
    document.documentElement.dir = l === "fa" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const v = d[el.dataset.i18n];
      if (v !== undefined) el.innerHTML = v;
    });
    const t = document.querySelector("title");
    if (t && t.dataset.i18n && d[t.dataset.i18n]) t.textContent = d[t.dataset.i18n];
    document.querySelectorAll(".lang-btn").forEach(b => (b.textContent = l === "fa" ? "EN" : "FA"));
    try { localStorage.setItem("wechee-lang", l); } catch (e) {}
    lang = l;
  }

  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = WA_LINK; a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll(".lang-btn").forEach(b =>
    b.addEventListener("click", () => apply(lang === "fa" ? "en" : "fa"))
  );

  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      menu.classList.toggle("open");
    });
  }

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 })
    : null;
  document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
  /* stats count-up: on first view and on every hover */
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(b) {
    const target = +b.dataset.count, suf = b.dataset.suffix || "";
    if (reduce || !target) { b.textContent = target + suf; return; }
    if (b._raf) cancelAnimationFrame(b._raf);
    const t0 = performance.now(), dur = 900;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      b.textContent = Math.round(target * e) + suf;
      if (p < 1) b._raf = requestAnimationFrame(step);
    };
    b._raf = requestAnimationFrame(step);
  }
  const nums = document.querySelectorAll("[data-count]");
  nums.forEach(b => b.closest(".stat").addEventListener("mouseenter", () => countUp(b)));
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { countUp(e.target); so.unobserve(e.target); }
    }), { threshold: .5 });
    nums.forEach(b => so.observe(b));
  }

  apply(lang);
})();
