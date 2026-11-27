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

  /* services: initials trail the cursor */
  if (window.matchMedia && matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".svc-row").forEach(row => {
      const fls = [...row.querySelectorAll(".fl")];
      if (!fls.length) return;
      const pts = fls.map(() => ({ x: 0, y: 0 }));
      let tx = 0, ty = 0, raf = null, on = false;
      const ease = [0.32, 0.2, 0.13];
      const tick = () => {
        const dir = document.documentElement.dir === "rtl" ? -1 : 1;
        let moving = false;
        pts.forEach((p, i) => {
          const gx = tx + dir * (22 + i * 30) - (dir < 0 ? 30 : 0), gy = ty - 14 + i * 4;
          const k = reduce ? 1 : ease[i] || 0.1;
          p.x += (gx - p.x) * k; p.y += (gy - p.y) * k;
          if (Math.abs(gx - p.x) + Math.abs(gy - p.y) > 0.3) moving = true;
          fls[dir < 0 ? fls.length - 1 - i : i].style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
        });
        raf = (on || moving) ? requestAnimationFrame(tick) : null;
      };
      const pos = e => { const r = row.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; };
      row.addEventListener("mouseenter", e => {
        pos(e); on = true; row.classList.add("trail");
        const dir = document.documentElement.dir === "rtl" ? -1 : 1;
        pts.forEach((p, i) => { p.x = tx + dir * 10 * i; p.y = ty + 20; });
        if (!raf) raf = requestAnimationFrame(tick);
      });
      row.addEventListener("mousemove", e => { pos(e); if (!raf) raf = requestAnimationFrame(tick); });
      row.addEventListener("mouseleave", () => { on = false; row.classList.remove("trail"); });
    });
  }

  apply(lang);
})();
