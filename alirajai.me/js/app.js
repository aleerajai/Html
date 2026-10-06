const header = document.querySelector("[data-header]");
const loader = document.querySelector(".loader");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

window.addEventListener("load", () => {
  if (window.gsap) {
    gsap.to(loader, { autoAlpha: 0, duration: 0.7, delay: 0.45, ease: "power2.out" });
    gsap.from(".hero .reveal", { y: 36, opacity: 0, duration: 0.9, stagger: 0.13, delay: 0.7, ease: "power3.out" });
  } else {
    loader.style.display = "none";
  }
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
});

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

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    cursorDot.style.transform = `translate(${clientX - 3}px, ${clientY - 3}px)`;
    cursorRing.animate(
      { transform: `translate(${clientX - 17}px, ${clientY - 17}px)` },
      { duration: 450, fill: "forwards", easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });

  document.querySelectorAll("a, button, .magnetic").forEach((item) => {
    item.addEventListener("mouseenter", () => cursorRing.classList.add("is-active"));
    item.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("is-active");
      item.style.transform = "";
    });
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}

const bootGsap = () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  let mm = gsap.matchMedia();

  // --- DESKTOP ANIMATIONS ONLY (min-width: 821px) ---
  // Mobile devices often struggle with complex scrub animations over backdrop-filters, 
  // so we disable all scroll-based GSAP animations on mobile for maximum performance.
  mm.add("(min-width: 821px)", () => {
    
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
    enterCards.forEach((card, i) => {
      const isLeft = i % 2 === 0;
      portfolioEnterTl.fromTo(card,
        { y: 180 + (i >= 2 ? 40 : 0), opacity: 0, rotationY: isLeft ? -16 : 16, rotationX: 10 },
        { y: 0,   opacity: 1, rotationY: 0,   rotationX: 0,  ease: "none", duration: 1 },
        0.1 + i * 0.12
      );
    });

    // 5. Services Cards Stagger Entrance (guaranteed visibility)
    gsap.fromTo(".service-card",
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".services", start: "top 85%", once: true }
      }
    );

    // 6. Timeline Milestones Entrance
    gsap.from(".timeline__item", {
      x: -40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      scrollTrigger: { trigger: ".timeline", start: "top 80%", once: true }
    });

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

window.addEventListener("load", bootGsap);

// Copy Email to Clipboard helper
document.querySelectorAll("[data-copy-email]").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = btn.getAttribute("data-copy-email") || "alirajai.dev@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span>Copied to Clipboard! ✓</span>`;
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2400);
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  });
});
