/* ============================================================
   VISAGE STUDIO - main.js
   Navegacion, overlays, microinteracciones y 2026 behaviors
   ============================================================ */

const navbar    = document.getElementById("navbar");
const navLinks  = document.querySelectorAll(".nav-links a");
const sections  = [...document.querySelectorAll("section[id]")];
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

const serviceModal          = document.getElementById("serviceModal");
const serviceModalClose     = document.getElementById("serviceModalClose");
const serviceModalImage     = document.getElementById("serviceModalImage");
const serviceModalKicker    = document.getElementById("serviceModalKicker");
const serviceModalTitle     = document.getElementById("serviceModalTitle");
const serviceModalDescription = document.getElementById("serviceModalDescription");
const serviceModalPoints    = document.getElementById("serviceModalPoints");
const serviceModalThumbs    = document.getElementById("serviceModalThumbs");

const lightbox        = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose   = document.getElementById("lightboxClose");
const lightboxPrev    = document.getElementById("lightboxPrev");
const lightboxNext    = document.getElementById("lightboxNext");
const lightboxTitle   = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");

let galleryImages = [];
let galleryIndex  = 0;
let isLightboxAnimating = false;

const serviceDetails = {
  cabello: {
    kicker: "Diseño capilar",
    title: "Cabello",
    image: "assets/images/services/IMG_SERVICIO_CABELLO.jpg",
    description: "Cortes, color y styling trabajados con criterio para que el resultado se vea elegante en el salon, en la calle y en fotos.",
    points: [
      "Diagnostico de textura, forma y mantenimiento realista.",
      "Coloracion, brillo y movimiento adaptados a tu estilo.",
      "Acabado final pensado para durar y verse pulido.",
    ],
  },
  unas: {
    kicker: "Manos impecables",
    title: "Uñas",
    image: "assets/images/services/IMG_SERVICIO_UNAS.jpg",
    description: "Una propuesta de manicure con forma, color y terminacion limpia para que tus manos se vean sofisticadas sin exceso.",
    points: [
      "Definicion de largo, forma y acabado segun tu rutina.",
      "Trabajo prolijo de cuticula y estructura visual.",
      "Opciones de look natural, pulido o mas editorial.",
    ],
  },
  maquillaje: {
    kicker: "Luz y balance",
    title: "Maquillaje",
    image: "assets/images/services/IMG_SERVICIO_MAKEUP.jpg",
    description: "Maquillaje social o editorial con tecnica de piel, estructura y luz para resaltar tu rostro sin disfrazarlo.",
    points: [
      "Lectura de rostro, evento, vestuario y duracion esperada.",
      "Piel trabajada con textura fina y puntos de luz medidos.",
      "Acabado que se sostiene bien de cerca y en camara.",
    ],
  },
  pestanas: {
    kicker: "Mirada definida",
    title: "Pestañas",
    image: "assets/images/services/IMG_SERVICIO_PESTANAS.jpg",
    description: "Disenamos la mirada con un resultado armonico, comodo y proporcionado para que se vea expresiva y limpia.",
    points: [
      "Mapeo segun forma del ojo y efecto que te favorece.",
      "Aplicacion orientada a comodidad y caida visual elegante.",
      "Mantenimiento pensado para que el look siga viendose fino.",
    ],
  },
  masajes: {
    kicker: "Bienestar y pausa",
    title: "Masajes",
    image: "assets/images/studio/IMG_STUDIO_INTERIOR.jpg",
    description: "Masajes relajantes pensados para liberar tension y convertir tu cita en una experiencia todavia mas completa y reconfortante.",
    points: [
      "Ideal para complementar servicios de belleza con un momento real de descanso.",
      "Enfoque en relajacion de espalda, pies o zonas de mayor tension.",
      "Tecnica profesional adaptada a tu nivel de sensibilidad.",
    ],
  },
};

/* ============================================================
   BODY LOCK
   ============================================================ */
const syncBodyLock = () => {
  const shouldLock =
    mobileMenu?.classList.contains("open")   ||
    serviceModal?.classList.contains("open") ||
    lightbox?.classList.contains("open");
  document.body.style.overflow = shouldLock ? "hidden" : "";
};

/* ============================================================
   SCROLL PROGRESS BAR (JS fallback cuando CSS scroll-driven no disponible)
   ============================================================ */
const progressBar = document.getElementById("scroll-progress-bar");

const updateProgressBar = () => {
  if (!progressBar) return;
  if (CSS.supports("animation-timeline", "scroll()")) return; // native CSS handles it
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
};

/* ============================================================
   NAVBAR — hide on scroll down, show on scroll up
   ============================================================ */
