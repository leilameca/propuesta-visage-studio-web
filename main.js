/* ============================================================
   VISAGE STUDIO - main.js
   Navegacion, overlays y microinteracciones
   ============================================================ */

const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...document.querySelectorAll("section[id]")];
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

const serviceModal = document.getElementById("serviceModal");
const serviceModalClose = document.getElementById("serviceModalClose");
const serviceModalImage = document.getElementById("serviceModalImage");
const serviceModalKicker = document.getElementById("serviceModalKicker");
const serviceModalTitle = document.getElementById("serviceModalTitle");
const serviceModalDescription = document.getElementById("serviceModalDescription");
const serviceModalPoints = document.getElementById("serviceModalPoints");
const serviceModalThumbs = document.getElementById("serviceModalThumbs");

const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");

let galleryImages = [];
let galleryIndex = 0;
let isLightboxAnimating = false;

const serviceDetails = {
  cabello: {
    kicker: "Diseno capilar",
    title: "Cabello",
    image: "IMG_SERVICIO_CABELLO.jpg",
    description:
      "Cortes, color y styling trabajados con criterio para que el resultado se vea elegante en el salon, en la calle y en fotos.",
    points: [
      "Diagnostico de textura, forma y mantenimiento realista.",
      "Coloracion, brillo y movimiento adaptados a tu estilo.",
      "Acabado final pensado para durar y verse pulido.",
    ],
  },
  unas: {
    kicker: "Manos impecables",
    title: "Unas",
    image: "IMG_SERVICIO_UNAS.jpg",
    description:
      "Una propuesta de manicure con forma, color y terminacion limpia para que tus manos se vean sofisticadas sin exceso.",
    points: [
      "Definicion de largo, forma y acabado segun tu rutina.",
      "Trabajo prolijo de cuticula y estructura visual.",
      "Opciones de look natural, pulido o mas editorial.",
    ],
  },
  maquillaje: {
    kicker: "Luz y balance",
    title: "Maquillaje",
    image: "IMG_SERVICIO_MAKEUP.jpg",
    description:
      "Maquillaje social o editorial con tecnica de piel, estructura y luz para resaltar tu rostro sin disfrazarlo.",
    points: [
      "Lectura de rostro, evento, vestuario y duracion esperada.",
      "Piel trabajada con textura fina y puntos de luz medidos.",
      "Acabado que se sostiene bien de cerca y en camara.",
    ],
  },
  pestanas: {
    kicker: "Mirada definida",
    title: "Pestanas",
    image: "IMG_SERVICIO_PESTANAS.jpg",
    description:
      "Disenamos la mirada con un resultado armonico, comodo y proporcionado para que se vea expresiva y limpia.",
    points: [
      "Mapeo segun forma del ojo y efecto que te favorece.",
      "Aplicacion orientada a comodidad y caida visual elegante.",
      "Mantenimiento pensado para que el look siga viendose fino.",
    ],
  },
};

const syncBodyLock = () => {
  const shouldLock =
    mobileMenu?.classList.contains("open") ||
    serviceModal?.classList.contains("open") ||
    lightbox?.classList.contains("open");

  document.body.style.overflow = shouldLock ? "hidden" : "";
};

const updateNavbar = () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 24);

  let currentId = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 180) {
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

mobileMenu?.addEventListener("click", (event) => {
  if (event.target === mobileMenu) {
    closeMobileMenu();
  }
});

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  }
);

reveals.forEach((element) => revealObserver.observe(element));

