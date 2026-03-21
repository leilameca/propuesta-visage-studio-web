/* ============================================================
   VISAGE STUDIO — main.js
   Interacciones premium, navegación dinámica y reservas por WhatsApp
   ============================================================ */

/* ── LOADER ─────────────────────────────────────────────────── */
window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.getElementById("loader")?.classList.add("hidden");
  }, 1800);
});

/* ── NAVBAR / ACTIVE LINKS ─────────────────────────────────── */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...document.querySelectorAll("section[id]")];

const updateNavbar = () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 40);

  let currentId = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 160) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
};

updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

/* ── MOBILE MENU ───────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

const closeMobileMenu = () => {
  hamburger?.classList.remove("active");
  hamburger?.setAttribute("aria-expanded", "false");
  mobileMenu?.classList.remove("open");
  document.body.style.overflow = "";
};

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("active");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  mobileMenu?.classList.toggle("open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

mobileMenu?.addEventListener("click", (event) => {
  if (event.target === mobileMenu) {
    closeMobileMenu();
  }
});

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14,
  rootMargin: "0px 0px -40px 0px",
});

reveals.forEach((element) => revealObserver.observe(element));

/* ── HERO PARALLAX ─────────────────────────────────────────── */
const heroBg = document.querySelector(".hero-bg");
window.addEventListener("scroll", () => {
  if (!heroBg) return;
  const offset = Math.min(window.scrollY * 0.22, 120);
  heroBg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.02)`;
}, { passive: true });

/* ── HERO VIDEO LAZY LOAD ──────────────────────────────────── */
const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;
  const saveData = navigator.connection?.saveData;

  const shouldSkipVideo = prefersReducedMotion || saveData || isSmallScreen;

  const loadHeroVideo = () => {
    if (heroVideo.dataset.loaded === "true" || shouldSkipVideo) return;

    const src = heroVideo.dataset.src;
    if (!src) return;

    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    heroVideo.appendChild(source);
    heroVideo.load();
    heroVideo.dataset.loaded = "true";

    heroVideo.play().catch(() => {});
  };

  if (!shouldSkipVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadHeroVideo();
          videoObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    videoObserver.observe(heroVideo);
  }
}

/* ── LIGHTBOX ──────────────────────────────────────────────── */
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");

const closeLightbox = () => {
  lightbox?.classList.remove("open");
  document.body.style.overflow = "";
};

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    const label = item.dataset.label || "Galería";
    const hasRealImage = image && image.complete && image.naturalWidth > 0;

    if (!lightboxContent || !lightbox) return;

    lightboxContent.innerHTML = hasRealImage
      ? `<img src="${image.src}" alt="${label}" />`
      : `<div class="lightbox-bg-preview">${label}</div>`;

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

/* ── SMOOTH ANCHORS ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    const navOffset = navbar ? navbar.offsetHeight + 34 : 100;
    window.scrollTo({
      top: target.offsetTop - navOffset,
      behavior: "smooth",
    });
  });
});

/* ── MARQUEE PAUSE ─────────────────────────────────────────── */
const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack) {
  marqueeTrack.addEventListener("mouseenter", () => {
    marqueeTrack.style.animationPlayState = "paused";
  });
  marqueeTrack.addEventListener("mouseleave", () => {
    marqueeTrack.style.animationPlayState = "running";
  });
}

/* ── BEFORE / AFTER SLIDER ─────────────────────────────────── */
const beforeAfterRange = document.getElementById("beforeAfterRange");
const beforeLayer = document.getElementById("beforeLayer");
const beforeAfterDivider = document.getElementById("beforeAfterDivider");

const updateBeforeAfter = (value) => {
  if (!beforeLayer || !beforeAfterDivider) return;
  beforeLayer.style.width = `${value}%`;
  beforeAfterDivider.style.left = `${value}%`;
};

if (beforeAfterRange) {
  updateBeforeAfter(beforeAfterRange.value);
  beforeAfterRange.addEventListener("input", (event) => {
    updateBeforeAfter(event.target.value);
  });
}

/* ── BOOKING FORM TO WHATSAPP ──────────────────────────────── */
const bookingForm = document.getElementById("bookingForm");

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("bookingName")?.value.trim();
  const service = document.getElementById("bookingService")?.value.trim();
  const time = document.getElementById("bookingTime")?.value.trim();

  if (!name || !service || !time) return;

  const message = [
    "Hola, quiero reservar una cita en Visage Studio.",
    `Nombre: ${name}`,
    `Servicio: ${service}`,
    `Hora preferida: ${time}`,
  ].join("\n");

  const url = `https://wa.me/18095835757?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
});
