// ============================================
// JOBFOREST — JOB MATCHING ENGINE
// AI-based Profile Matching & Recommendations
// ============================================

const Matching = (() => {

  let currentUser = null;

  // ─── INIT ─────────────────────────────────────
  function init() {
    currentUser = JobForestData.getCurrentUser();
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }

    renderHeaderSummary();
    calculateAndRenderMatches();
    setupEventListeners();
  }

  // ─── EVENT LISTENERS ──────────────────────────
  function setupEventListeners() {
    const recalcBtn = document.getElementById('recalculate-match-btn');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', () => {
        const grid = document.getElementById('matches-grid');
        if (grid) {
          grid.innerHTML = Components.renderLoader();
        }
        recalcBtn.classList.add('btn-loading');
        setTimeout(() => {
          recalcBtn.classList.remove('btn-loading');
          calculateAndRenderMatches();
          Components.showToast('Match scores updated based on your latest profile!', 'success');
        }, 1200);
      });
    }
  }

  // ─── RENDER HEADER PROFILE SUMMARY ────────────
  function renderHeaderSummary() {
    const summaryEl = document.getElementById('match-skills-summary');
    if (!summaryEl) return;

    const skillChips = (currentUser.skills || []).map(s => 
      `<span class="tag tag-primary">${s}</span>`
    ).join('');

    summaryEl.innerHTML = `
      <div class="flex items-center gap-4 reveal">
        <div class="avatar avatar-xl">${currentUser.avatar || currentUser.firstName[0]}</div>
        <div>
          <h2 style="margin:0;">Matching Profile: ${currentUser.firstName} ${currentUser.lastName}</h2>
          <p class="text-sm text-secondary" style="margin:2px 0 var(--space-2);">${currentUser.title || 'Candidate'}</p>
          <div class="flex flex-wrap gap-1 mt-1">
            ${skillChips || '<em class="text-tertiary">No skills added. Add skills in profile to scan matches.</em>'}
          </div>
        </div>
      </div>
    `;
  }

  // ─── CALCULATE & RENDER ───────────────────────
  function calculateAndRenderMatches() {
    const grid = document.getElementById('matches-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const jobs = JobForestData.getJobs().filter(j => j.status === 'active');
    const scoredJobs = jobs.map(job => {
      const score = calculateScore(currentUser, job);
      return {
        job,
        score,
        breakdown: getMatchBreakdown(currentUser, job)
      };
    });

    // Sort by match score descending
    scoredJobs.sort((a, b) => b.score - a.score);

    // Filter to jobs that have at least some match
    if (scoredJobs.length === 0) {
      grid.innerHTML = `<div class="text-center p-8 text-tertiary col-span-full">No active jobs found to match.</div>`;
      return;
    }

    scoredJobs.forEach(item => {
      const card = renderMatchCard(item);
      grid.appendChild(card);
    });

    renderImprovementSuggestions(scoredJobs);
  }

  // ─── CALCULATE SCORE ALGORITHM ────────────────
  function calculateScore(user, job) {
    if (!user || !job) return 0;

    // 1. Skills Fit (60%)
    const jobSkills = job.skills || [];
    const userSkills = user.skills || [];
    if (jobSkills.length === 0) return 60; // Default points if no skills listed

    const matchedSkills = jobSkills.filter(s => 
      userSkills.some(us => us.toLowerCase() === s.toLowerCase())
    );
    const skillsRatio = matchedSkills.length / jobSkills.length;
    const skillsScore = skillsRatio * 60;

    // 2. Experience Level Fit (20%)
    let expScore = 0;
    const userYears = calculateUserExperienceYears(user);
    const jobTier = job.experience; // Entry, Mid, Senior, Executive

    if (jobTier === 'Entry') {
      expScore = userYears >= 1 ? 20 : 10;
    } else if (jobTier === 'Mid') {
      if (userYears >= 3) expScore = 20;
      else if (userYears >= 1) expScore = 15;
      else expScore = 5;
    } else if (jobTier === 'Senior') {
      if (userYears >= 5) expScore = 20;
      else if (userYears >= 3) expScore = 12;
      else expScore = 0;
    } else if (jobTier === 'Executive') {
      if (userYears >= 8) expScore = 20;
      else if (userYears >= 5) expScore = 10;
      else expScore = 0;
    }

    // 3. Work Mode & Location Fit (20%)
    let workModeScore = 0;
    const isRemoteFriendly = job.workMode === 'Remote';
    const isSameLocation = user.location && job.location && 
      user.location.toLowerCase().includes(job.location.split(',')[0].toLowerCase().trim());

    if (isRemoteFriendly) {
      workModeScore = 20; // Maximum compatibility
    } else if (isSameLocation) {
      workModeScore = 20; // Local hybrid or onsite
    } else if (!user.location) {
      workModeScore = 15; // Undefined location is moderately compatible
    } else {
      workModeScore = 5; // Mismatched location, reloc needed
    }

    return Math.min(100, Math.round(skillsScore + expScore + workModeScore));
  }

  // ─── HELPER: YEARS OF EXP ─────────────────────
  function calculateUserExperienceYears(user) {
    if (!user.experience || user.experience.length === 0) return 1; // Default minimum

    let totalMonths = 0;
    user.experience.forEach(exp => {
      const start = new Date(exp.startDate + '-01');
      const endStr = exp.endDate === 'Present' ? '2026-06' : exp.endDate;
      const end = new Date(endStr + '-01');

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += Math.max(1, diffMonths);
      }
    });

    return totalMonths / 12;
  }

  // ─── GET BREAKDOWN DETAILS ────────────────────
  function getMatchBreakdown(user, job) {
    const jobSkills = job.skills || [];
    const userSkills = user.skills || [];
    
    const matched = jobSkills.filter(s => 
      userSkills.some(us => us.toLowerCase() === s.toLowerCase())
    );
    const missing = jobSkills.filter(s => 
      !userSkills.some(us => us.toLowerCase() === s.toLowerCase())
    );

    return {
      matchedSkills: matched,
      missingSkills: missing,
      userYears: Math.round(calculateUserExperienceYears(user) * 10) / 10,
      jobTier: job.experience,
      locationMatch: job.workMode === 'Remote' || (user.location && job.location && user.location.toLowerCase().includes(job.location.split(',')[0].toLowerCase()))
    };
  }

  // ─── RENDER MATCH CARD ────────────────────────
  function renderMatchCard(item) {
    const company = JobForestData.getCompanyById(item.job.companyId);
    const scoreColor = item.score >= 80 ? 'success' : (item.score >= 60 ? 'warning' : 'danger');

    const card = document.createElement('div');
    card.className = 'card glass-card reveal';
    card.style.cursor = 'pointer';
    
    card.innerHTML = `
      <div class="card-body">
        <div class="flex justify-between items-start mb-4">
          <div class="flex gap-3">
            <div class="job-card-logo" style="margin:0;">${company?.logo || '🏢'}</div>
            <div>
              <h3 style="margin:0; font-size:var(--text-lg);">${item.job.title}</h3>
              <p class="text-xs text-secondary">${company?.name || 'Unknown Company'} • 📍 ${item.job.location}</p>
            </div>
          </div>
          <div class="match-score-gauge flex flex-col items-center">
            <div class="text-xl font-extrabold text-${scoreColor}">${item.score}%</div>
            <span class="text-xs text-tertiary">Match Fit</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center py-2 mb-4 bg-black-opacity-5" style="border-radius:6px; background: rgba(0,0,0,0.02);">
          <div>
            <div class="text-xs text-tertiary">Type</div>
            <div class="text-xs font-semibold text-secondary mt-1">${item.job.type}</div>
          </div>
          <div>
            <div class="text-xs text-tertiary">Setting</div>
            <div class="text-xs font-semibold text-secondary mt-1">${item.job.workMode}</div>
          </div>
          <div>
            <div class="text-xs text-tertiary">Salary Max</div>
            <div class="text-xs font-semibold text-secondary mt-1">$${(item.job.salary.max/1000).toFixed(0)}K/yr</div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-xs text-secondary">
            <strong>Matched Skills:</strong> ${item.breakdown.matchedSkills.join(', ') || '<em class="text-tertiary">None</em>'}
          </div>
          ${item.breakdown.missingSkills.length > 0
            ? `<div class="text-xs text-tertiary">
                <strong>Missing Skills:</strong> ${item.breakdown.missingSkills.slice(0, 3).join(', ')}${item.breakdown.missingSkills.length > 3 ? '...' : ''}
               </div>`
            : ''
          }
        </div>

        <div class="flex gap-2 mt-6 justify-end pt-3" style="border-t: 1px solid var(--border-light);">
          <button class="btn btn-ghost btn-xs" onclick="Matching.openDetailsModal('${item.job.id}')">Breakdown Details</button>
          <button class="btn btn-primary btn-xs" onclick="window.location.href='job-detail.html?id=${item.job.id}'">View Job</button>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      window.location.href = `job-detail.html?id=${item.job.id}`;
    });

    return card;
  }

  // ─── DETAILS MODAL ────────────────────────────
  function openDetailsModal(jobId) {
    const job = JobForestData.getJobById(jobId);
    const company = JobForestData.getCompanyById(job?.companyId);
    if (!job) return;

    const score = calculateScore(currentUser, job);
    const bd = getMatchBreakdown(currentUser, job);
    const scoreColor = score >= 80 ? 'var(--color-success)' : (score >= 60 ? 'var(--color-warning)' : 'var(--color-error)');

    const modalBody = `
      <div style="display:flex; flex-col; gap:var(--space-4);">
        <div class="flex justify-between items-center bg-black-opacity-5 p-4" style="border-radius:8px; background: rgba(0,0,0,0.02); border: 1px solid var(--border-light);">
          <div>
            <h4 style="margin:0; font-size:var(--text-lg);">${job.title}</h4>
            <span class="text-xs text-secondary">${company?.name}</span>
          </div>
          <div style="text-align:right;">
            <div style="font-size: var(--text-2xl); font-weight:800; color:${scoreColor};">${score}%</div>
            <span class="text-xs text-tertiary">AI Alignment Score</span>
          </div>
        </div>

        <div class="flex flex-col gap-4 mt-4">
          <!-- Skills match component (60%) -->
          <div>
            <div class="flex justify-between text-sm font-semibold mb-1">
              <span>1. Technical Skills Fit (60% weight)</span>
              <span>${bd.matchedSkills.length} / ${job.skills.length} skills</span>
            </div>
            <div style="background:var(--border-default); height:6px; border-radius:3px; width:100%; overflow:hidden;">
              <div style="background:var(--color-primary); height:100%; width:${(bd.matchedSkills.length / (job.skills.length || 1)) * 100}%;"></div>
            </div>
            <div style="margin-top:var(--space-2); display:flex; flex-wrap:wrap; gap:4px;">
              ${bd.matchedSkills.map(s => `<span class="tag tag-sm tag-primary" style="background:var(--color-primary-light); color:var(--color-primary);">✓ ${s}</span>`).join('')}
              ${bd.missingSkills.map(s => `<span class="tag tag-sm tag-outline" style="border-color:var(--color-error); color:var(--color-error);">✗ ${s}</span>`).join('')}
            </div>
          </div>

          <!-- Experience match component (20%) -->
          <div>
            <div class="flex justify-between text-sm font-semibold mb-1">
              <span>2. Experience Tier Fit (20% weight)</span>
              <span>${bd.jobTier} level required</span>
            </div>
            <p class="text-xs text-secondary">
              You have approximately <strong>${bd.userYears} years</strong> of documented experience on your profile.
            </p>
          </div>

          <!-- Location match component (20%) -->
          <div>
            <div class="flex justify-between text-sm font-semibold mb-1">
              <span>3. Work Mode & Setting Compatibility (20% weight)</span>
              <span>${job.workMode} / Onsite Location</span>
            </div>
            <p class="text-xs text-secondary">
              Job location is <strong>${job.location}</strong>. ${bd.locationMatch ? '✓ Location matches or is remote-friendly.' : '⚠ Mismatched location. Relocation/commute might be required.'}
            </p>
          </div>
        </div>
      </div>
    `;

    Components.showModal(
      `AI Alignment Breakdown`,
      modalBody,
      `<button class="btn btn-primary btn-sm" onclick="Components.closeModal()">Close Details</button>`
    );
  }

  // ─── RENDER IMPROVEMENT TIPS ──────────────────
  function renderImprovementSuggestions(scoredJobs) {
    const container = document.getElementById('missing-skills-helper');
    if (!container) return;

    container.innerHTML = '';

    // Find skills that would increase match score for high-match candidates
    const suggestions = {};
    
    scoredJobs.forEach(item => {
      // Look at jobs where score is between 50% and 85%
      if (item.score >= 50 && item.score < 88) {
        item.breakdown.missingSkills.forEach(skill => {
          if (!suggestions[skill]) {
            suggestions[skill] = {
              skill,
              impactCount: 0,
              affectedJobs: []
            };
          }
          suggestions[skill].impactCount++;
          suggestions[skill].affectedJobs.push(item.job.title);
        });
      }
    });

    const suggestionsList = Object.values(suggestions);
    suggestionsList.sort((a, b) => b.impactCount - a.impactCount);

    if (suggestionsList.length === 0) {
      container.innerHTML = `<p class="text-xs text-tertiary">Congratulations! You have complete skill matches for all relevant active vacancies.</p>`;
      return;
    }

    container.innerHTML = `
      <h4 class="text-sm font-semibold mb-3">Add these skills to unlock opportunities:</h4>
      <div class="flex flex-col gap-3">
        ${suggestionsList.slice(0, 3).map(s => `
          <div class="flex justify-between items-center bg-black-opacity-5 p-3" style="border-radius:6px; background: rgba(0,0,0,0.02); border: 1px solid var(--border-light);">
            <div>
              <div class="font-semibold text-secondary text-sm">${s.skill}</div>
              <div class="text-xs text-tertiary mt-1">Found in: ${s.affectedJobs.slice(0, 2).join(', ')}${s.affectedJobs.length > 2 ? ' etc.' : ''}</div>
            </div>
            <button class="btn btn-outline btn-xs" onclick="Matching.addSuggestedSkill('${s.skill}')">Add Skill</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  function addSuggestedSkill(skill) {
    if (!currentUser.skills) currentUser.skills = [];
    if (!currentUser.skills.includes(skill)) {
      currentUser.skills.push(skill);
      currentUser.profileCompletion = Math.min(100, (currentUser.profileCompletion || 0) + 4);
      JobForestData.setCurrentUser(currentUser);
      
      // Update UI
      renderHeaderSummary();
      calculateAndRenderMatches();
      Components.showToast(`Added "${skill}" to your skills checklist! Match scores updated.`, 'success');
    }
  }

  return {
    init,
    calculateScore,
    openDetailsModal,
    addSuggestedSkill
  };
})();