let lastScrollY   = window.scrollY;
let scrollTicking = false;

const updateNavbar = () => {
  const currentY = window.scrollY;
  const delta    = currentY - lastScrollY;

  // Scrolled state (background)
  navbar?.classList.toggle("scrolled", currentY > 24);

  // Active link tracking
  let currentId = "";
  sections.forEach((section) => {
    if (currentY >= section.offsetTop - 180) currentId = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });

  lastScrollY = currentY;
  scrollTicking = false;
};

updateNavbar();

window.addEventListener("scroll", () => {
  updateProgressBar();
  if (!scrollTicking) {
    requestAnimationFrame(updateNavbar);
    scrollTicking = true;
  }
}, { passive: true });

/* ============================================================
   WHATSAPP FLOAT — appears after 300px scroll
   ============================================================ */
const waFloat = document.querySelector(".whatsapp-float");

const updateWaFloat = () => {
  if (!waFloat) return;
  waFloat.classList.toggle("wa-visible", window.scrollY > 300);
};

updateWaFloat();
window.addEventListener("scroll", updateWaFloat, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const closeMobileMenu = () => {
  hamburger?.classList.remove("active");
  hamburger?.setAttribute("aria-expanded", "false");
  mobileMenu?.classList.remove("open");
  syncBodyLock();
};

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("active");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  mobileMenu?.classList.toggle("open", isOpen);
  syncBodyLock();
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

mobileMenu?.addEventListener("click", (e) => {
  if (e.target === mobileMenu) closeMobileMenu();
});

/* ============================================================
   REVEAL SYSTEM
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13, rootMargin: "0px 0px -50px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ============================================================
   HERO PARALLAX
   ============================================================ */
const heroBg = document.querySelector(".hero-bg");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  window.addEventListener("scroll", () => {
    if (!heroBg) return;
    const offset = Math.min(window.scrollY * 0.22, 120);
    heroBg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.02)`;
  }, { passive: true });
}

/* ============================================================
   HERO VIDEO
   ============================================================ */
const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  const saveData      = navigator.connection?.saveData;
  const supportsWebm  = heroVideo.canPlayType("video/webm") !== "";
  const shouldSkip    = prefersReducedMotion || saveData || !supportsWebm;

  if (shouldSkip) {
    heroBg?.classList.add("poster-only");
  } else {
    const src = heroVideo.dataset.src;
    if (src && heroVideo.dataset.loaded !== "true") {
      const source   = document.createElement("source");
      source.src     = src;
      source.type    = "video/webm";
      heroVideo.appendChild(source);
      heroVideo.load();
      heroVideo.dataset.loaded = "true";
      heroVideo.play().catch(() => {});
    }
  }
}

/* ============================================================
   SERVICE MODAL
   ============================================================ */
const closeServiceModal = () => {
  serviceModal?.classList.remove("open");
  serviceModal?.setAttribute("aria-hidden", "true");
  syncBodyLock();
};

const openServiceModal = (serviceKey) => {
  const service = serviceDetails[serviceKey];
  if (!service || !serviceModal) return;

  serviceModalKicker.textContent     = service.kicker;
  serviceModalTitle.textContent      = service.title;
  serviceModalDescription.textContent = service.description;
  serviceModalImage.src              = service.image;
  serviceModalImage.alt              = service.title;

  serviceModalPoints.innerHTML = service.points
    .map((point) =>
      `<div class="service-modal-point"><i class="fas fa-circle-check" aria-hidden="true"></i><span>${point}</span></div>`
    ).join("");

  serviceModalThumbs.innerHTML = Array.from({ length: 3 }, () => service.image)
    .map((src, i) =>
      `<img src="${src}" alt="${service.title} ${i + 1}" class="service-modal-thumb" loading="lazy" decoding="async" />`
    ).join("");

  serviceModal.classList.add("open");
  serviceModal.setAttribute("aria-hidden", "false");
  syncBodyLock();
};

document.querySelectorAll(".service-card").forEach((card) => {
  const button     = card.querySelector(".service-card-action");
  const serviceKey = card.dataset.service;
  button?.addEventListener("click", (e) => { e.stopPropagation(); openServiceModal(serviceKey); });
});

serviceModalClose?.addEventListener("click", closeServiceModal);
serviceModal?.addEventListener("click", (e) => { if (e.target === serviceModal) closeServiceModal(); });

/* ============================================================
   SERVICE CARD MAGNETIC HOVER (desktop only)
   ============================================================ */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = ((e.clientX - cx) / rect.width)  * 18;
      const dy   = ((e.clientY - cy) / rect.height) * 18;
      card.style.setProperty("--mx", `${dx}px`);
      card.style.setProperty("--my", `${dy}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--mx", "0px");
      card.style.setProperty("--my", "0px");
    });
  });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
