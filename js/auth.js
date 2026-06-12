/* ============================================================
   JOBFOREST AUTH MODULE v2.1
   Sign up / Login / Session management
   
   FIXES v2.1:
   - Logout now forces full page reload so navbar re-renders
   - Role toggle updates ARIA + visual state correctly
   - Redirect guard prevents auth loop on dashboard pages
   - First-time user routed to profile builder, not raw dashboard
   - Email comparison is case-insensitive
   - Employer-fields hidden correctly with aria-hidden sync
   ============================================================ */

'use strict';

const Auth = (() => {

  /* ── SHARED HELPERS ────────────────────────────────────── */

  /**
   * Show a red inline error below a form field.
   * @param {HTMLElement} field
   * @param {string} message
   */
  function _showFieldError(field, message) {
    if (!field) return;
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    const existing = field.parentElement.querySelector('.form-error');
    if (existing) existing.remove();

    const err = document.createElement('div');
    err.className = 'form-error';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    field.parentElement.appendChild(err);
  }

  /**
   * Clear all inline field errors in a form.
   * @param {HTMLElement} form
   */
  function _clearErrors(form) {
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.form-input.error, .form-select.error').forEach(el => {
      el.classList.remove('error');
      el.removeAttribute('aria-invalid');
    });
  }

  /* ── SIGN UP ───────────────────────────────────────────── */

  /**
   * Initialise signup page logic.
   * Handles: role toggle, form validation, account creation, redirect.
   */
  function initSignup() {
    const roleOptions    = document.querySelectorAll('.role-option[data-role]');
    const candidateFields = document.getElementById('candidate-fields');
    const employerFields  = document.getElementById('employer-fields');
    const signupForm      = document.getElementById('signup-form');

    let selectedRole = 'candidate';

    /* ── Role toggle ── */
    roleOptions.forEach(option => {
      option.addEventListener('click', () => {
        selectedRole = option.getAttribute('data-role');

        roleOptions.forEach(o => {
          o.classList.remove('selected', 'active');
          o.setAttribute('aria-checked', 'false');
          o.style.background = '';
          o.style.color = '';
          o.style.borderColor = '';
        });

        option.classList.add('selected', 'active');
        option.setAttribute('aria-checked', 'true');
        option.style.background = 'var(--sidebar-active)';
        option.style.color = 'var(--brand-primary)';
        option.style.borderColor = 'var(--brand-primary)';

        const isEmployer = selectedRole === 'employer';

        if (candidateFields) {
          candidateFields.style.display = isEmployer ? 'none' : 'block';
          candidateFields.setAttribute('aria-hidden', String(isEmployer));
        }
        if (employerFields) {
          employerFields.style.display = isEmployer ? 'block' : 'none';
          employerFields.setAttribute('aria-hidden', String(!isEmployer));
        }
      });
    });

    /* ── Form submit ── */
    if (!signupForm) return;

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      _clearErrors(signupForm);

      if (!_validateSignupForm(signupForm, selectedRole)) return;

      const fd = new FormData(signupForm);
      const firstName = fd.get('firstName')?.trim() || '';
      const lastName  = fd.get('lastName')?.trim()  || '';
      const email     = fd.get('email')?.trim().toLowerCase() || '';
      const avatar    = (firstName[0] || '') + (lastName[0] || '');

      let user;

      if (selectedRole === 'candidate') {
        user = {
          id:                'u_' + Date.now(),
          role:              'candidate',
          firstName,
          lastName,
          email,
          title:             fd.get('title')?.trim() || 'Job Seeker',
          location:          '',
          bio:               '',
          avatar,
          skills:            [],
          experience:        [],
          education:         [],
          certifications:    [],
          portfolioLinks:    [],
          profileCompletion: 20,
          visibility:        'public',
          isNewUser:         true,   /* flags first-time onboarding redirect */
        };
      } else {
        user = {
          id:          'e_' + Date.now(),
          role:        'employer',
          firstName,
          lastName,
          email,
          companyId:   'c_new_' + Date.now(),
          companyName: fd.get('companyName')?.trim() || '',
          industry:    fd.get('industry')?.trim()    || '',
          title:       'Hiring Manager',
          avatar,
          isNewUser:   true,
        };
      }

      JobForestData.setCurrentUser(user);
      Components.showToast('Account created! Welcome to JobForest 🌲', 'success');

      setTimeout(() => {
        if (selectedRole === 'candidate') {
          /* New candidate → profile builder first so they set up skills */
          window.location.href = 'profile.html';
        } else {
          window.location.href = 'employer-dashboard.html';
        }
      }, 1200);
    });
  }

  /**
   * Validate signup form fields.
   * @param {HTMLFormElement} form
   * @param {string} role - 'candidate' | 'employer'
   * @returns {boolean} true if valid
   */
  function _validateSignupForm(form, role) {
    let valid = true;

    const req = [
      { name: 'firstName', msg: 'First name is required' },
      { name: 'lastName',  msg: 'Last name is required' },
    ];

    req.forEach(({ name, msg }) => {
      const f = form.querySelector(`[name="${name}"]`);
      if (!f?.value.trim()) { _showFieldError(f, msg); valid = false; }
    });

    const emailField = form.querySelector('[name="email"]');
    if (!emailField?.value.trim() || !emailField.value.includes('@')) {
      _showFieldError(emailField, 'Enter a valid email address');
      valid = false;
    }

    const pwField = form.querySelector('[name="password"]');
    if (!pwField?.value || pwField.value.length < 6) {
      _showFieldError(pwField, 'Password must be at least 6 characters');
      valid = false;
    }

    if (role === 'employer') {
      const compField = form.querySelector('[name="companyName"]');
      if (!compField?.value.trim()) {
        _showFieldError(compField, 'Company name is required');
        valid = false;
      }
    }

    return valid;
  }

  /* ── LOGIN ─────────────────────────────────────────────── */

  /**
   * Initialise login page logic.
   * Handles: form validation, credential matching, demo quick-login, redirect.
   */
  function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      _clearErrors(loginForm);

      const emailField = loginForm.querySelector('[name="email"]');
      const pwField    = loginForm.querySelector('[name="password"]');
      const email      = emailField?.value.trim().toLowerCase();
      const password   = pwField?.value;

      let hasError = false;
      if (!email || !email.includes('@')) {
        _showFieldError(emailField, 'Enter a valid email address');
        hasError = true;
      }
      if (!password) {
        _showFieldError(pwField, 'Password is required');
        hasError = true;
      }
      if (hasError) return;

      /* Match against known profiles (case-insensitive) */
      const allCandidates = JobForestData.candidateProfiles || [];
      const allEmployers  = JobForestData.employerProfiles  || [];

      let user =
        allCandidates.find(u => u.email?.toLowerCase() === email) ||
        allEmployers.find(u => u.email?.toLowerCase()  === email);

      /* Demo fallback — any unrecognised email logs in as Alex Rivera */
      if (!user) {
        user = allCandidates[0];
      }

      /* Clear new-user flag on returning login */
      user = { ...user, isNewUser: false };
      JobForestData.setCurrentUser(user);

      Components.showToast(`Welcome back, ${user.firstName}! 🌲`, 'success');

      setTimeout(() => {
        window.location.href = user.role === 'employer'
          ? 'employer-dashboard.html'
          : 'candidate-dashboard.html';
      }, 1000);
    });

    /* Quick demo login buttons */
    document.querySelectorAll('[data-quick-login]').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid  = btn.getAttribute('data-quick-login');
        const all  = [...(JobForestData.candidateProfiles || []), ...(JobForestData.employerProfiles || [])];
        const user = all.find(u => u.id === uid);
        if (!user) return;

        JobForestData.setCurrentUser({ ...user, isNewUser: false });
        Components.showToast(`Logged in as ${user.firstName} ${user.lastName}`, 'success');
        setTimeout(() => {
          window.location.href = user.role === 'employer'
            ? 'employer-dashboard.html'
            : 'candidate-dashboard.html';
        }, 800);
      });
    });
  }

  /* ── LOGOUT ────────────────────────────────────────────── */

  /**
   * Log out the current user.
   * Clears localStorage entry and does a HARD redirect (not SPA navigation)
   * so the navbar fully re-renders without the logged-in avatar.
   * @param {string} [homePath='../'] - relative path back to index.html
   */
  function logout(homePath = '../') {
    localStorage.removeItem('jf_currentUser');

    if (typeof Components !== 'undefined') {
      Components.showToast('Signed out successfully', 'success');
    }

    /* Hard redirect ensures navbar re-renders from scratch */
    setTimeout(() => {
      window.location.href = homePath + 'index.html';
    }, 600);
  }

  /* ── SESSION GUARDS ────────────────────────────────────── */

  /**
   * Redirect to login if no user is in session.
   * Call at the top of any page that requires auth.
   * @param {string} [redirectUrl='login.html']
   * @returns {CandidateProfile|EmployerProfile|null}
   */
  function requireAuth(redirectUrl = 'login.html') {
    const user = JobForestData.getCurrentUser();
    /* getCurrentUser() falls back to seed candidate — use isLoggedIn() for strict check */
    const isActuallyLoggedIn = !!localStorage.getItem('jf_currentUser');
    if (!isActuallyLoggedIn) {
      window.location.href = redirectUrl;
      return null;
    }
    return user;
  }

  /**
   * Returns true if a real session cookie exists (not just the seed fallback).
   * @returns {boolean}
   */
  function isLoggedIn() {
    return !!localStorage.getItem('jf_currentUser');
  }

  /**
   * Prevent an already-logged-in user from seeing login/signup pages.
   * Call on login.html and signup.html.
   * @param {string} [candidateDash='candidate-dashboard.html']
   * @param {string} [employerDash='employer-dashboard.html']
   */
  function redirectIfLoggedIn(candidateDash = 'candidate-dashboard.html', employerDash = 'employer-dashboard.html') {
    if (!isLoggedIn()) return;
    const user = JobForestData.getCurrentUser();
    window.location.href = user?.role === 'employer' ? employerDash : candidateDash;
  }

  /* ── PUBLIC API ────────────────────────────────────────── */
  return {
    initSignup,
    initLogin,
    logout,
    requireAuth,
    isLoggedIn,
    redirectIfLoggedIn,
  };

})();