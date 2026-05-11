const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!prefersReducedMotion) {
  const revealItems = document.querySelectorAll("[data-reveal], .section-head");
  const reveal = (item) => item.classList.add("is-visible");
  const staggerGroups = document.querySelectorAll(
    ".hero-copy, .problem-grid, .steps-row, .use-case-grid, .offer-grid, .faq-list, .contact-layout",
  );

  staggerGroups.forEach((group) => {
    const items = group.querySelectorAll("[data-reveal], .section-head");
    items.forEach((item, index) => {
      item.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 70, 320)}ms`,
      );
    });
  });

  document.documentElement.classList.add("motion-ready");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -4% 0px",
        threshold: 0.04,
      },
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach(reveal);
  }
}
