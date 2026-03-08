# 🧠 ReconAI - Agentic Document Intelligence Platform

<div align="center">

**Transform your logistics reconciliation with AI-powered 3-way document matching**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🚀 Overview

**ReconAI** is an enterprise-grade, AI-powered document reconciliation platform designed specifically for logistics operations. It automates the tedious and error-prone process of matching Lorry Receipts (LR), Proof of Delivery (POD), and Tax Invoices using advanced machine learning and intelligent document extraction algorithms.

### 💡 The Problem We Solve

In traditional logistics operations, reconciling thousands of documents across multiple sources is:
- ⏰ **Time-consuming**: Manual verification takes hours per batch
- ❌ **Error-prone**: Human oversight leads to costly discrepancies  
- 📊 **Difficult to track**: No centralized visibility into audit status
- 🔍 **Hard to analyze**: Missing insights on vendor performance and risk patterns

### ✨ Our Solution

ReconAI leverages **Agentic AI** to automatically extract, match, and reconcile documents with unprecedented accuracy, providing real-time insights and automated risk assessment for logistics operations.

---

## 🎯 Key Features

### 🤖 **Intelligent Document Processing**
- **AI-Powered Extraction**: Automatically extracts key data points from PDFs (LR Number, Invoice Amount, Dates, Quantities, etc.)
- **Multi-Format Support**: Handles various document formats and layouts seamlessly
- **Smart Field Mapping**: Intelligently maps fields across different document types

### 🔄 **3-Way Reconciliation Engine**
- **Automated Matching**: Matches Lorry Receipt, POD, and Invoice in real-time
- **Discrepancy Detection**: Identifies mismatches in amounts, quantities, dates, and other critical fields
- **Confidence Scoring**: Provides match confidence percentages for each reconciliation

### 📊 **Advanced Analytics Dashboard**
- **Real-Time KPIs**: Track Total Audits, Match Rates, Processing Time, and Risk Scores
- **Visual Insights**: Interactive charts for status distribution, vendor performance, and risk breakdown
- **Trend Analysis**: Monitor reconciliation patterns over time with animated counters

### ⚡ **Risk Intelligence**
- **Automated Risk Scoring**: ML-powered risk assessment for each audit (Low, Medium, High, Critical)
- **Risk Factor Analysis**: Identifies specific risk contributors (amount variance, date discrepancies, etc.)
- **Proactive Alerting**: Flags high-risk audits for immediate attention

### 🎨 **Premium User Experience**
- **Modern UI/UX**: Sleek, gradient-rich interface with smooth animations
- **Dark/Light Mode**: Fully themed with seamless mode switching
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-Time Updates**: Live processing animations and status updates

---

## 🔄 User Flow

### 1️⃣ **Upload Documents**
Users navigate to the "New Audit" page and upload three documents:
- 📄 Lorry Receipt (LR)
- ✅ Proof of Delivery (POD)  
- 🧾 Tax Invoice

Drag-and-drop interface with live upload progress and file validation.

### 2️⃣ **AI Extraction & Processing**
The backend AI agents automatically:
- Extract structured data from each document
- Validate data integrity and completeness
- Prepare documents for reconciliation

Real-time processing animation keeps users informed of progress.

### 3️⃣ **Automated Reconciliation**
The reconciliation engine performs:
- **3-way matching** across all documents
- **Field-level comparison** for amounts, quantities, dates, and IDs
- **Discrepancy identification** with detailed explanations
- **Risk scoring** based on ML models

### 4️⃣ **Review Results**
Users can:
- View comprehensive dashboard with all audit metrics
- Drill into individual audits to see detailed 3-way comparison
- Analyze discrepancies with visual indicators
- Review risk scores and contributing factors
- Track resolution status and timeline

### 5️⃣ **Analytics & Insights**
Access powerful analytics:
- Vendor performance metrics
- Historical trend analysis
- Risk pattern identification
- Export capabilities for reporting

---

## 🛠️ Technology Stack

### **Frontend** (This Repository)
- **Framework**: Next.js 16.1 with App Router
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 3.4 with custom design system
- **State Management**: Zustand 5.0
- **Data Fetching**: TanStack Query (React Query) 5.90
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion 12.35
- **Charts**: Recharts 3.8
- **Icons**: Lucide React

### **Backend**
- **Framework**: FastAPI 1.0
- **Language**: Python 3.x
- **Document Processing**: AI/ML extraction services
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Architecture**: RESTful with automatic OpenAPI documentation

