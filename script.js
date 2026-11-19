/* =====================================================
   AC PRODUCTIONS | script.js
   Only REEL_URL (just below) needs editing: your showreel link.
   ===================================================== */
/* ---------- EDIT THIS: your YouTube embed link ---------- */
const REEL_URL = ""; // e.g. "https://www.youtube.com/embed/VIDEO_ID"

/* ---------- logo: show logo.png if it exists ---------- */
document.querySelectorAll(".logo-slot img").forEach((img) => {
  const slot = img.parentElement;
  const ok = () => {
    if (img.naturalWidth) slot.classList.add("has-logo");
  };
  if (img.complete) ok();
  else img.addEventListener("load", ok);
});

/* ---------- nav: scrolled state, mobile menu, scroll spy ---------- */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

const burger = document.getElementById("burger"),
  menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
};
burger.addEventListener("click", () =>
  setMenu(!menu.classList.contains("open")),
);
menu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => setMenu(false)));

const links = [...menu.querySelectorAll("a")];
const spy = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting)
        links.forEach((l) =>
          l.classList.toggle(
            "active",
            l.getAttribute("href") === "#" + e.target.id,
          ),
        );
    }),
  { rootMargin: "-45% 0px -50% 0px" },
);
document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

/* ---------- hero: red spotlight + frame parallax ---------- */
const hero = document.getElementById("hero"),
  glow = hero.querySelector(".glow");
const frames = hero.querySelectorAll(".frame");
if (matchMedia("(pointer:fine)").matches) {
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    glow.style.setProperty("--mx", e.clientX - r.left + "px");
    glow.style.setProperty("--my", e.clientY - r.top + "px");
    const nx = e.clientX / innerWidth - 0.5,
      ny = e.clientY / innerHeight - 0.5;
    frames.forEach((f) => {
      const d = +f.dataset.depth;
      f.style.transform = `translate(${nx * d * 2}px, ${ny * d * 2}px)`;
    });
  });
}

/* ---------- scroll reveal ---------- */
const rv = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        rv.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".rv").forEach((el) => rv.observe(el));

/* ---------- counters ---------- */
const cnt = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target,
        end = +el.dataset.count,
        suf = el.dataset.suffix || "";
      const t0 = performance.now(),
        dur = 1400;
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cnt.unobserve(el);
    }),
  { threshold: 0.6 },
);
document.querySelectorAll("[data-count]").forEach((el) => cnt.observe(el));

/* ---------- work filters ---------- */
const btns = document.querySelectorAll(".filters button"),
  cards = document.querySelectorAll(".card");
btns.forEach((b) =>
  b.addEventListener("click", () => {
    btns.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    cards.forEach((c) => {
      const show =
        b.dataset.filter === "all" || c.dataset.cat === b.dataset.filter;
      c.classList.toggle("hide", !show);
      if (show) {
        c.classList.remove("pop");
        void c.offsetWidth;
        c.classList.add("pop");
      }
    });
  }),
);
cards.forEach((c) =>
  c.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openReel();
  }),
);
cards.forEach((c) => c.addEventListener("click", openReel));

/* ---------- showreel modal ---------- */
const modal = document.getElementById("modal"),
  reel = document.getElementById("reel");
function openReel() {
  if (REEL_URL && !reel.querySelector("iframe")) {
    const f = document.createElement("iframe");
    f.src = REEL_URL + (REEL_URL.includes("?") ? "&" : "?") + "autoplay=1";
    f.allow = "autoplay; fullscreen; picture-in-picture";
    f.allowFullscreen = true;
    reel.appendChild(f);
    document.getElementById("reel-msg").style.display = "none";
  }
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("close").focus();
}
function closeReel() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
  const f = reel.querySelector("iframe");
  if (f) f.remove();
}
document
  .querySelectorAll("[data-open-reel]")
  .forEach((b) => b.addEventListener("click", openReel));
document.getElementById("close").addEventListener("click", closeReel);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeReel();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeReel();
    setMenu(false);
  }
});

/* ---------- contact form (opens the visitor's email app) ---------- */
const form = document.getElementById("form"),
  note = document.getElementById("note");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  if (!d.name || !/\S+@\S+\.\S+/.test(d.email || "") || !d.type || !d.msg) {
    note.textContent = "Please fill in every field with a valid email.";
    return;
  }
  const body = `Name: ${d.name}\nEmail: ${d.email}\nService: ${d.type}\n\n${d.msg}`;
  location.href = `mailto:hello@acproductions.com?subject=${encodeURIComponent("New project: " + d.type)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Your email app is opening with your message.";
  form.reset();
});

document.getElementById("yr").textContent = new Date().getFullYear();
