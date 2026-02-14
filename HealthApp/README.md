# 🏥 Healthcare Management System (CareNet360)

A comprehensive full-stack healthcare management system built with **Next.js 15**, **React 19**, **MongoDB Atlas**, and **Custom CSS**. Supporting multi-hospital ecosystems with role-based portals for Patients, Doctors, Pharmacists, and Administrators.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [User Roles](#user-roles--features)
- [API Endpoints](#api-endpoints)
- [Database](#database-collections)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Multi-Role Authentication

- **Patient Portal**: Book appointments, view medical records, digital health cards, payment processing
- **Doctor Portal**: Manage appointments, QR code scanner, create medical records, prescribe medications
- **Pharmacist Portal**: Manage medicine inventory, view prescriptions, payment tracking
- **Admin Dashboard**: User management, system analytics, appointment oversight

### Core Functionality

- JWT-based authentication with secure password hashing
- Role-based access control and routing
- MongoDB Atlas cloud database integration
- Digital health cards with QR codes
- **QR Code Scanner for Doctors**: Scan patient health cards to view complete medical history
- Appointment booking and management
- Medical records system with doctor notes
- Prescription management
- Medicine inventory tracking
- **Full Payment Processing**: Credit/Debit card, UPI, Net Banking
- Payment history and transaction tracking
- Analytics and reporting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB Atlas account (free tier available)
- Stripe account (for payment processing)

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/SandaliTharaka/carenet360-healthapp.git
cd carenet360-healthapp/HealthApp

# 2. Install dependencies
pnpm install

# 3. Create .env.local file with your secrets
cp .env.example .env.local  # or create manually

# 4. Add your environment variables (see Configuration section)

# 5. Run development server
pnpm dev

# 6. Open browser
# 🎉 Visit http://localhost:3000
```

Login with default admin:

- **Email**: `admin@healthcare.com`
- **Password**: `Admin@123456`

---

## 🔧 Installation

### Step 1: Clone Repository

```bash
git clone https://github.com/SandaliTharaka/carenet360-healthapp.git
cd carenet360-healthapp/HealthApp
```

### Step 2: Install Dependencies

```bash
pnpm install
```

_(Uses pnpm for faster installs. Or use `npm install` for npm)_

### Step 3: Setup MongoDB Atlas

1. **Create Free Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**:
   - Click "Build a Database"
   - Select **FREE** (M0 tier)
   - Choose region
   - Click "Create Cluster"

3. **Add Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Select "Read and write to any database"
   - Save credentials

4. **Allow IP Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (for development)

5. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the string and replace `<password>` with your DB password

**Example**:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority
```

### Step 4: Setup Stripe (Optional)

1. Create account at https://stripe.com
2. Get test keys from Dashboard
3. Add to `.env.local`

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file in project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority

# JWT Secret (min 32 characters)
JWT_SECRET=0469dd13ae9e78967ebd910fde7ce12166c4893638f97d7096d74e42c48b03be

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@healthcare.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=System Administrator

# Stripe Payment Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
```

⚠️ **Important**: Never commit `.env.local` to Git (already in `.gitignore`)

---

## 🏃 Running the Project

### Development Mode

```bash
pnpm dev
```

- Opens at `http://localhost:3000`
- Hot reload enabled
- Full debugging support

### Production Build

```bash
pnpm build
pnpm start
```

### Other Commands

```bash
pnpm lint        # Run ESLint
pnpm test        # Run Jest tests
pnpm seed:admin      # Create default admin user
pnpm seed:medicines  # Populate medicine database
```

---

## 📁 Project Structure

```
HealthApp/
├── app/                      # Next.js 15 App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── appointments/   # Appointment management
│   │   ├── doctors/        # Doctor endpoints
│   │   ├── medical-records/ # Health records
│   │   ├── payments/       # Payment processing
│   │   ├── prescriptions/  # Prescriptions
│   │   ├── medicines/      # Pharmacy inventory
│   │   └── hospitals/      # Hospital management
│   ├── auth/               # Login/Register pages
│   ├── patient/            # Patient portal
│   ├── doctor/             # Doctor portal
│   ├── pharmacist/         # Pharmacist portal
│   ├── admin/              # Admin dashboard
│   └── layout.tsx          # Root layout
├── components/              # Reusable components
│   └── ui/                 # 40+ UI components (Radix UI)
├── lib/                     # Core utilities
│   ├── mongodb.ts          # Database connection
│   ├── auth.ts             # JWT & authentication
│   ├── stripe.ts           # Payment processing
│   └── utils.ts            # Helper functions
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
├── scripts/                 # Database seeding scripts
└── middleware.ts            # Authentication middleware
```

---

## 👥 User Roles & Features

### 👨‍⚕️ **Doctor**

- View daily appointment schedule
- **Scan patient QR codes** for instant access to:
  - Complete patient information
  - Full medical history
  - Previous prescriptions
  - Past appointments
- Add medical records with diagnosis
- Write prescriptions
- Manage patient list

### 🏥 **Patient**

- Dashboard with health overview
- Book and manage appointments
- View medical records
- Digital health card with QR code
- Access prescriptions
- Process payments (Stripe)
- View payment history

### 💊 **Pharmacist**

- Medicine inventory management
- View and fulfill prescriptions
- Stock tracking
- Payment processing for medicine sales
- Order management

### 👨‍💼 **Admin**

- Manage hospitals (multi-hospital support)
- Register staff members (doctors, pharmacists)
- User management
- View system analytics
- Appointment oversight
- Platform statistics

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
GET    /api/auth/me             # Get current user
```

### Appointments

```
GET    /api/appointments        # List appointments
POST   /api/appointments        # Book appointment
PATCH  /api/appointments/[id]   # Update appointment
DELETE /api/appointments/[id]   # Cancel appointment
```

### Medical Records

```
GET    /api/medical-records     # List medical records
POST   /api/medical-records/create  # Add medical record
```

### Health Card (QR Scanner)

```
GET    /api/health-card         # Get patient card
POST   /api/health-card/scan    # Scan QR code
PATCH  /api/health-card         # Update card info
```

### Prescriptions

```
GET    /api/prescriptions       # List prescriptions
POST   /api/prescriptions/create # Create prescription
```

### Medicines

```
GET    /api/medicines           # List medicines
POST   /api/medicines           # Add medicine
PATCH  /api/medicines/[id]      # Update medicine
DELETE /api/medicines/[id]      # Delete medicine
```

### Payments

```
GET    /api/payments            # Payment history
POST   /api/payments            # Record payment
POST   /api/payments/process    # Process payment
```

---

## 💾 Database Collections

| Collection        | Purpose                   |
| ----------------- | ------------------------- |
| `users`           | User accounts (all roles) |
| `appointments`    | Appointment bookings      |
| `medical_records` | Patient medical history   |
| `prescriptions`   | Doctor prescriptions      |
| `medicines`       | Pharmacy inventory        |
| `hospitals`       | Hospital information      |
| `health_cards`    | Digital health cards      |
| `payments`        | Payment transactions      |

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ httpOnly secure cookies
- ✅ PBKDF2 password hashing with salt
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ Environment variable secrets
- ✅ Input validation & sanitization
- ✅ CORS protection

---

## 📦 Technology Stack

| Layer                | Technology                         |
| -------------------- | ---------------------------------- |
| **Frontend**         | Next.js 15, React 19, Custom CSS   |
| **Backend**          | Next.js API Routes, Server Actions |
| **Database**         | MongoDB Atlas                      |
| **Authentication**   | JWT + httpOnly Cookies             |
| **State Management** | React Hooks                        |
| **UI Components**    | Radix UI (40+)                     |
| **Styling**          | Custom CSS Modules                 |
| **QR Codes**         | QRCode library                     |
| **Payments**         | Stripe API                         |
| **Validation**       | Zod, React Hook Form               |
| **Charts**           | Recharts                           |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open Pull Request

---

## 📝## Setup Instructions

### 1. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your environment variables in the **Vars** section of the v0 sidebar

### 2. Environment Variables

Add the following environment variable in the **Vars** section:

\`\`\`
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
\`\`\`

### 3. Access the Application

- The application is ready to use once you add the MongoDB URI
- Register as a new user (select your role: Patient, Doctor, Pharmacist, or Admin)
- Login and explore the features

## 📞 Support & Contact

- 📧 Issues: Open an issue on GitHub
- 💬 Discussions: Use GitHub Discussions
- 🐛 Bug Reports: Create a detailed issue with reproduction steps

---

## 📄 License

MIT License - Free to use for learning and commercial purposes.

```
MIT License

Copyright (c) 2026 SandaliTharaka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI Components from [Radix UI](https://www.radix-ui.com/)
- Database by [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Payments powered by [Stripe](https://stripe.com)

---

**⭐ If you find this helpful, please consider giving it a star!**

For detailed setup guide, see [SETUP.md](SETUP.md)
