<div align="center">
  
  # ExamIQ 🎓 
  ### AI-Powered Examination & Learning Assistant
  
  *A 6th Semester Mini-Project focusing on Generative AI, Full-Stack Development, and Cloud/DevOps.*
</div>

---

## 📖 About The Project

**ExamIQ** is an intelligent, AI-driven educational platform designed to streamline the learning and examination preparation process. Built as a 6th-semester mini-project, it leverages the **Google Gemini Pro API** to automatically generate quiz questions, summaries, and personalized learning materials from student inputs (Text, PDFs, or Documents). 

The project demonstrates a complete end-to-end software development lifecycle (SDLC), featuring a modern React frontend, a robust Node.js backend with hybrid database support (Azure Cosmos DB & SQLite), and a heavily automated CI/CD pipeline deploying to an Azure Kubernetes Service (AKS) cluster.

---

## ✨ Features

- 🧠 **Generative AI Integration**: Powered by Google's Gemini API for dynamic question generation and document summarization.
- 📂 **Multi-Format Support**: Upload `.pdf`, `.docx`, or raw text to generate interactive exams.
- 🗄️ **Hybrid Database Architecture**: 
  - Uses **Azure Cosmos DB** for production scalability.
  - Fallback to **SQLite** for zero-config local development.
- 🔒 **Cloud Security**: Integrated with **Azure Key Vault** to securely inject secrets during runtime.
- 🚀 **Enterprise DevOps Pipeline**: Fully automated Jenkins pipeline handling SonarQube quality testing, OWASP dependency checks, Trivy container security scanning, and Kubernetes deployments.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite**
- **Tailwind CSS v4** + Framer Motion (Animations)
- Lucide React (Icons) & Recharts (Data Visualization)

### Backend
- **Node.js** with **Express.js**
- **Google GenAI SDK** (Gemini)
- **Azure Cosmos DB** (Primary) & **Better-SQLite3** (Local)
- pdfjs & mammoth (Parse PDFs and Word docs)

### DevOps & Cloud Infrastructure
- **Docker**: Multi-stage containerization.
- **Jenkins**: CI/CD Pipelines (`Jenkinsfile`).
- **Kubernetes (AKS)**: Container Orchestration & workload management.
- **Azure Container Registry (ACR)**: Image repository.
- **SonarQube & Trivy**: Code quality and vulnerability scanning.
- **OWASP**: Dependency vulnerability checks.

---

## ⚙️ Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/ExamIQ.git
cd ExamIQ
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
# Required for AI functionalities
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: To use SQLite locally instead of Azure Cosmos DB
USE_SQLITE=true
```

### 3. Run the Application
The project uses `concurrently` to run both the frontend (Vite) and backend (Express) in one simple command.

```bash
npm run dev
```
- **Frontend** will be available at `http://localhost:5173`
- **Backend API** will be available at `http://localhost:3000`

---

## 🚢 CI/CD Pipeline (Jenkins)

This project features a production-ready Jenkins pipeline with the following stages:

1. **SonarQube Analysis**: Runs static code analysis to ensure code quality.
2. **OWASP Dependency Check**: Scans npm dependencies for known vulnerabilities.
3. **Build Docker Image**: Containerizes the application.
4. **Trivy Scan**: Scans the Docker image for Critical/High OS vulnerabilities.
5. **Push to ACR**: Pushes the secure image dynamically (e.g., `v${BUILD_NUMBER}`).
6. **Deploy to AKS**: Applies Kubernetes manifests (`k8s/`) and automatically triggers a rolling update for the new image tag.

---

## 👥 Contributors
*(Add your team members here)*
- **[Your Name]** - Full Stack & DevOps
- **[Team Member 2]** - Frontend Developer
- **[Team Member 3]** - Backend Developer

---

<div align="center">
  <i>Made with ❤️ by the ExamIQ Team</i>
</div>
