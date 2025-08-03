<!-- Accessibility Analyzer - Web Accessibility Testing Tool -->

<h1 align="center">🌐 Accessibility Analyzer</h1>

<p align="center">
  <strong>🧩 Automated Web Accessibility Testing</strong> · ⚙️ MERN Stack · ♿ Powered by axe-core
</p>

<!-- Social Stats (No blue underline, no excessive spacing) -->
<p align="center">
  <img src="https://img.shields.io/github/stars/spandan-git-hub/accessibility-analyzer-v3?style=social&label=Stars&logo=github" alt="GitHub stars" style="vertical-align: middle; margin-right: 4px;">
  <img src="https://img.shields.io/github/forks/spandan-git-hub/accessibility-analyzer-v3?style=social&label=Forks&logo=github" alt="GitHub forks" style="vertical-align: middle;">
</p>

<!-- Meta Info -->
<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License" style="margin-right: 6px;">
  <img src="https://img.shields.io/github/last-commit/spandan-git-hub/accessibility-analyzer-v3?style=for-the-badge" alt="Last Commit">
</p>

---

### ✨ About This Project

A comprehensive web accessibility testing tool that automatically analyzes websites for compliance with accessibility standards. Built with modern web technologies to provide detailed reports and actionable insights for developers and designers.

> 🎯 **Automated scanning** with axe-core integration  
> 📊 **Detailed reporting** with PDF export capabilities  
> 📧 **Email delivery** of accessibility reports  
> 💡 **Modern UI** with responsive design and smooth animations

---

### 🛠 Tech Stack

#### **Backend & Database**
![Node.js](https://img.shields.io/badge/Node.js-3C873A?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-303030?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-10AA50?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongodb&logoColor=white)

#### **Frontend & UI**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-1f1f1f?style=for-the-badge&logo=framer&logoColor=white)
![React Icons](https://img.shields.io/badge/React_Icons-61DAFB?style=for-the-badge&logo=react&logoColor=white)

#### **Testing & Automation**
![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)
![axe-core](https://img.shields.io/badge/axe--core-FF6B35?style=for-the-badge&logo=axe-core&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-339933?style=for-the-badge&logo=nodemailer&logoColor=white)

#### **Deployment & Tools**
![Docker](https://img.shields.io/badge/Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F1502F?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

### 🚀 Features

#### ✅ **Automated Analysis**
- Real-time URL scanning with comprehensive accessibility testing
- Violation detection across critical, serious, moderate, and minor levels
- Detailed issue reports with actionable insights
- Visual impact indicators for rapid assessment

#### 📊 **Report Management**
- Persistent storage with historical tracking (MongoDB)
- Compare and track accessibility trends over time
- Search, filter, and explore previous scans
- Timeline views to visualize progress

#### 📄 **Export & Sharing**
- Professional-grade PDF export of reports
- Automated email delivery of analysis
- Downloadable local copies
- Customizable output templates

#### 🎨 **Modern Interface**
- Fully responsive design (mobile-first)
- Dark mode with neumorphism aesthetics
- Smooth transitions with Framer Motion
- Clean and intuitive navigation

---

### 📦 Installation & Setup

#### ✅ Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

#### 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/spandan-git-hub/accessibility-analyzer-v3.git
cd accessibility-analyzer-v3

# Install frontend
cd client
npm install

# Install backend
cd ../server
npm install

#### **Environment Configuration**

**Server (.env):**
```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Client (.env):**
```env
REACT_APP_API_ENPT=http://localhost:4000/api
```

#### **Running the Application**

```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

**Access Points:**
- 🖥️ **Frontend**: http://localhost:3000  
- 🔧 **Backend API**: http://localhost:4000

---

### 📁 Project Structure

```text
accessibility-analyzer-v3/
├── client/                   # React frontend application
│   ├── public/               # Static assets and HTML template
│   ├── src/
│   │   ├── UI/               # React components
│   │   │   └── Dash.jsx      # Main dashboard component
│   │   ├── logic/            # API integration layer
│   │   │   └── api.js        # API service functions
│   │   └── index.js          # Application entry point
│   ├── package.json          # Frontend dependencies
│   └── tailwind.config.js    # Tailwind CSS configuration
├── server/                   # Node.js backend application
│   ├── routes/               # API route handlers
│   │   ├── analysis.js       # Accessibility analysis endpoints
│   │   ├── report.js         # Report management endpoints
│   │   └── pdf.js            # PDF generation endpoints
│   ├── models/               # MongoDB data models
│   │   └── report.js         # Report schema definition
│   ├── index.js              # Server entry point
│   ├── Dockerfile            # Container configuration
│   └── package.json          # Backend dependencies
└── README.md                 # Project documentation
```

---

### 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

### 📞 Support & Contact

**Need help or have questions?**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/spandanmhaske/)
[![Gmail](https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:spandanmhaske.work@gmail.com)
[![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://accessibility-analyzer-v3.vercel.app)

---

**Built with ❤️ for better web accessibility**

*Empowering developers to create inclusive digital experiences*
