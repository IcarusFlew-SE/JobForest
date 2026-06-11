/* JOBFOREST COMPONENTS MODULE
   All shared UI component renderers:
   Navbar, Footer, Modal, Toast, Job Card, Stat Card,
   Bottom Nav, Skeleton Loader, Confirm Dialog.
   
   USAGE: Components.renderNavbar('page-name')
          Components.showToast('Message', 'success')
          Components.showModal('Title', '<p>Body</p>')
   ============================================================ */

'use strict';

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
    const isLoggedIn = !!user;
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
          <span class="logo-icon" aria-hidden="true">🌲</span>
          <span>JobForest</span>
        </a>

        <!-- Desktop nav links -->
        <div class="navbar-links" id="nav-links" role="navigation">
          <a href="${basePath}jobs.html"
             class="${currentPage === 'jobs' ? 'active' : ''}">
            Find Jobs
          </a>

          ${isEmployer
            ? `<a href="${basePath}employer-dashboard.html"
                  class="${currentPage === 'employer-dashboard' ? 'active' : ''}">
                 Dashboard
               </a>`
            : `<a href="${basePath}candidate-dashboard.html"
                  class="${currentPage === 'candidate-dashboard' ? 'active' : ''}">
                 Dashboard
               </a>`
          }

          ${!isEmployer
            ? `<a href="${basePath}job-matching.html"
                  class="${currentPage === 'matching' ? 'active' : ''}">
                 Job Match
               </a>
               <a href="${basePath}profile.html"
                  class="${currentPage === 'profile' ? 'active' : ''}">
                 Profile
               </a>`
            : ''
          }

          <a href="${basePath}living-portfolio.html"
             class="${currentPage === 'portfolio' ? 'active' : ''}">
            Portfolio
          </a>
        </div>

        <!-- Right-side actions -->
        <div class="navbar-actions">

          <!-- Search (desktop only) -->
          <div class="navbar-search hide-mobile" aria-label="Search jobs">
            <span class="search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              id="nav-search-input"
              placeholder="Search jobs…"
              aria-label="Search jobs"
              autocomplete="off"
            />
          </div>

          <!-- Theme toggle -->
          <button
            class="theme-toggle"
            id="theme-toggle"
            aria-label="Toggle dark/light theme"
            title="Toggle theme"
          >
            <span id="theme-icon" aria-hidden="true">🌙</span>
          </button>

          <!-- Auth: logged in -->
          ${isLoggedIn
            ? `<div class="dropdown" id="user-dropdown">
                 <div
                   class="navbar-avatar"
                   id="nav-avatar"
                   role="button"
                   tabindex="0"
                   aria-haspopup="true"
                   aria-expanded="false"
                   aria-label="User menu for ${user.firstName}"
                 >
                   ${user.avatar || user.firstName?.[0] || 'U'}
                 </div>
                 <div class="dropdown-menu" id="user-dropdown-menu" role="menu">
                   <div style="padding:var(--space-3);border-bottom:1px solid var(--border-subtle);">
                     <div style="font-weight:var(--fw-semibold);font-size:var(--text-sm);">
                       ${user.firstName} ${user.lastName}
                     </div>
                     <div style="font-size:var(--text-xs);color:var(--text-tertiary);">
                       ${user.email}
                     </div>
                   </div>
                   ${!isEmployer
                     ? `<a class="dropdown-item" href="${basePath}profile.html" role="menuitem">
                          👤 My Profile
                        </a>`
                     : ''
                   }
                   <a class="dropdown-item"
                      href="${basePath}${isEmployer ? 'employer-dashboard.html' : 'candidate-dashboard.html'}"
                      role="menuitem">
                     📊 Dashboard
                   </a>
                   <div class="dropdown-divider"></div>
                   <a class="dropdown-item"
                      id="logout-btn"
                      href="#"
                      role="menuitem"
                      style="color:var(--color-error);">
                     🚪 Sign Out
                   </a>
                 </div>
               </div>`
            : `<a href="${basePath}login.html"  class="btn btn-ghost  btn-sm">Log In</a>
               <a href="${basePath}signup.html" class="btn btn-primary btn-sm">Sign Up</a>`
          }

          <!-- Mobile hamburger -->
          <button
            class="navbar-hamburger show-mobile"
            id="nav-hamburger"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="nav-links"
          >
            ☰
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
        hamburger.textContent = isOpen ? '✕' : '☰';
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
              <li><a href="#">Pricing Plans</a></li>
            </ul>
          </div>

          <!-- Company column -->
          <div class="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact</a></li>
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
  function renderStatCard(icon, value, label, trend = '', colorClass = 'green') {
    const trendClass = trend.startsWith('+') ? 'up' : 'down';
    return `
      <div class="stat-card">
        <div class="stat-card-icon ${colorClass}" aria-hidden="true">${icon}</div>
        <div class="stat-card-content">
          <div class="stat-card-value">${value}</div>
          <div class="stat-card-label">${label}</div>
          ${trend
            ? `<div class="stat-card-trend ${trendClass}" aria-label="${trend}">${trend}</div>`
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
    escapeHTML,
  };

})();