const buildLightboxMedia = (imageData, className = "") => {
  const media = document.createElement("div");
  media.className = `lightbox-media ${className}`.trim();

  if (imageData.src) {
    const img = document.createElement("img");
    img.src   = imageData.src;
    img.alt   = imageData.label;
    media.appendChild(img);
    return media;
  }

  const preview = document.createElement("div");
  preview.className   = "lightbox-bg-preview";
  preview.textContent = imageData.label;
  media.appendChild(preview);
  return media;
};

const renderLightboxImage = (direction = 0) => {
  if (!lightboxContent || !galleryImages.length) return;

  const currentImage = galleryImages[galleryIndex];
  lightboxTitle.textContent   = currentImage.label;
  lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;

  if (direction === 0 || prefersReducedMotion || !lightboxContent.children.length) {
    lightboxContent.innerHTML = "";
    lightboxContent.appendChild(buildLightboxMedia(currentImage, "is-current"));
    isLightboxAnimating = false;
    return;
  }

  const currentMedia   = lightboxContent.querySelector(".lightbox-media.is-current");
  const incomingClass  = direction > 0 ? "turn-in-next"  : "turn-in-prev";
  const outgoingClass  = direction > 0 ? "turn-out-next" : "turn-out-prev";
  const nextMedia      = buildLightboxMedia(currentImage, incomingClass);

  if (!currentMedia) {
    lightboxContent.innerHTML = "";
    lightboxContent.appendChild(buildLightboxMedia(currentImage, "is-current"));
    isLightboxAnimating = false;
    return;
  }

  isLightboxAnimating = true;
  currentMedia.classList.remove("is-current");
  currentMedia.classList.add(outgoingClass);
  lightboxContent.appendChild(nextMedia);

  nextMedia.addEventListener("animationend", () => {
    currentMedia.remove();
    nextMedia.classList.remove(incomingClass);
    nextMedia.classList.add("is-current");
    isLightboxAnimating = false;
  }, { once: true });
};

const closeLightbox = () => {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  isLightboxAnimating = false;
  syncBodyLock();
};

const stepGallery = (direction) => {
  if (!galleryImages.length || isLightboxAnimating) return;
  galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;
  renderLightboxImage(direction);
};

const openGallery = (item) => {
  const image    = item.querySelector("img");
  const label    = item.dataset.label || "Galeria";
  const imageSrc = image?.src || "";

  galleryImages = Array.from({ length: 6 }, (_, i) => {
    const imgs = document.querySelectorAll(".gallery-item img");
    return {
      src:   imgs[i]?.src || imageSrc,
      label: document.querySelectorAll(".gallery-item")[i]?.dataset.label || label,
    };
  });

  // Start at clicked item index
  const items  = [...document.querySelectorAll(".gallery-item")];
  galleryIndex = Math.max(items.indexOf(item), 0);

  renderLightboxImage(0);
  lightbox?.classList.add("open");
  lightbox?.setAttribute("aria-hidden", "false");
  syncBodyLock();
};

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => openGallery(item));
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGallery(item); }
  });
});

lightboxPrev?.addEventListener("click", () => stepGallery(-1));
lightboxNext?.addEventListener("click", () => stepGallery(1));
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeMobileMenu();
    closeServiceModal();
    closeLightbox();

    const navOffset = navbar ? navbar.offsetHeight + 24 : 96;
    window.scrollTo({ top: target.offsetTop - navOffset, behavior: "smooth" });
  });
});

/* ============================================================
   MARQUEE PAUSE ON HOVER
   ============================================================ */
const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack) {
  marqueeTrack.addEventListener("mouseenter", () => { marqueeTrack.style.animationPlayState = "paused"; });
  marqueeTrack.addEventListener("mouseleave", () => { marqueeTrack.style.animationPlayState = "running"; });
}

/* ============================================================
   BEFORE / AFTER SLIDER
   ============================================================ */
const beforeAfterRange   = document.getElementById("beforeAfterRange");
const beforeLayer        = document.getElementById("beforeLayer");
const beforeAfterDivider = document.getElementById("beforeAfterDivider");

const updateBeforeAfter = (value) => {
  if (!beforeLayer || !beforeAfterDivider) return;
  beforeLayer.style.width        = `${value}%`;
  beforeAfterDivider.style.left  = `${value}%`;
};

if (beforeAfterRange) {
  updateBeforeAfter(beforeAfterRange.value);
  beforeAfterRange.addEventListener("input", (e) => updateBeforeAfter(e.target.value));
}

