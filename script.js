// ===== REDUCED MOTION =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== CURSOR GLOW EFFECT =====
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && !prefersReducedMotion) {
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
    cursorGlow.style.opacity = '1';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; // ignore bare "#" links
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SCROLL REVEAL ANIMATION (reveal once, then stop observing) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-section').forEach(section => {
  revealObserver.observe(section);
});

// ===== CONSOLIDATED SCROLL HANDLER (header bg + hero fade), rAF-throttled =====
const hero = document.getElementById('hero');
const header = document.querySelector('header');
let ticking = false;

function handleScroll() {
  const scrolled = window.pageYOffset;

  // Header background
  if (header) {
    if (scrolled > 50) {
      header.style.background = 'rgba(10, 10, 15, 0.95)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.background = 'rgba(10, 10, 15, 0.8)';
      header.style.boxShadow = 'none';
    }
  }

  // Fade hero as you scroll past it
  if (hero && !prefersReducedMotion && scrolled < window.innerHeight) {
    const opacity = 1 - (scrolled / window.innerHeight) * 1.5;
    hero.style.opacity = Math.max(opacity, 0);
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

// ===== PROJECT CARD TILT =====
if (!prefersReducedMotion) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 20;
      const rotateY = (rect.width / 2 - x) / 20;
      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ===== SKILL TAG ENTRANCE ANIMATION =====
if (!prefersReducedMotion) {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.skill-tag').forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.05}s`;
    tag.style.animation = 'fadeInUp 0.6s forwards';
  });
}

// ===== DYNAMIC FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();