### **Features**
- 🔒 CORS-enabled secure API communication
- 🎨 Theme persistence with next-themes
- 📱 Fully responsive design
- ♿ Accessibility-first component library
- 🚀 Optimized performance with code splitting
- 💾 Efficient state management with Zustand

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 20+ and npm
- Python 3.9+
- pip

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
```
http://localhost:3000
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the API server**
```bash
uvicorn main:app --reload
```

4. **API will be available at**
```
http://localhost:8000
```

5. **View API documentation**
```
http://localhost:8000/docs
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Main dashboard view
│   │   ├── upload/             # Document upload interface
│   │   ├── reconciliation/     # Audit history & detail views
│   │   ├── analytics/          # Analytics & reporting
│   │   └── settings/           # User preferences
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── reconciliation/     # 3-way compare & discrepancy views
│   │   ├── upload/             # File upload components
│   │   ├── layout/             # Header, Sidebar, MainContent
│   │   ├── shared/             # Reusable components
│   │   └── ui/                 # Base UI components (buttons, cards, etc.)
│   └── lib/
│       ├── api.ts              # API client with axios
│       ├── store.ts            # Zustand state management
│       ├── types.ts            # TypeScript type definitions
│       └── utils.ts            # Utility functions
└── public/                     # Static assets
```

---

## 🎨 Key Functionalities

### Dashboard
- **Real-time KPI Cards**: Animated counters showing metrics like Total Audits, Match Rate, Avg Processing Time
- **Status Distribution**: Pie chart visualization of audit statuses (Matched, Partial, Discrepancy, Pending)
- **Recent Audits Table**: Quick access to latest reconciliations with status badges
- **Risk Breakdown**: Visual representation of risk distribution across audits
- **Vendor Performance**: Compare performance metrics across different vendors

### Upload Interface
- **Multi-file Drop Zones**: Three dedicated zones for LR, POD, and Invoice
- **Drag & Drop Support**: Intuitive file upload with visual feedback
- **File Validation**: Automatic format and size validation
- **Processing Animation**: Engaging visual feedback during AI extraction
- **Demo Mode**: Sample documents available for testing

### Reconciliation Detail View
- **3-Way Comparison Table**: Side-by-side view of all three documents
- **Field-Level Matching**: Visual indicators (✓ match, ⚠ discrepancy) for each field
- **Discrepancy Timeline**: Track when and how discrepancies were identified
- **Risk Score Gauge**: Visual representation of audit risk level
- **Risk Factor Cards**: Detailed breakdown of risk contributors

### Analytics
- **Trend Analysis**: Historical view of reconciliation metrics
- **Vendor Insights**: Performance comparison and ranking
- **Risk Patterns**: Identify common discrepancy patterns
- **Export Capabilities**: Download reports for external analysis

---

## 🌟 Design Highlights

- **Gradient-Rich UI**: Modern aesthetic with purple-indigo-pink gradients throughout
- **Micro-interactions**: Smooth hover effects, scale animations, and transitions
- **Glass-morphism**: Backdrop blur effects for depth and sophistication
- **Consistent Spacing**: 8px grid system for visual harmony
- **Accessible Colors**: WCAG-compliant color contrast ratios
- **Responsive Typography**: Fluid font sizes that adapt to screen size

---

## 🚀 Performance Optimizations

- ⚡ **Code Splitting**: Automatic route-based code splitting with Next.js
- 🖼️ **Image Optimization**: Next.js Image component for optimal loading
- 📦 **Tree Shaking**: Eliminates unused code in production builds
- 🎯 **React Query**: Intelligent caching and background refetching
- 💨 **Lazy Loading**: Components loaded on-demand for faster initial load

---

## 🔮 Future Enhancements

- 🌐 **Multi-language Support**: Internationalization for global deployment
- 🔔 **Real-time Notifications**: WebSocket integration for live updates
- 📧 **Email Integration**: Automated alerts for high-risk audits
- 🤝 **Collaborative Features**: Multi-user audit review and approval workflows
- 📱 **Mobile App**: Native iOS/Android applications
- 🔗 **ERP Integration**: Connect with SAP, Oracle, and other enterprise systems

---

## 📄 License

This project is proprietary software developed for the Lorri Hackathon.

---

## 👥 Contributing

This is a hackathon project. For any inquiries or collaboration opportunities, please contact the development team.

---

<div align="center">

**Built with ❤️ using Next.js, FastAPI, and cutting-edge AI technology**

*Revolutionizing logistics reconciliation, one document at a time*

</div>