/* Auto-demo: animate once when entering viewport */
const baFrame = document.getElementById("beforeAfterFrame");
if (baFrame && beforeLayer && beforeAfterDivider && !prefersReducedMotion) {
  let baPlayed = false;

  const baObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !baPlayed) {
          baPlayed = true;

          // Remove and re-add class to restart animation
          beforeLayer.classList.remove("ba-demo");
          beforeAfterDivider.classList.remove("ba-demo");
          void beforeLayer.offsetWidth; // force reflow
          beforeLayer.classList.add("ba-demo");
          beforeAfterDivider.classList.add("ba-demo");

          // After demo, set slider back to center
          setTimeout(() => {
            beforeLayer.classList.remove("ba-demo");
            beforeAfterDivider.classList.remove("ba-demo");
            updateBeforeAfter(50);
            if (beforeAfterRange) beforeAfterRange.value = 50;
          }, 2500);

          baObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  baObserver.observe(baFrame);
}

/* ============================================================
   TESTIMONIALS CAROUSEL (mobile auto-advance)
   ============================================================ */
const testimoniosGrid = document.querySelector(".testimonios-grid");
const testimoniosDots = document.querySelector(".testimonios-dots");

if (testimoniosGrid && testimoniosDots) {
  const cards      = [...testimoniosGrid.querySelectorAll(".testimonial-card")];
  const dotEls     = [...testimoniosDots.querySelectorAll(".testimonios-dot")];
  let currentSlide = 0;
  let autoTimer    = null;
  let isScrolling  = false;

  const goToSlide = (index) => {
    currentSlide = (index + cards.length) % cards.length;
    dotEls.forEach((d, i) => d.classList.toggle("active", i === currentSlide));

    // Scroll the grid to the card (mobile carousel behavior)
    const card    = cards[currentSlide];
    const gridLeft = testimoniosGrid.getBoundingClientRect().left;
    const cardLeft = card.getBoundingClientRect().left;
    const offset   = testimoniosGrid.scrollLeft + (cardLeft - gridLeft);

    testimoniosGrid.scrollTo({ left: offset, behavior: "smooth" });
  };

  // Build dots from cards
  dotEls.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(autoTimer);
      goToSlide(i);
      startAuto();
    });
  });

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isScrolling) goToSlide(currentSlide + 1);
    }, 4000);
  };

  // Detect manual swipe to update dots
  testimoniosGrid.addEventListener("scroll", () => {
    isScrolling = true;
    clearTimeout(testimoniosGrid._scrollEnd);
    testimoniosGrid._scrollEnd = setTimeout(() => {
      isScrolling = false;
      // Detect which card is most visible
      let bestIndex   = 0;
      let bestOverlap = -Infinity;
      cards.forEach((card, i) => {
        const rect      = card.getBoundingClientRect();
        const gridRect  = testimoniosGrid.getBoundingClientRect();
        const overlap   = Math.min(rect.right, gridRect.right) - Math.max(rect.left, gridRect.left);
        if (overlap > bestOverlap) { bestOverlap = overlap; bestIndex = i; }
      });
      currentSlide = bestIndex;
      dotEls.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
    }, 100);
  }, { passive: true });

  // Pause auto on touch
  testimoniosGrid.addEventListener("touchstart", () => {
    clearInterval(autoTimer);
    isScrolling = true;
  }, { passive: true });

  testimoniosGrid.addEventListener("touchend", () => {
    setTimeout(() => { isScrolling = false; startAuto(); }, 600);
  }, { passive: true });

  // Init first dot active
  if (dotEls[0]) dotEls[0].classList.add("active");

  // Only auto-advance on mobile
  if (window.matchMedia("(max-width: 640px)").matches) {
    startAuto();
  }
}

/* ============================================================
   BOOKING FORM — WhatsApp
   ============================================================ */
const bookingForm = document.getElementById("bookingForm");

bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name    = document.getElementById("bookingName")?.value.trim();
  const service = document.getElementById("bookingService")?.value.trim();
  const time    = document.getElementById("bookingTime")?.value.trim();

  if (!name || !service || !time) return;

  const message = [
    "Hola, quiero reservar una cita en Visage Studio.",
    `Nombre: ${name}`,
    `Servicio: ${service}`,
    `Hora preferida: ${time}`,
  ].join("\n");

  window.open(`https://wa.me/18095835757?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

/* ============================================================
   KEYBOARD NAVIGATION
   ============================================================ */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobileMenu();
    closeServiceModal();
    closeLightbox();
    return;
  }

  if (lightbox?.classList.contains("open")) {
    if (e.key === "ArrowLeft")  stepGallery(-1);
    if (e.key === "ArrowRight") stepGallery(1);
  }
});
