// ============================================
// JOBFOREST — AUTH MODULE
// Sign up / Login simulation & session
// ============================================

const Auth = (() => {

  // ─── SIGNUP ──────────────────────────────────
  function initSignup() {
    const roleOptions = document.querySelectorAll('.role-option');
    const candidateFields = document.getElementById('candidate-fields');
    const employerFields = document.getElementById('employer-fields');
    const signupForm = document.getElementById('signup-form');
    let selectedRole = 'candidate';

    // Role selector
    roleOptions.forEach(option => {
      option.addEventListener('click', () => {
        roleOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedRole = option.getAttribute('data-role');

        if (candidateFields && employerFields) {
          candidateFields.style.display = selectedRole === 'candidate' ? 'block' : 'none';
          employerFields.style.display = selectedRole === 'employer' ? 'block' : 'none';
        }
      });
    });

    // Form submission
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateSignupForm(selectedRole)) return;

        const formData = new FormData(signupForm);
        let user;

        if (selectedRole === 'candidate') {
          user = {
            id: 'u_new_' + Date.now(),
            role: 'candidate',
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            title: 'Job Seeker',
            location: '',
            bio: '',
            avatar: (formData.get('firstName')?.[0] || '') + (formData.get('lastName')?.[0] || ''),
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            portfolioLinks: [],
            profileCompletion: 25,
            visibility: 'public'
          };
        } else {
          user = {
            id: 'e_new_' + Date.now(),
            role: 'employer',
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            companyId: 'c_new',
            companyName: formData.get('companyName'),
            industry: formData.get('industry'),
            title: 'Hiring Manager',
            avatar: (formData.get('firstName')?.[0] || '') + (formData.get('lastName')?.[0] || '')
          };
        }

        // Save to localStorage
        JobForestData.setCurrentUser(user);

        // Show success
        Components.showToast('Account created successfully! Welcome to JobForest 🌲', 'success');

        // Redirect
        setTimeout(() => {
          if (selectedRole === 'candidate') {
            window.location.href = 'candidate-dashboard.html';
          } else {
            window.location.href = 'employer-dashboard.html';
          }
        }, 1500);
      });
    }
  }

  function validateSignupForm(role) {
    let valid = true;
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));

    const firstName = document.querySelector('[name="firstName"]');
    const lastName = document.querySelector('[name="lastName"]');
    const email = document.querySelector('[name="email"]');
    const password = document.querySelector('[name="password"]');

    if (!firstName?.value.trim()) { showFieldError(firstName, 'First name is required'); valid = false; }
    if (!lastName?.value.trim()) { showFieldError(lastName, 'Last name is required'); valid = false; }
    if (!email?.value.trim() || !email.value.includes('@')) { showFieldError(email, 'Valid email is required'); valid = false; }
    if (!password?.value || password.value.length < 6) { showFieldError(password, 'Password must be at least 6 characters'); valid = false; }

    if (role === 'employer') {
      const companyName = document.querySelector('[name="companyName"]');
      if (!companyName?.value.trim()) { showFieldError(companyName, 'Company name is required'); valid = false; }
    }

    return valid;
  }

  function showFieldError(field, message) {
    if (!field) return;
    field.classList.add('error');
    const error = document.createElement('div');
    error.className = 'form-error';
    error.innerHTML = `⚠ ${message}`;
    field.parentElement.appendChild(error);
  }

  // ─── LOGIN ───────────────────────────────────
  function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('[name="email"]')?.value.trim();
      const password = document.querySelector('[name="password"]')?.value;

      // Clear errors
      document.querySelectorAll('.form-error').forEach(el => el.remove());
      document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));

      if (!email || !email.includes('@')) {
        showFieldError(document.querySelector('[name="email"]'), 'Valid email is required');
        return;
      }
      if (!password) {
        showFieldError(document.querySelector('[name="password"]'), 'Password is required');
        return;
      }

      // Simulate login — match against known profiles
      let user = null;

      // Check candidate profiles
      user = JobForestData.candidateProfiles.find(u => u.email === email);

      // Check employer profiles
      if (!user) {
        user = JobForestData.employerProfiles.find(u => u.email === email);
      }

      // If no match, create a default candidate
      if (!user) {
        user = JobForestData.candidateProfiles[0]; // Default to Alex Rivera for demo
      }

      JobForestData.setCurrentUser(user);
      Components.showToast(`Welcome back, ${user.firstName}! 🌲`, 'success');

      setTimeout(() => {
        if (user.role === 'employer') {
          window.location.href = 'employer-dashboard.html';
        } else {
          window.location.href = 'candidate-dashboard.html';
        }
      }, 1200);
    });

    // Quick login buttons for demo
    const quickLoginBtns = document.querySelectorAll('[data-quick-login]');
    quickLoginBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.getAttribute('data-quick-login');
        let user = JobForestData.candidateProfiles.find(u => u.id === userId)
          || JobForestData.employerProfiles.find(u => u.id === userId);
        if (user) {
          JobForestData.setCurrentUser(user);
          Components.showToast(`Logged in as ${user.firstName} ${user.lastName}`, 'success');
          setTimeout(() => {
            window.location.href = user.role === 'employer' ? 'employer-dashboard.html' : 'candidate-dashboard.html';
          }, 1000);
        }
      });
    });
  }

  // ─── SESSION CHECK ────────────────────────────
  function requireAuth(redirectUrl = 'login.html') {
    const user = JobForestData.getCurrentUser();
    if (!user) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  function isLoggedIn() {
    return !!JobForestData.getCurrentUser();
  }

  return {
    initSignup,
    initLogin,
    requireAuth,
    isLoggedIn
  };
})();
