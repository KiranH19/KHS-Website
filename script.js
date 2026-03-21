/**
 * Karnataka High School, Fort Dharwad — script.js
 * Features: Loader, Navbar scroll, Mobile menu, Scroll reveal,
 *           Animated counters, Testimonial slider, Contact form,
 *           Back to top button
 */

'use strict';

/* ===================================================
   1. PAGE LOADER
=================================================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Minimum 1.2s display for branding feel
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animations after loader hides
    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 180);
    });
  }, 1400);
});


/* ===================================================
   2. STICKY NAVBAR + SCROLL STATE
=================================================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ===================================================
   3. MOBILE HAMBURGER MENU
=================================================== */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

// Create overlay backdrop
const menuOverlay = document.createElement('div');
menuOverlay.id    = 'menuOverlay';
Object.assign(menuOverlay.style, {
  position: 'fixed', inset: '0',
  background: 'rgba(0,0,0,0.55)',
  zIndex: '998',
  display: 'none',
  backdropFilter: 'blur(2px)'
});
document.body.appendChild(menuOverlay);

function openMenu() {
  hamburger.classList.add('active');
  navLinks.classList.add('open');
  menuOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  menuOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
menuOverlay.addEventListener('click', closeMenu);

// Close on nav link click
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));


/* ===================================================
   4. SMOOTH SCROLLING (fallback for older browsers)
=================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 10;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ===================================================
   5. SCROLL REVEAL ANIMATIONS
=================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

// Observe all reveal elements (excluding hero, handled separately)
document.querySelectorAll('.reveal-up:not(.hero *), .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


/* ===================================================
   6. ANIMATED COUNTERS
=================================================== */
function animateCounter(el, target, duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (!isNaN(target)) animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));


/* ===================================================
   7. TESTIMONIAL SLIDER
=================================================== */
(function initSlider() {
  const track    = document.getElementById('testimonialTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');

  if (!track) return;

  const cards     = track.querySelectorAll('.testimonial-card');
  const total     = cards.length;
  let   current   = 0;
  let   autoTimer = null;

  // Determine visible cards based on viewport
  function getVisible() {
    return window.innerWidth <= 768 ? 1 : 2;
  }

  function maxIndex() {
    return total - getVisible();
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const gap      = parseFloat(getComputedStyle(track).gap) || 32;
    const cardW    = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${current * cardW}px)`;
    updateDots();
  }

  function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }

  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  buildDots();
  startAuto();

  // Recalculate on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(0);
    }, 250);
  });
})();


/* ===================================================
   8. CONTACT FORM
=================================================== */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showStatus('error', 'Please fill in all required fields.');
      return;
    }
    if (!emailRx.test(email)) {
      showStatus('error', 'Please enter a valid email address.');
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
    submitBtn.disabled  = true;

    setTimeout(() => {
      showStatus('success', '✓ Thank you! Your message has been received. We will get back to you shortly.');
      form.reset();
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled  = false;
    }, 1600);
  });

  function showStatus(type, msg) {
    status.textContent  = msg;
    status.className    = `form-status ${type}`;
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { status.className = 'form-status'; }, 6000);
  }
})();


/* ===================================================
   9. BACK TO TOP BUTTON
=================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===================================================
   10. ACTIVE NAV LINK HIGHLIGHTING
=================================================== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const top    = section.offsetTop - navbar.offsetHeight - 80;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = '#' + section.id;
      }
    });
    links.forEach(link => {
      link.style.background = link.getAttribute('href') === current
        ? 'rgba(255,255,255,0.12)'
        : '';
      link.style.color = link.getAttribute('href') === current
        ? 'var(--white)'
        : '';
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
})();


/* ===================================================
   11. SUBTLE PARALLAX ON HERO
=================================================== */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
})();


/* ===================================================
   12. CARD TILT EFFECT (subtle, desktop only)
=================================================== */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices

  document.querySelectorAll('.acad-card, .facility-card, .alumni-stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
