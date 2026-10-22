# 🎓 VIT Placement & Internship Management Portal

A comprehensive, full-stack Next.js web application designed to streamline and automate campus recruitment drives, student internship workflows, document verification, and AI-driven placement preparation for **Vellore Institute of Technology (VIT)**.

![Architecture Diagram](Architecture.jpg)

---

## 🚀 Key Highlights & Role-Based Portals

The platform supports dedicated, tailored portals for each stakeholder:

| Role | Core Capabilities |
| :--- | :--- |
| 🧑‍🎓 **Student** | Browse & apply for jobs/internships, upload & parse resumes, simulate AI mock interviews, track application status, and view received offers. |
| 🏢 **Recruiter** | Post job listings & internship openings, review applicants, evaluate parsed resumes, schedule interview rounds, and roll out digital offer letters. |
| 👨‍🏫 **Faculty Mentor** | Review & endorse student internship progress, verify weekly reports, and monitor academic compliance. |
| 📋 **Internship Coordinator**| Define departmental semester requirements, track internship credits, and validate NOC / completion certificates. |
| 💼 **TPO (Training & Placement Officer)** | Campus drive management, placement analytics, real-time recruiting statistics, and institutional reporting. |
| 👔 **Company Mentor** | Monitor onboarded student interns, submit performance appraisals, and submit company attendance logs. |
| ⚙️ **Administrator** | Manage user accounts, role-based access control (RBAC), and system configurations. |

---

## 🧠 Smart & AI-Driven Features

- **🤖 AI Interview Simulator**: Interactive mock interview simulator with real-time technical & behavioral questions, scoring, and performance feedback.
- **📄 Automated Document & Resume Parser**: Extracts structured skillsets, experience, and education from PDF/Word resumes with keyword alignment scoring.
- **🔍 Intelligent Internship Verifier**: Multi-tier verification pipeline for offer letters and completion certificates with procedural checks and OCR/AI validation.
- **📊 Real-Time Analytics**: Built with Recharts for visual insights into hiring rates, departmental placement numbers, and salary trends.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, Server Actions)
- **Frontend & Styling**: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Database & Storage**: MongoDB (Atlas Cloud) with Prisma ORM / PostgreSQL adapter support & local offline mock fallback
- **Authentication**: Role-Based Session Management with BcryptJS
- **Document Processing**: `pdf-parse`, `mammoth` (DOCX parsing)
- **Charts & Visualization**: Recharts

---

## 📐 Architecture & System Design

The system follows an extensible modular architecture:

- **System Implementation**:
  ![System Implementation Diagram](system_implementation_diagram.jpg)

- **Workflow Architecture**:
  ![Workflow Diagram](workflow_diagram.jpg)

- **Data Flow & Use Cases**:
  - [Context DFD](context-dfd.svg)
  - [Level-1 DFD](level-1-dfd.svg)
  - [Level-2 DFD](level-2-dfd.svg)
  - [Usecase Diagram](usecase-diagram.svg)

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or later recommended)
- **npm** / **yarn** / **pnpm**

### 2. Clone the Repository
```bash
git clone https://github.com/YashrajKharat/VITPlacement.git
cd VITPlacement
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```bash
cp .env.example .env
```
Update `.env` with your MongoDB connection string and NextAuth secret:
```env
MONGODB_URI="your-mongodb-atlas-uri"
NEXTAUTH_SECRET="your-32-character-secret"
```

> **Note**: If `MONGODB_URI` is not provided, the application automatically uses local mock data (`.mockdb.json`) for seamless offline demonstration.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```text
├── public/                 # Static assets & college branding
├── src/
│   ├── actions/            # Next.js Server Actions (AI, jobs, applications, internships)
│   ├── app/                # Next.js App Router (Dashboard, Login, Registration)
│   │   ├── dashboard/      # Role-specific dashboard views
│   │   │   ├── admin/
│   │   │   ├── company-mentor/
│   │   │   ├── coordinator/
│   │   │   ├── faculty/
│   │   │   ├── recruiter/
│   │   │   ├── student/
│   │   │   └── tpo/
│   ├── components/         # Reusable UI components & layouts
│   └── lib/                # Database clients, auth helpers, verifiers, parsers
├── prisma/                 # Prisma schema definition
├── .env.example            # Sample environment variables
└── README.md               # Project documentation
```

---

## 📜 License
Developed as part of the Software Engineering Mini Project at VIT.
