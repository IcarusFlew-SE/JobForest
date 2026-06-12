// ============================================
// JOBFOREST — LIVING PORTFOLIO TEASER
// Marketing Features and Portfolio Mockup Theme customizer
// ============================================

const Portfolio = (() => {

  let timelineIndex = 0;
  let timelineTimer = null;
  const timelineEvents = [
    { type: 'github', title: 'Commit pushed to "react-dashboard"', detail: 'Detected new project usage: Redux Toolkit', time: 'Just now' },
    { type: 'profile', title: 'Resume Section Modified', detail: 'Added work experience at WebCraft Studios', time: '1 min ago' },
    { type: 'linkedin', title: 'LinkedIn certification updated', detail: 'Added credential: AWS Certified Developer', time: '5 mins ago' },
    { type: 'github', title: 'Repo published "nextjs-api-boilerplate"', detail: 'Auto-extracted skills: Next.js, API Design', time: '10 mins ago' },
    { type: 'endorsement', title: 'Client endorsement received', detail: 'Taylor Chen endorsed for "System Architecture"', time: '1 hr ago' }
  ];

  // ─── INIT ─────────────────────────────────────
  function init() {
    setupThemeSelector();
    setupNewsletterForm();
    startTimelineSimulation();
  }

  // ─── THEME CUSTOMIZATION PREVIEW ──────────────
  function setupThemeSelector() {
    const selectors = document.querySelectorAll('.theme-selector-btn');
    const previewCard = document.getElementById('portfolio-preview-card');
    
    if (!selectors || !previewCard) return;

    selectors.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove existing theme classes
        previewCard.classList.remove('theme-minimal', 'theme-forest', 'theme-cyberpunk');
        selectors.forEach(s => s.classList.remove('active'));

        // Add selected theme class
        const theme = btn.getAttribute('data-theme');
        previewCard.classList.add(`theme-${theme}`);
        btn.classList.add('active');

        Components.showToast(`Preview style switched to: ${theme.toUpperCase()}`, 'info');
      });
    });
  }

  // ─── TIMELINE ANIMATION SIMULATION ────────────
  function startTimelineSimulation() {
    const timelineContainer = document.getElementById('cv-timeline-animation');
    if (!timelineContainer) return;

    // Reset list
    timelineContainer.innerHTML = '';
    timelineIndex = 0;

    // Clear previous loop if any
    if (timelineTimer) clearInterval(timelineTimer);

    // Initial render of first 2 events
    addTimelineEvent(timelineEvents[0]);
    addTimelineEvent(timelineEvents[1]);
    timelineIndex = 2;

    // Loop through adding more events
    timelineTimer = setInterval(() => {
      const event = timelineEvents[timelineIndex % timelineEvents.length];
      
      // Update time labels on existing children
      document.querySelectorAll('.timeline-log-item').forEach(el => {
        const timeLabel = el.querySelector('.log-time');
        if (timeLabel) timeLabel.textContent = 'Prior cycle';
      });

      addTimelineEvent(event);
      timelineIndex++;
    }, 4000);
  }

  function addTimelineEvent(evt) {
    const container = document.getElementById('cv-timeline-animation');
    if (!container) return;

    const icons = {
      github: '🐙',
      profile: '👤',
      linkedin: '💼',
      endorsement: '⭐'
    };

    const item = document.createElement('div');
    item.className = 'timeline-log-item reveal-log';
    item.style.padding = 'var(--space-3)';
    item.style.borderBottom = '1px solid var(--border-light)';
    item.style.background = 'rgba(255,255,255,0.02)';
    item.style.transition = 'all 0.4s ease';

    item.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex gap-3">
          <span style="font-size:1.2rem;">${icons[evt.type] || '⚡'}</span>
          <div>
            <h4 style="margin:0; font-size:var(--text-sm); font-weight:600;">${evt.title}</h4>
            <p style="margin:2px 0 0; font-size:var(--text-xs); color:var(--text-secondary);">${evt.detail}</p>
          </div>
        </div>
        <span class="log-time text-xs text-tertiary" style="font-style:italic;">${evt.time}</span>
      </div>
    `;

    container.prepend(item);

    // Keep only up to 4 items in the list view for cleaner styling
    if (container.children.length > 4) {
      container.lastElementChild.remove();
    }
  }

  // ─── NEWSLETTER SIGNUP ─────────────────────────
  function setupNewsletterForm() {
    const form = document.getElementById('early-access-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!emailInput || !emailInput.value.includes('@')) {
        Components.showToast('Please enter a valid email address.', 'warning');
        return;
      }

      // Add loading state
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        
        Components.showToast('Success! You\'ve been added to our early access list. 🌲', 'success');
        emailInput.value = '';
      }, 1500);
    });
  }

  return { init };
})();
