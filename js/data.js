/* JOBFOREST DATA MODULE
   Central data store and CRUD layer for JobForest.
   All persistent data flows through this module.
   
   PATTERN: Module IIFE — private state, public API returned.
   STORAGE: localStorage — keys prefixed with "jf_"
   
   HOW TO USE:
     JobForestData.getJobs()           → all jobs (filterable)
     JobForestData.getCurrentUser()    → logged-in user object
     JobForestData.saveApplication()   → persist a new application
   ============================================================ */

/** @module JobForestData */
const JobForestData = (() => {

  /* ── STORAGE KEY CONSTANTS ─────────────────────────────────
   * All localStorage keys in one place.
   * Change a key here → changes everywhere. Never hardcode "jf_jobs" elsewhere.
   */
  const KEYS = {
    THEME:       'jf_theme',
    USER:        'jf_currentUser',
    JOBS:        'jf_jobs',
    COMPANIES:   'jf_companies',
    CANDIDATES:  'jf_candidateProfiles',
    EMPLOYERS:   'jf_employerProfiles',
    APPLICATIONS:'jf_applications',
    SAVED_JOBS:  'jf_savedJobs',
    MESSAGES:    'jf_messages',
  };

  /* ── HELPERS ───────────────────────────────────────────────
   * Small utilities used internally. Prefixed with _ = private.
   */

  /**
   * Safely parse JSON from localStorage.
   * Returns fallback if the key is missing or JSON is invalid.
   * @param {string} key - localStorage key
   * @param {*} fallback - value returned on failure
   * @returns {*}
   */
  function _load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn(`[JobForestData] Failed to parse "${key}":`, err);
      return fallback;
    }
  }

  /**
   * Serialize data to JSON and save to localStorage.
   * @param {string} key - localStorage key
   * @param {*} data - value to save
   * @returns {void}
   */
  function _save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`[JobForestData] Failed to save "${key}":`, err);
    }
  }

  /**
   * Generate a unique ID string.
   * @param {string} prefix - e.g. "j", "u", "a"
   * @returns {string} e.g. "j_1718012345_3fg2"
   */
  function _uid(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  }

  /* ── SEED DATA ─────────────────────────────────────────────
   * Default data loaded when localStorage is empty (first run).
   * Edit these objects to change the default demo content.
   */

  /** @type {Company[]} */
  const _seedCompanies = [
    {
      id: 'c1', name: 'TechNova Solutions', logo: '🚀',
      industry: 'Technology', size: '500-1000',
      location: 'San Francisco, CA',
      description: 'Building the next generation of cloud-native applications for enterprise teams worldwide.',
      culture: 'Innovation-driven, remote-first, flat hierarchy with quarterly hackathons.',
      founded: 2018, website: 'technova.io',
    },
    {
      id: 'c2', name: 'GreenLeaf Health', logo: '🌿',
      industry: 'Healthcare', size: '1000-5000',
      location: 'Boston, MA',
      description: 'Revolutionizing digital health with AI-powered diagnostic tools and telemedicine platforms.',
      culture: 'Patient-first, research-backed, inclusive workplace with wellness programs.',
      founded: 2015, website: 'greenleafhealth.com',
    },
    {
      id: 'c3', name: 'QuantumEdge Finance', logo: '💎',
      industry: 'Finance', size: '200-500',
      location: 'New York, NY',
      description: 'Fintech startup disrupting traditional banking with blockchain-based payment solutions.',
      culture: 'Fast-paced, data-driven, competitive compensation with equity packages.',
      founded: 2020, website: 'quantumedge.co',
    },
    {
      id: 'c4', name: 'Aurora Creative', logo: '🎨',
      industry: 'Design & Media', size: '50-200',
      location: 'Austin, TX',
      description: 'Award-winning creative agency specializing in brand identity, UX design, and digital marketing.',
      culture: 'Creative freedom, flexible hours, studio-style office with monthly art exhibitions.',
      founded: 2019, website: 'auroracreative.design',
    },
    {
      id: 'c5', name: 'DataStream Analytics', logo: '📊',
      industry: 'Data & Analytics', size: '100-500',
      location: 'Seattle, WA',
      description: 'Enterprise data analytics platform helping Fortune 500 companies make data-driven decisions.',
      culture: 'Intellectual curiosity, continuous learning, generous conference budget.',
      founded: 2017, website: 'datastream.ai',
    },
    {
      id: 'c6', name: 'EcoVolt Energy', logo: '⚡',
      industry: 'Clean Energy', size: '200-500',
      location: 'Denver, CO',
      description: 'Sustainable energy solutions company focused on solar and wind power infrastructure.',
      culture: 'Mission-driven, sustainability-focused, outdoor team activities.',
      founded: 2016, website: 'ecovolt.energy',
    },
  ];

  /** @type {Job[]} */
  const _seedJobs = [
    {
      id: 'j1', companyId: 'c1',
      title: 'Senior Frontend Developer', type: 'Full-time',
      location: 'San Francisco, CA', workMode: 'Hybrid',
      salary: { min: 120000, max: 160000 },
      experience: 'Senior', category: 'Engineering',
      description: 'Lead frontend architecture for our enterprise SaaS platform. Work with a team of 8 engineers building product used by 200K+ users globally.',
      requirements: [
        '5+ years of frontend development experience',
        'Expert in React.js with TypeScript',
        'Experience with state management (Redux, Zustand, or Jotai)',
        'Strong CSS skills and design system experience',
        'Familiarity with CI/CD pipelines and testing frameworks',
      ],
      responsibilities: [
        'Lead frontend architecture decisions and code reviews',
        'Build performant, accessible web applications',
        'Mentor and grow junior team members',
        'Collaborate with designers on accessibility and UX quality',
      ],
      benefits: ['Health Insurance', 'Remote Work', 'Stock Options', '401k Match', 'Learning Budget'],
      skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Testing', 'Git'],
      posted: '2026-06-08', applicants: 24, status: 'active',
    },
    {
      id: 'j2', companyId: 'c2',
      title: 'Data Scientist — Healthcare AI', type: 'Full-time',
      location: 'Boston, MA', workMode: 'Remote',
      salary: { min: 130000, max: 170000 },
      experience: 'Mid', category: 'Data Science',
      description: 'Develop ML models that improve patient outcomes. Work with large medical datasets and collaborate with clinical researchers.',
      requirements: [
        '3+ years in data science or machine learning',
        'Strong Python with ML libraries (scikit-learn, TensorFlow, PyTorch)',
        'Healthcare data experience preferred (EHR, FHIR)',
        'Masters or PhD in CS, Statistics, or related field',
      ],
      responsibilities: [
        'Develop and deploy ML models for clinical decision support',
        'Analyse large-scale healthcare datasets',
        'Present findings to clinical and executive stakeholders',
      ],
      benefits: ['Health Insurance', 'Remote Work', 'Research Budget', 'Conference Travel'],
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'NLP', 'Statistics'],
      posted: '2026-06-07', applicants: 18, status: 'active',
    },
    {
      id: 'j3', companyId: 'c3',
      title: 'Blockchain Developer', type: 'Full-time',
      location: 'New York, NY', workMode: 'Onsite',
      salary: { min: 140000, max: 190000 },
      experience: 'Senior', category: 'Engineering',
      description: 'Design and implement smart contracts and DeFi protocols for our next-generation payment infrastructure.',
      requirements: [
        '4+ years blockchain development experience',
        'Proficient in Solidity and smart contract development',
        'Deep knowledge of Ethereum and EVM-compatible chains',
        'Security audit experience preferred',
      ],
      responsibilities: [
        'Design and implement smart contracts',
        'Conduct security audits and vulnerability assessments',
        'Integrate blockchain solutions with traditional banking APIs',
      ],
      benefits: ['Competitive Salary', 'Crypto Bonus', 'Equity', 'Unlimited PTO'],
      skills: ['Solidity', 'Ethereum', 'Web3.js', 'JavaScript', 'Smart Contracts', 'Security'],
      posted: '2026-06-09', applicants: 12, status: 'active',
    },
    {
      id: 'j4', companyId: 'c4',
      title: 'UX/UI Designer', type: 'Full-time',
      location: 'Austin, TX', workMode: 'Hybrid',
      salary: { min: 85000, max: 120000 },
      experience: 'Mid', category: 'Design',
      description: 'Own the design process from research to final deliverables across mobile apps and enterprise dashboards.',
      requirements: [
        '3+ years UX/UI design experience',
        'Proficient in Figma',
        'Strong portfolio demonstrating user-centered design',
        'Experience with design systems and WCAG accessibility',
      ],
      responsibilities: [
        'Conduct user research and usability testing',
        'Create wireframes, prototypes, and high-fidelity designs',
        'Build and maintain client design systems',
      ],
      benefits: ['Health Insurance', 'Creative Freedom', 'Conference Budget', 'Flexible Hours'],
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite'],
      posted: '2026-06-06', applicants: 31, status: 'active',
    },
    {
      id: 'j5', companyId: 'c5',
      title: 'Full Stack Engineer', type: 'Full-time',
      location: 'Seattle, WA', workMode: 'Remote',
      salary: { min: 110000, max: 150000 },
      experience: 'Mid', category: 'Engineering',
      description: 'Build scalable data visualisation tools and real-time analytics dashboards across the full stack.',
      requirements: [
        '3–5 years full-stack development',
        'Proficient in React and Node.js or Python',
        'Experience with PostgreSQL and Redis',
        'Knowledge of data visualisation libraries (D3.js, Chart.js)',
      ],
      responsibilities: [
        'Develop full-stack features for our analytics platform',
        'Build interactive data visualisation components',
        'Design and implement RESTful APIs',
      ],
      benefits: ['Remote Work', 'Health Insurance', 'Learning Stipend', '401k'],
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'D3.js'],
      posted: '2026-06-05', applicants: 42, status: 'active',
    },
    {
      id: 'j6', companyId: 'c1',
      title: 'DevOps Engineer', type: 'Full-time',
      location: 'San Francisco, CA', workMode: 'Remote',
      salary: { min: 125000, max: 165000 },
      experience: 'Senior', category: 'Engineering',
      description: 'Architect and maintain cloud infrastructure, CI/CD pipelines, and monitoring systems ensuring 99.99% uptime.',
      requirements: [
        '5+ years DevOps or SRE experience',
        'Expert in Kubernetes and Docker',
        'Strong AWS or GCP knowledge',
        'Infrastructure as Code (Terraform)',
      ],
      responsibilities: [
        'Design and maintain scalable cloud infrastructure',
        'Build and optimise CI/CD pipelines',
        'Implement monitoring, alerting, and incident response',
      ],
      benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Home Office Budget'],
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python', 'CI/CD'],
      posted: '2026-06-04', applicants: 15, status: 'active',
    },
    {
      id: 'j7', companyId: 'c2',
      title: 'Product Manager', type: 'Full-time',
      location: 'Boston, MA', workMode: 'Hybrid',
      salary: { min: 115000, max: 155000 },
      experience: 'Senior', category: 'Product',
      description: 'Drive product strategy for our flagship telemedicine platform serving 2M+ patients.',
      requirements: [
        '5+ years product management',
        'Healthcare or health-tech experience preferred',
        'Strong analytical and data-driven decision making',
        'Experience with agile methodologies',
      ],
      responsibilities: [
        'Define product vision and strategy',
        'Manage product backlog and prioritise features',
        'Present roadmap to executive leadership',
      ],
      benefits: ['Health Insurance', 'Equity', 'Flexible Schedule', 'Parental Leave'],
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Stakeholder Management', 'Roadmapping'],
      posted: '2026-06-03', applicants: 28, status: 'active',
    },
    {
      id: 'j8', companyId: 'c5',
      title: 'Machine Learning Engineer', type: 'Full-time',
      location: 'Seattle, WA', workMode: 'Hybrid',
      salary: { min: 140000, max: 185000 },
      experience: 'Senior', category: 'Data Science',
      description: 'Design and deploy production ML systems powering our real-time analytics platform — recommendation engines, anomaly detection, predictive models at scale.',
      requirements: [
        '5+ years ML engineering',
        'Expert Python and SQL',
        'Experience with TensorFlow or PyTorch',
        'MLOps tooling (MLflow, Kubeflow)',
        'Large-scale data processing (Spark)',
      ],
      responsibilities: [
        'Design and implement ML models for production',
        'Build data processing pipelines at scale',
        'Set up ML monitoring and experimentation',
      ],
      benefits: ['Health Insurance', 'Stock Options', 'Learning Budget', 'Research Time'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Spark', 'MLOps', 'Kubernetes'],
      posted: '2026-06-02', applicants: 22, status: 'active',
    },
    {
      id: 'j9', companyId: 'c6',
      title: 'Sustainability Analyst', type: 'Full-time',
      location: 'Denver, CO', workMode: 'Onsite',
      salary: { min: 70000, max: 95000 },
      experience: 'Entry', category: 'Analytics',
      description: 'Analyse environmental data and energy metrics to guide our sustainability initiatives and help clients achieve carbon-reduction goals.',
      requirements: [
        '1–3 years in sustainability or environmental analysis',
        'Degree in Environmental Science, Engineering, or related',
        'Strong data analysis skills (Excel, Python, or R)',
        'Knowledge of ESG frameworks and reporting standards',
      ],
      responsibilities: [
        'Collect and analyse environmental and energy data',
        'Create sustainability reports for clients',
        'Track carbon emissions and reduction progress',
      ],
      benefits: ['Health Insurance', 'Green Commute Stipend', 'Volunteer Days', 'Learning Budget'],
      skills: ['Data Analysis', 'Sustainability', 'ESG Reporting', 'Python', 'Excel'],
      posted: '2026-06-08', applicants: 19, status: 'active',
    },
    {
      id: 'j10', companyId: 'c3',
      title: 'Cybersecurity Analyst', type: 'Full-time',
      location: 'New York, NY', workMode: 'Hybrid',
      salary: { min: 100000, max: 140000 },
      experience: 'Mid', category: 'Security',
      description: 'Protect our fintech platform and customer data. Monitor security systems, conduct vulnerability assessments, and respond to incidents.',
      requirements: [
        '3+ years cybersecurity experience',
        'Security certifications (CISSP, CEH, or CompTIA Security+)',
        'SIEM tool experience',
        'Financial compliance knowledge (PCI-DSS, SOC 2)',
      ],
      responsibilities: [
        'Monitor security alerts and investigate incidents',
        'Conduct vulnerability assessments and penetration testing',
        'Support compliance audits and certifications',
      ],
      benefits: ['Health Insurance', 'Certification Budget', 'Equity', 'Home Office Setup'],
      skills: ['Cybersecurity', 'SIEM', 'Penetration Testing', 'Network Security', 'Compliance'],
      posted: '2026-06-05', applicants: 9, status: 'active',
    },
    {
      id: 'j11', companyId: 'c4',
      title: 'Content Marketing Specialist', type: 'Full-time',
      location: 'Austin, TX', workMode: 'Hybrid',
      salary: { min: 60000, max: 85000 },
      experience: 'Entry', category: 'Marketing',
      description: 'Create compelling content driving brand awareness. From blog posts to social media campaigns, craft stories that resonate.',
      requirements: [
        '1–2 years content marketing experience',
        'Excellent writing and editing skills',
        'SEO best practice knowledge',
        'Experience with analytics (Google Analytics)',
      ],
      responsibilities: [
        'Write blog posts, case studies, and whitepapers',
        'Manage social media content calendar',
        'Research industry trends and competitor content',
      ],
      benefits: ['Health Insurance', 'Flexible Hours', 'Creative Environment', 'Free Lunch'],
      skills: ['Content Writing', 'SEO', 'Social Media', 'Google Analytics', 'Copywriting'],
      posted: '2026-06-09', applicants: 56, status: 'active',
    },
  ];

  /** @type {Object.<string, string[]>} Skill taxonomy by category */
  const _skillCategories = {
    'Engineering':  ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C++', 'SQL', 'Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'REST APIs', 'GraphQL', 'CI/CD', 'Agile', 'Testing'],
    'Data Science': ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Statistics', 'Data Visualization', 'Spark', 'Pandas', 'Scikit-learn', 'MLOps'],
    'Design':       ['Figma', 'Sketch', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Adobe Photoshop', 'Adobe Illustrator', 'Typography', 'Color Theory'],
    'Marketing':    ['SEO', 'Content Writing', 'Social Media', 'Google Analytics', 'Email Marketing', 'Copywriting', 'PPC', 'Marketing Strategy', 'Brand Management'],
    'Product':      ['Product Strategy', 'Roadmapping', 'Agile', 'Scrum', 'Data Analysis', 'Stakeholder Management', 'Market Research', 'User Stories', 'Jira'],
    'Security':     ['Cybersecurity', 'Penetration Testing', 'Network Security', 'SIEM', 'Compliance', 'Incident Response', 'Cryptography', 'Vulnerability Assessment'],
    'Analytics':    ['Data Analysis', 'Tableau', 'Power BI', 'Excel', 'Python', 'R', 'SQL', 'Statistics', 'ESG Reporting', 'Sustainability'],
  };

  /** @type {CandidateProfile[]} */
  const _seedCandidates = [
    {
      id: 'u1', role: 'candidate',
      firstName: 'Alex', lastName: 'Rivera',
      email: 'alex.rivera@email.com', avatar: 'AR',
      title: 'Full Stack Developer',
      location: 'San Francisco, CA',
      bio: 'Passionate full-stack developer with 4 years of experience building web applications. Love creating intuitive user experiences and writing clean, maintainable code.',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL'],
      experience: [
        {
          title: 'Frontend Developer', company: 'WebCraft Studios',
          location: 'San Francisco, CA', startDate: '2024-01', endDate: 'Present',
          description: 'Building responsive web applications using React and TypeScript. Led migration to TypeScript, reducing bugs by 40%.',
        },
        {
          title: 'Junior Developer', company: 'StartupHub',
          location: 'San Jose, CA', startDate: '2022-06', endDate: '2023-12',
          description: 'Full-stack features for a SaaS platform serving 10K+ users. Implemented RESTful APIs and database schemas.',
        },
      ],
      education: [{ degree: 'B.S. Computer Science', institution: 'UC Berkeley', year: '2022' }],
      certifications: ['AWS Certified Developer', 'Meta Frontend Developer Certificate'],
      portfolioLinks: ['github.com/alexrivera', 'alexrivera.dev'],
      profileCompletion: 85,
      visibility: 'public',
    },
    {
      id: 'u2', role: 'candidate',
      firstName: 'Priya', lastName: 'Sharma',
      email: 'priya.sharma@email.com', avatar: 'PS',
      title: 'UX/UI Designer',
      location: 'Austin, TX',
      bio: 'Creative UX designer with a passion for human-centered design. Transforming complex problems into simple, beautiful solutions.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite', 'Typography'],
      experience: [
        {
          title: 'UI/UX Designer', company: 'PixelPerfect Agency',
          location: 'Austin, TX', startDate: '2023-03', endDate: 'Present',
          description: 'Designed mobile and web interfaces for 20+ client projects. Created shared design system used across the agency.',
        },
      ],
      education: [{ degree: 'B.F.A. Interaction Design', institution: 'School of Visual Arts', year: '2022' }],
      certifications: ['Google UX Design Certificate'],
      portfolioLinks: ['priyasharma.design', 'dribbble.com/priya'],
      profileCompletion: 92,
      visibility: 'public',
    },
    {
      id: 'u3', role: 'candidate',
      firstName: 'Marcus', lastName: 'Johnson',
      email: 'marcus.johnson@email.com', avatar: 'MJ',
      title: 'Data Analyst',
      location: 'Chicago, IL',
      bio: 'Data-driven analyst transitioning into data science with a focus on machine learning.',
      skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Data Visualization', 'Statistics', 'R'],
      experience: [
        {
          title: 'Business Analyst', company: 'FinServe Corp',
          location: 'Chicago, IL', startDate: '2023-09', endDate: 'Present',
          description: 'Analyse financial data and create executive dashboards. Automated monthly reporting, saving 20 hours/month.',
        },
      ],
      education: [{ degree: 'B.A. Economics', institution: 'University of Illinois', year: '2023' }],
      certifications: ['Google Data Analytics Certificate'],
      portfolioLinks: ['github.com/marcusj'],
      profileCompletion: 68,
      visibility: 'public',
    },
  ];

  /** @type {EmployerProfile[]} */
  const _seedEmployers = [
    {
      id: 'e1', role: 'employer',
      firstName: 'Sarah', lastName: 'Chen',
      email: 'sarah.chen@technova.io',
      companyId: 'c1', companyName: 'TechNova Solutions',
      title: 'Head of Engineering', avatar: 'SC',
    },
    {
      id: 'e2', role: 'employer',
      firstName: 'James', lastName: 'Wilson',
      email: 'james.wilson@auroracreative.design',
      companyId: 'c4', companyName: 'Aurora Creative',
      title: 'Creative Director', avatar: 'JW',
    },
  ];

  /** @type {Application[]} */
  const _seedApplications = [
    { id: 'a1', candidateId: 'u1', jobId: 'j1', status: 'interview', appliedDate: '2026-06-09', coverLetter: 'I am excited to apply for the Senior Frontend Developer position at TechNova...' },
    { id: 'a2', candidateId: 'u1', jobId: 'j5', status: 'applied',   appliedDate: '2026-06-08', coverLetter: 'As a full-stack developer with strong React experience...' },
    { id: 'a3', candidateId: 'u1', jobId: 'j6', status: 'reviewed',  appliedDate: '2026-06-07', coverLetter: 'My experience with cloud infrastructure makes me a strong fit...' },
    { id: 'a4', candidateId: 'u2', jobId: 'j4', status: 'offered',   appliedDate: '2026-06-05', coverLetter: 'I would love to bring my design expertise to Aurora Creative...' },
    { id: 'a5', candidateId: 'u2', jobId: 'j11',status: 'applied',   appliedDate: '2026-06-09', coverLetter: 'As a UX designer with strong visual skills...' },
    { id: 'a6', candidateId: 'u3', jobId: 'j9', status: 'applied',   appliedDate: '2026-06-10', coverLetter: 'My background in data analysis and passion for sustainability...' },
    { id: 'a7', candidateId: 'u3', jobId: 'j2', status: 'rejected',  appliedDate: '2026-06-03', coverLetter: 'While transitioning to data science, I bring strong analytical skills...' },
  ];

  /** @type {Message[]} */
  const _seedMessages = [
    {
      id: 'm1', fromId: 'e1', toId: 'u1',
      fromName: 'Sarah Chen', fromAvatar: 'SC',
      subject: 'Interview Invitation — Senior Frontend Developer',
      preview: 'Hi Alex, we were impressed by your application and would love to schedule...',
      body: 'Hi Alex,\n\nWe were impressed by your application and would love to schedule a technical interview for the Senior Frontend Developer position at TechNova Solutions.\n\nWould you be available this Thursday at 2 PM PST for a 60-minute video call?\n\nBest regards,\nSarah Chen\nHead of Engineering',
      date: '2026-06-10', read: false,
    },
    {
      id: 'm2', fromId: 'system', toId: 'u1',
      fromName: 'JobForest', fromAvatar: '🌲',
      subject: 'Your application was viewed',
      preview: 'Good news! DataStream Analytics viewed your application...',
      body: 'Good news! DataStream Analytics viewed your application for Full Stack Engineer. We will notify you of any updates.',
      date: '2026-06-09', read: true,
    },
    {
      id: 'm3', fromId: 'e2', toId: 'u2',
      fromName: 'James Wilson', fromAvatar: 'JW',
      subject: 'Offer Letter — UX/UI Designer',
      preview: 'Congratulations Priya! We are thrilled to extend an offer...',
      body: 'Congratulations Priya!\n\nWe are thrilled to extend an offer for the UX/UI Designer position at Aurora Creative. Please find the offer details attached.\n\nBest,\nJames Wilson\nCreative Director',
      date: '2026-06-10', read: false,
    },
  ];

  /* ── STATE — load from localStorage or use seed data ───────
   * Each state variable is loaded once at module initialisation.
   * Write operations update both the in-memory array AND localStorage.
   */
  let _companies    = _load(KEYS.COMPANIES,    _seedCompanies);
  let _jobs         = _load(KEYS.JOBS,         _seedJobs);
  let _candidates   = _load(KEYS.CANDIDATES,   _seedCandidates);
  let _employers    = _load(KEYS.EMPLOYERS,    _seedEmployers);
  let _applications = _load(KEYS.APPLICATIONS, _seedApplications);
  let _savedJobs    = _load(KEYS.SAVED_JOBS,   ['j3', 'j8', 'j7']);
  let _messages     = _load(KEYS.MESSAGES,     _seedMessages);

  // Persist seed data if localStorage was empty
  if (!localStorage.getItem(KEYS.COMPANIES))    _save(KEYS.COMPANIES,    _companies);
  if (!localStorage.getItem(KEYS.JOBS))         _save(KEYS.JOBS,         _jobs);
  if (!localStorage.getItem(KEYS.CANDIDATES))   _save(KEYS.CANDIDATES,   _candidates);
  if (!localStorage.getItem(KEYS.EMPLOYERS))    _save(KEYS.EMPLOYERS,    _employers);
  if (!localStorage.getItem(KEYS.APPLICATIONS)) _save(KEYS.APPLICATIONS, _applications);
  if (!localStorage.getItem(KEYS.MESSAGES))     _save(KEYS.MESSAGES,     _messages);

  /* ── PUBLIC API — JOBS ─────────────────────────────────────*/

  /**
   * Get all jobs, with optional filtering and sorting.
   *
   * @param {Object} [filters={}] - Filter options
   * @param {string}   [filters.keyword]    - Search term matched against title, description, skills, company name
   * @param {string[]} [filters.type]       - Job types e.g. ['Full-time', 'Contract']
   * @param {string[]} [filters.workMode]   - ['Remote', 'Hybrid', 'Onsite']
   * @param {string[]} [filters.experience] - ['Entry', 'Mid', 'Senior', 'Executive']
   * @param {string[]} [filters.category]   - ['Engineering', 'Design', ...]
   * @param {number}   [filters.salaryMin]  - Minimum max salary threshold
   * @param {string}   [filters.location]   - Location substring match
   * @param {string}   [filters.sort]       - 'newest' | 'salary-high' | 'salary-low' | 'applicants'
   * @returns {Job[]} Filtered and sorted array of job objects
   *
   * @example
   * // Get all remote Engineering jobs
   * const jobs = JobForestData.getJobs({ workMode: ['Remote'], category: ['Engineering'] });
   */
  function getJobs(filters = {}) {
    let results = [..._jobs];

    // Keyword filter — searches title, description, skills, company name
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      results = results.filter(j => {
        const company = getCompanyById(j.companyId);
        return (
          j.title.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw) ||
          j.skills.some(s => s.toLowerCase().includes(kw)) ||
          (company?.name?.toLowerCase().includes(kw) ?? false)
        );
      });
    }

    // Array filters — only applied when arrays are non-empty
    if (filters.type?.length)       results = results.filter(j => filters.type.includes(j.type));
    if (filters.workMode?.length)   results = results.filter(j => filters.workMode.includes(j.workMode));
    if (filters.experience?.length) results = results.filter(j => filters.experience.includes(j.experience));
    if (filters.category?.length)   results = results.filter(j => filters.category.includes(j.category));

    // Salary filter — jobs where max salary >= requested minimum
    if (filters.salaryMin) results = results.filter(j => j.salary.max >= filters.salaryMin);

    // Location substring match
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter(j => j.location.toLowerCase().includes(loc));
    }

    // Sorting
    switch (filters.sort) {
      case 'salary-high':  results.sort((a, b) => b.salary.max - a.salary.max);  break;
      case 'salary-low':   results.sort((a, b) => a.salary.min - b.salary.min);  break;
      case 'applicants':   results.sort((a, b) => a.applicants - b.applicants);   break;
      case 'newest':
      default:             results.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    }

    return results;
  }

  /**
   * Find a single job by its ID.
   * @param {string} id - Job ID e.g. "j1"
   * @returns {Job|null} The job object, or null if not found
   */
  function getJobById(id) {
    return _jobs.find(j => j.id === id) ?? null;
  }

  /**
   * Get all jobs posted by a specific employer's company.
   * @param {string} companyId - Company ID e.g. "c1"
   * @returns {Job[]}
   */
  function getEmployerJobs(companyId) {
    return _jobs.filter(j => j.companyId === companyId);
  }

  /**
   * Add a new job listing and persist it.
   * @param {Omit<Job, 'id'>} jobData - Job data without an ID (ID is auto-generated)
   * @returns {Job} The saved job object with its new ID
   */
  function saveJob(jobData) {
    const newJob = { id: _uid('j'), ...jobData };
    _jobs.unshift(newJob); // Add to front so it appears first in listings
    _save(KEYS.JOBS, _jobs);
    return newJob;
  }

  /**
   * Toggle a job's status between 'active' and 'closed'.
   * @param {string} jobId
   * @returns {string} The new status: 'active' | 'closed'
   */
  function toggleJobStatus(jobId) {
    const job = _jobs.find(j => j.id === jobId);
    if (!job) return null;
    job.status = job.status === 'active' ? 'closed' : 'active';
    _save(KEYS.JOBS, _jobs);
    return job.status;
  }

  /* ── PUBLIC API — COMPANIES ────────────────────────────────*/

  /**
   * Get all companies.
   * @returns {Company[]}
   */
  function getCompanies() { return [..._companies]; }

  /**
   * Find a company by ID.
   * @param {string} id - Company ID e.g. "c1"
   * @returns {Company|null}
   */
  function getCompanyById(id) {
    return _companies.find(c => c.id === id) ?? null;
  }

  /**
   * Create or update a company profile.
   * @param {Company} companyData - Must include an `id` field
   * @returns {Company}
   */
  function saveCompany(companyData) {
    const idx = _companies.findIndex(c => c.id === companyData.id);
    if (idx >= 0) {
      _companies[idx] = { ..._companies[idx], ...companyData };
    } else {
      _companies.push(companyData);
    }
    _save(KEYS.COMPANIES, _companies);
    return companyData;
  }

  /* ── PUBLIC API — USERS ────────────────────────────────────*/

  /**
   * Get the currently logged-in user from localStorage.
   * Falls back to the first seed candidate if nobody is logged in.
   * @returns {CandidateProfile|EmployerProfile}
   */
  function getCurrentUser() {
    return _load(KEYS.USER, _candidates[0]);
  }

  /**
   * Persist the current user to localStorage.
   * Also updates the user in the corresponding profile array.
   * @param {CandidateProfile|EmployerProfile} user
   * @returns {void}
   */
  function setCurrentUser(user) {
    _save(KEYS.USER, user);

    if (user.role === 'candidate') {
      const idx = _candidates.findIndex(c => c.id === user.id);
      idx >= 0 ? (_candidates[idx] = user) : _candidates.push(user);
      _save(KEYS.CANDIDATES, _candidates);
    } else if (user.role === 'employer') {
      const idx = _employers.findIndex(e => e.id === user.id);
      idx >= 0 ? (_employers[idx] = user) : _employers.push(user);
      _save(KEYS.EMPLOYERS, _employers);
    }
  }

  /**
   * Get all candidate profiles.
   * @returns {CandidateProfile[]}
   */
  function getCandidateProfiles() { return [..._candidates]; }

  /**
   * Find a candidate by ID.
   * @param {string} id
   * @returns {CandidateProfile|null}
   */
  function getCandidateById(id) {
    return _candidates.find(c => c.id === id) ?? null;
  }

  /* ── PUBLIC API — APPLICATIONS ─────────────────────────────*/

  /**
   * Get all applications for a specific candidate,
   * with the related job and company data attached.
   * @param {string} candidateId
   * @returns {EnrichedApplication[]}
   */
  function getUserApplications(candidateId) {
    return _applications
      .filter(a => a.candidateId === candidateId)
      .map(a => {
        const job = getJobById(a.jobId);
        return {
          ...a,
          job,
          company: getCompanyById(job?.companyId ?? null),
        };
      });
  }

  /**
   * Check if a candidate has already applied to a job.
   * @param {string} candidateId
   * @param {string} jobId
   * @returns {boolean}
   */
  function hasApplied(candidateId, jobId) {
    return _applications.some(a => a.candidateId === candidateId && a.jobId === jobId);
  }

  /**
   * Create a new job application.
   * @param {string} candidateId
   * @param {string} jobId
   * @param {string} coverLetter
   * @returns {Application} The newly created application
   */
  function saveApplication(candidateId, jobId, coverLetter) {
    const newApp = {
      id: _uid('a'),
      candidateId,
      jobId,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      coverLetter,
    };
    _applications.push(newApp);
    _save(KEYS.APPLICATIONS, _applications);
    return newApp;
  }

  /**
   * Update an application's status (e.g. 'reviewed', 'interview', 'offered').
   * @param {string} appId
   * @param {ApplicationStatus} newStatus
   * @returns {boolean} true if updated, false if not found
   */
  function updateApplicationStatus(appId, newStatus) {
    const app = _applications.find(a => a.id === appId);
    if (!app) return false;
    app.status = newStatus;
    _save(KEYS.APPLICATIONS, _applications);
    return true;
  }

  /**
   * Permanently remove an application (used by candidate to retract).
   * @param {string} appId
   * @returns {boolean} true if removed
   */
  function retractApplication(appId) {
    const idx = _applications.findIndex(a => a.id === appId);
    if (idx < 0) return false;
    _applications.splice(idx, 1);
    _save(KEYS.APPLICATIONS, _applications);
    return true;
  }

  /* ── PUBLIC API — SAVED JOBS ───────────────────────────────*/

  /**
   * Toggle a job's saved state. Adds if missing, removes if present.
   * @param {string} jobId
   * @returns {boolean} true = now saved, false = now removed
   */
  function toggleSavedJob(jobId) {
    const idx = _savedJobs.indexOf(jobId);
    if (idx >= 0) {
      _savedJobs.splice(idx, 1);
    } else {
      _savedJobs.push(jobId);
    }
    _save(KEYS.SAVED_JOBS, _savedJobs);
    return _savedJobs.includes(jobId);
  }

  /**
   * Check if a job is saved.
   * @param {string} jobId
   * @returns {boolean}
   */
  function isJobSaved(jobId) { return _savedJobs.includes(jobId); }

  /**
   * Get full job objects for all saved jobs.
   * @returns {Job[]}
   */
  function getSavedJobs() {
    return _savedJobs.map(id => getJobById(id)).filter(Boolean);
  }

  /* ── PUBLIC API — MESSAGES ─────────────────────────────────*/

  /**
   * Get all messages for a user (as recipient).
   * @param {string} userId
   * @returns {Message[]}
   */
  function getMessages(userId) {
    return _messages.filter(m => m.toId === userId);
  }

  /**
   * Count unread messages for a user.
   * @param {string} userId
   * @returns {number}
   */
  function getUnreadCount(userId) {
    return _messages.filter(m => m.toId === userId && !m.read).length;
  }

  /**
   * Append a new message.
   * @param {Message} msg
   * @returns {void}
   */
  function addMessage(msg) {
    _messages.push(msg);
    _save(KEYS.MESSAGES, _messages);
  }

  /* ── PUBLIC API — SKILLS ───────────────────────────────────*/

  /**
   * Get the skill taxonomy object.
   * @returns {Object.<string, string[]>}
   */
  function getSkillCategories() { return { ..._skillCategories }; }

  /**
   * Get a flat array of all known skills across all categories.
   * @returns {string[]}
   */
  function getAllSkills() {
    return Object.values(_skillCategories).flat();
  }

  /* ── PUBLIC API — FORMATTERS ───────────────────────────────*/

  /**
   * Format a salary range as a human-readable string.
   * @param {number} min - Annual minimum in USD
   * @param {number} max - Annual maximum in USD
   * @returns {string} e.g. "$120K - $160K"
   *
   * @example
   * formatSalary(120000, 160000) // "$120K - $160K"
   */
  function formatSalary(min, max) {
    const fmt = n => `$${(n / 1000).toFixed(0)}K`;
    return `${fmt(min)} - ${fmt(max)}`;
  }

  /**
   * Convert a date string to a relative time label.
   * @param {string} dateStr - ISO date string e.g. "2026-06-08"
   * @returns {string} e.g. "2 days ago", "Today", "3 weeks ago"
   *
   * @example
   * timeAgo('2026-06-08') // "3 days ago" (if today is 2026-06-11)
   */
  function timeAgo(dateStr) {
    const now  = new Date('2026-06-11'); // Prototype fixed date
    const date = new Date(dateStr);
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (days === 0)  return 'Today';
    if (days === 1)  return 'Yesterday';
    if (days < 7)   return `${days} days ago`;
    if (days < 30)  return `${Math.floor(days / 7)} week${days < 14 ? '' : 's'} ago`;
    return `${Math.floor(days / 30)} month${days < 60 ? '' : 's'} ago`;
  }

  /* ── PUBLIC API — EXPOSED ARRAYS (read-only references) ────
   * These are intentionally exposed so Dashboard can iterate them.
   * Do NOT push to these directly — use the save/update functions above.
   */

  return {
    // Jobs
    getJobs,
    getJobById,
    getEmployerJobs,
    saveJob,
    toggleJobStatus,

    // Companies
    getCompanies,
    getCompanyById,
    saveCompany,

    // Users
    getCurrentUser,
    setCurrentUser,
    getCandidateProfiles,
    getCandidateById,

    // Applications
    getUserApplications,
    hasApplied,
    saveApplication,
    updateApplicationStatus,
    retractApplication,

    // Saved jobs
    toggleSavedJob,
    isJobSaved,
    getSavedJobs,

    // Messages
    getMessages,
    getUnreadCount,
    addMessage,

    // Skills
    getSkillCategories,
    getAllSkills,

    // Formatters
    formatSalary,
    timeAgo,

    // Exposed arrays (read-only intent — for iterating in dashboard.js)
    get candidateProfiles() { return _candidates; },
    get employerProfiles()  { return _employers; },
    get companies()         { return _companies; },
  };

})();