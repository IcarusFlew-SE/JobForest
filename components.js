/* JOBFOREST COMPONENTS MODULE
   All shared UI component renderers:
   Navbar, Footer, Modal, Toast, Job Card, Stat Card,
   Bottom Nav, Skeleton Loader, Confirm Dialog.
   
   USAGE: Components.renderNavbar('page-name')
          Components.showToast('Message', 'success')
          Components.showModal('Title', '<p>Body</p>')
   ============================================================ */

/** @module Components */
const Components = (() => {

  /* ── NAVBAR ─────────────────────────────────────────────── */

  /**
   * Inject the global navbar into the top of <body>.
   * Automatically shows the correct links based on logged-in role.
   *
   * @param {string} [currentPage=''] - Page identifier used to mark active nav link.
   *   Valid values: 'home' | 'jobs' | 'candidate-dashboard' | 'employer-dashboard'
   *                 'matching' | 'profile' | 'portfolio' | 'login' | 'signup'
   * @returns {void}
   */
  function renderNavbar(currentPage = '') {
    const user       = JobForestData.getCurrentUser();
    const isLoggedIn = user !== null;
    const isEmployer = user?.role === 'employer';

    // Compute relative paths based on whether we're in /pages/ or root
    const isRoot   = currentPage === 'home';
    const basePath = isRoot ? 'pages/' : '';
    const homePath = isRoot ? ''        : '../';

    /* ── HTML ── */
    const nav = document.createElement('nav');
    nav.className = 'navbar glass-nav';
    nav.id        = 'main-navbar';
    nav.setAttribute('aria-label', 'Main navigation');

    nav.innerHTML = `
      <div class="container">

        <!-- Logo -->
        <a href="${homePath}index.html" class="navbar-brand" aria-label="JobForest home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon" aria-hidden="true"><path d="M3 21h18"/><path d="M5 21V9l7-6 7 6v12"/><path d="M9 21V15h6v6"/></svg>
          <span>JobForest</span>
        </a>

        <!-- Desktop nav links -->
        <div class="navbar-links" id="nav-links" role="navigation">
          <a href="${basePath}jobs.html" class="${currentPage === 'jobs' ? 'active' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Find Jobs
          </a>

          ${isEmployer
            ? `<a href="${basePath}employer-dashboard.html" class="${currentPage === 'employer-dashboard' ? 'active' : ''}">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                 Dashboard
               </a>`
            : `<a href="${basePath}candidate-dashboard.html" class="${currentPage === 'candidate-dashboard' ? 'active' : ''}">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                 Dashboard
               </a>`
          }

          ${!isEmployer
            ? `<a href="${basePath}job-matching.html" class="${currentPage === 'matching' ? 'active' : ''}">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                 Job Match
               </a>
               <a href="${basePath}profile.html" class="${currentPage === 'profile' ? 'active' : ''}">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
                 Profile
               </a>`
            : ''
          }

          <a href="${basePath}living-portfolio.html" class="${currentPage === 'portfolio' ? 'active' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Portfolio
          </a>
        </div>

        <!-- Right-side actions -->
        <div class="navbar-actions">

          <!-- Search (desktop only) -->
          <div class="navbar-search hide-mobile" aria-label="Search jobs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="search"
              id="nav-search-input"
              placeholder="Search jobs…"
              aria-label="Search jobs"
              autocomplete="off"
            />
          </div>

          <!-- Theme toggle -->
          <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark/light theme" title="Toggle theme">
            <span id="theme-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </span>
          </button>

          <!-- Auth: logged in -->
          ${isLoggedIn
            ? `<div class="dropdown" id="user-dropdown">
                 <div class="navbar-avatar" id="nav-avatar" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-label="User menu for ${user.firstName}">
                   ${user.firstName?.[0] || 'U'}
                 </div>
                 <div class="dropdown-menu" id="user-dropdown-menu" role="menu">
                   <div style="padding:var(--space-3);border-bottom:1px solid var(--border-subtle);">
                     <div style="font-weight:var(--fw-semibold);font-size:var(--text-sm);">${user.firstName} ${user.lastName}</div>
                     <div style="font-size:var(--text-xs);color:var(--text-tertiary);">${user.email}</div>
                   </div>
                   ${!isEmployer
                     ? `<a class="dropdown-item" href="${basePath}profile.html" role="menuitem">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>
                          My Profile
                        </a>`
                     : ''
                   }
                   <a class="dropdown-item" href="${basePath}${isEmployer ? 'employer-dashboard.html' : 'candidate-dashboard.html'}" role="menuitem">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                     Dashboard
                   </a>
                   <div class="dropdown-divider"></div>
                   <a class="dropdown-item" id="logout-btn" href="#" role="menuitem" style="color:var(--error-500);">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                     Sign Out
                   </a>
                 </div>
               </div>`
            : `<a href="${basePath}login.html"  class="btn btn-ghost  btn-sm">Log In</a>
               <a href="${basePath}signup.html" class="btn btn-primary btn-sm">Sign Up</a>`
          }

          <!-- Mobile hamburger -->
          <button class="navbar-hamburger show-mobile" id="nav-hamburger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-links">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="hamburger-icon"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    `;

    document.body.prepend(nav);

    /* ── WIRE UP INTERACTIONS ── */

    // Hamburger → mobile menu toggle
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('mobile-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        const iconEl = document.getElementById('hamburger-icon');
        if (iconEl) {
          iconEl.innerHTML = isOpen
            ? '<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>'
            : '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>';
        }
      });
    }

    // User dropdown toggle
    const avatarEl      = document.getElementById('nav-avatar');
    const dropdownMenu  = document.getElementById('user-dropdown-menu');
    if (avatarEl && dropdownMenu) {
      // Click to open
      avatarEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.toggle('open');
        avatarEl.setAttribute('aria-expanded', String(isOpen));
      });
      // Keyboard accessibility
      avatarEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          avatarEl.click();
        }
      });
      // Click outside to close
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('open');
        avatarEl?.setAttribute('aria-expanded', 'false');
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('jf_currentUser');
        showToast('Signed out successfully', 'success');
        setTimeout(() => { window.location.href = `${homePath}index.html`; }, 1000);
      });
    }

    // Navbar search → redirect to jobs page
    const navSearchInput = document.getElementById('nav-search-input');
    if (navSearchInput) {
      navSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = navSearchInput.value.trim();
          if (q) window.location.href = `${basePath}jobs.html?q=${encodeURIComponent(q)}`;
        }
      });
    }
  }

  /* ── FOOTER ─────────────────────────────────────────────── */

  /**
   * Inject the global footer at the bottom of <body>.
   * @param {string} [currentPage='']
   * @returns {void}
   */
  function renderFooter(currentPage = '') {
    const isRoot   = currentPage === 'home';
    const basePath = isRoot ? 'pages/' : '';
    const homePath = isRoot ? ''        : '../';

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.id         = 'main-footer';

    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">

          <!-- Brand column -->
          <div class="footer-brand">
            <a href="${homePath}index.html" class="navbar-brand">
              <span class="logo-icon" aria-hidden="true">🌲</span>
              <span>JobForest</span>
            </a>
            <p>Grow your career naturally. Connect with top employers and discover opportunities that align with your unique skills.</p>
            <div class="footer-social" aria-label="Social media links">
              <a href="#" aria-label="Twitter / X">𝕏</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="https://github.com/IcarusFlew-SE" target="_blank" rel="noopener" aria-label="GitHub">⌨</a>
            </div>
          </div>

          <!-- Job Seekers column -->
          <div class="footer-column">
            <h4>Job Seekers</h4>
            <ul>
              <li><a href="${basePath}jobs.html">Browse Jobs</a></li>
              <li><a href="${basePath}profile.html">Build Resume</a></li>
              <li><a href="${basePath}job-matching.html">Job Matching</a></li>
              <li><a href="${basePath}candidate-dashboard.html">Dashboard</a></li>
              <li><a href="${basePath}living-portfolio.html">Living Portfolio</a></li>
            </ul>
          </div>

          <!-- Employers column -->
          <div class="footer-column">
            <h4>Employers</h4>
            <ul>
              <li><a href="${basePath}employer-dashboard.html">Post a Job</a></li>
              <li><a href="${basePath}employer-dashboard.html">Find Candidates</a></li>
              <li><a href="${basePath}pricingplan.html">Pricing Plans</a></li>
            </ul>
          </div>

          <!-- Company column -->
          <div class="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="${basePath}about.html">About Us</a></li>
              <li><a href="${basePath}blog.html">Blog</a></li>
              <li><a href="${basePath}privacy.html">Privacy Policy</a></li>
              <li><a href="${basePath}contact.html">Contact</a></li>
            </ul>
          </div>

        </div>
        <div class="footer-bottom">
          <span>© 2026 JobForest. All rights reserved.</span>
          <span>Made with 🌲 for job seekers everywhere</span>
        </div>
      </div>
    `;

    document.body.appendChild(footer);
  }

  /* ── MODAL ──────────────────────────────────────────────── */

  /**
   * Show a centered modal dialog.
   * Automatically handles Escape key and backdrop click to close.
   *
   * @param {string} title    - Modal heading text
   * @param {string} bodyHTML - Inner HTML for the modal body
   * @param {string} [footerHTML=''] - Inner HTML for the modal footer (usually buttons)
   * @returns {HTMLElement} The overlay element
   *
   * @example
   * Components.showModal(
   *   'Confirm Delete',
   *   '<p>Are you sure you want to delete this listing?</p>',
   *   '<button class="btn btn-ghost btn-sm" onclick="Components.closeModal()">Cancel</button>
   *    <button class="btn btn-danger btn-sm" id="confirm-del">Delete</button>'
   * );
   */
  function showModal(title, bodyHTML, footerHTML = '') {
    closeModal(); // Remove any existing modal first

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id        = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'modal-title');

    overlay.innerHTML = `
      <div class="modal" id="modal-content">
        <div class="modal-header">
          <h3 id="modal-title">${title}</h3>
          <button
            class="modal-close"
            id="modal-close-btn"
            aria-label="Close dialog"
          >✕</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Close on X button
    document.getElementById('modal-close-btn')
      .addEventListener('click', closeModal);

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', _handleEscClose);

    // Trap focus inside modal
    const firstFocusable = overlay.querySelector('button, [href], input, select, textarea');
    firstFocusable?.focus();

    return overlay;
  }

  /**
   * Close and remove the currently open modal.
   * @returns {void}
   */
  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = ''; // Restore scrolling
    document.removeEventListener('keydown', _handleEscClose);
  }

  /**
   * @private
   * Close modal when Escape key is pressed.
   */
  function _handleEscClose(e) {
    if (e.key === 'Escape') closeModal();
  }

  /* ── TOAST ──────────────────────────────────────────────── */

  /**
   * Show a short notification toast message.
   * Auto-dismisses after `duration` milliseconds.
   *
   * @param {string} message          - Text to display
   * @param {'success'|'error'|'info'|'warning'} [type='info'] - Visual variant
   * @param {number} [duration=4000]  - Auto-dismiss time in ms
   * @returns {void}
   *
   * @example
   * Components.showToast('Application submitted!', 'success');
   * Components.showToast('Something went wrong.', 'error');
   */
  function showToast(message, type = 'info', duration = 4000) {
    // Create container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className  = 'toast-container';
      container.id         = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }

    const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

    const toast = document.createElement('div');
    toast.className   = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${ICONS[type] ?? ICONS.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Dismiss notification">✕</button>
    `;

    container.appendChild(toast);

    // Manual dismiss
    toast.querySelector('.toast-close').addEventListener('click', () => _dismissToast(toast));

    // Auto dismiss
    setTimeout(() => _dismissToast(toast), duration);
  }

  /**
   * @private
   * Animate and remove a toast element.
   */
  function _dismissToast(toast) {
    if (!toast.parentElement) return;
    toast.style.animation = 'slideToast 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }

  /* ── CONFIRM DIALOG ─────────────────────────────────────── */

  /**
   * Show a simple confirmation modal with Cancel / Confirm buttons.
   * @param {string}   message    - Question to ask the user
   * @param {Function} onConfirm  - Called if the user clicks Confirm
   * @returns {void}
   *
   * @example
   * Components.confirm('Delete this listing?', () => {
   *   JobForestData.toggleJobStatus(jobId);
   * });
   */
  function confirm(message, onConfirm) {
    showModal(
      'Confirm Action',
      `<p style="color:var(--text-secondary);line-height:var(--lh-relaxed);">${message}</p>`,
      `<button class="btn btn-ghost btn-sm" id="confirm-cancel">Cancel</button>
       <button class="btn btn-primary btn-sm" id="confirm-ok">Confirm</button>`
    );

    document.getElementById('confirm-cancel').addEventListener('click', closeModal);
    document.getElementById('confirm-ok').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  /* ── JOB CARD ───────────────────────────────────────────── */

  /**
   * Render a job listing card element.
   * Includes bookmark toggle and click-to-detail navigation.
   *
   * @param {Job} job - Job data object from JobForestData
   * @param {Object} [options={}]
   * @param {string} [options.basePath=''] - Path prefix for job-detail.html link
   * @returns {HTMLElement} The card element ready to append to the DOM
   *
   * @example
   * const card = Components.renderJobCard(job, { basePath: 'pages/' });
   * document.getElementById('jobs-grid').appendChild(card);
   */
  function renderJobCard(job, options = {}) {
    const company   = JobForestData.getCompanyById(job.companyId);
    const isSaved   = JobForestData.isJobSaved(job.id);
    const basePath  = options.basePath || '';

    const card = document.createElement('article');
    card.className = 'job-card';
    card.id        = `job-card-${job.id}`;

    card.innerHTML = `
      <div class="job-card-header">
        <div class="job-card-logo" aria-hidden="true">${company?.logo || '🏢'}</div>
        <div class="job-card-info">
          <h3 class="job-card-title">${job.title}</h3>
          <div class="job-card-company">${company?.name || 'Unknown Company'}</div>
        </div>
        <button
          class="job-card-bookmark ${isSaved ? 'saved' : ''}"
          data-job-id="${job.id}"
          aria-label="${isSaved ? 'Unsave job' : 'Save job'}"
          title="${isSaved ? 'Remove from saved' : 'Save this job'}"
        >
          ${isSaved ? '★' : '☆'}
        </button>
      </div>

      <div class="job-card-tags">
        <span class="tag tag-primary">${job.type}</span>
        <span class="tag tag-info">${job.workMode}</span>
        <span class="tag">${job.experience}</span>
        ${job.category ? `<span class="tag tag-purple">${job.category}</span>` : ''}
      </div>

      <div class="job-card-meta">
        <span>📍 ${job.location}</span>
        <span>👥 ${job.applicants} applicants</span>
      </div>

      <div class="job-card-footer">
        <span class="job-card-salary">${JobForestData.formatSalary(job.salary.min, job.salary.max)}</span>
        <span class="job-card-time">${JobForestData.timeAgo(job.posted)}</span>
      </div>
    `;

    // Bookmark toggle — stop propagation so it doesn't navigate to detail
    const bookmarkBtn = card.querySelector('.job-card-bookmark');
    bookmarkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowSaved = JobForestData.toggleSavedJob(job.id);
      bookmarkBtn.classList.toggle('saved', nowSaved);
      bookmarkBtn.textContent = nowSaved ? '★' : '☆';
      bookmarkBtn.setAttribute('aria-label', nowSaved ? 'Unsave job' : 'Save job');
      showToast(
        nowSaved ? 'Job saved to your list!' : 'Job removed from saved',
        nowSaved ? 'success' : 'info'
      );
    });

    // Navigate to job detail on card click
    card.addEventListener('click', (e) => {
      if (e.target.closest('.job-card-bookmark')) return;
      window.location.href = `${basePath}job-detail.html?id=${job.id}`;
    });

    // Keyboard accessibility — Enter/Space activates card
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${job.title} at ${company?.name || 'Unknown'}`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    return card;
  }

  /* ── STAT CARD HTML ─────────────────────────────────────── */

  /**
   * Generate the HTML string for a stat card widget.
   * Inject into a container with innerHTML or insertAdjacentHTML.
   *
   * @param {string} icon       - Emoji icon
   * @param {string|number} value - The big number / value
   * @param {string} label      - Descriptive label below the value
   * @param {string} [trend=''] - Trend string e.g. "+12 this week" (starts with + = green, - = red)
   * @param {string} [colorClass='green'] - Icon background color: 'green' | 'blue' | 'amber' | 'red' | 'purple'
   * @returns {string} HTML string
   *
   * @example
   * container.innerHTML += Components.renderStatCard('📝', 7, 'Applications', '+2 this week', 'green');
   */
  function renderStatCard(icon, value, label, trend = '', colorClass = 'success') {
    const trendClass = trend.startsWith('+') ? 'up' : 'down';
    const iconMap = {
      apps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
      interview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
      saved: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>',
      match: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      posts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      candidates: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
      rate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
    };
    const iconContent = iconMap[icon] || icon;
    return `
      <div class="stat-card">
        <div class="stat-card-icon stat-card-icon--${colorClass}" aria-hidden="true">${iconContent}</div>
        <div class="stat-card-content">
          <div class="stat-card-value">${value}</div>
          <div class="stat-card-label">${label}</div>
          ${trend
            ? `<div class="stat-card-trend stat-card-trend--${trendClass}" aria-label="${trend}">${trend}</div>`
            : ''
          }
        </div>
      </div>
    `;
  }

  /* ── SKILL TAG ──────────────────────────────────────────── */

  /**
   * Create a skill chip/tag element.
   * @param {string}   skill       - Skill name
   * @param {boolean}  [removable=false] - Show a ✕ remove button
   * @param {Function} [onRemove=null]   - Called with the skill name when removed
   * @returns {HTMLElement}
   */
  function renderSkillTag(skill, removable = false, onRemove = null) {
    const tag = document.createElement('span');
    tag.className = `tag tag-primary${removable ? ' tag-removable' : ''}`;
    tag.textContent = skill;

    if (removable) {
      const removeBtn = document.createElement('span');
      removeBtn.className   = 'tag-remove';
      removeBtn.textContent = '✕';
      removeBtn.setAttribute('aria-label', `Remove ${skill}`);
      tag.appendChild(removeBtn);

      if (onRemove) {
        tag.addEventListener('click', () => onRemove(skill));
      }
    }

    return tag;
  }

  /* ── LOADER ─────────────────────────────────────────────── */

  /**
   * Return an HTML string for a centered loading spinner.
   * @returns {string} HTML string
   *
   * @example
   * container.innerHTML = Components.renderLoader();
   */
  function renderLoader() {
    return `
      <div
        class="flex items-center justify-center"
        style="padding:var(--space-12);"
        aria-label="Loading"
        role="status"
      >
        <div
          style="
            width:32px; height:32px;
            border:3px solid var(--border-default);
            border-top-color:var(--brand-primary);
            border-radius:50%;
            animation:spin 0.7s linear infinite;
          "
        ></div>
      </div>
    `;
  }

  /* ── SKELETON CARDS ─────────────────────────────────────── */

  /**
   * Generate skeleton placeholder HTML for N job cards.
   * Used while real data is loading.
   * @param {number} [count=3]
   * @returns {string} HTML string
   */
  function renderSkeletonCards(count = 3) {
    const card = `
      <div class="job-card" aria-hidden="true">
        <div class="job-card-header">
          <div class="skeleton" style="width:44px;height:44px;border-radius:var(--radius-lg);flex-shrink:0;"></div>
          <div style="flex:1;">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        </div>
        <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4);">
          <div class="skeleton" style="width:60px;height:22px;border-radius:var(--radius-full);"></div>
          <div class="skeleton" style="width:50px;height:22px;border-radius:var(--radius-full);"></div>
        </div>
        <div class="skeleton skeleton-text" style="width:80%;"></div>
        <div class="skeleton skeleton-text short" style="margin-top:var(--space-3);"></div>
      </div>
    `;
    return Array(count).fill(card).join('');
  }

  /* ── MOBILE BOTTOM NAV ──────────────────────────────────── */

  /**
   * Inject the mobile bottom navigation bar.
   * Only visible on screens < 768px wide.
   *
   * @param {string} currentPage - The active page key
   * @param {boolean} isEmployer - Whether current user is an employer
   * @returns {void}
   */
  function renderBottomNav(currentPage, isEmployer = false) {
    const existing = document.getElementById('bottom-nav');
    if (existing) existing.remove();

    const nav = document.createElement('nav');
    nav.id          = 'bottom-nav';
    nav.className   = 'bottom-nav';
    nav.setAttribute('aria-label', 'Mobile navigation');

    const links = isEmployer
      ? [
          { page: 'employer-dashboard', icon: '📊', label: 'Dashboard', href: 'employer-dashboard.html' },
          { page: 'jobs',               icon: '🔍', label: 'Browse',    href: 'jobs.html' },
          { page: 'employer-dashboard', icon: '➕', label: 'Post Job',  href: 'employer-dashboard.html#posts' },
          { page: 'profile',            icon: '🏢', label: 'Company',   href: 'employer-dashboard.html#company' },
        ]
      : [
          { page: 'candidate-dashboard', icon: '🏠', label: 'Home',     href: 'candidate-dashboard.html' },
          { page: 'jobs',                icon: '🔍', label: 'Browse',   href: 'jobs.html' },
          { page: 'matching',            icon: '⚡', label: 'Matches',  href: 'job-matching.html' },
          { page: 'profile',             icon: '👤', label: 'Profile',  href: 'profile.html' },
        ];

    nav.innerHTML = links.map(link => `
      <a
        href="${link.href}"
        class="bottom-nav-item ${currentPage === link.page ? 'active' : ''}"
        data-page="${link.page}"
        aria-label="${link.label}"
        aria-current="${currentPage === link.page ? 'page' : 'false'}"
      >
        <span class="bottom-nav-icon" aria-hidden="true">${link.icon}</span>
        <span>${link.label}</span>
      </a>
    `).join('');

    document.body.appendChild(nav);
  }

  /* ── UTILITIES ────────────────────────────────────────────── */

  /**
   * Escape HTML special characters to prevent XSS.
   * @param {string} str - Unescaped string
   * @returns {string} Safe HTML string
   */
  function escapeHTML(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ── PRICING PLAN ─────────────────────────────────────────── */
  /* 
   * Render the Pricing Plans section
   * @returns {HTMLElement}
   */

  function renderPricingPlans() {
    const container = document.createElement('div');
    container.className = 'pricing-page-wrapper';
    container.style.width = '100%';
    container.style.padding = 'calc(var(--space-12) + 40px) 0 var(--space-12) 0';

    container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto var(--space-12); text-align: center; padding: 0 var(--space-4);">
        <h1 style="font-size: var(--text-2xl); font-weight: var(--fw-bold); margin-bottom: var(--space-2); color: inherit;">
          Simple, Transparent Pricing
        </h1>
        <p class="text-secondary" style="font-size: var(--text-sm); line-height: 1.6;">
          Grow your engineering team naturally. Choose the plan that best fits your current hiring velocity.
        </p>
      </div>
      
      <div style="max-width: 1024px; margin: 0 auto; padding: 0 var(--space-6);">
        
        <div style="display: flex; flex-flow: row wrap; justify-content: center; align-items: stretch; gap: var(--space-6);">
          
          <div class="card glass-card" 
              style="display: flex; flex-direction: column; justify-content: space-between; position: relative; padding: var(--space-5); height: auto; min-width: 260px; max-width: 290px; flex: 1 1 0px;">
            <div>
              <div class="text-sm font-semibold uppercase tracking-wider text-tertiary mb-1">Seedling</div>
              <div style="font-size: var(--text-xl); font-weight: var(--fw-bold); margin-bottom: var(--space-3);">
                Free <span style="font-size: var(--text-xs); font-weight: var(--fw-normal); color: var(--text-tertiary);">/ forever</span>
              </div>
              <p class="text-xs text-secondary mb-4" style="min-height: 32px;">Perfect for early-stage startups publishing their first vacancy.</p>
              <img src="" alt="" onerror="this.style.display='none'">
              <hr style="border-color: var(--border-light); margin-bottom: var(--space-4);" />
              <ul class="flex flex-col gap-2 text-xs text-secondary" style="list-style: none; padding: 0; margin: 0; text-align: left;">
                <li>🌲 <strong>1</strong> Active Job Posting</li>
                <li>🌲 Standard Match Alignment Index</li>
                <li>🌲 Basic Candidate Screening Tools</li>
                <li>🌲 Public Company Profile Builder</li>
              </ul>
            </div>
            <button class="btn btn-outline btn-block mt-6" style="padding: var(--space-2); font-size: var(--text-xs); width: 100%;" onclick="window.location.href='signup.html'">Get Started</button>
          </div>

          <div class="card glass-card" 
              style="display: flex; flex-direction: column; justify-content: space-between; position: relative; padding: var(--space-5); border: 2px solid var(--brand-primary); height: auto; min-width: 270px; max-width: 300px; flex: 1 1 0px; box-shadow: 0 10px 25px -10px rgba(0,0,0,0.15); transform: scale(1.02);">
            <div>
              <div style="margin-bottom: var(--space-3); text-align: left;">
                <span class="tag tag-primary" style="font-size: 10px; padding: 3px 8px; font-weight: var(--fw-semibold); display: inline-block; letter-spacing: 0.05em; uppercase;">
                  Most Popular
                </span>
              </div>
              
              <div class="text-sm font-semibold uppercase tracking-wider text-primary mb-1">Sapling</div>
              <div style="font-size: var(--text-xl); font-weight: var(--fw-bold); margin-bottom: var(--space-3);">
                $149 <span style="font-size: var(--text-xs); font-weight: var(--fw-normal); color: var(--text-tertiary);">/ month</span>
              </div>
              <p class="text-xs text-secondary mb-4" style="min-height: 32px;">Designed for expanding teams requiring active pipeline routing.</p>
              <hr style="border-color: var(--border-light); margin-bottom: var(--space-4);" />
              <ul class="flex flex-col gap-2 text-xs text-secondary" style="list-style: none; padding: 0; margin: 0; text-align: left;">
                <li>🌲 <strong>5</strong> Active Job Postings</li>
                <li>🌲 Enhanced Match Alignment</li>
                <li>🌲 Living Portfolio Verification</li>
                <li>🌲 Direct In-App Chat Messenger</li>
                <li>🌲 Resume PDF Exports Pipeline</li>
              </ul>
            </div>
            <button class="btn btn-primary btn-block mt-6" style="padding: var(--space-2); font-size: var(--text-xs); width: 100%;" onclick="Components.showToast('Redirecting to secure payment checkout... 💳', 'info')">Upgrade Now</button>
          </div>

          <div class="card glass-card" 
              style="display: flex; flex-direction: column; justify-content: space-between; position: relative; padding: var(--space-5); height: auto; min-width: 260px; max-width: 290px; flex: 1 1 0px;">
            <div>
              <div class="text-sm font-semibold uppercase tracking-wider text-tertiary mb-1">Forest Elite</div>
              <div style="font-size: var(--text-xl); font-weight: var(--fw-bold); margin-bottom: var(--space-3);">
                $399 <span style="font-size: var(--text-xs); font-weight: var(--fw-normal); color: var(--text-tertiary);">/ month</span>
              </div>
              <p class="text-xs text-secondary mb-4" style="min-height: 32px;">Built for scale, custom integrations, and unlimited data indexing.</p>
              <hr style="border-color: var(--border-light); margin-bottom: var(--space-4);" />
              <ul class="flex flex-col gap-2 text-xs text-secondary" style="list-style: none; padding: 0; margin: 0; text-align: left;">
                <li>🌲 <strong>Unlimited</strong> Job Postings</li>
                <li>🌲 Priority Automated Alignment</li>
                <li>🌲 Full System SRE & API Access</li>
                <li>🌲 Advanced Compliance Logs</li>
                <li>🌲 Dedicated Account Handler</li>
              </ul>
            </div>
            <button class="btn btn-outline btn-block mt-6" style="padding: var(--space-2); font-size: var(--text-xs);" onclick="window.location.href='contact.html'">Contact Sales</button>
          </div>

        </div>
      </div>
    `;

    return container;
  };

  /* ── PUBLIC API — ABOUT US ── */
  function renderAboutUs() {
    const container = document.createElement('div');
    container.className = 'about-page-layout';
    container.style.width = '100%';

    container.innerHTML = `
      <section class="container" style="padding: var(--space-12) var(--space-4) var(--space-16); max-width: 1024px; margin: 0 auto;">
        <div style="display: flex; flex-flow: row wrap; align-items: center; gap: var(--space-10); justify-content: center;">
          
          <div class="reveal" style="flex: 1 1 400px; max-width: 520px; text-align: left;">
            <span class="tag tag-primary mb-4" style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; display: inline-block;">Our Roots</span>
            
            <h1 style="font-size: var(--text-4xl); font-weight: var(--fw-extrabold); line-height: 1.2; margin-bottom: var(--space-4); max-width: 460px;">
              Growing the Next <span class="text-gradient">Software Ecosystem</span>
            </h1>
            
            <p class="text-secondary" style="font-size: var(--text-md); line-height: 1.6; margin-bottom: var(--space-4); max-width: 480px;">
              Founded in 2026, JobForest was built to strip away the surface-level noise of traditional hiring boards. We engineer direct algorithmic pathways that match authentic software capabilities against high-velocity development squads.
            </p>
            <p class="text-secondary" style="font-size: var(--text-sm); line-height: 1.6; max-width: 480px;">
              We believe in deep technical transparency, skipping structural bloat, and empowering engineers to transition seamlessly into their next phase of production stability.
            </p>
          </div>

          <div class="reveal" style="flex: 1 1 340px; max-width: 420px; position: relative;">
            <div class="card glass-card text-center" style="padding: var(--space-8); border: 1px solid var(--border-brand); background: linear-gradient(145deg, rgba(23,184,144,0.05) 0%, transparent 70%);">
              <span style="font-size: 3.5rem; display: block; margin-bottom: var(--space-2); filter: drop-shadow(0 0 15px rgba(23,184,144,0.2));">🌲</span>
              <div class="text-2xl font-extrabold text-primary" style="margin-bottom: 4px;">100% Focused</div>
              <p class="text-xs text-tertiary uppercase tracking-wider">On Technical Complexity</p>
              <hr style="border-color: var(--border-light); margin: var(--space-4) 0;" />
              <p class="text-xs text-secondary" style="line-height: 1.5; text-align: left;">
                "Our platform calculates alignment indexes using weighted metrics rather than keyword scanning filters, giving developers verified portfolio integrity."
              </p>
            </div>
          </div>

        </div>
      </section>

      <section style="background: rgba(0,0,0,0.02); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); padding: var(--space-16) 0;">
        <div class="container" style="max-width: 1024px; margin: 0 auto; padding: 0 var(--space-6);">
          
          <div class="text-center mb-12 reveal" style="max-width: 600px; margin: 0 auto var(--space-12);">
            <h2>The Principles Anchoring Our Forest</h2>
            <p class="text-secondary text-sm" style="margin-top: var(--space-1);">The values driving our design frameworks and engineering culture daily.</p>
          </div>

          <div style="display: flex; flex-flow: row wrap; gap: var(--space-6); justify-content: center; align-items: stretch;">
            <div class="card glass-card" style="flex: 1 1 280px; max-width: 310px; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-3);">
              <div style="font-size: 1.5rem;">⚡</div>
              <h3 style="font-size: var(--text-md); font-weight: var(--fw-semibold); margin: 0;">Velocity Over Bloat</h3>
              <p class="text-xs text-secondary" style="line-height: 1.6; margin: 0;">
                We cut out superficial job descriptions and slow candidate loops. We ship performant UX pipelines that save technical leads hours of screen triage.
              </p>
            </div>

            <div class="card glass-card" style="flex: 1 1 280px; max-width: 310px; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-3); border-color: var(--border-strong);">
              <div style="font-size: 1.5rem;">🔒</div>
              <h3 style="font-size: var(--text-md); font-weight: var(--fw-semibold); margin: 0;">Verified Data Integrity</h3>
              <p class="text-xs text-secondary" style="line-height: 1.6; margin: 0;">
                Every applicant profile links straight to verified repository assets and portfolio timelines. Recruiters gain clean visibility without compliance risks.
              </p>
            </div>

            <div class="card glass-card" style="flex: 1 1 280px; max-width: 310px; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-3);">
              <div style="font-size: 1.5rem;">🤝</div>
              <h3 style="font-size: var(--text-md); font-weight: var(--fw-semibold); margin: 0;">Load-Bearing Support</h3>
              <p class="text-xs text-secondary" style="line-height: 1.6; margin: 0;">
                We build stability blocks for engineering students, active teams, and scaling tech founders alike. We protect our ecosystem's growth naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="container" style="padding: var(--space-16) var(--space-4); max-width: 800px; text-align: center;">
        <div class="card reveal" style="background: var(--gradient-brand); padding: var(--space-10) var(--space-6); border-radius: var(--radius-2xl); color: #000;">
          <h2 style="color: #000; font-size: var(--text-2xl); margin-bottom: var(--space-2);">Ready to plant your roots?</h2>
          <p style="font-size: var(--text-sm); opacity: 0.85; max-width: 480px; margin: 0 auto var(--space-6); line-height: 1.5;">
            Join thousands of full-stack developers, ML practitioners, and design leads accelerating their deployment timeline on JobForest.
          </p>
          <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-outline btn-sm" style="background: #000; color: #fff; border: none;" onclick="window.location.href='jobs.html'">Explore Vacancies</button>
            <button class="btn btn-ghost btn-sm" style="color: #000; font-weight: 700;" onclick="window.location.href='signup.html'">Create Free Account →</button>
          </div>
        </div>
      </section>
    `;

    return container;
  }

  /* ── PUBLIC API — PRIVACY POLICY ── */
  function renderPrivacyPolicy() {
    const container = document.createElement('div');
    container.className = 'privacy-page-layout';
    container.style.width = '100%';

    container.innerHTML = `
      <section class="container" style="padding: var(--space-12) var(--space-4) var(--space-16); max-width: 800px; margin: 0 auto;">
        
        <div class="reveal text-center mb-12" style="max-width: 600px; margin: 0 auto var(--space-12);">
          <h1 style="font-size: var(--text-4xl); font-weight: var(--fw-extrabold); line-height: 1.2; margin-bottom: var(--space-2);">
            Privacy Policy
          </h1>
          <p class="text-secondary" style="font-size: var(--text-sm);">
            Last Updated: June 13, 2026 • Effective Data Protection Principles
          </p>
        </div>

        <div class="reveal flex flex-col gap-8 text-secondary" style="line-height: 1.7; font-size: var(--text-sm); text-align: left;">
          
          <div class="card glass-card" style="padding: var(--space-6);">
            <h2 style="font-size: var(--text-lg); font-weight: var(--fw-semibold); color: var(--text-primary); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
              <span>🛡️</span> 1. Data Collection Architecture
            </h2>
            <p style="margin-bottom: var(--space-3);">
              JobForest indexes candidate portfolio elements, technical skill tags, and work experience parameters to run our match alignment algorithm. We parse and load local storage objects to preserve active session data arrays.
            </p>
            <p style="margin-bottom: 0;">
              For employer accounts, we store primary corporate metadata tokens including registered email keys, brand domains, company sizes, and active pipeline status summaries.
            </p>
          </div>

          <div class="card glass-card" style="padding: var(--space-6);">
            <h2 style="font-size: var(--text-lg); font-weight: var(--fw-semibold); color: var(--text-primary); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
              <span>⚡</span> 2. How Your Engineering Data is Utilized
            </h2>
            <p style="margin-bottom: var(--space-3);">
              Your skill profiles and documented repository histories feed directly into our weighted alignment index calculations. This data is exclusively parsed to score compatibility ratios against open employer job posts.
            </p>
            <ul style="list-style: disc; padding-left: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2);">
              <li>Algorithmic matching across entry, mid, and senior vacancy levels.</li>
              <li>Secure timeline streaming updates on the Living Portfolio engine.</li>
              <li>Direct recruiter visibility indexing when your profile state is set to Public.</li>
            </ul>
          </div>

          <div class="card glass-card" style="padding: var(--space-6);">
            <h2 style="font-size: var(--text-lg); font-weight: var(--fw-semibold); color: var(--text-primary); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
              <span>🔒</span> 3. Security, Storage & Session Lifecycles
            </h2>
            <p style="margin-bottom: var(--space-3);">
              All platform data layer profiles are persisted inside client-side structures with explicit database prefix bounds. Session security safeguards prevent cross-role injection loops on active dashboards.
            </p>
            <p style="margin-0;">
              When triggering an account sign-out flow, your session keys are instantly deleted from storage, resetting the authorization state back to an unauthenticated fallback view baseline.
            </p>
          </div>

          <div class="card glass-card" style="padding: var(--space-6);">
            <h2 style="font-size: var(--text-lg); font-weight: var(--fw-semibold); color: var(--text-primary); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
              <span>⚖️</span> 4. User Rights and Controls
            </h2>
            <p style="margin-0;">
              You maintain total authority over your visibility flags. You can modify your visibility toggle status inside your settings panel at any time, retract submitted applications permanently, or clear your tracked skill profile matrices.
            </p>
          </div>

        </div>
      </section>
    `;

    return container;
  }

  /* ── PUBLIC API — CONTACT US ── */
  function renderContactUs() {
    const container = document.createElement('div');
    container.className = 'contact-page-layout';
    container.style.width = '100%';

    container.innerHTML = `
      <section class="container" style="padding: var(--space-12) var(--space-4) var(--space-6); max-width: 650px; margin: 0 auto; text-align: center;">
        <div class="reveal">
          <span class="tag tag-primary mb-4" style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; display: inline-block;">Connect with Us</span>
          <h1 style="font-size: var(--text-4xl); font-weight: var(--fw-extrabold); line-height: 1.2; margin-bottom: var(--space-3);">
            How Can We <span class="text-gradient">Help You Grow?</span>
          </h1>
          <p class="text-secondary" style="font-size: var(--text-sm); line-height: 1.6;">
            Choose the pathway that matches your current objective so we can route you straight to the right handler.
          </p>
        </div>
      </section>

      <section class="container" style="padding: 0 var(--space-4) var(--space-16); max-width: 900px; margin: 0 auto;">
        <div style="display: flex; flex-flow: row wrap; gap: var(--space-6); justify-content: center; align-items: stretch;">
          
          <div class="card glass-card reveal" style="flex: 1 1 340px; max-width: 420px; padding: var(--space-6); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 2rem; margin-bottom: var(--space-2);">💻</div>
              <h3 style="font-size: var(--text-lg); font-weight: var(--fw-semibold); margin-bottom: var(--space-2);">For Developers & Candidates</h3>
              <p class="text-xs text-secondary" style="line-height: 1.6; margin-bottom: var(--space-4);">
                Need assistance optimizing your profile, connecting your workspace repository timelines, verifying portfolio assets, or resolving an account session bug? Our technical support squad is ready to handle your query.
              </p>
            </div>
            <button class="btn btn-outline btn-block btn-sm" 
                    onclick="Components.showToast('Launching developer support channel... 🛠️', 'info')">
              Open Support Ticket
            </button>
          </div>

          <div class="card glass-card reveal" style="flex: 1 1 340px; max-width: 420px; padding: var(--space-6); display: flex; flex-direction: column; justify-content: space-between; border: 2px solid var(--brand-primary); box-shadow: 0 10px 25px -10px rgba(0,0,0,0.15);">
            <div>
              <div style="font-size: 2rem; margin-bottom: var(--space-2);">🏢</div>
              <h3 style="font-size: var(--text-lg); font-weight: var(--fw-semibold); margin-bottom: var(--space-2);">For Hiring Teams & Enterprise</h3>
              <p class="text-xs text-secondary" style="line-height: 1.6; margin-bottom: var(--space-4);">
                Looking to scale past your plan limits, initiate secure compliance auditing logging (SOC 2 trackers), arrange automated custom data pipeline indexing, or require a dedicated account handler assigned to your brand?
              </p>
            </div>
            <button class="btn btn-primary btn-block btn-sm" 
                    onclick="Components.showToast('Initiating consultation channel callback routing... 📞', 'success')">
              Contact Enterprise Sales
            </button>
          </div>

        </div>
      </section>
    `;

    return container;
  }

  /* ── PUBLIC API ─────────────────────────────────────────── */
  return {
    renderNavbar,
    renderFooter,
    showModal,
    closeModal,
    showToast,
    confirm,
    renderJobCard,
    renderStatCard,
    renderSkillTag,
    renderLoader,
    renderSkeletonCards,
    renderBottomNav,
    renderPricingPlans,
    renderAboutUs,
    renderPrivacyPolicy,
    renderContactUs,
    escapeHTML,
  };

})();