const heroBg = document.querySelector(".hero-bg");
window.addEventListener(
  "scroll",
  () => {
    if (!heroBg) return;
    const offset = Math.min(window.scrollY * 0.22, 120);
    heroBg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.02)`;
  },
  { passive: true }
);

const heroVideo = document.getElementById("heroVideo");

if (heroVideo) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData;
  const supportsMp4 = heroVideo.canPlayType("video/mp4") !== "";
  const shouldSkipVideo = prefersReducedMotion || saveData || !supportsMp4;

  if (shouldSkipVideo) {
    heroBg?.classList.add("poster-only");
  }

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
    loadHeroVideo();
  }
}

const closeServiceModal = () => {
  serviceModal?.classList.remove("open");
  serviceModal?.setAttribute("aria-hidden", "true");
  syncBodyLock();
};

const openServiceModal = (serviceKey) => {
  const service = serviceDetails[serviceKey];
  if (!service || !serviceModal) return;

  serviceModalKicker.textContent = service.kicker;
  serviceModalTitle.textContent = service.title;
  serviceModalDescription.textContent = service.description;
  serviceModalImage.src = service.image;
  serviceModalImage.alt = service.title;

  serviceModalPoints.innerHTML = service.points
    .map(
      (point) =>
        `<div class="service-modal-point"><i class="fas fa-circle-check" aria-hidden="true"></i><span>${point}</span></div>`
    )
    .join("");

  serviceModalThumbs.innerHTML = Array.from({ length: 3 }, () => service.image)
    .map((imageSrc, index) => `<img src="${imageSrc}" alt="${service.title} ${index + 1}" class="service-modal-thumb" loading="lazy" decoding="async" />`)
    .join("");

  serviceModal.classList.add("open");
  serviceModal.setAttribute("aria-hidden", "false");
  syncBodyLock();
};

document.querySelectorAll(".service-card").forEach((card) => {
  const button = card.querySelector(".service-card-action");
  const serviceKey = card.dataset.service;

  button?.addEventListener("click", (event) => {
    event.stopPropagation();
    openServiceModal(serviceKey);
  });
});

serviceModalClose?.addEventListener("click", closeServiceModal);
serviceModal?.addEventListener("click", (event) => {
  if (event.target === serviceModal) {
    closeServiceModal();
  }
});

const buildLightboxMedia = (imageData, className = "") => {
  const media = document.createElement("div");
  media.className = `lightbox-media ${className}`.trim();

  if (imageData.src) {
    const img = document.createElement("img");
    img.src = imageData.src;
    img.alt = imageData.label;
    media.appendChild(img);
    return media;
  }

  const preview = document.createElement("div");
  preview.className = "lightbox-bg-preview";
  preview.textContent = imageData.label;
  media.appendChild(preview);
  return media;
};

const renderLightboxImage = (direction = 0) => {
  if (!lightboxContent || !galleryImages.length) return;

  const currentImage = galleryImages[galleryIndex];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  lightboxTitle.textContent = currentImage.label;
  lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;

  if (direction === 0 || prefersReducedMotion || !lightboxContent.children.length) {
    lightboxContent.innerHTML = "";
    lightboxContent.appendChild(buildLightboxMedia(currentImage, "is-current"));
    isLightboxAnimating = false;
    return;
  }

  const currentMedia = lightboxContent.querySelector(".lightbox-media.is-current");
  const incomingClass = direction > 0 ? "turn-in-next" : "turn-in-prev";
  const outgoingClass = direction > 0 ? "turn-out-next" : "turn-out-prev";
  const nextMedia = buildLightboxMedia(currentImage, incomingClass);

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

  nextMedia.addEventListener(
    "animationend",
    () => {
      currentMedia.remove();
      nextMedia.classList.remove(incomingClass);
      nextMedia.classList.add("is-current");
      isLightboxAnimating = false;
    },
    { once: true }
  );
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
  const image = item.querySelector("img");
  const label = item.dataset.label || "Galeria";
  const imageSrc = image?.src || "";

  galleryImages = Array.from({ length: 5 }, (_, index) => ({
    src: imageSrc,
    label,
  }));

  galleryIndex = 0;
  renderLightboxImage(0);
  lightbox?.classList.add("open");
  lightbox?.setAttribute("aria-hidden", "false");
  syncBodyLock();
};

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => openGallery(item));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGallery(item);
    }
  });
});

lightboxPrev?.addEventListener("click", () => stepGallery(-1));
lightboxNext?.addEventListener("click", () => stepGallery(1));
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    closeMobileMenu();
    closeServiceModal();
    closeLightbox();

    const navOffset = navbar ? navbar.offsetHeight + 24 : 96;
    window.scrollTo({
      top: target.offsetTop - navOffset,
      behavior: "smooth",
    });
  });
});

const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack) {
  marqueeTrack.addEventListener("mouseenter", () => {
    marqueeTrack.style.animationPlayState = "paused";
  });

  marqueeTrack.addEventListener("mouseleave", () => {
    marqueeTrack.style.animationPlayState = "running";
  });
}

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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    closeServiceModal();
    closeLightbox();
    return;
  }

  if (lightbox?.classList.contains("open")) {
    if (event.key === "ArrowLeft") stepGallery(-1);
    if (event.key === "ArrowRight") stepGallery(1);
  }
});
