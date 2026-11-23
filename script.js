// Scroll reveal + subtle card tilt. Content remains readable without JavaScript.
const revealTargets = document.querySelectorAll('.section-label, .intro-grid, .statement-text, .work-heading, .project, .skills-grid, .closing h2, .closing-bottom');
revealTargets.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('shown'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => observer.observe(el));
} else revealTargets.forEach(el => el.classList.add('shown'));

// Gentle pointer-driven 3D tilt on desktop; disable on touch and reduced-motion.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(900px) rotateY(${x*3.2}deg) rotateX(${-y*3.2}deg) translateY(-3px)`;
    }, { passive: true });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; }, { passive: true });
  });
}
