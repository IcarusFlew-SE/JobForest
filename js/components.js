// ============================================
// JOBFOREST — SHARED UI COMPONENTS
// Navbar, Footer, Modal, Toast, Card Renderers
// ============================================

const Components = (() => {

  // ─── NAVBAR ──────────────────────────────────
  function renderNavbar(currentPage = '') {
    const user = JobForestData.getCurrentUser();
    const isLoggedIn = !!user;
    const isEmployer = user?.role === 'employer';
    const basePath = currentPage === 'home' ? 'pages/' : (currentPage ? '' : 'pages/');
    const homePath = currentPage === 'home' ? '' : '../';

    const nav = document.createElement('nav');
    nav.className = 'navbar glass-nav';
    nav.id = 'main-navbar';

    nav.innerHTML = `
      <div class="container">
        <a href="${homePath}index.html" class="navbar-brand" id="nav-brand">
          <span class="logo-icon">🌲</span>
          <span>JobForest</span>
        </a>

        <div class="navbar-links" id="nav-links">
          <a href="${basePath}jobs.html" class="${currentPage === 'jobs' ? 'active' : ''}" id="nav-jobs">Find Jobs</a>
          ${isEmployer 
            ? `<a href="${basePath}employer-dashboard.html" class="${currentPage === 'employer-dashboard' ? 'active' : ''}" id="nav-employer-dash">Dashboard</a>`
            : `<a href="${basePath}candidate-dashboard.html" class="${currentPage === 'candidate-dashboard' ? 'active' : ''}" id="nav-candidate-dash">Dashboard</a>`
          }
          ${!isEmployer ? `<a href="${basePath}job-matching.html" class="${currentPage === 'matching' ? 'active' : ''}" id="nav-matching">Job Match</a>` : ''}
          ${!isEmployer ? `<a href="${basePath}profile.html" class="${currentPage === 'profile' ? 'active' : ''}" id="nav-profile">Profile</a>` : ''}
          <a href="${basePath}living-portfolio.html" class="${currentPage === 'portfolio' ? 'active' : ''}" id="nav-portfolio">Living Portfolio</a>
        </div>

        <div class="navbar-actions">
          <div class="navbar-search hide-mobile" id="nav-search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search jobs..." id="nav-search-input" />
          </div>
          <button class="theme-toggle" id="theme-toggle" data-tooltip="Toggle theme" aria-label="Toggle dark/light theme">
            <span id="theme-icon">🌙</span>
          </button>
          ${isLoggedIn
            ? `<div class="dropdown" id="user-dropdown">
                <div class="navbar-avatar" id="nav-avatar">${user.avatar || user.firstName?.[0] || 'U'}</div>
                <div class="dropdown-menu" id="user-dropdown-menu">
                  <div style="padding: var(--space-3); border-bottom: 1px solid var(--border-light);">
                    <div style="font-weight: 600; font-size: var(--text-sm);">${user.firstName} ${user.lastName}</div>
                    <div style="font-size: var(--text-xs); color: var(--text-tertiary);">${user.email}</div>
                  </div>
                  ${!isEmployer ? `<a class="dropdown-item" href="${basePath}profile.html">👤 My Profile</a>` : ''}
                  <a class="dropdown-item" href="${basePath}${isEmployer ? 'employer-dashboard.html' : 'candidate-dashboard.html'}">📊 Dashboard</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" id="logout-btn" href="#" style="color: var(--color-error);">🚪 Sign Out</a>
                </div>
              </div>`
            : `<a href="${basePath}login.html" class="btn btn-ghost btn-sm" id="nav-login">Log In</a>
               <a href="${basePath}signup.html" class="btn btn-primary btn-sm" id="nav-signup">Sign Up</a>`
          }
          <button class="navbar-hamburger hide-desktop hide-tablet" id="nav-hamburger" aria-label="Toggle navigation menu">☰</button>
        </div>
      </div>
    `;

    document.body.prepend(nav);

    // Hamburger toggle
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }

    // User dropdown toggle
    const avatarEl = document.getElementById('nav-avatar');
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    if (avatarEl && dropdownMenu) {
      avatarEl.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('open');
      });
      document.addEventListener('click', () => {
        dropdownMenu.classList.remove('open');
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('jf_currentUser');
        showToast('Signed out successfully', 'success');
        setTimeout(() => {
          window.location.href = homePath + 'index.html';
        }, 1000);
      });
    }

    // Nav search → redirect to jobs page
    const navSearchInput = document.getElementById('nav-search-input');
    if (navSearchInput) {
      navSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && navSearchInput.value.trim()) {
          window.location.href = `${basePath}jobs.html?q=${encodeURIComponent(navSearchInput.value.trim())}`;
        }
      });
    }
  }

  // ─── FOOTER ──────────────────────────────────
  function renderFooter(currentPage = '') {
    const basePath = currentPage === 'home' ? 'pages/' : '';
    const homePath = currentPage === 'home' ? '' : '../';

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.id = 'main-footer';

    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="${homePath}index.html" class="navbar-brand">
              <span class="logo-icon">🌲</span>
              <span>JobForest</span>
            </a>
            <p>Grow your career naturally. Connect with top employers and discover opportunities that match your unique skills and aspirations.</p>
            <div class="footer-social">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="GitHub">⌨</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>
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
          <div class="footer-column">
            <h4>Employers</h4>
            <ul>
              <li><a href="${basePath}employer-dashboard.html">Post a Job</a></li>
              <li><a href="${basePath}employer-dashboard.html">Find Candidates</a></li>
              <li><a href="#">Pricing Plans</a></li>
              <li><a href="#">Enterprise Solutions</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
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

  // ─── MODAL ────────────────────────────────────
  function showModal(title, bodyHTML, footerHTML = '') {
    // Remove existing modal if any
    closeModal();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';

    overlay.innerHTML = `
      <div class="modal" id="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" id="modal-close-btn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);

    // Close handlers
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', handleEscClose);

    return overlay;
  }

  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.remove();
    }
    document.removeEventListener('keydown', handleEscClose);
  }

  function handleEscClose(e) {
    if (e.key === 'Escape') closeModal();
  }

  // ─── TOAST NOTIFICATIONS ─────────────────────
  function showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" aria-label="Dismiss notification">✕</span>
    `;

    container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.animation = 'slideToast 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    });

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideToast 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  // ─── JOB CARD ─────────────────────────────────
  function renderJobCard(job, options = {}) {
    const company = JobForestData.getCompanyById(job.companyId);
    const isSaved = JobForestData.isJobSaved(job.id);
    const basePath = options.basePath || '';

    const card = document.createElement('div');
    card.className = 'job-card';
    card.id = `job-card-${job.id}`;

    card.innerHTML = `
      <div class="job-card-header">
        <div class="job-card-logo">${company?.logo || '🏢'}</div>
        <div class="job-card-info">
          <div class="job-card-title">${job.title}</div>
          <div class="job-card-company">${company?.name || 'Unknown Company'}</div>
        </div>
        <button class="job-card-bookmark ${isSaved ? 'saved' : ''}" data-job-id="${job.id}" aria-label="${isSaved ? 'Unsave job' : 'Save job'}">
          ${isSaved ? '★' : '☆'}
        </button>
      </div>
      <div class="job-card-tags">
        <span class="tag tag-primary">${job.type}</span>
        <span class="tag tag-info">${job.workMode}</span>
        <span class="tag">${job.experience}</span>
        <span class="tag tag-purple">${job.category}</span>
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

    // Bookmark toggle
    const bookmarkBtn = card.querySelector('.job-card-bookmark');
    bookmarkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowSaved = JobForestData.toggleSavedJob(job.id);
      bookmarkBtn.classList.toggle('saved', nowSaved);
      bookmarkBtn.textContent = nowSaved ? '★' : '☆';
      showToast(nowSaved ? 'Job saved!' : 'Job removed from saved', nowSaved ? 'success' : 'info');
    });

    // Card click → job detail
    card.addEventListener('click', (e) => {
      if (e.target.closest('.job-card-bookmark')) return;
      window.location.href = `${basePath}job-detail.html?id=${job.id}`;
    });

    return card;
  }

  // ─── SKILL TAG ────────────────────────────────
  function renderSkillTag(skill, removable = false, onRemove = null) {
    const tag = document.createElement('span');
    tag.className = `tag tag-primary ${removable ? 'tag-removable' : ''}`;
    tag.innerHTML = removable ? `${skill} <span class="tag-remove">✕</span>` : skill;

    if (removable && onRemove) {
      tag.addEventListener('click', () => onRemove(skill));
    }
    return tag;
  }

  // ─── STAT CARD ────────────────────────────────
  function renderStatCard(icon, value, label, trend = '', colorClass = 'green') {
    return `
      <div class="stat-card">
        <div class="stat-card-icon ${colorClass}">${icon}</div>
        <div class="stat-card-content">
          <div class="stat-card-value">${value}</div>
          <div class="stat-card-label">${label}</div>
          ${trend ? `<div class="stat-card-trend ${trend.startsWith('+') ? 'up' : 'down'}">${trend}</div>` : ''}
        </div>
      </div>
    `;
  }

  // ─── CONFIRMATION DIALOG ──────────────────────
  function confirm(message, onConfirm) {
    showModal('Confirm Action', `<p>${message}</p>`,
      `<button class="btn btn-ghost" id="confirm-cancel">Cancel</button>
       <button class="btn btn-primary" id="confirm-ok">Confirm</button>`
    );
    document.getElementById('confirm-cancel').addEventListener('click', closeModal);
    document.getElementById('confirm-ok').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  // ─── LOADING SPINNER ──────────────────────────
  function renderLoader() {
    return `<div class="flex items-center justify-center p-8"><div class="btn-loader" style="width:32px;height:32px;border-width:3px;border-color:var(--border-default);border-top-color:var(--color-primary);"></div></div>`;
  }

  // Public API
  return {
    renderNavbar,
    renderFooter,
    showModal,
    closeModal,
    showToast,
    renderJobCard,
    renderSkillTag,
    renderStatCard,
    confirm,
    renderLoader
  };
})();
