// ============================================
// JOBFOREST — SEARCH & FILTER MODULE
// Job search, filters, and results rendering
// ============================================

const Search = (() => {

  let currentFilters = {
    keyword: '',
    type: [],
    workMode: [],
    experience: [],
    category: [],
    salaryMin: 0,
    salaryMax: 200000,
    location: '',
    sort: 'newest'
  };

  // ─── INIT SEARCH PAGE ────────────────────────
  function init() {
    // Load keyword from URL if present
    const params = App.getUrlParams();
    if (params.q) {
      currentFilters.keyword = params.q;
      const keywordInput = document.getElementById('search-keyword');
      if (keywordInput) keywordInput.value = params.q;
    }

    bindFilterEvents();
    renderResults();
  }

  // ─── BIND FILTER EVENTS ──────────────────────
  function bindFilterEvents() {
    // Keyword search
    const keywordInput = document.getElementById('search-keyword');
    if (keywordInput) {
      let debounceTimer;
      keywordInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          currentFilters.keyword = keywordInput.value.trim();
          renderResults();
        }, 300);
      });
    }

    // Location search
    const locationInput = document.getElementById('search-location');
    if (locationInput) {
      let debounceTimer;
      locationInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          currentFilters.location = locationInput.value.trim();
          renderResults();
        }, 300);
      });
    }

    // Checkbox filters
    document.querySelectorAll('[data-filter-type]').forEach(cb => {
      cb.addEventListener('change', () => {
        const filterKey = cb.getAttribute('data-filter-type');
        const value = cb.value;
        if (cb.checked) {
          if (!currentFilters[filterKey].includes(value)) {
            currentFilters[filterKey].push(value);
          }
        } else {
          currentFilters[filterKey] = currentFilters[filterKey].filter(v => v !== value);
        }
        renderResults();
      });
    });

    // Salary range
    const salarySlider = document.getElementById('salary-range');
    const salaryDisplay = document.getElementById('salary-display');
    if (salarySlider) {
      salarySlider.addEventListener('input', () => {
        const value = parseInt(salarySlider.value);
        currentFilters.salaryMin = value;
        if (salaryDisplay) {
          salaryDisplay.textContent = `$${(value / 1000).toFixed(0)}K+`;
        }
        renderResults();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentFilters.sort = sortSelect.value;
        renderResults();
      });
    }

    // Clear filters
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearFilters);
    }
  }

  // ─── CLEAR FILTERS ───────────────────────────
  function clearFilters() {
    currentFilters = {
      keyword: '',
      type: [],
      workMode: [],
      experience: [],
      category: [],
      salaryMin: 0,
      salaryMax: 200000,
      location: '',
      sort: 'newest'
    };

    // Reset UI
    document.querySelectorAll('[data-filter-type]').forEach(cb => cb.checked = false);
    const keywordInput = document.getElementById('search-keyword');
    if (keywordInput) keywordInput.value = '';
    const locationInput = document.getElementById('search-location');
    if (locationInput) locationInput.value = '';
    const salarySlider = document.getElementById('salary-range');
    if (salarySlider) salarySlider.value = 0;
    const salaryDisplay = document.getElementById('salary-display');
    if (salaryDisplay) salaryDisplay.textContent = '$0K+';
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'newest';

    renderResults();
    Components.showToast('Filters cleared', 'info');
  }

  // ─── RENDER RESULTS ──────────────────────────
  function renderResults() {
    const resultsContainer = document.getElementById('jobs-results');
    const countEl = document.getElementById('results-count');
    if (!resultsContainer) return;

    const jobs = JobForestData.getJobs(currentFilters);

    // Update count
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${jobs.length}</strong> jobs${currentFilters.keyword ? ` for "${currentFilters.keyword}"` : ''}`;
    }

    // Clear and render
    resultsContainer.innerHTML = '';

    if (jobs.length === 0) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">No jobs found</h3>
          <p class="empty-state-text">Try adjusting your filters or search terms to find more opportunities.</p>
          <button class="btn btn-secondary" onclick="Search.clearFilters()">Clear All Filters</button>
        </div>
      `;
      return;
    }

    jobs.forEach((job, index) => {
      const card = Components.renderJobCard(job, { basePath: '' });
      card.style.animationDelay = `${index * 0.05}s`;
      card.classList.add('animate-fade-in-up');
      resultsContainer.appendChild(card);
    });
  }

  // ─── HERO SEARCH (Landing Page) ───────────────
  function initHeroSearch() {
    const heroKeyword = document.getElementById('hero-keyword');
    const heroLocation = document.getElementById('hero-location');
    const heroSearchBtn = document.getElementById('hero-search-btn');

    if (heroSearchBtn) {
      heroSearchBtn.addEventListener('click', () => {
        const keyword = heroKeyword?.value.trim() || '';
        const location = heroLocation?.value.trim() || '';
        let url = 'pages/jobs.html';
        const params = new URLSearchParams();
        if (keyword) params.set('q', keyword);
        if (location) params.set('loc', location);
        if (params.toString()) url += '?' + params.toString();
        window.location.href = url;
      });
    }

    // Enter key support
    [heroKeyword, heroLocation].forEach(input => {
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            heroSearchBtn?.click();
          }
        });
      }
    });
  }

  return {
    init,
    clearFilters,
    renderResults,
    initHeroSearch
  };
})();
