/* JOBFOREST APP MODULE
   Global application initialisation.
   Handles: theme, scroll animations, counter animation,
            smooth scroll, navbar scroll shadow, URL params.
   
   USAGE: Call App.init('page-name') on DOMContentLoaded.
   ============================================================ */

/** @module App */
const App = (() => {

  /* ── THEME ─────────────────────────────────────────────────*/

  /**
   * Load the saved theme from localStorage and apply it.
   * Falls back to 'dark' if nothing is saved.
   * @returns {void}
   */
  function initTheme() {
    const saved = localStorage.getItem('jf_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    _updateThemeIcon(saved);
  }

  /**
   * Toggle between dark and light themes, saving the preference.
   * @returns {void}
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jf_theme', next);
    _updateThemeIcon(next);
  }

  /**
   * Update the theme toggle button's icon to match the active theme.
   * @private
   * @param {string} theme - 'dark' | 'light'
   */
  function _updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    if (theme === 'dark') {
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 25 22.85" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    } else {
      icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 25 22.85" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }

  /* ── SCROLL ANIMATIONS ─────────────────────────────────────*/

  /**
   * Watch all elements with class `.reveal` using IntersectionObserver.
   * Adds `.revealed` when an element enters the viewport,
   * which triggers the CSS fade-in-up transition.
   * @returns {void}
   */
  function initScrollAnimations() {
    // IntersectionObserver watches elements without blocking the main thread
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Only animate once
          }
        });
      },
      {
        threshold: 0.1,           // Trigger when 10% visible
        rootMargin: '0px 0px -40px 0px', // Trigger slightly before bottom of viewport
      }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ── ANIMATED COUNTERS ─────────────────────────────────────*/

  /**
   * Animate number counters from 0 to their target value.
   * Triggered when the element enters the viewport.
   * 
   * HTML usage:
   *   <span data-counter="1240" data-suffix="+">0</span>
   * 
   * @returns {void}
   */
  function initCounters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const el      = entry.target;
          const target  = parseInt(el.getAttribute('data-counter'), 10);
          const suffix  = el.getAttribute('data-suffix') || '';
          const prefix  = el.getAttribute('data-prefix') || '';
          const duration = 1800; // ms
          const fps      = 60;
          const step     = target / (duration / (1000 / fps));
          let   current  = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
          }, 1000 / fps);

          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
  }

  /* ── SMOOTH SCROLL ─────────────────────────────────────────*/

  /**
   * Intercept clicks on anchor links (`href="#section"`) and
   * smooth-scroll to the target element instead of jumping.
   * @returns {void}
   */
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

  /* ── NAVBAR SCROLL SHADOW ──────────────────────────────────*/

  /**
   * Add a shadow to the navbar when the user scrolls down.
   * Uses a CSS class `.scrolled` to trigger the shadow via CSS.
   * @returns {void}
   */
  function initNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    // Use a passive event listener for scroll — better performance on mobile
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── MOBILE BOTTOM NAV ─────────────────────────────────────*/

  /**
   * Sync the active state on the mobile bottom nav bar
   * based on the current page name.
   * @param {string} currentPage - e.g. 'candidate-dashboard'
   * @returns {void}
   */
  function initBottomNav(currentPage) {
    const items = document.querySelectorAll('.bottom-nav-item[data-page]');
    items.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === currentPage);
    });
  }

  /* ── URL PARAMS HELPER ─────────────────────────────────────*/

  /**
   * Parse the current page's URL query string into a plain object.
   * @returns {Object.<string, string>}
   *
   * @example
   * // URL: /pages/jobs.html?q=react&mode=remote
   * App.getUrlParams() // { q: 'react', mode: 'remote' }
   */
  function getUrlParams() {
    return Object.fromEntries(new URLSearchParams(globalThis.location.search));
  }

  /* ── INIT ──────────────────────────────────────────────────*/

  /**
   * Main entry point — call this on DOMContentLoaded.
   * Wires up all global behaviours.
   * @param {string} [pageName=''] - The current page identifier
   * @returns {void}
   *
   * @example
   * document.addEventListener('DOMContentLoaded', () => {
   *   App.init('candidate-dashboard');
   * });
   */
  function init(pageName = '') {
    initTheme();

    // Wait one frame for navbar to be injected into DOM by Components.renderNavbar()
    requestAnimationFrame(() => {
      const themeToggle = document.getElementById('theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
      }

      initNavbarScroll();
      initSmoothScroll();
      initScrollAnimations();
      initCounters();
      initBottomNav(pageName);
    });
  }

  /* ── PUBLIC API ────────────────────────────────────────────*/
  return {
    init,
    initTheme,
    toggleTheme,
    initScrollAnimations,
    initCounters,
    getUrlParams,
  };

})();