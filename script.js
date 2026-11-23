// Small scroll-reveal motion. All content remains visible when JS is unavailable.
const revealTargets = document.querySelectorAll('.section-label, .intro-grid, .statement-text, .work-heading, .project, .skills-grid, .closing h2, .closing-bottom');
revealTargets.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('shown');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));
