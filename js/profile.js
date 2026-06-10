// ============================================
// JOBFOREST — PROFILE & RESUME BUILDER
// Editable sections, live preview, download
// ============================================

const Profile = (() => {

  let editingSection = null;

  // ─── INIT ─────────────────────────────────────
  function init() {
    const user = JobForestData.getCurrentUser();
    if (!user || user.role !== 'candidate') return;

    renderProfile(user);
    renderResumePreview(user);
    bindEvents(user);
  }

  // ─── RENDER PROFILE ──────────────────────────
  function renderProfile(user) {
    // Avatar & sidebar
    const sidebarCard = document.getElementById('profile-sidebar-card');
    if (sidebarCard) {
      sidebarCard.innerHTML = `
        <div class="avatar avatar-2xl" style="margin: 0 auto var(--space-4);">${user.avatar || 'U'}</div>
        <h3>${user.firstName} ${user.lastName}</h3>
        <p class="title">${user.title || 'Add your title'}</p>
        <p class="location">📍 ${user.location || 'Add location'}</p>
        <div style="margin: var(--space-6) 0;">
          <div class="progress-ring" id="completion-ring">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle class="progress-ring-track" cx="60" cy="60" r="52"/>
              <circle class="progress-ring-fill" cx="60" cy="60" r="52"
                stroke-dasharray="326.73"
                stroke-dashoffset="${326.73 * (1 - (user.profileCompletion || 0) / 100)}"/>
            </svg>
            <div class="progress-ring-text">
              <span class="progress-ring-value">${user.profileCompletion || 0}%</span>
              <span class="progress-ring-label">Complete</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2" style="margin-top: var(--space-4);">
          <button class="btn btn-primary btn-block btn-sm" id="download-resume-btn">📄 Download Resume</button>
          <div class="flex items-center justify-center gap-2 mt-2">
            <span class="text-sm text-secondary">Profile Visibility:</span>
            <div class="toggle-switch ${user.visibility === 'public' ? 'active' : ''}" id="visibility-toggle">
              <div class="toggle-track"></div>
            </div>
            <span class="text-sm" id="visibility-label">${user.visibility === 'public' ? 'Public' : 'Private'}</span>
          </div>
        </div>
      `;
    }

    // Bio section
    renderSection('bio', 'About Me', user.bio || 'Tell employers about yourself...', user);

    // Skills
    renderSkillsSection(user);

    // Experience
    renderExperienceSection(user);

    // Education
    renderEducationSection(user);

    // Certifications
    renderCertificationsSection(user);

    // Portfolio links
    renderPortfolioSection(user);
  }

  // ─── GENERIC SECTION RENDERER ─────────────────
  function renderSection(id, title, content, user) {
    const section = document.getElementById(`section-${id}`);
    if (!section) return;

    section.innerHTML = `
      <div class="profile-section-header">
        <h3>${title}</h3>
        <button class="edit-btn" data-edit="${id}">✏️ Edit</button>
      </div>
      <div id="${id}-display">
        <p class="text-secondary" style="line-height: var(--leading-relaxed);">${content || '<em class="text-tertiary">Not provided yet</em>'}</p>
      </div>
      <div id="${id}-edit" class="hidden">
        <textarea class="form-textarea" id="${id}-input" rows="4">${content || ''}</textarea>
        <div class="flex gap-3 mt-4">
          <button class="btn btn-primary btn-sm" data-save="${id}">Save</button>
          <button class="btn btn-ghost btn-sm" data-cancel="${id}">Cancel</button>
        </div>
      </div>
    `;
  }

  // ─── SKILLS SECTION ───────────────────────────
  function renderSkillsSection(user) {
    const section = document.getElementById('section-skills');
    if (!section) return;

    const skillTags = (user.skills || []).map(s =>
      `<span class="tag tag-primary tag-removable" data-skill="${s}">${s} <span class="tag-remove">✕</span></span>`
    ).join('');

    section.innerHTML = `
      <div class="profile-section-header">
        <h3>Skills</h3>
        <button class="edit-btn" data-edit="skills">✏️ Edit</button>
      </div>
      <div id="skills-display">
        <div class="flex flex-wrap gap-2">
          ${skillTags || '<em class="text-tertiary text-sm">Add your skills to improve job matching</em>'}
        </div>
      </div>
      <div id="skills-edit" class="hidden">
        <div class="skill-input-wrapper" id="skill-input-wrapper">
          ${(user.skills || []).map(s => `<span class="tag tag-primary tag-removable" data-skill="${s}">${s} <span class="tag-remove">✕</span></span>`).join('')}
          <input type="text" placeholder="Type a skill and press Enter..." id="skill-input" />
        </div>
        <p class="form-hint mt-2">Press Enter to add a skill. Click ✕ to remove.</p>
        <div class="flex gap-3 mt-4">
          <button class="btn btn-primary btn-sm" data-save="skills">Save</button>
          <button class="btn btn-ghost btn-sm" data-cancel="skills">Cancel</button>
        </div>
      </div>
    `;
  }

  // ─── EXPERIENCE SECTION ───────────────────────
  function renderExperienceSection(user) {
    const section = document.getElementById('section-experience');
    if (!section) return;

    const entries = (user.experience || []).map((exp, i) => `
      <div class="experience-entry">
        <h4>${exp.title}</h4>
        <div class="exp-company">${exp.company}</div>
        <div class="exp-dates">${exp.startDate} — ${exp.endDate} • ${exp.location}</div>
        <p class="exp-desc">${exp.description}</p>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="profile-section-header">
        <h3>Work Experience</h3>
        <button class="edit-btn" data-edit="experience">+ Add Experience</button>
      </div>
      <div id="experience-display">
        ${entries || '<em class="text-tertiary text-sm">Add your work experience</em>'}
      </div>
      <div id="experience-edit" class="hidden">
        <div class="form-group">
          <label class="form-label">Job Title<span class="required">*</span></label>
          <input type="text" class="form-input" id="exp-title" placeholder="e.g. Software Engineer" />
        </div>
        <div class="form-group">
          <label class="form-label">Company<span class="required">*</span></label>
          <input type="text" class="form-input" id="exp-company" placeholder="e.g. Google" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input type="month" class="form-input" id="exp-start" />
          </div>
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input type="month" class="form-input" id="exp-end" placeholder="Present" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-input" id="exp-location" placeholder="e.g. San Francisco, CA" />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" id="exp-desc" rows="3" placeholder="Describe your role and achievements..."></textarea>
        </div>
        <div class="flex gap-3">
          <button class="btn btn-primary btn-sm" data-save="experience">Add Experience</button>
          <button class="btn btn-ghost btn-sm" data-cancel="experience">Cancel</button>
        </div>
      </div>
    `;
  }

  // ─── EDUCATION SECTION ────────────────────────
  function renderEducationSection(user) {
    const section = document.getElementById('section-education');
    if (!section) return;

    const entries = (user.education || []).map(edu => `
      <div class="experience-entry">
        <h4>${edu.degree}</h4>
        <div class="exp-company">${edu.institution}</div>
        <div class="exp-dates">Class of ${edu.year}</div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="profile-section-header">
        <h3>Education</h3>
        <button class="edit-btn" data-edit="education">+ Add Education</button>
      </div>
      <div id="education-display">${entries || '<em class="text-tertiary text-sm">Add your education</em>'}</div>
      <div id="education-edit" class="hidden">
        <div class="form-group">
          <label class="form-label">Degree<span class="required">*</span></label>
          <input type="text" class="form-input" id="edu-degree" placeholder="e.g. B.S. Computer Science" />
        </div>
        <div class="form-group">
          <label class="form-label">Institution<span class="required">*</span></label>
          <input type="text" class="form-input" id="edu-institution" placeholder="e.g. MIT" />
        </div>
        <div class="form-group">
          <label class="form-label">Year</label>
          <input type="text" class="form-input" id="edu-year" placeholder="e.g. 2022" />
        </div>
        <div class="flex gap-3">
          <button class="btn btn-primary btn-sm" data-save="education">Add Education</button>
          <button class="btn btn-ghost btn-sm" data-cancel="education">Cancel</button>
        </div>
      </div>
    `;
  }

  // ─── CERTIFICATIONS SECTION ───────────────────
  function renderCertificationsSection(user) {
    const section = document.getElementById('section-certifications');
    if (!section) return;

    const items = (user.certifications || []).map(c => `<li style="padding: var(--space-2) 0; display: flex; align-items: center; gap: var(--space-2);"><span style="color: var(--color-accent);">🏆</span> ${c}</li>`).join('');

    section.innerHTML = `
      <div class="profile-section-header">
        <h3>Certifications & Awards</h3>
        <button class="edit-btn" data-edit="certifications">+ Add</button>
      </div>
      <div id="certifications-display">
        <ul>${items || '<em class="text-tertiary text-sm">Add your certifications</em>'}</ul>
      </div>
      <div id="certifications-edit" class="hidden">
        <div class="form-group">
          <label class="form-label">Certification Name</label>
          <input type="text" class="form-input" id="cert-name" placeholder="e.g. AWS Certified Developer" />
        </div>
        <div class="flex gap-3">
          <button class="btn btn-primary btn-sm" data-save="certifications">Add Certification</button>
          <button class="btn btn-ghost btn-sm" data-cancel="certifications">Cancel</button>
        </div>
      </div>
    `;
  }

  // ─── PORTFOLIO SECTION ────────────────────────
  function renderPortfolioSection(user) {
    const section = document.getElementById('section-portfolio');
    if (!section) return;

    const links = (user.portfolioLinks || []).map(l => `<li style="padding: var(--space-2) 0;"><a href="https://${l}" target="_blank" style="display: flex; align-items: center; gap: var(--space-2);">🔗 ${l}</a></li>`).join('');

    section.innerHTML = `
      <div class="profile-section-header">
        <h3>Portfolio & Links</h3>
        <button class="edit-btn" data-edit="portfolio">+ Add Link</button>
      </div>
      <div id="portfolio-display">
        <ul>${links || '<em class="text-tertiary text-sm">Add portfolio links</em>'}</ul>
      </div>
      <div id="portfolio-edit" class="hidden">
        <div class="form-group">
          <label class="form-label">URL</label>
          <input type="text" class="form-input" id="portfolio-url" placeholder="e.g. github.com/yourname" />
        </div>
        <div class="flex gap-3">
          <button class="btn btn-primary btn-sm" data-save="portfolio">Add Link</button>
          <button class="btn btn-ghost btn-sm" data-cancel="portfolio">Cancel</button>
        </div>
      </div>
    `;
  }

  // ─── RESUME PREVIEW ──────────────────────────
  function renderResumePreview(user) {
    const preview = document.getElementById('resume-preview');
    if (!preview) return;

    preview.innerHTML = `
      <div style="text-align: center; margin-bottom: var(--space-6);">
        <h1 style="font-size: var(--text-2xl); margin-bottom: var(--space-1); color: inherit;">${user.firstName} ${user.lastName}</h1>
        <p style="color: var(--color-primary); font-weight: 500;">${user.title || ''}</p>
        <p style="font-size: var(--text-sm); color: var(--text-tertiary);">${user.email} ${user.location ? '• ' + user.location : ''}</p>
      </div>

      ${user.bio ? `<h2>Summary</h2><p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6;">${user.bio}</p>` : ''}

      ${(user.skills && user.skills.length > 0) ? `
        <h2>Skills</h2>
        <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
          ${user.skills.map(s => `<span class="tag tag-primary">${s}</span>`).join('')}
        </div>
      ` : ''}

      ${(user.experience && user.experience.length > 0) ? `
        <h2>Experience</h2>
        ${user.experience.map(exp => `
          <div style="margin-bottom: var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong>${exp.title}</strong>
              <span style="font-size: var(--text-xs); color: var(--text-tertiary);">${exp.startDate} — ${exp.endDate}</span>
            </div>
            <div style="color: var(--color-primary); font-size: var(--text-sm);">${exp.company} • ${exp.location}</div>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-2);">${exp.description}</p>
          </div>
        `).join('')}
      ` : ''}

      ${(user.education && user.education.length > 0) ? `
        <h2>Education</h2>
        ${user.education.map(edu => `
          <div style="margin-bottom: var(--space-3);">
            <strong>${edu.degree}</strong>
            <div style="font-size: var(--text-sm); color: var(--text-secondary);">${edu.institution} — ${edu.year}</div>
          </div>
        `).join('')}
      ` : ''}

      ${(user.certifications && user.certifications.length > 0) ? `
        <h2>Certifications</h2>
        <ul style="list-style: disc; padding-left: var(--space-6);">
          ${user.certifications.map(c => `<li style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-2);">${c}</li>`).join('')}
        </ul>
      ` : ''}
    `;
  }

  // ─── BIND EVENTS ──────────────────────────────
  function bindEvents(user) {
    // Edit buttons
    document.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-edit]');
      if (editBtn) {
        const section = editBtn.getAttribute('data-edit');
        toggleEdit(section, true);
      }

      const cancelBtn = e.target.closest('[data-cancel]');
      if (cancelBtn) {
        const section = cancelBtn.getAttribute('data-cancel');
        toggleEdit(section, false);
      }

      const saveBtn = e.target.closest('[data-save]');
      if (saveBtn) {
        const section = saveBtn.getAttribute('data-save');
        saveSection(section, user);
      }

      // Skill tag removal
      const removeTag = e.target.closest('.tag-remove');
      if (removeTag) {
        const tag = removeTag.closest('.tag');
        const skill = tag?.getAttribute('data-skill');
        if (skill && user.skills) {
          user.skills = user.skills.filter(s => s !== skill);
          tag.remove();
        }
      }
    });

    // Skill input
    const skillInput = document.getElementById('skill-input');
    if (skillInput) {
      skillInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && skillInput.value.trim()) {
          e.preventDefault();
          const skill = skillInput.value.trim();
          if (!user.skills) user.skills = [];
          if (!user.skills.includes(skill)) {
            user.skills.push(skill);
            const wrapper = document.getElementById('skill-input-wrapper');
            const tag = document.createElement('span');
            tag.className = 'tag tag-primary tag-removable';
            tag.setAttribute('data-skill', skill);
            tag.innerHTML = `${skill} <span class="tag-remove">✕</span>`;
            wrapper.insertBefore(tag, skillInput);
          }
          skillInput.value = '';
        }
      });
    }

    // Visibility toggle
    const visToggle = document.getElementById('visibility-toggle');
    if (visToggle) {
      visToggle.addEventListener('click', () => {
        visToggle.classList.toggle('active');
        user.visibility = visToggle.classList.contains('active') ? 'public' : 'private';
        const label = document.getElementById('visibility-label');
        if (label) label.textContent = user.visibility === 'public' ? 'Public' : 'Private';
        JobForestData.setCurrentUser(user);
        Components.showToast(`Profile is now ${user.visibility}`, 'info');
      });
    }

    // Download resume
    const downloadBtn = document.getElementById('download-resume-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => downloadResume(user));
    }
  }

  // ─── TOGGLE EDIT MODE ─────────────────────────
  function toggleEdit(section, show) {
    const display = document.getElementById(`${section}-display`);
    const edit = document.getElementById(`${section}-edit`);
    if (display) display.classList.toggle('hidden', show);
    if (edit) edit.classList.toggle('hidden', !show);
  }

  // ─── SAVE SECTION ────────────────────────────
  function saveSection(section, user) {
    switch (section) {
      case 'bio': {
        const input = document.getElementById('bio-input');
        if (input) {
          user.bio = input.value.trim();
          user.profileCompletion = Math.min(100, (user.profileCompletion || 0) + (user.bio ? 5 : 0));
        }
        break;
      }
      case 'skills': {
        // Skills are already updated in-place via tag add/remove
        user.profileCompletion = Math.min(100, (user.profileCompletion || 0) + (user.skills?.length > 0 ? 5 : 0));
        break;
      }
      case 'experience': {
        const title = document.getElementById('exp-title')?.value.trim();
        const company = document.getElementById('exp-company')?.value.trim();
        if (title && company) {
          if (!user.experience) user.experience = [];
          user.experience.unshift({
            title,
            company,
            startDate: document.getElementById('exp-start')?.value || '',
            endDate: document.getElementById('exp-end')?.value || 'Present',
            location: document.getElementById('exp-location')?.value || '',
            description: document.getElementById('exp-desc')?.value || ''
          });
          user.profileCompletion = Math.min(100, (user.profileCompletion || 0) + 10);
        }
        break;
      }
      case 'education': {
        const degree = document.getElementById('edu-degree')?.value.trim();
        const institution = document.getElementById('edu-institution')?.value.trim();
        if (degree && institution) {
          if (!user.education) user.education = [];
          user.education.unshift({
            degree,
            institution,
            year: document.getElementById('edu-year')?.value || ''
          });
        }
        break;
      }
      case 'certifications': {
        const name = document.getElementById('cert-name')?.value.trim();
        if (name) {
          if (!user.certifications) user.certifications = [];
          user.certifications.push(name);
        }
        break;
      }
      case 'portfolio': {
        const url = document.getElementById('portfolio-url')?.value.trim();
        if (url) {
          if (!user.portfolioLinks) user.portfolioLinks = [];
          user.portfolioLinks.push(url);
        }
        break;
      }
    }

    // Persist
    JobForestData.setCurrentUser(user);

    // Re-render
    renderProfile(user);
    renderResumePreview(user);
    bindEvents(user);
    toggleEdit(section, false);

    Components.showToast('Profile updated!', 'success');
  }

  // ─── DOWNLOAD RESUME ─────────────────────────
  function downloadResume(user) {
    let text = `${user.firstName} ${user.lastName}\n`;
    text += `${user.title || ''}\n`;
    text += `${user.email} | ${user.location || ''}\n`;
    text += '═'.repeat(50) + '\n\n';

    if (user.bio) {
      text += 'SUMMARY\n' + '─'.repeat(30) + '\n' + user.bio + '\n\n';
    }

    if (user.skills?.length) {
      text += 'SKILLS\n' + '─'.repeat(30) + '\n' + user.skills.join(' • ') + '\n\n';
    }

    if (user.experience?.length) {
      text += 'EXPERIENCE\n' + '─'.repeat(30) + '\n';
      user.experience.forEach(exp => {
        text += `${exp.title} at ${exp.company}\n`;
        text += `${exp.startDate} — ${exp.endDate} | ${exp.location}\n`;
        text += `${exp.description}\n\n`;
      });
    }

    if (user.education?.length) {
      text += 'EDUCATION\n' + '─'.repeat(30) + '\n';
      user.education.forEach(edu => {
        text += `${edu.degree} — ${edu.institution} (${edu.year})\n`;
      });
      text += '\n';
    }

    if (user.certifications?.length) {
      text += 'CERTIFICATIONS\n' + '─'.repeat(30) + '\n';
      user.certifications.forEach(c => { text += `• ${c}\n`; });
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${user.firstName}_${user.lastName}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(a.href);

    Components.showToast('Resume downloaded!', 'success');
  }

  return { init };
})();
