// JOBFOREST — DASHBOARD MODULE
// Candidate and Employer Dashboard Rendering & Interactions
// ============================================

const Dashboard = (() => {

  let currentUser = null;
  let activeTab = 'overview';
  let activeMessageId = null;
  const escapeHTML = Components.escapeHTML;

  // ─── INIT ─────────────────────────────────────
  function init() {
    currentUser = JobForestData.getCurrentUser();
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }

    // Identify if candidate or employer page
    const path = window.location.pathname;
    const isEmployerPage = path.includes('employer-dashboard.html');

    if (isEmployerPage && currentUser.role !== 'employer') {
      window.location.href = 'candidate-dashboard.html';
      return;
    } else if (!isEmployerPage && currentUser.role === 'employer') {
      window.location.href = 'employer-dashboard.html';
      return;
    }

    // Default tab from URL hash if present
    const hash = window.location.hash.replace('#', '');
    if (hash) activeTab = hash;

    setupSidebar();
    renderActiveTab();
  }

  // ─── SETUP SIDEBAR ────────────────────────────
  function setupSidebar() {
    const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
    sidebarItems.forEach(item => {
      const tab = item.getAttribute('data-tab');
      
      // Highlight current active tab
      if (tab === activeTab) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }

      item.addEventListener('click', (e) => {
        e.preventDefault();
        activeTab = tab;
        window.location.hash = tab;

        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        activeMessageId = null; // Reset chat focus on tab switch
        renderActiveTab();
      });
    });
  }

  // ─── RENDER ACTIVE TAB ────────────────────────
  function renderActiveTab() {
    const contentPane = document.getElementById('dashboard-main-content') || document.getElementById('employer-main-content');
    if (!contentPane) return;

    // Clear previous view
    contentPane.innerHTML = '';

    if (currentUser.role === 'candidate') {
      switch (activeTab) {
        case 'overview':
          renderCandidateOverview(contentPane);
          break;
        case 'applications':
          renderCandidateApplications(contentPane);
          break;
        case 'saved':
          renderCandidateSavedJobs(contentPane);
          break;
        case 'messages':
          renderMessagesTab(contentPane);
          break;
        case 'settings':
          renderCandidateSettings(contentPane);
          break;
        default:
          renderCandidateOverview(contentPane);
      }
    } else {
      switch (activeTab) {
        case 'overview':
          renderEmployerOverview(contentPane);
          break;
        case 'posts':
          renderEmployerPosts(contentPane);
          break;
        case 'candidates':
          renderEmployerCandidates(contentPane);
          break;
        case 'messages':
          renderMessagesTab(contentPane);
          break;
        case 'company':
          renderEmployerCompany(contentPane);
          break;
        default:
          renderEmployerOverview(contentPane);
      }
    }
  }

  // ──────────────────────────────────────────────
  // ─── CANDIDATE TAB RENDERERS ──────────────────
  // ──────────────────────────────────────────────

  function renderCandidateOverview(container) {
    const apps = JobForestData.getUserApplications(currentUser.id);
    const savedJobs = JobForestData.getSavedJobs();
    const interviewCount = apps.filter(a => a.status === 'interview').length;
    
    // Compute a simulated best match score from jobs
    let topMatch = 0;
    if (typeof Matching !== 'undefined') {
      const jobsList = JobForestData.getJobs();
      jobsList.forEach(job => {
        const score = Matching.calculateScore(currentUser, job);
        if (score > topMatch) topMatch = score;
      });
    } else {
      topMatch = currentUser.profileCompletion || 75;
    }

    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>Welcome back, ${escapeHTML(currentUser.firstName)}!</h2>
        <p class="text-secondary">Grow your career naturally. Here is your progress today.</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 reveal" role="region" aria-label="Dashboard statistics">
        ${Components.renderStatCard('apps', apps.length, 'Applications Sent', '', 'success')}
        ${Components.renderStatCard('interview', interviewCount, 'Interviews Scheduled', interviewCount > 0 ? '+1 this week' : '', 'warning')}
        ${Components.renderStatCard('saved', savedJobs.length, 'Saved Opportunities', '', 'info')}
        ${Components.renderStatCard('match', Math.round(topMatch), 'Top Match Score', 'Add skills to increase', 'brand')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 reveal">
        <!-- Recent applications -->
        <div class="card col-span-1 lg:col-span-2 glass-card">
          <div class="card-header flex justify-between items-center">
            <h3>Recent Applications</h3>
            <a href="#applications" class="text-sm" style="color: var(--brand-500);" onclick="document.querySelector('[data-tab=applications]').click()">View All</a>
          </div>
          <div class="card-body" style="padding: 0;">
            ${apps.length === 0 
              ? `<div class="text-center p-8 text-tertiary">
                  <p>You haven't applied to any jobs yet.</p>
                  <a href="../pages/jobs.html" class="btn btn-primary btn-sm mt-4">Browse Jobs</a>
                 </div>`
              : `<div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${apps.slice(0, 3).map(app => `
                        <tr>
                          <td><strong>${app.job?.title || 'Unknown Job'}</strong></td>
                          <td>${app.company?.name || 'Unknown Company'}</td>
                          <td class="text-sm">${JobForestData.timeAgo(app.appliedDate)}</td>
                          <td><span class="status-badge ${app.status}">${app.status}</span></td>
                          <td>
                            ${app.status === 'applied' || app.status === 'reviewed'
                              ? `<button class="btn btn-ghost btn-xs text-error" onclick="Dashboard.handleRetractApp('${app.id}')">Retract</button>`
                              : `<span class="text-xs text-tertiary">Locked</span>`
                            }
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                 </div>`
            }
          </div>
        </div>

        <!-- Matching tips -->
        <div class="card glass-card">
          <div class="card-header">
            <h3>Match Recommendations</h3>
          </div>
          <div class="card-body">
            <div class="flex flex-col gap-4">
              <div class="progress-ring-mini flex items-center gap-4">
                <div class="avatar avatar-lg" style="background: var(--brand-50); color: var(--brand-600);">JF</div>
                <div>
                  <h4 style="margin:0;">Profile Strength</h4>
                  <span class="text-sm text-secondary">${currentUser.profileCompletion}% Complete</span>
                </div>
              </div>
              <div class="progress-linear" style="margin-top: var(--space-2);">
                <div class="progress-linear-track">
                  <div class="progress-linear-fill" style="width: ${currentUser.profileCompletion}%;"></div>
                </div>
              </div>
              <p class="text-sm text-secondary" style="line-height:1.5;">
                Adding more certifications or work history helps our match algorithm align your profile to high-paying developer roles.
              </p>
              <hr style="border-color: var(--border-light); margin: var(--space-2) 0;" />
              <a class="btn btn-outline btn-block btn-sm" href="job-matching.html">
                Run Job Matching
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCandidateApplications(container) {
    const apps = JobForestData.getUserApplications(currentUser.id);

    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>My Applications</h2>
        <p class="text-secondary">Track the real-time status of your active and past applications.</p>
      </div>

      <div class="card glass-card reveal">
        <div class="card-body" style="padding:0;">
          ${apps.length === 0
            ? `<div class="text-center p-12 text-tertiary">
                <p style="font-size: var(--text-lg);">No applications found.</p>
                <p class="text-sm mt-1">Start applying to jobs to track them here!</p>
                <a href="../pages/jobs.html" class="btn btn-primary btn-sm mt-6">Browse Jobs</a>
               </div>`
            : `<div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Work Mode</th>
                      <th>Date Applied</th>
                      <th>Status</th>
                      <th>Cover Letter</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${apps.map(app => `
                      <tr>
                        <td>
                          <div style="font-weight: 600;">${app.job?.title || 'Unknown Job'}</div>
                          <div class="text-xs text-tertiary">${app.job?.category}</div>
                        </td>
                        <td>
                          <div class="flex items-center gap-2">
                            <span>${app.company?.logo || '🏢'}</span>
                            <span>${app.company?.name || 'Unknown Company'}</span>
                          </div>
                        </td>
                        <td><span class="tag tag-sm">${app.job?.workMode || 'Remote'}</span></td>
                        <td class="text-sm">${app.appliedDate}</td>
                        <td><span class="status-badge ${app.status}">${app.status}</span></td>
                        <td>
                          <button class="btn btn-ghost btn-xs" onclick="Dashboard.viewCoverLetter('${app.id}')">View Text</button>
                        </td>
                        <td>
                          ${app.status === 'applied' || app.status === 'reviewed' || app.status === 'interview'
                            ? `<button class="btn btn-outline btn-xs text-error" onclick="Dashboard.handleRetractApp('${app.id}')">Retract</button>`
                            : `<span class="text-xs text-tertiary">No actions</span>`
                          }
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
               </div>`
          }
        </div>
      </div>
    `;
  }

  function renderCandidateSavedJobs(container) {
    const saved = JobForestData.getSavedJobs();

    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>Saved Opportunities</h2>
        <p class="text-secondary">Review job listings you've bookmarked to apply later.</p>
      </div>

      ${saved.length === 0
        ? `<div class="card glass-card p-12 text-center text-tertiary reveal">
            <span style="font-size: 3rem; display: block; margin-bottom: var(--space-4);">⭐</span>
            <p>Your saved jobs list is currently empty.</p>
            <a href="../pages/jobs.html" class="btn btn-primary btn-sm mt-6">Search Jobs</a>
           </div>`
        : `<div class="grid grid-cols-3 gap-6 reveal" id="saved-jobs-grid"></div>`
      }
    `;

    const grid = document.getElementById('saved-jobs-grid');
    if (grid) {
      saved.forEach(job => {
        const card = Components.renderJobCard(job, { basePath: '' });
        
        // Append apply button directly into card footer
        const cardFooter = card.querySelector('.job-card-footer');
        const applyBtn = document.createElement('button');
        applyBtn.className = 'btn btn-primary btn-xs';
        applyBtn.textContent = 'Apply Now';
        applyBtn.style.marginLeft = 'auto';
        applyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = `job-detail.html?id=${job.id}`;
        });
        cardFooter.appendChild(applyBtn);

        grid.appendChild(card);
      });
    }
  }

  function renderCandidateSettings(container) {
    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>Account Settings</h2>
        <p class="text-secondary">Manage your contact information and preference profiles.</p>
      </div>

      <div class="card glass-card max-w-xl reveal">
        <div class="card-body">
          <form id="candidate-settings-form">
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" class="form-input" name="firstName" value="${currentUser.firstName}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" class="form-input" name="lastName" value="${currentUser.lastName}" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Professional Title</label>
              <input type="text" class="form-input" name="title" value="${currentUser.title || ''}" placeholder="e.g. Senior Product Designer" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" name="email" value="${currentUser.email}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-input" name="location" value="${currentUser.location || ''}" placeholder="e.g. Los Angeles, CA" />
            </div>
            <div class="form-group">
              <label class="form-label">Short Bio</label>
              <textarea class="form-textarea" name="bio" rows="4" placeholder="Brief statement about your career goals...">${currentUser.bio || ''}</textarea>
            </div>
            
            <button type="submit" class="btn btn-primary mt-4">Save Changes</button>
          </form>
        </div>
      </div>
    `;

    const form = document.getElementById('candidate-settings-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        
        currentUser.firstName = fd.get('firstName');
        currentUser.lastName = fd.get('lastName');
        currentUser.title = fd.get('title');
        currentUser.email = fd.get('email');
        currentUser.location = fd.get('location');
        currentUser.bio = fd.get('bio');
        
        JobForestData.setCurrentUser(currentUser);
        Components.showToast('Profile settings saved successfully!', 'success');
      });
    }
  }

  // ──────────────────────────────────────────────
  // ─── EMPLOYER TAB RENDERERS ───────────────────
  // ──────────────────────────────────────────────

  function renderEmployerOverview(container) {
    const company = JobForestData.getCompanyById(currentUser.companyId) || { id: currentUser.companyId, name: currentUser.companyName || 'My Startup' };
    const myJobs = JobForestData.getEmployerJobs(company.id);
    
    // Find all applications for my jobs
    const jobIds = myJobs.map(j => j.id);
    const allApps = JobForestData.candidateProfiles.flatMap(cand => 
      JobForestData.getUserApplications(cand.id).filter(a => jobIds.includes(a.jobId))
    );
    
    const activePosts = myJobs.filter(j => j.status === 'active').length;
    const interviewCount = allApps.filter(a => a.status === 'interview').length;
    const hireRate = Math.round((allApps.filter(a => a.status === 'offered').length / (allApps.length || 1)) * 100);

    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>Welcome back, ${currentUser.firstName}!</h2>
        <p class="text-secondary">Manage candidate pipelines for <strong>${escapeHTML(company.name)}</strong>.</p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 reveal" role="region" aria-label="Employer statistics">
        ${Components.renderStatCard('posts', activePosts, 'Active Job Posts', '', 'success')}
        ${Components.renderStatCard('candidates', allApps.length, 'Total Candidates', '', 'info')}
        ${Components.renderStatCard('interview', interviewCount, 'Scheduled Interviews', '', 'warning')}
        ${Components.renderStatCard('rate', hireRate, 'Offer Accept Rate', '', 'brand')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 reveal">
        <!-- Funnel visualizer -->
        <div class="card col-span-1 lg:col-span-2 glass-card">
          <div class="card-header">
            <h3>Recruitment Pipeline</h3>
          </div>
          <div class="card-body">
            <div class="funnel-container flex flex-col gap-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Applied</span>
                  <span>${allApps.filter(a => a.status === 'applied').length} Candidates</span>
                </div>
                <div class="bar-progress-container" style="background:var(--border-default); border-radius:4px; height:8px; width:100%;">
                  <div style="background:var(--brand-500); height:100%; border-radius:4px; width:${(allApps.filter(a => a.status === 'applied').length / (allApps.length || 1)) * 100}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Reviewed / Shortlisted</span>
                  <span>${allApps.filter(a => a.status === 'reviewed').length} Candidates</span>
                </div>
                <div class="bar-progress-container" style="background:var(--border-default); border-radius:4px; height:8px; width:100%;">
                  <div style="background:var(--info-500); height:100%; border-radius:4px; width:${(allApps.filter(a => a.status === 'reviewed').length / (allApps.length || 1)) * 100}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Interviews</span>
                  <span>${allApps.filter(a => a.status === 'interview').length} Candidates</span>
                </div>
                <div class="bar-progress-container" style="background:var(--border-default); border-radius:4px; height:8px; width:100%;">
                  <div style="background:var(--warning-500); height:100%; border-radius:4px; width:${(allApps.filter(a => a.status === 'interview').length / (allApps.length || 1)) * 100}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Offered / Hired</span>
                  <span>${allApps.filter(a => a.status === 'offered').length} Hires</span>
                </div>
                <div class="bar-progress-container" style="background:var(--border-default); border-radius:4px; height:8px; width:100%;">
                  <div style="background:var(--success-500); height:100%; border-radius:4px; width:${(allApps.filter(a => a.status === 'offered').length / (allApps.length || 1)) * 100}%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recruiter Tips -->
        <div class="card glass-card">
          <div class="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div class="card-body flex flex-col gap-3">
            <button class="btn btn-primary btn-block" onclick="Dashboard.openPostJobModal()">
              Post a New Job
            </button>
            <button class="btn btn-outline btn-block" onclick="document.querySelector('[data-tab=candidates]').click()">
              Screen Candidates
            </button>
            <hr style="border-color:var(--border-light); margin: var(--space-2) 0;" />
            <p class="text-xs text-tertiary" style="line-height:1.4;">
              Ensure you review candidates within 3 business days to maintain a high response rate index on the JobForest platform.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderEmployerPosts(container) {
    const myJobs = JobForestData.getEmployerJobs(currentUser.companyId);

    container.innerHTML = `
      <div class="dashboard-header flex justify-between items-center reveal">
        <div>
          <h2>Job Posts</h2>
          <p class="text-secondary">Publish and oversee your company's career listings.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="Dashboard.openPostJobModal()">Post New Job</button>
      </div>

      <div class="card glass-card reveal">
        <div class="card-body" style="padding:0;">
          ${myJobs.length === 0
            ? `<div class="text-center p-12 text-tertiary">
                <p>No jobs posted yet. Create your first opening to attract candidates!</p>
                <button class="btn btn-primary btn-sm mt-4" onclick="Dashboard.openPostJobModal()">Post First Job</button>
               </div>`
            : `<div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Type / Work Mode</th>
                      <th>Location</th>
                      <th>Salary Range</th>
                      <th>Applicants</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${myJobs.map(job => {
                      // Fetch applicants count for this specific job
                      const applicantsCount = JobForestData.candidateProfiles.flatMap(cand => 
                        JobForestData.getUserApplications(cand.id).filter(a => a.jobId === job.id)
                      ).length;

                      return `
                        <tr>
                          <td><strong>${job.title}</strong></td>
                          <td>
                            <span class="tag tag-sm tag-primary">${job.type}</span>
                            <span class="tag tag-sm tag-info">${job.workMode}</span>
                          </td>
                          <td>📍 ${job.location}</td>
                          <td>${JobForestData.formatSalary(job.salary.min, job.salary.max)}</td>
                          <td>
                            <a href="#candidates" class="text-primary font-semibold" onclick="Dashboard.viewApplicantsForJob('${job.id}')">
                              👥 ${applicantsCount} applicants
                            </a>
                          </td>
                          <td>
                            <label class="toggle-switch ${job.status === 'active' ? 'active' : ''}" onclick="Dashboard.toggleJobStatus('${job.id}')">
                              <div class="toggle-track"></div>
                            </label>
                            <span style="font-size: var(--text-xs); margin-left:4px; vertical-align: middle;">
                              ${job.status === 'active' ? 'Active' : 'Closed'}
                            </span>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
               </div>`
          }
        </div>
      </div>
    `;
  }

  function renderEmployerCandidates(container, filterJobId = 'all') {
    const myJobs = JobForestData.getEmployerJobs(currentUser.companyId);
    const jobIds = myJobs.map(j => j.id);
    
    // Aggregate applicants
    let allCandidates = [];
    JobForestData.candidateProfiles.forEach(cand => {
      const apps = JobForestData.getUserApplications(cand.id).filter(a => jobIds.includes(a.jobId));
      apps.forEach(app => {
        allCandidates.push({
          candidate: cand,
          application: app,
          job: app.job
        });
      });
    });

    if (filterJobId !== 'all') {
      allCandidates = allCandidates.filter(c => c.job.id === filterJobId);
    }

    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>Candidates Screening</h2>
        <p class="text-secondary">Evaluate applicants, assess skills fit, and manage schedules.</p>
      </div>

      <div class="flex gap-4 mb-6 reveal">
        <div class="form-group" style="margin: 0; min-width: 250px;">
          <select class="form-input" id="candidate-job-filter" onchange="Dashboard.filterCandidatesByJob(this.value)">
            <option value="all" ${filterJobId === 'all' ? 'selected' : ''}>All Active Openings</option>
            ${myJobs.map(j => `<option value="${j.id}" ${filterJobId === j.id ? 'selected' : ''}>${j.title}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 reveal">
        ${allCandidates.length === 0
          ? `<div class="col-span-2 card glass-card p-12 text-center text-tertiary">
              <p>No candidates found for the selected criteria.</p>
             </div>`
          : allCandidates.map(item => {
              const matchScore = typeof Matching !== 'undefined' ? Matching.calculateScore(item.candidate, item.job) : 75;
              
              return `
                <div class="card glass-card">
                  <div class="card-body">
                    <div class="flex justify-between items-start mb-4">
                      <div class="flex gap-3">
                        <div class="avatar avatar-xl">${item.candidate.avatar || item.candidate.firstName[0]}</div>
                        <div>
                          <h3 style="margin:0; font-size:var(--text-lg);">${item.candidate.firstName} ${item.candidate.lastName}</h3>
                          <p class="text-xs text-tertiary">Applied for: <span class="text-primary font-semibold">${item.job.title}</span></p>
                          <p class="text-xs text-secondary mt-1">📍 ${item.candidate.location || 'Unknown'}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-xl font-bold ${matchScore >= 80 ? 'text-success' : 'text-warning'}" style="line-height:1;">
                          ${Math.round(matchScore)}%
                        </div>
                        <span class="text-xs text-tertiary">Match Fit</span>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h4 class="text-xs text-tertiary uppercase font-semibold mb-2">Top Skills</h4>
                      <div class="flex flex-wrap gap-1">
                        ${item.candidate.skills.slice(0, 5).map(s => `<span class="tag tag-sm tag-primary">${s}</span>`).join('')}
                        ${item.candidate.skills.length > 5 ? `<span class="tag tag-sm">+${item.candidate.skills.length - 5} more</span>` : ''}
                      </div>
                    </div>

                    <div class="flex justify-between items-center pt-3 border-t border-light">
                      <div>
                        <span class="status-badge ${item.application.status}">${item.application.status}</span>
                      </div>
                      <div class="flex gap-2">
                        <button class="btn btn-outline btn-xs" onclick="Dashboard.viewResumeModal('${item.candidate.id}')">Resume</button>
                        ${item.application.status === 'applied' 
                          ? `<button class="btn btn-secondary btn-xs" onclick="Dashboard.changeCandidateStage('${item.application.id}', 'reviewed')">Shortlist</button>`
                          : ''
                        }
                        ${item.application.status === 'reviewed' || item.application.status === 'applied'
                          ? `<button class="btn btn-primary btn-xs" onclick="Dashboard.changeCandidateStage('${item.application.id}', 'interview')">Schedule</button>`
                          : ''
                        }
                        ${item.application.status === 'interview'
                          ? `<button class="btn btn-primary btn-xs" style="background:var(--color-success); border-color:var(--color-success);" onclick="Dashboard.changeCandidateStage('${item.application.id}', 'offered')">Offer</button>`
                          : ''
                        }
                        ${item.application.status !== 'rejected' && item.application.status !== 'offered'
                          ? `<button class="btn btn-ghost btn-xs text-error" onclick="Dashboard.changeCandidateStage('${item.application.id}', 'rejected')">Reject</button>`
                          : ''
                        }
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')
        }
      </div>
    `;
  }

  function renderEmployerCompany(container) {
    const company = JobForestData.getCompanyById(currentUser.companyId) || {
      id: currentUser.companyId,
      name: currentUser.companyName || 'My Startup',
      logo: '🚀',
      industry: currentUser.industry || 'Technology',
      size: '1-10',
      location: 'San Francisco, CA',
      description: '',
      culture: '',
      founded: 2026,
      website: ''
    };

    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>Company Profile</h2>
        <p class="text-secondary">Update company branding, culture notes, and public listings details.</p>
      </div>

      <div class="card glass-card max-w-xl reveal">
        <div class="card-body">
          <form id="employer-company-form">
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-input" name="name" value="${company.name}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Logo Emoji</label>
                <input type="text" class="form-input" name="logo" value="${company.logo || '🏢'}" required />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Industry</label>
                <input type="text" class="form-input" name="industry" value="${company.industry || ''}" placeholder="e.g. Cleantech" />
              </div>
              <div class="form-group">
                <label class="form-label">Company Size</label>
                <input type="text" class="form-input" name="size" value="${company.size || '50-100'}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Location Headquarters</label>
              <input type="text" class="form-input" name="location" value="${company.location || ''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Website Domain</label>
              <input type="text" class="form-input" name="website" value="${company.website || ''}" placeholder="e.g. technova.io" />
            </div>
            <div class="form-group">
              <label class="form-label">Overview Description</label>
              <textarea class="form-textarea" name="description" rows="3" placeholder="Tell candidates what your business accomplishes...">${company.description || ''}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Work Culture & Benefits</label>
              <textarea class="form-textarea" name="culture" rows="3" placeholder="Remote-first, flat organization structure...">${company.culture || ''}</textarea>
            </div>

            <button type="submit" class="btn btn-primary mt-4">Save Company Profile</button>
          </form>
        </div>
      </div>
    `;

    const form = document.getElementById('employer-company-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);

        company.name = fd.get('name');
        company.logo = fd.get('logo');
        company.industry = fd.get('industry');
        company.size = fd.get('size');
        company.location = fd.get('location');
        company.website = fd.get('website');
        company.description = fd.get('description');
        company.culture = fd.get('culture');

        JobForestData.saveCompany(company);
        
        // Propagate company name back to current user record
        currentUser.companyName = company.name;
        JobForestData.setCurrentUser(currentUser);

        Components.showToast('Company profile updated successfully!', 'success');
      });
    }
  }

  // ──────────────────────────────────────────────
  // ─── SHARED MESSAGING CONTROLLER ──────────────
  // ──────────────────────────────────────────────

  function renderMessagesTab(container) {
    const messages = JobForestData.getMessages(currentUser.id);

    container.innerHTML = `
      <div class="dashboard-header reveal">
        <h2>Inbox Messaging</h2>
        <p class="text-secondary">Communicate directly with hiring panels and candidates.</p>
      </div>

      <div class="card glass-card reveal" style="padding:0; overflow:hidden;">
        <div class="grid grid-cols-3" style="min-height: 500px;">
          <!-- Contacts / Messages list -->
          <div style="border-right: 1px solid var(--border-light); background: rgba(0,0,0,0.05);">
            <div style="padding: var(--space-4); border-bottom: 1px solid var(--border-light); font-weight:600;">Conversations</div>
            <div id="contacts-list" class="flex flex-col overflow-y-auto" style="max-height: 450px;">
              ${messages.length === 0
                ? `<div class="text-center p-8 text-tertiary">No messages yet.</div>`
                : messages.map(msg => `
                    <div class="chat-contact-item ${activeMessageId === msg.id ? 'active' : ''} ${!msg.read ? 'unread' : ''}" 
                         style="padding: var(--space-4); border-bottom:1px solid var(--border-light); cursor:pointer;"
                         onclick="Dashboard.selectMessage('${msg.id}')">
                      <div class="flex justify-between items-start mb-1">
                        <div class="flex items-center gap-2">
                          <span class="avatar avatar-sm">${msg.fromAvatar || msg.fromName[0]}</span>
                          <span style="font-weight:600; font-size:var(--text-sm);">${msg.fromName}</span>
                        </div>
                        <span class="text-xs text-tertiary">${JobForestData.timeAgo(msg.date)}</span>
                      </div>
                      <div class="text-sm font-semibold text-secondary truncate" style="max-width:180px;">${msg.subject}</div>
                      <div class="text-xs text-tertiary truncate" style="max-width:180px;">${msg.preview}</div>
                    </div>
                  `).join('')
              }
            </div>
          </div>

          <!-- Chat Window -->
          <div class="col-span-2 flex flex-col" id="active-chat-window">
            <div class="flex items-center justify-center text-tertiary" style="flex: 1; min-height: 350px;">
              Select a conversation from the left to read.
            </div>
          </div>
        </div>
      </div>
    `;

    // If there was a previously focused active chat, reload it
    if (activeMessageId) {
      selectMessage(activeMessageId);
    }
  }

  function selectMessage(id) {
    activeMessageId = id;
    const messages = JobForestData.getMessages(currentUser.id);
    const msg = messages.find(m => m.id === id);
    if (!msg) return;

    // Mark as read
    msg.read = true;
    localStorage.setItem('jf_messages', JSON.stringify(JobForestData.getMessages(currentUser.id)));

    // Re-render contacts list highlight state
    const contactsList = document.getElementById('contacts-list');
    if (contactsList) {
      // Small redraw of contact classes without rebuilding details
      document.querySelectorAll('.chat-contact-item').forEach(el => {
        el.classList.remove('active');
        if (el.innerHTML.includes(msg.subject)) el.classList.add('active');
      });
    }

    const chatWindow = document.getElementById('active-chat-window');
    if (!chatWindow) return;

    chatWindow.innerHTML = `
      <!-- Chat header -->
      <div style="padding: var(--space-4); border-bottom: 1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0; font-size:var(--text-md);">${msg.subject}</h3>
          <span class="text-xs text-secondary">From: <strong>${msg.fromName}</strong></span>
        </div>
        <span class="text-xs text-tertiary">${msg.date}</span>
      </div>

      <!-- Chat messages list -->
      <div id="chat-messages-container" class="flex flex-col gap-4 overflow-y-auto" style="flex: 1; padding: var(--space-4); background: rgba(0,0,0,0.02); max-height:300px;">
        <div class="chat-bubble received" style="align-self: flex-start; max-width:80%; background:var(--border-default); padding: var(--space-3); border-radius: 12px 12px 12px 0px; font-size:var(--text-sm); line-height:1.5;">
          ${msg.body.replace(/\n/g, '<br/>')}
        </div>
      </div>

      <!-- Chat Input -->
      <div style="padding: var(--space-3); border-top: 1px solid var(--border-light); display:flex; gap: var(--space-2); align-items:center;">
        <input type="text" class="form-input" style="margin:0;" placeholder="Type a reply..." id="chat-reply-input" />
        <button class="btn btn-primary btn-sm" id="chat-send-btn" onclick="Dashboard.sendChatReply('${msg.id}')">Send</button>
      </div>
    `;
  }

  function sendChatReply(msgId) {
    const input = document.getElementById('chat-reply-input');
    if (!input || !input.value.trim()) return;

    const replyText = input.value.trim();
    const container = document.getElementById('chat-messages-container');

    // Add UI bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble sent';
    userBubble.style.alignSelf = 'flex-end';
    userBubble.style.maxWidth = '80%';
    userBubble.style.background = 'var(--color-primary)';
    userBubble.style.color = '#fff';
    userBubble.style.padding = 'var(--space-3)';
    userBubble.style.borderRadius = '12px 12px 0px 12px';
    userBubble.style.fontSize = 'var(--text-sm)';
    userBubble.style.lineHeight = '1.5';
    userBubble.innerHTML = replyText.replace(/\n/g, '<br/>');

    container.appendChild(userBubble);
    container.scrollTop = container.scrollHeight;

    input.value = '';

    // Simulate auto response after 2 seconds
    setTimeout(() => {
      if (document.getElementById('chat-messages-container')) {
        const responseBubble = document.createElement('div');
        responseBubble.className = 'chat-bubble received';
        responseBubble.style.alignSelf = 'flex-start';
        responseBubble.style.maxWidth = '80%';
        responseBubble.style.background = 'var(--border-default)';
        responseBubble.style.padding = 'var(--space-3)';
        responseBubble.style.borderRadius = '12px 12px 12px 0px';
        responseBubble.style.fontSize = 'var(--text-sm)';
        responseBubble.style.lineHeight = '1.5';
        responseBubble.innerHTML = "Thanks for the response! Our recruiting coordinator will sync with you shortly regarding scheduling. 🌲";

        container.appendChild(responseBubble);
        container.scrollTop = container.scrollHeight;
        
        Components.showToast("New message received", "info");
      }
    }, 1500);
  }

  // ──────────────────────────────────────────────
  // ─── ACTION HANDLERS & MODALS ─────────────────
  // ──────────────────────────────────────────────

  function handleRetractApp(appId) {
    Components.confirm("Are you sure you want to retract this application? This action cannot be undone.", () => {
      const success = JobForestData.retractApplication(appId);
      if (success) {
        Components.showToast('Application retracted successfully', 'success');
        renderActiveTab();
      } else {
        Components.showToast('Failed to retract application', 'error');
      }
    });
  }

  function viewCoverLetter(appId) {
    const apps = JobForestData.getUserApplications(currentUser.id);
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    Components.showModal(
      'Cover Letter Details',
      `<p style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-secondary); white-space: pre-wrap;">${app.coverLetter || 'No cover letter provided.'}</p>`,
      `<button class="btn btn-primary btn-sm" onclick="Components.closeModal()">Close</button>`
    );
  }

  function viewResumeModal(candidateId) {
    const candidate = JobForestData.getCandidateById(candidateId);
    if (!candidate) return;

    // Simulate profile resume renderer
    const body = `
      <div style="border:1px solid var(--border-light); padding:var(--space-6); border-radius:8px; background: rgba(0,0,0,0.02); max-height:400px; overflow-y:auto;">
        <h2 style="font-size: var(--text-xl); margin-bottom: 2px;">${candidate.firstName} ${candidate.lastName}</h2>
        <p style="color:var(--color-primary); font-weight:500; font-size:var(--text-sm);">${candidate.title}</p>
        <p style="font-size: var(--text-xs); color: var(--text-tertiary);">${candidate.email} • 📍 ${candidate.location}</p>
        
        <h4 style="margin:var(--space-4) 0 var(--space-2); border-bottom:1px solid var(--border-light); padding-bottom:4px;">Skills</h4>
        <div style="display:flex; flex-wrap:wrap; gap:4px;">
          ${candidate.skills.map(s => `<span class="tag tag-sm tag-primary">${s}</span>`).join('')}
        </div>

        <h4 style="margin:var(--space-4) 0 var(--space-2); border-bottom:1px solid var(--border-light); padding-bottom:4px;">Experience</h4>
        ${candidate.experience.map(exp => `
          <div style="margin-bottom:var(--space-3);">
            <div style="display:flex; justify-content:space-between; font-size:var(--text-sm);">
              <strong>${exp.title}</strong>
              <span class="text-tertiary">${exp.startDate} - ${exp.endDate}</span>
            </div>
            <div class="text-xs text-secondary">${exp.company} • ${exp.location}</div>
            <p class="text-xs text-secondary mt-1">${exp.description}</p>
          </div>
        `).join('')}

        <h4 style="margin:var(--space-4) 0 var(--space-2); border-bottom:1px solid var(--border-light); padding-bottom:4px;">Education</h4>
        ${candidate.education.map(edu => `
          <div style="font-size:var(--text-sm);">
            <strong>${edu.degree}</strong>
            <div class="text-xs text-tertiary">${edu.institution} • Class of ${edu.year}</div>
          </div>
        `).join('')}
      </div>
    `;

    Components.showModal(
      `${candidate.firstName}'s Resume`,
      body,
      `<button class="btn btn-primary btn-sm" onclick="Components.closeModal()">Close Preview</button>`
    );
  }

  function changeCandidateStage(appId, newStatus) {
    const success = JobForestData.updateApplicationStatus(appId, newStatus);
    if (success) {
      Components.showToast(`Candidate marked as: ${newStatus}`, 'success');
      renderActiveTab();
    } else {
      Components.showToast('Could not update application status', 'error');
    }
  }

  function filterCandidatesByJob(jobId) {
    const contentPane = document.getElementById('employer-main-content');
    if (contentPane) {
      renderEmployerCandidates(contentPane, jobId);
    }
  }

  function viewApplicantsForJob(jobId) {
    activeTab = 'candidates';
    const sidebarItems = document.querySelectorAll('.sidebar-nav-item');
    sidebarItems.forEach(i => {
      i.classList.remove('active');
      if (i.getAttribute('data-tab') === 'candidates') i.classList.add('active');
    });

    const contentPane = document.getElementById('employer-main-content');
    if (contentPane) {
      renderEmployerCandidates(contentPane, jobId);
    }
  }

  function toggleJobStatus(jobId) {
    const jobs = JobForestData.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      job.status = job.status === 'active' ? 'closed' : 'active';
      localStorage.setItem('jf_jobs', JSON.stringify(jobs));
      Components.showToast(`Job opening is now ${job.status}`, 'info');
      renderActiveTab();
    }
  }

  // ─── POST JOB MODAL ───────────────────────────
  function openPostJobModal() {
    const categories = Object.keys(JobForestData.getSkillCategories());
    
    const bodyHTML = `
      <form id="post-job-form" style="display:flex; flex-col; gap:var(--space-3); max-height:420px; overflow-y:auto; padding-right:8px;">
        <div class="form-group">
          <label class="form-label">Job Title<span class="required">*</span></label>
          <input type="text" class="form-input" name="title" placeholder="e.g. Lead React Architect" required />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">Category / Area<span class="required">*</span></label>
            <select class="form-input" name="category" required>
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Job Type<span class="required">*</span></label>
            <select class="form-input" name="type" required>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">Work Mode<span class="required">*</span></label>
            <select class="form-input" name="workMode" required>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Location<span class="required">*</span></label>
            <input type="text" class="form-input" name="location" placeholder="e.g. Seattle, WA" required />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">Min Salary (Annual $)</label>
            <input type="number" class="form-input" name="salaryMin" value="80000" />
          </div>
          <div class="form-group">
            <label class="form-label">Max Salary (Annual $)</label>
            <input type="number" class="form-input" name="salaryMax" value="120000" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Experience Tier<span class="required">*</span></label>
          <select class="form-input" name="experience" required>
            <option value="Entry">Entry (1-2 years)</option>
            <option value="Mid">Mid (3-5 years)</option>
            <option value="Senior">Senior (5+ years)</option>
            <option value="Executive">Executive (8+ years)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Job Description<span class="required">*</span></label>
          <textarea class="form-textarea" name="description" rows="3" placeholder="Outline the primary purpose of this opening..." required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Requirements (One per line)<span class="required">*</span></label>
          <textarea class="form-textarea" name="requirements" rows="3" placeholder="3+ years of React&#10;Degree in CS&#10;Excellent documentation skills" required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Target Skills Tag (Comma separated)<span class="required">*</span></label>
          <input type="text" class="form-input" name="skills" placeholder="React, TypeScript, CSS, Git" required />
        </div>
      </form>
    `;

    const footerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="Components.closeModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" id="submit-post-job-btn">Publish Opening</button>
    `;

    Components.showModal('Post a New Job Opening', bodyHTML, footerHTML);

    const submitBtn = document.getElementById('submit-post-job-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const formEl = document.getElementById('post-job-form');
        if (!formEl.checkValidity()) {
          formEl.reportValidity();
          return;
        }

        const fd = new FormData(formEl);
        const skillArray = fd.get('skills').split(',').map(s => s.trim()).filter(Boolean);
        const reqArray = fd.get('requirements').split('\n').map(r => r.trim()).filter(Boolean);

        const newJob = {
          id: 'j' + (JobForestData.getJobs().length + 1),
          companyId: currentUser.companyId,
          title: fd.get('title'),
          category: fd.get('category'),
          type: fd.get('type'),
          workMode: fd.get('workMode'),
          location: fd.get('location'),
          salary: {
            min: parseInt(fd.get('salaryMin')) || 60000,
            max: parseInt(fd.get('salaryMax')) || 90000
          },
          experience: fd.get('experience'),
          description: fd.get('description'),
          requirements: reqArray,
          responsibilities: ['Contribute to team deliverables', 'Follow security guidelines', 'Participate in engineering reviews'],
          benefits: ['Health Insurance', 'Flexible Hours', 'Stock Options'],
          skills: skillArray,
          posted: new Date().toISOString().split('T')[0],
          applicants: 0,
          status: 'active'
        };

        JobForestData.saveJob(newJob);
        Components.closeModal();
        Components.showToast('Job listing published successfully!', 'success');
        
        renderActiveTab();
      });
    }
  }

  // Public API
  return {
    init,
    handleRetractApp,
    viewCoverLetter,
    viewResumeModal,
    changeCandidateStage,
    filterCandidatesByJob,
    viewApplicantsForJob,
    toggleJobStatus,
    openPostJobModal,
    selectMessage,
    sendChatReply
  };
})();
