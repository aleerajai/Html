const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Contact floating menu logic
const contactMenu = document.querySelector(".contact-menu");
const contactToggle = document.querySelector(".whatsapp-float");

if (contactMenu && contactToggle) {
  contactToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isActive = contactMenu.classList.toggle("is-active");
    contactToggle.setAttribute("aria-expanded", String(isActive));
  });

  document.addEventListener("click", (event) => {
    if (!contactMenu.contains(event.target)) {
      contactMenu.classList.remove("is-active");
      contactToggle.setAttribute("aria-expanded", "false");
    }
  });
}

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const desktopMotion = window.matchMedia("(min-width: 821px) and (prefers-reduced-motion: no-preference)");

if (desktopMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  let cursorFrame = 0;
  let cursorPosition = { clientX: 0, clientY: 0 };

  window.addEventListener("mousemove", (event) => {
    cursorPosition = { clientX: event.clientX, clientY: event.clientY };
    if (cursorFrame) return;
    cursorFrame = window.requestAnimationFrame(() => {
      cursorFrame = 0;
      if (!desktopMotion.matches) {
        document.body.classList.remove("has-custom-cursor");
        return;
      }
      document.body.classList.add("has-custom-cursor");
      cursorDot.style.transform = `translate(${cursorPosition.clientX - 3}px, ${cursorPosition.clientY - 3}px)`;
      cursorRing.style.transform = `translate(${cursorPosition.clientX - 17}px, ${cursorPosition.clientY - 17}px)`;
    });
  }, { passive: true });

  document.querySelectorAll("a, button, .magnetic").forEach((item) => {
    item.addEventListener("mouseenter", () => cursorRing.classList.add("is-active"));
    item.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("is-active");
      item.style.transform = "";
    });
    item.addEventListener("mousemove", (event) => {
      if (!desktopMotion.matches) return;
      const rect = item.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${offsetX * 0.08}px, ${offsetY * 0.08}px)`;
    });
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (!desktopMotion.matches) return;
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${offsetY * -8}deg) rotateY(${offsetX * 10}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}

const bootGsap = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  // --- DESKTOP ANIMATIONS ONLY (min-width: 821px) ---
  // Mobile devices often struggle with complex scrub animations over backdrop-filters, 
  // so we disable all scroll-based GSAP animations on mobile for maximum performance.
  mm.add("(min-width: 821px) and (prefers-reduced-motion: no-preference)", () => {
    
    // 0. Existing reveal animation for generic sections
    gsap.utils.toArray(".section:not(.hero) .reveal").forEach((element) => {
      gsap.from(element, {
        y: 42, opacity: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 86%", once: true }
      });
    });

    // Ensure profile image is on top of the text for the slide-behind effect
    gsap.set(".hero__visual", { zIndex: 10 });
    gsap.set(".hero__content", { zIndex: 1 });

    // 1. Hero Text Slide Behind Profile Image
    gsap.to(".hero__content > *", {
      x: 450, opacity: 0.3, stagger: 0.05,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 }
    });

    // 2. Hero Profile Image Parallax & Rotation
    gsap.to(".hero-image-wrapper", {
      y: 80, x: 30, rotationZ: 8, scale: 0.95,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 }
    });

    // 3. Skills Pop-in Animation
    gsap.from(".about__stack span", {
      scale: 0.5, opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)",
      scrollTrigger: { trigger: ".about__stack", start: "top 85%", once: true }
    });

    // 4. Portfolio Section - 3D Scrub Entrance (repeats on every scroll)
    gsap.set(".portfolio", { perspective: 1400 });

    const portfolioEnterTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".portfolio",
        start: "top bottom",   // begins as soon as section enters viewport
        end: "top 10%",        // fully revealed before merge zone starts
        scrub: 1.2
      }
    });

    // Heading rises + fades
    portfolioEnterTl.fromTo(".portfolio .section-heading",
      { y: 70, opacity: 0 },
      { y: 0,  opacity: 1, ease: "none", duration: 0.5 },
      0
    );

    const enterCards = gsap.utils.toArray(".work-card");
    if (enterCards.length === 3) {
      // Left card - rises + tilts from left
      portfolioEnterTl.fromTo(enterCards[0],
        { y: 200, opacity: 0, rotationY: -30, rotationX: 12 },
        { y: 0,   opacity: 1, rotationY: 0,   rotationX: 0,  ease: "none", duration: 1 },
        0.1
      );
      // Center card - rises highest (most dramatic)
      portfolioEnterTl.fromTo(enterCards[1],
        { y: 280, opacity: 0, scale: 0.85 },
        { y: 0,   opacity: 1, scale: 1,    ease: "none", duration: 1 },
        0.2
      );
      // Right card - rises + tilts from right
      portfolioEnterTl.fromTo(enterCards[2],
        { y: 200, opacity: 0, rotationY: 30, rotationX: 12 },
        { y: 0,   opacity: 1, rotationY: 0,  rotationX: 0,  ease: "none", duration: 1 },
        0.15
      );
    }

    // 5. Portfolio Merge Animation (Horizontal)
    const portfolioTl = gsap.timeline({
      scrollTrigger: { trigger: ".portfolio-track", start: "center center", end: "bottom top", scrub: 1 }
    });
    const cards = gsap.utils.toArray(".work-card");
    if (cards.length === 3) {
      cards.forEach(card => portfolioTl.to(card.children, { opacity: 0, ease: "power2.inOut" }, 0));
      portfolioTl.to(cards[0], { xPercent: 105, scale: 0.85, rotationY: -10, ease: "power2.inOut" }, 0);
      portfolioTl.to(cards[2], { xPercent: -105, scale: 0.85, rotationY: 10, ease: "power2.inOut" }, 0);
      portfolioTl.to(cards[1], { scale: 0.85, ease: "power2.inOut" }, 0);
      portfolioTl.to(".merged-text", { opacity: 1, scale: 1, ease: "power2.inOut" }, 0.1);
    }

    // 6. Section Headings Horizontal Shift
    gsap.utils.toArray(".section-heading h2, .about__panel h2").forEach((heading) => {
      gsap.to(heading, { x: 30, scrollTrigger: { trigger: heading, start: "top bottom", end: "bottom top", scrub: 1.2 } });
    });

    // 7. Contact Card Cinematic Scale
    gsap.from(".contact__card", {
      scale: 0.9, y: 50, rotationX: 5, transformPerspective: 1000,
      scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: 1 }
    });

    // 8. About Section - Full 3D Door (opens on scroll in, folds away on scroll out)
    gsap.set(".about", { perspective: 1400 });
    gsap.set([".about__panel", ".about__stack"], { clearProps: "all", opacity: 1 });

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about",
        start: "top bottom",   // starts when section enters from below
        end: "bottom top",     // ends when section fully exits at top
        scrub: 1.2
      }
    });

    // --- PHASE 1: Entry — panels swing open as section scrolls in ---
    aboutTl.fromTo(".about__panel",
      { rotationY: -60, x: -80, opacity: 0.2, transformOrigin: "right center" },
      { rotationY: 0,   x: 0,   opacity: 1,   transformOrigin: "right center", ease: "none", duration: 1 },
      0
    );
    aboutTl.fromTo(".about__stack",
      { rotationY: 60, x: 80, opacity: 0.2, transformOrigin: "left center" },
      { rotationY: 0,  x: 0,  opacity: 1,   transformOrigin: "left center",  ease: "none", duration: 1 },
      0
    );

    // --- PHASE 2: Exit — panels fold closed as section scrolls out at top ---
    aboutTl.to(".about__panel",
      { rotationY: 60, x: 80, opacity: 0.2, transformOrigin: "left center", ease: "none", duration: 1 },
      1
    );
    aboutTl.to(".about__stack",
      { rotationY: -60, x: -80, opacity: 0.2, transformOrigin: "right center", ease: "none", duration: 1 },
      1
    );

    // Skills boxes pop in when section is fully open (center of screen)
    gsap.fromTo(".about__stack span",
      { scale: 0.5, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: "back.out(2)",
        scrollTrigger: { trigger: ".about", start: "center 65%", once: true }
      }
    );

    // 9. Ambient Background Blobs Parallax
    gsap.to(".ambient--one", { yPercent: 18, scrollTrigger: { scrub: true } });
    gsap.to(".ambient--two", { yPercent: -16, scrollTrigger: { scrub: true } });
  });
};

let effectsRequested = false;

const loadScript = (source) => new Promise((resolve, reject) => {
  const script = document.createElement("script");
  script.src = source;
  script.onload = resolve;
  script.onerror = reject;
  document.head.append(script);
});

const loadScrollEffects = async () => {
  if (effectsRequested || !desktopMotion.matches || window.scrollY <= 20) return;
  effectsRequested = true;
  try {
    await loadScript("js/vendor/gsap-3.12.5.min.js");
    await loadScript("js/vendor/ScrollTrigger-3.12.5.min.js");
    bootGsap();
  } catch {
    document.body.classList.remove("has-custom-cursor");
  }
};

desktopMotion.addEventListener("change", () => {
  document.body.classList.remove("has-custom-cursor");
  loadScrollEffects();
});
window.addEventListener("scroll", loadScrollEffects, { passive: true });
loadScrollEffects();
