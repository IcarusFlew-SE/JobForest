// ============================================
// JOBFOREST — GLOBAL APP LOGIC
// Theme toggle, navigation, scroll animations
// ============================================

const App = (() => {

  // ─── THEME MANAGEMENT ─────────────────────────
  function initTheme() {
    const saved = localStorage.getItem('jf_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jf_theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // ─── SCROLL ANIMATIONS (Intersection Observer) ─
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ─── ANIMATED COUNTERS ────────────────────────
  function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
          }, 16);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ─── NAVBAR SCROLL EFFECT ─────────────────────
  function initNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-lg)';
      } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
      }
    });
  }

  // ─── PAGE INIT ────────────────────────────────
  function init(pageName) {
    initTheme();

    // Wait for DOM to be ready with navbar
    requestAnimationFrame(() => {
      // Theme toggle
      const toggle = document.getElementById('theme-toggle');
      if (toggle) {
        toggle.addEventListener('click', toggleTheme);
      }

      initNavbarScroll();
      initSmoothScroll();
      initScrollAnimations();
      animateCounters();
    });
  }

  // ─── URL PARAMS HELPER ────────────────────────
  function getUrlParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }

  return {
    init,
    initTheme,
    toggleTheme,
    initScrollAnimations,
    animateCounters,
    getUrlParams
  };
})();
