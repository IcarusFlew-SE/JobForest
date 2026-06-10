// ============================================
// JOBFOREST — MOCK DATA STORE
// Jobs, Users, Companies, Applications, Skills
// ============================================

const JobForestData = (() => {
  // ─── COMPANIES ──────────────────────────────────────
  let companies = JSON.parse(localStorage.getItem('jf_companies')) || [
    {
      id: 'c1',
      name: 'TechNova Solutions',
      logo: '🚀',
      industry: 'Technology',
      size: '500-1000',
      location: 'San Francisco, CA',
      description: 'Building the next generation of cloud-native applications for enterprise teams worldwide.',
      culture: 'Innovation-driven, remote-first, flat hierarchy with quarterly hackathons.',
      founded: 2018,
      website: 'technova.io'
    },
    {
      id: 'c2',
      name: 'GreenLeaf Health',
      logo: '🌿',
      industry: 'Healthcare',
      size: '1000-5000',
      location: 'Boston, MA',
      description: 'Revolutionizing digital health with AI-powered diagnostic tools and telemedicine platforms.',
      culture: 'Patient-first, research-backed, inclusive workplace with wellness programs.',
      founded: 2015,
      website: 'greenleafhealth.com'
    },
    {
      id: 'c3',
      name: 'QuantumEdge Finance',
      logo: '💎',
      industry: 'Finance',
      size: '200-500',
      location: 'New York, NY',
      description: 'Fintech startup disrupting traditional banking with blockchain-based payment solutions.',
      culture: 'Fast-paced, data-driven, competitive compensation with equity packages.',
      founded: 2020,
      website: 'quantumedge.co'
    },
    {
      id: 'c4',
      name: 'Aurora Creative',
      logo: '🎨',
      industry: 'Design & Media',
      size: '50-200',
      location: 'Austin, TX',
      description: 'Award-winning creative agency specializing in brand identity, UX design, and digital marketing.',
      culture: 'Creative freedom, flexible hours, studio-style office with monthly art exhibitions.',
      founded: 2019,
      website: 'auroracreative.design'
    },
    {
      id: 'c5',
      name: 'DataStream Analytics',
      logo: '📊',
      industry: 'Data & Analytics',
      size: '100-500',
      location: 'Seattle, WA',
      description: 'Enterprise data analytics platform helping Fortune 500 companies make data-driven decisions.',
      culture: 'Intellectual curiosity, continuous learning, generous conference budget.',
      founded: 2017,
      website: 'datastream.ai'
    },
    {
      id: 'c6',
      name: 'EcoVolt Energy',
      logo: '⚡',
      industry: 'Clean Energy',
      size: '200-500',
      location: 'Denver, CO',
      description: 'Sustainable energy solutions company focused on solar and wind power infrastructure.',
      culture: 'Mission-driven, sustainability-focused, outdoor team activities.',
      founded: 2016,
      website: 'ecovolt.energy'
    }
  ];

  // ─── JOBS ──────────────────────────────────────
  let jobs = JSON.parse(localStorage.getItem('jf_jobs')) || [
    {
      id: 'j1',
      companyId: 'c1',
      title: 'Senior Frontend Developer',
      type: 'Full-time',
      location: 'San Francisco, CA',
      workMode: 'Hybrid',
      salary: { min: 120000, max: 160000 },
      experience: 'Senior',
      category: 'Engineering',
      description: 'We are looking for a Senior Frontend Developer to lead our web application team. You will architect and implement complex user interfaces using modern JavaScript frameworks, mentor junior developers, and collaborate closely with our design and product teams.',
      requirements: [
        '5+ years of frontend development experience',
        'Expert in React.js or Vue.js with state management',
        'Strong TypeScript and modern JavaScript skills',
        'Experience with responsive design and CSS-in-JS',
        'Familiarity with CI/CD pipelines and testing frameworks',
        'Excellent communication and leadership skills'
      ],
      responsibilities: [
        'Lead frontend architecture decisions and code reviews',
        'Build performant, accessible web applications',
        'Mentor and grow junior team members',
        'Collaborate with designers to implement pixel-perfect UIs',
        'Optimize application performance and bundle size',
        'Contribute to our open-source component library'
      ],
      benefits: ['Health Insurance', 'Remote Work', 'Stock Options', '401k Match', 'Learning Budget', 'Gym Membership'],
      skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Testing', 'Git'],
      posted: '2026-06-08',
      applicants: 24,
      status: 'active'
    },
    {
      id: 'j2',
      companyId: 'c2',
      title: 'Data Scientist - Healthcare AI',
      type: 'Full-time',
      location: 'Boston, MA',
      workMode: 'Remote',
      salary: { min: 130000, max: 170000 },
      experience: 'Mid',
      category: 'Data Science',
      description: 'Join our healthcare AI team to develop machine learning models that improve patient outcomes. Work with large medical datasets, build predictive analytics tools, and collaborate with clinical researchers.',
      requirements: [
        '3+ years in data science or machine learning',
        'Strong Python skills with ML libraries (scikit-learn, TensorFlow, PyTorch)',
        'Experience with healthcare data (EHR, FHIR) preferred',
        'Masters or PhD in CS, Statistics, or related field',
        'Knowledge of NLP and computer vision techniques',
        'Understanding of HIPAA compliance'
      ],
      responsibilities: [
        'Develop and deploy ML models for clinical decision support',
        'Analyze large-scale healthcare datasets',
        'Build data pipelines and feature engineering workflows',
        'Present findings to clinical and executive stakeholders',
        'Collaborate with engineering to productionize models',
        'Stay current with latest ML research in healthcare'
      ],
      benefits: ['Health Insurance', 'Remote Work', 'Research Budget', 'Conference Travel', 'Parental Leave', 'Mental Health Support'],
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'NLP', 'Statistics'],
      posted: '2026-06-07',
      applicants: 18,
      status: 'active'
    },
    {
      id: 'j3',
      companyId: 'c3',
      title: 'Blockchain Developer',
      type: 'Full-time',
      location: 'New York, NY',
      workMode: 'Onsite',
      salary: { min: 140000, max: 190000 },
      experience: 'Senior',
      category: 'Engineering',
      description: 'Build the future of decentralized finance. We need a blockchain developer to design and implement smart contracts, develop DeFi protocols, and ensure the security of our payment infrastructure.',
      requirements: [
        '4+ years blockchain development experience',
        'Proficient in Solidity and smart contract development',
        'Experience with Ethereum, Polygon, or similar chains',
        'Strong understanding of DeFi protocols',
        'Knowledge of cryptographic principles',
        'Security audit experience preferred'
      ],
      responsibilities: [
        'Design and implement smart contracts for payment solutions',
        'Develop and maintain DeFi protocols',
        'Conduct security audits and vulnerability assessments',
        'Integrate blockchain solutions with traditional banking APIs',
        'Write comprehensive technical documentation',
        'Participate in code reviews and architecture discussions'
      ],
      benefits: ['Competitive Salary', 'Crypto Bonus', 'Equity', 'Health Insurance', 'Unlimited PTO', 'Home Office Setup'],
      skills: ['Solidity', 'Ethereum', 'Web3.js', 'JavaScript', 'Smart Contracts', 'Security'],
      posted: '2026-06-09',
      applicants: 12,
      status: 'active'
    },
    {
      id: 'j4',
      companyId: 'c4',
      title: 'UX/UI Designer',
      type: 'Full-time',
      location: 'Austin, TX',
      workMode: 'Hybrid',
      salary: { min: 85000, max: 120000 },
      experience: 'Mid',
      category: 'Design',
      description: 'Create beautiful, intuitive digital experiences for our diverse client portfolio. From mobile apps to enterprise dashboards, you will own the design process from research to final deliverables.',
      requirements: [
        '3+ years UX/UI design experience',
        'Proficient in Figma, Sketch, or Adobe XD',
        'Strong portfolio demonstrating user-centered design',
        'Experience with design systems and component libraries',
        'Understanding of accessibility standards (WCAG)',
        'Basic prototyping and animation skills'
      ],
      responsibilities: [
        'Conduct user research and usability testing',
        'Create wireframes, prototypes, and high-fidelity designs',
        'Build and maintain client design systems',
        'Collaborate with developers for design handoff',
        'Present design solutions to clients and stakeholders',
        'Stay updated with latest design trends and tools'
      ],
      benefits: ['Health Insurance', 'Creative Freedom', 'Conference Budget', 'Flexible Hours', 'Design Tool Licenses', 'Team Retreats'],
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite'],
      posted: '2026-06-06',
      applicants: 31,
      status: 'active'
    },
    {
      id: 'j5',
      companyId: 'c5',
      title: 'Full Stack Engineer',
      type: 'Full-time',
      location: 'Seattle, WA',
      workMode: 'Remote',
      salary: { min: 110000, max: 150000 },
      experience: 'Mid',
      category: 'Engineering',
      description: 'Build scalable data visualization tools and analytics dashboards. Work across the entire stack from React frontends to Node.js/Python backends, with heavy emphasis on real-time data processing.',
      requirements: [
        '3-5 years full-stack development experience',
        'Proficient in React and Node.js or Python',
        'Experience with PostgreSQL and Redis',
        'Knowledge of data visualization libraries (D3.js, Chart.js)',
        'Familiarity with cloud services (AWS/GCP)',
        'Understanding of RESTful API design'
      ],
      responsibilities: [
        'Develop full-stack features for our analytics platform',
        'Build interactive data visualization components',
        'Design and implement RESTful APIs',
        'Optimize database queries and application performance',
        'Write unit and integration tests',
        'Participate in agile ceremonies and sprint planning'
      ],
      benefits: ['Remote Work', 'Health Insurance', 'Learning Stipend', '401k', 'Home Office Budget', 'Flexible Schedule'],
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'D3.js'],
      posted: '2026-06-05',
      applicants: 42,
      status: 'active'
    },
    {
      id: 'j6',
      companyId: 'c1',
      title: 'DevOps Engineer',
      type: 'Full-time',
      location: 'San Francisco, CA',
      workMode: 'Remote',
      salary: { min: 125000, max: 165000 },
      experience: 'Senior',
      category: 'Engineering',
      description: 'Architect and maintain our cloud infrastructure, CI/CD pipelines, and monitoring systems. Ensure high availability and reliability of our SaaS platform serving millions of users.',
      requirements: [
        '5+ years DevOps or SRE experience',
        'Expert in Kubernetes and Docker',
        'Strong AWS or GCP experience',
        'Infrastructure as Code (Terraform, Pulumi)',
        'Monitoring and observability (Datadog, Grafana)',
        'Scripting with Python or Bash'
      ],
      responsibilities: [
        'Design and maintain scalable cloud infrastructure',
        'Build and optimize CI/CD pipelines',
        'Implement monitoring, alerting, and incident response',
        'Automate infrastructure provisioning',
        'Ensure security best practices and compliance',
        'Mentor team on DevOps best practices'
      ],
      benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'On-Call Compensation', 'Home Office Budget', 'Sabbatical'],
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python', 'CI/CD'],
      posted: '2026-06-04',
      applicants: 15,
      status: 'active'
    },
    {
      id: 'j7',
      companyId: 'c4',
      title: 'Content Marketing Specialist',
      type: 'Full-time',
      location: 'Austin, TX',
      workMode: 'Hybrid',
      salary: { min: 60000, max: 85000 },
      experience: 'Entry',
      category: 'Marketing',
      description: 'Create compelling content that drives brand awareness and engagement. From blog posts to social media campaigns, you will craft stories that resonate with our audience.',
      requirements: [
        '1-2 years content marketing experience',
        'Excellent writing and editing skills',
        'Familiarity with SEO best practices',
        'Experience with social media management tools',
        'Basic understanding of analytics (Google Analytics)',
        'Portfolio of published content'
      ],
      responsibilities: [
        'Write blog posts, case studies, and whitepapers',
        'Manage social media content calendar',
        'Optimize content for SEO',
        'Collaborate with design team on visual content',
        'Track content performance metrics',
        'Research industry trends and competitor content'
      ],
      benefits: ['Health Insurance', 'Flexible Hours', 'Creative Environment', 'Learning Budget', 'Team Events', 'Free Lunch'],
      skills: ['Content Writing', 'SEO', 'Social Media', 'Google Analytics', 'Copywriting', 'Marketing Strategy'],
      posted: '2026-06-09',
      applicants: 56,
      status: 'active'
    },
    {
      id: 'j8',
      companyId: 'c2',
      title: 'Product Manager',
      type: 'Full-time',
      location: 'Boston, MA',
      workMode: 'Hybrid',
      salary: { min: 115000, max: 155000 },
      experience: 'Senior',
      category: 'Product',
      description: 'Drive product strategy for our flagship telemedicine platform. Define roadmaps, prioritize features, and work cross-functionally to deliver products that improve healthcare access.',
      requirements: [
        '5+ years product management experience',
        'Experience in healthcare or health-tech preferred',
        'Strong analytical and data-driven decision making',
        'Excellent stakeholder management skills',
        'Experience with agile methodologies',
        'Technical background is a plus'
      ],
      responsibilities: [
        'Define product vision and strategy',
        'Manage product backlog and prioritize features',
        'Conduct market research and competitive analysis',
        'Work with engineering, design, and clinical teams',
        'Define KPIs and track product metrics',
        'Present roadmap to executive leadership'
      ],
      benefits: ['Health Insurance', 'Equity', 'Flexible Schedule', 'Professional Development', 'Wellness Programs', 'Parental Leave'],
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Stakeholder Management', 'Roadmapping', 'Market Research'],
      posted: '2026-06-03',
      applicants: 28,
      status: 'active'
    },
    {
      id: 'j9',
      companyId: 'c6',
      title: 'Sustainability Analyst',
      type: 'Full-time',
      location: 'Denver, CO',
      workMode: 'Onsite',
      salary: { min: 70000, max: 95000 },
      experience: 'Entry',
      category: 'Analytics',
      description: 'Analyze environmental data and energy metrics to guide our sustainability initiatives. Help clients achieve their carbon reduction goals through data-driven recommendations.',
      requirements: [
        '1-3 years in sustainability or environmental analysis',
        'Degree in Environmental Science, Engineering, or related',
        'Strong data analysis skills (Excel, Python, or R)',
        'Knowledge of ESG frameworks and reporting standards',
        'Familiarity with carbon accounting methodologies',
        'Excellent presentation skills'
      ],
      responsibilities: [
        'Collect and analyze environmental and energy data',
        'Create sustainability reports for clients',
        'Track carbon emissions and reduction progress',
        'Research emerging clean energy technologies',
        'Support ESG compliance and reporting',
        'Collaborate with engineering teams on green initiatives'
      ],
      benefits: ['Health Insurance', 'Green Commute Stipend', 'Volunteer Days', 'Learning Budget', 'Outdoor Activities', 'Team Retreats'],
      skills: ['Data Analysis', 'Sustainability', 'ESG Reporting', 'Python', 'Excel', 'Environmental Science'],
      posted: '2026-06-08',
      applicants: 19,
      status: 'active'
    },
    {
      id: 'j10',
      companyId: 'c3',
      title: 'QA Automation Engineer',
      type: 'Contract',
      location: 'New York, NY',
      workMode: 'Remote',
      salary: { min: 90000, max: 120000 },
      experience: 'Mid',
      category: 'Engineering',
      description: 'Build and maintain automated testing frameworks for our fintech platform. Ensure the reliability and quality of critical financial transactions through comprehensive test coverage.',
      requirements: [
        '3+ years QA or test automation experience',
        'Proficient in Selenium, Cypress, or Playwright',
        'Experience with API testing tools (Postman, REST Assured)',
        'Knowledge of CI/CD integration for tests',
        'Understanding of financial software testing requirements',
        'Strong attention to detail'
      ],
      responsibilities: [
        'Design and implement automated test suites',
        'Create and maintain test frameworks and infrastructure',
        'Perform API and integration testing',
        'Collaborate with developers on testing best practices',
        'Report and track defects through resolution',
        'Contribute to quality metrics and dashboards'
      ],
      benefits: ['Competitive Rate', 'Remote Work', 'Flexible Hours', 'Equipment Provided', 'Extension Possible'],
      skills: ['Cypress', 'Selenium', 'JavaScript', 'API Testing', 'CI/CD', 'Agile'],
      posted: '2026-06-10',
      applicants: 8,
      status: 'active'
    },
    {
      id: 'j11',
      companyId: 'c5',
      title: 'Machine Learning Engineer',
      type: 'Full-time',
      location: 'Seattle, WA',
      workMode: 'Hybrid',
      salary: { min: 140000, max: 185000 },
      experience: 'Senior',
      category: 'Data Science',
      description: 'Design and deploy production ML systems that power our real-time analytics platform. Build recommendation engines, anomaly detection systems, and predictive models at scale.',
      requirements: [
        '5+ years ML engineering experience',
        'Strong Python and SQL skills',
        'Experience with ML frameworks (TensorFlow, PyTorch)',
        'Knowledge of MLOps tools (MLflow, Kubeflow)',
        'Experience with large-scale data processing (Spark)',
        'MS or PhD in Computer Science or related field'
      ],
      responsibilities: [
        'Design and implement ML models for production use',
        'Build data processing pipelines at scale',
        'Develop recommendation and ranking systems',
        'Optimize model performance and latency',
        'Set up ML monitoring and experimentation',
        'Collaborate with data scientists and engineers'
      ],
      benefits: ['Health Insurance', 'Stock Options', 'Learning Budget', '401k Match', 'Relocation Support', 'Research Time'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Spark', 'MLOps', 'Kubernetes'],
      posted: '2026-06-02',
      applicants: 22,
      status: 'active'
    },
    {
      id: 'j12',
      companyId: 'c6',
      title: 'Solar Installation Technician',
      type: 'Full-time',
      location: 'Denver, CO',
      workMode: 'Onsite',
      salary: { min: 50000, max: 70000 },
      experience: 'Entry',
      category: 'Operations',
      description: 'Install and maintain residential and commercial solar panel systems. Join our field team in bringing clean energy to communities across Colorado.',
      requirements: [
        'High school diploma or equivalent',
        'NABCEP certification preferred',
        'Comfortable working at heights and outdoors',
        'Basic electrical knowledge',
        'Valid drivers license',
        'Physical fitness for hands-on work'
      ],
      responsibilities: [
        'Install rooftop and ground-mounted solar systems',
        'Perform system maintenance and troubleshooting',
        'Follow safety protocols and building codes',
        'Document installation progress and inspections',
        'Communicate with project managers and clients',
        'Maintain tools and equipment'
      ],
      benefits: ['Health Insurance', 'Paid Training', 'Tool Allowance', 'Company Vehicle', 'Career Growth', 'Green Energy Mission'],
      skills: ['Solar Installation', 'Electrical Basics', 'Safety Protocols', 'Troubleshooting', 'Physical Fitness', 'Teamwork'],
      posted: '2026-06-07',
      applicants: 14,
      status: 'active'
    },
    {
      id: 'j13',
      companyId: 'c4',
      title: 'Junior Graphic Designer',
      type: 'Part-time',
      location: 'Austin, TX',
      workMode: 'Remote',
      salary: { min: 35000, max: 50000 },
      experience: 'Entry',
      category: 'Design',
      description: 'Support our design team with visual content creation for clients. Great opportunity for recent graduates to grow their skills in a creative agency environment.',
      requirements: [
        'Degree in Graphic Design or related field',
        'Proficient in Adobe Illustrator and Photoshop',
        'Basic Figma or Sketch knowledge',
        'Strong visual design fundamentals',
        'Portfolio demonstrating design skills',
        'Eagerness to learn and receive feedback'
      ],
      responsibilities: [
        'Create social media graphics and marketing materials',
        'Assist senior designers with client projects',
        'Maintain brand asset libraries',
        'Prepare files for print and digital production',
        'Participate in creative brainstorming sessions',
        'Learn and apply client brand guidelines'
      ],
      benefits: ['Flexible Hours', 'Remote Work', 'Mentorship', 'Design Tool Licenses', 'Portfolio Development', 'Team Culture'],
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Typography', 'Color Theory', 'Brand Design'],
      posted: '2026-06-09',
      applicants: 67,
      status: 'active'
    },
    {
      id: 'j14',
      companyId: 'c1',
      title: 'Technical Writer',
      type: 'Contract',
      location: 'San Francisco, CA',
      workMode: 'Remote',
      salary: { min: 75000, max: 100000 },
      experience: 'Mid',
      category: 'Content',
      description: 'Create clear, comprehensive technical documentation for our developer APIs, SDKs, and internal tools. Make complex technical concepts accessible to developers of all levels.',
      requirements: [
        '2-4 years technical writing experience',
        'Experience documenting APIs and developer tools',
        'Basic understanding of programming concepts',
        'Proficient with docs-as-code tools (Markdown, Git)',
        'Strong attention to detail and clarity',
        'Experience with docs platforms (GitBook, Docusaurus)'
      ],
      responsibilities: [
        'Write and maintain API reference documentation',
        'Create getting-started guides and tutorials',
        'Document internal tools and processes',
        'Review code samples for accuracy',
        'Collaborate with engineering teams',
        'Improve documentation structure and discoverability'
      ],
      benefits: ['Remote Work', 'Flexible Schedule', 'Competitive Rate', 'Equipment Stipend', 'Tech Stack Access'],
      skills: ['Technical Writing', 'API Documentation', 'Markdown', 'Git', 'Developer Tools', 'Content Strategy'],
      posted: '2026-06-06',
      applicants: 11,
      status: 'active'
    },
    {
      id: 'j15',
      companyId: 'c3',
      title: 'Cybersecurity Analyst',
      type: 'Full-time',
      location: 'New York, NY',
      workMode: 'Hybrid',
      salary: { min: 100000, max: 140000 },
      experience: 'Mid',
      category: 'Security',
      description: 'Protect our fintech platform and customer data from security threats. Monitor security systems, conduct vulnerability assessments, and respond to security incidents.',
      requirements: [
        '3+ years cybersecurity experience',
        'Security certifications (CISSP, CEH, or CompTIA Security+)',
        'Experience with SIEM tools and threat detection',
        'Knowledge of financial compliance (PCI-DSS, SOC 2)',
        'Strong understanding of network security',
        'Incident response experience'
      ],
      responsibilities: [
        'Monitor security alerts and investigate incidents',
        'Conduct vulnerability assessments and penetration testing',
        'Maintain security tools and infrastructure',
        'Develop security policies and procedures',
        'Support compliance audits and certifications',
        'Train employees on security best practices'
      ],
      benefits: ['Health Insurance', 'Certification Budget', 'Equity', 'Flexible Hours', 'Home Office Setup', 'Conference Budget'],
      skills: ['Cybersecurity', 'SIEM', 'Penetration Testing', 'Network Security', 'Compliance', 'Incident Response'],
      posted: '2026-06-05',
      applicants: 9,
      status: 'active'
    }
  ];

  // ─── SKILL CATEGORIES ─────────────────────────
  const skillCategories = {
    'Engineering': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C++', 'SQL', 'Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'REST APIs', 'GraphQL', 'CI/CD', 'Agile', 'Testing'],
    'Data Science': ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Statistics', 'Data Visualization', 'Spark', 'Pandas', 'Scikit-learn', 'MLOps'],
    'Design': ['Figma', 'Sketch', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Adobe Photoshop', 'Adobe Illustrator', 'Typography', 'Color Theory', 'Motion Design'],
    'Marketing': ['SEO', 'Content Writing', 'Social Media', 'Google Analytics', 'Email Marketing', 'Copywriting', 'PPC', 'Marketing Strategy', 'Brand Management', 'A/B Testing'],
    'Product': ['Product Strategy', 'Roadmapping', 'Agile', 'Scrum', 'Data Analysis', 'Stakeholder Management', 'Market Research', 'User Stories', 'Wireframing', 'Jira'],
    'Security': ['Cybersecurity', 'Penetration Testing', 'Network Security', 'SIEM', 'Compliance', 'Incident Response', 'Cryptography', 'SOC', 'Vulnerability Assessment', 'Security Auditing']
  };

  // ─── CANDIDATE PROFILES ────────────────────────
  let candidateProfiles = JSON.parse(localStorage.getItem('jf_candidateProfiles')) || [
    {
      id: 'u1',
      role: 'candidate',
      firstName: 'Alex',
      lastName: 'Rivera',
      email: 'alex.rivera@email.com',
      title: 'Full Stack Developer',
      location: 'San Francisco, CA',
      bio: 'Passionate full-stack developer with 4 years of experience building web applications. Love creating intuitive user experiences and writing clean, maintainable code.',
      avatar: 'AR',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL'],
      experience: [
        {
          title: 'Frontend Developer',
          company: 'WebCraft Studios',
          location: 'San Francisco, CA',
          startDate: '2024-01',
          endDate: 'Present',
          description: 'Building responsive web applications using React and TypeScript. Led migration from JavaScript to TypeScript, reducing bugs by 40%.'
        },
        {
          title: 'Junior Developer',
          company: 'StartupHub',
          location: 'San Jose, CA',
          startDate: '2022-06',
          endDate: '2023-12',
          description: 'Developed full-stack features for a SaaS platform serving 10K+ users. Implemented RESTful APIs and database schemas.'
        }
      ],
      education: [
        {
          degree: 'B.S. Computer Science',
          institution: 'UC Berkeley',
          year: '2022'
        }
      ],
      certifications: ['AWS Certified Developer', 'Meta Frontend Developer Certificate'],
      portfolioLinks: ['github.com/alexrivera', 'alexrivera.dev'],
      profileCompletion: 85,
      visibility: 'public'
    },
    {
      id: 'u2',
      role: 'candidate',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@email.com',
      title: 'UX/UI Designer',
      location: 'Austin, TX',
      bio: 'Creative UX designer with a passion for human-centered design. Experienced in transforming complex problems into simple, beautiful solutions.',
      avatar: 'PS',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite', 'Typography', 'Motion Design'],
      experience: [
        {
          title: 'UI/UX Designer',
          company: 'PixelPerfect Agency',
          location: 'Austin, TX',
          startDate: '2023-03',
          endDate: 'Present',
          description: 'Designed mobile and web interfaces for 20+ client projects. Created and maintained a shared design system used across the agency.'
        },
        {
          title: 'Design Intern',
          company: 'CreativeMinds',
          location: 'Dallas, TX',
          startDate: '2022-06',
          endDate: '2023-02',
          description: 'Assisted senior designers with wireframing, user research, and UI mockups for healthcare and e-commerce clients.'
        }
      ],
      education: [
        {
          degree: 'B.F.A. Interaction Design',
          institution: 'School of Visual Arts',
          year: '2022'
        }
      ],
      certifications: ['Google UX Design Certificate', 'Nielsen Norman UX Certification'],
      portfolioLinks: ['priyasharma.design', 'dribbble.com/priya'],
      profileCompletion: 92,
      visibility: 'public'
    },
    {
      id: 'u3',
      role: 'candidate',
      firstName: 'Marcus',
      lastName: 'Johnson',
      email: 'marcus.johnson@email.com',
      title: 'Data Analyst',
      location: 'Chicago, IL',
      bio: 'Data-driven analyst with experience in business intelligence and reporting. Transitioning into data science with a focus on machine learning.',
      avatar: 'MJ',
      skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Data Visualization', 'Statistics', 'R', 'Google Analytics'],
      experience: [
        {
          title: 'Business Analyst',
          company: 'FinServe Corp',
          location: 'Chicago, IL',
          startDate: '2023-09',
          endDate: 'Present',
          description: 'Analyze financial data and create executive dashboards. Automated monthly reporting process, saving 20 hours per month.'
        }
      ],
      education: [
        {
          degree: 'B.A. Economics',
          institution: 'University of Illinois',
          year: '2023'
        }
      ],
      certifications: ['Google Data Analytics Certificate'],
      portfolioLinks: ['github.com/marcusj'],
      profileCompletion: 68,
      visibility: 'public'
    }
  ];

  // ─── EMPLOYER PROFILES ─────────────────────────
  let employerProfiles = JSON.parse(localStorage.getItem('jf_employerProfiles')) || [
    {
      id: 'e1',
      role: 'employer',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.chen@technova.io',
      companyId: 'c1',
      title: 'Head of Engineering',
      avatar: 'SC'
    },
    {
      id: 'e2',
      role: 'employer',
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@auroracreative.design',
      companyId: 'c4',
      title: 'Creative Director',
      avatar: 'JW'
    }
  ];

  // ─── APPLICATIONS ──────────────────────────────
  let applications = JSON.parse(localStorage.getItem('jf_applications')) || [
    { id: 'a1', candidateId: 'u1', jobId: 'j1', status: 'interview', appliedDate: '2026-06-09', coverLetter: 'I am excited to apply for the Senior Frontend Developer position...' },
    { id: 'a2', candidateId: 'u1', jobId: 'j5', status: 'applied', appliedDate: '2026-06-08', coverLetter: 'As a full-stack developer with strong React experience...' },
    { id: 'a3', candidateId: 'u1', jobId: 'j6', status: 'reviewed', appliedDate: '2026-06-07', coverLetter: 'My experience with cloud infrastructure makes me a strong fit...' },
    { id: 'a4', candidateId: 'u2', jobId: 'j4', status: 'offered', appliedDate: '2026-06-05', coverLetter: 'I would love to bring my design expertise to Aurora Creative...' },
    { id: 'a5', candidateId: 'u2', jobId: 'j13', status: 'applied', appliedDate: '2026-06-09', coverLetter: 'As a UX designer with strong visual skills...' },
    { id: 'a6', candidateId: 'u3', jobId: 'j9', status: 'applied', appliedDate: '2026-06-10', coverLetter: 'My background in data analysis and passion for sustainability...' },
    { id: 'a7', candidateId: 'u3', jobId: 'j2', status: 'rejected', appliedDate: '2026-06-03', coverLetter: 'While transitioning to data science, I bring strong analytical skills...' }
  ];

  // ─── SAVED JOBS ────────────────────────────────
  let savedJobs = JSON.parse(localStorage.getItem('jf_savedJobs') || '["j3","j11","j8"]');

  // ─── MESSAGES ─────────────────────────────────
  let messages = JSON.parse(localStorage.getItem('jf_messages')) || [
    {
      id: 'm1',
      fromId: 'e1',
      toId: 'u1',
      fromName: 'Sarah Chen',
      fromAvatar: 'SC',
      subject: 'Interview Invitation - Senior Frontend Developer',
      preview: 'Hi Alex, we were impressed by your application and would love to schedule...',
      body: 'Hi Alex,\n\nWe were impressed by your application and would love to schedule a technical interview for the Senior Frontend Developer position at TechNova Solutions.\n\nWould you be available this Thursday at 2 PM PST for a 60-minute video call?\n\nBest regards,\nSarah Chen\nHead of Engineering',
      date: '2026-06-10',
      read: false
    },
    {
      id: 'm2',
      fromId: 'system',
      toId: 'u1',
      fromName: 'JobForest',
      fromAvatar: '🌲',
      subject: 'Your application was viewed',
      preview: 'Good news! DataStream Analytics viewed your application for Full Stack Engineer...',
      body: 'Good news! DataStream Analytics viewed your application for Full Stack Engineer. We will notify you of any updates.',
      date: '2026-06-09',
      read: true
    },
    {
      id: 'm3',
      fromId: 'e2',
      toId: 'u2',
      fromName: 'James Wilson',
      fromAvatar: 'JW',
      subject: 'Offer Letter - UX/UI Designer',
      preview: 'Congratulations Priya! We are thrilled to extend an offer for the UX/UI Designer...',
      body: 'Congratulations Priya!\n\nWe are thrilled to extend an offer for the UX/UI Designer position at Aurora Creative. Please find the offer details attached.\n\nWe believe your talent and vision will make a tremendous impact on our team.\n\nBest,\nJames Wilson\nCreative Director',
      date: '2026-06-10',
      read: false
    }
  ];

  if (!localStorage.getItem('jf_companies')) localStorage.setItem('jf_companies', JSON.stringify(companies));
  if (!localStorage.getItem('jf_jobs')) localStorage.setItem('jf_jobs', JSON.stringify(jobs));
  if (!localStorage.getItem('jf_candidateProfiles')) localStorage.setItem('jf_candidateProfiles', JSON.stringify(candidateProfiles));
  if (!localStorage.getItem('jf_employerProfiles')) localStorage.setItem('jf_employerProfiles', JSON.stringify(employerProfiles));
  if (!localStorage.getItem('jf_applications')) localStorage.setItem('jf_applications', JSON.stringify(applications));
  if (!localStorage.getItem('jf_messages')) localStorage.setItem('jf_messages', JSON.stringify(messages));

  // ─── HELPER FUNCTIONS ─────────────────────────

  function getJobs(filters = {}) {
    let filtered = [...jobs];
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(kw) ||
        j.description.toLowerCase().includes(kw) ||
        j.skills.some(s => s.toLowerCase().includes(kw)) ||
        getCompanyById(j.companyId)?.name.toLowerCase().includes(kw)
      );
    }
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(j => filters.type.includes(j.type));
    }
    if (filters.workMode && filters.workMode.length > 0) {
      filtered = filtered.filter(j => filters.workMode.includes(j.workMode));
    }
    if (filters.experience && filters.experience.length > 0) {
      filtered = filtered.filter(j => filters.experience.includes(j.experience));
    }
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(j => filters.category.includes(j.category));
    }
    if (filters.salaryMin) {
      filtered = filtered.filter(j => j.salary.max >= filters.salaryMin);
    }
    if (filters.salaryMax) {
      filtered = filtered.filter(j => j.salary.min <= filters.salaryMax);
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }
    // Sort
    if (filters.sort === 'salary-high') {
      filtered.sort((a, b) => b.salary.max - a.salary.max);
    } else if (filters.sort === 'salary-low') {
      filtered.sort((a, b) => a.salary.min - b.salary.min);
    } else if (filters.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    } else if (filters.sort === 'applicants') {
      filtered.sort((a, b) => a.applicants - b.applicants);
    }
    return filtered;
  }

  function getJobById(id) {
    return jobs.find(j => j.id === id) || null;
  }

  function getCompanies() {
    return [...companies];
  }

  function getCompanyById(id) {
    return companies.find(c => c.id === id) || null;
  }

  function getCurrentUser() {
    const stored = localStorage.getItem('jf_currentUser');
    if (stored) return JSON.parse(stored);
    // Default to first candidate for prototype
    return candidateProfiles[0];
  }

  function setCurrentUser(user) {
    localStorage.setItem('jf_currentUser', JSON.stringify(user));
    if (user.role === 'candidate') {
      const idx = candidateProfiles.findIndex(c => c.id === user.id);
      if (idx >= 0) {
        candidateProfiles[idx] = user;
      } else {
        candidateProfiles.push(user);
      }
      localStorage.setItem('jf_candidateProfiles', JSON.stringify(candidateProfiles));
    } else if (user.role === 'employer') {
      const idx = employerProfiles.findIndex(e => e.id === user.id);
      if (idx >= 0) {
        employerProfiles[idx] = user;
      } else {
        employerProfiles.push(user);
      }
      localStorage.setItem('jf_employerProfiles', JSON.stringify(employerProfiles));
    }
  }

  function getUserApplications(userId) {
    return applications.filter(a => a.candidateId === userId).map(a => ({
      ...a,
      job: getJobById(a.jobId),
      company: getCompanyById(getJobById(a.jobId)?.companyId)
    }));
  }

  function getJobApplications(jobId) {
    return applications.filter(a => a.jobId === jobId).map(a => ({
      ...a,
      candidate: candidateProfiles.find(c => c.id === a.candidateId)
    }));
  }

  function saveApplication(candidateId, jobId, coverLetter) {
    const newApp = {
      id: 'a' + (applications.length + 1),
      candidateId,
      jobId,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      coverLetter
    };
    applications.push(newApp);
    localStorage.setItem('jf_applications', JSON.stringify(applications));
    return newApp;
  }

  function updateApplicationStatus(appId, newStatus) {
    const app = applications.find(a => a.id === appId);
    if (app) {
      app.status = newStatus;
      localStorage.setItem('jf_applications', JSON.stringify(applications));
      return true;
    }
    return false;
  }

  function retractApplication(appId) {
    const idx = applications.findIndex(a => a.id === appId);
    if (idx >= 0) {
      applications.splice(idx, 1);
      localStorage.setItem('jf_applications', JSON.stringify(applications));
      return true;
    }
    return false;
  }

  function saveJob(job) {
    jobs.unshift(job);
    localStorage.setItem('jf_jobs', JSON.stringify(jobs));
  }

  function saveCompany(company) {
    const idx = companies.findIndex(c => c.id === company.id);
    if (idx >= 0) {
      companies[idx] = company;
    } else {
      companies.push(company);
    }
    localStorage.setItem('jf_companies', JSON.stringify(companies));
  }

  function addMessage(msg) {
    messages.push(msg);
    localStorage.setItem('jf_messages', JSON.stringify(messages));
  }

  function toggleSavedJob(jobId) {
    const idx = savedJobs.indexOf(jobId);
    if (idx >= 0) {
      savedJobs.splice(idx, 1);
    } else {
      savedJobs.push(jobId);
    }
    localStorage.setItem('jf_savedJobs', JSON.stringify(savedJobs));
    return savedJobs.includes(jobId);
  }

  function isJobSaved(jobId) {
    return savedJobs.includes(jobId);
  }

  function getSavedJobs() {
    return savedJobs.map(id => getJobById(id)).filter(Boolean);
  }

  function getMessages(userId) {
    return messages.filter(m => m.toId === userId);
  }

  function getUnreadCount(userId) {
    return messages.filter(m => m.toId === userId && !m.read).length;
  }

  function getCandidateProfiles() {
    return [...candidateProfiles];
  }

  function getCandidateById(id) {
    return candidateProfiles.find(c => c.id === id) || null;
  }

  function getEmployerJobs(companyId) {
    return jobs.filter(j => j.companyId === companyId);
  }

  function getAllSkills() {
    return Object.values(skillCategories).flat();
  }

  function getSkillCategories() {
    return { ...skillCategories };
  }

  function formatSalary(min, max) {
    const format = (n) => '$' + (n / 1000).toFixed(0) + 'K';
    return `${format(min)} - ${format(max)}`;
  }

  function timeAgo(dateStr) {
    const now = new Date('2026-06-10');
    const date = new Date(dateStr);
    const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }

  function hasApplied(candidateId, jobId) {
    return applications.some(a => a.candidateId === candidateId && a.jobId === jobId);
  }

  // Public API
  return {
    getJobs,
    getJobById,
    getCompanies,
    getCompanyById,
    getCurrentUser,
    setCurrentUser,
    getUserApplications,
    getJobApplications,
    saveApplication,
    updateApplicationStatus,
    retractApplication,
    saveJob,
    saveCompany,
    addMessage,
    toggleSavedJob,
    isJobSaved,
    getSavedJobs,
    getMessages,
    getUnreadCount,
    getCandidateProfiles,
    getCandidateById,
    getEmployerJobs,
    getAllSkills,
    getSkillCategories,
    formatSalary,
    timeAgo,
    hasApplied,
    candidateProfiles,
    employerProfiles,
    companies
  };
})();
