# JobForest 🌳

**A career-matching platform designed for the modern tech ecosystem.**

JobForest is a comprehensive job board and talent discovery engine built for speed, intelligence, and results. Going beyond traditional listings, it leverages advanced matching algorithms and a dynamic "Living Portfolio" concept to connect the right talent with the right opportunities seamlessly.

## 🌟 Key Features

### 🎯 Smart Job Matching
- **Algorithmic Matching**: Finds the best candidates for every role based on skills, experience, and preferences.
- **Candidate Discovery**: Employers can filter and discover top talent matching their specific requirements.

### 💼 Dynamic Job Management
- **CRUD Operations**: Create, Edit, View, and Delete job listings.
- **Advanced Search**: Filter jobs by keyword, category, location, and salary range.
- **Status Tracking**: Track applications through the hiring pipeline (Applied → Shortlisted → Interview → Offer → Hired/Rejected).

### 👤 Comprehensive Profiles
- **Candidate Profiles**: Detailed portfolio including work history, skills, education, and projects.
- **Employer Profiles**: Company details, industry focus, and culture insights.
- **Living Portfolio**: A dynamic, evolving resume that showcases a candidate's professional journey.

### 💬 Seamless Communication
- **Real-time Messaging**: Integrated chat system for direct communication between candidates and employers.
- **Notifications**: Keep track of new messages, application updates, and interview invites.

### 🔐 Secure Authentication
- **Role-Based Access**: Secure login and dashboard separation for Candidates and Employers.
- **Session Management**: Persistent login sessions using LocalStorage.

## 🛠️ Tech Stack

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables for a consistent "Design System" look and feel.
- **Storage**: LocalStorage for client-side data persistence.
- **Design System**: **"TalentBank CareerOS"** - A modern, professional UI/UX framework.

## 📊 Quick Stats (Demo Purposes)

| Metric | Count |
|--------|-------|
| Total Jobs | 11 |
| Total Candidates | 6 |
| Total Employers | 6 |
| Active Applications | 5 |
| Saved Jobs | 3 |

## 📂 Project Structure

```
JobForest/
├── css/                     # Stylesheets & Design System
├── pages/                   # HTML pages for different features
├── js/                      # Core application logic
│   ├── app.js               # Global application setup
│   ├── auth.js              # Authentication & User Management
│   ├── components.js        # UI Component rendering
│   ├── dashboard.js         # Dashboard logic
│   ├── data.js              # Mock data & LocalStorage management
│   ├── matching.js          # Matching algorithms
│   ├── portfolio.js         # Living Portfolio features
│   └── search.js            # Search & Filtering
└── index.html               # Landing Page & Home
```

## 🏁 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd JobForest
   ```

2. **Open in Browser:**
   Simply open `index.html` in your web browser.
   ```bash
   # Or use a simple local server
   python -m http.server 8000
   ```
---
