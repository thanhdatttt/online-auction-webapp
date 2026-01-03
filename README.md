# 🛒 Online Auction Web App

An **online auction platform** built with **React**, **Node.js**, **TailwindCSS**, and **MongoDB**, allowing users to bid on products in real-time, manage listings, and securely process transactions.  
This project demonstrates a **full-stack web architecture** with a RESTful API, responsive frontend, and persistent data layer.

---

## 🚀 Features

### 🧭 User Features
- User authentication (Sign up, Log in, Log out)
- Create, edit, and delete auction listings
- Place and update bids in real-time
- View product details and auction countdown timers
- Responsive and mobile-friendly UI
- User profile and bid history

### ⚙️ Admin Features
- Manage all user accounts and product listings
- Remove inappropriate items or bids
- Dashboard with active auction statistics

### 💡 Technical Highlights
- Full-stack JavaScript (React + Node.js)
- RESTful API design
- Secure password hashing and JWT authentication
- Real-time updates via WebSockets or polling
- Modular MVC backend architecture
- TailwindCSS for styling and dark mode support

---
```text
online-auction-webapp/
│
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── stores/          # Zustand stores
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth & error handling
│   │   ├── config/          # Environment & DB config
│   │   └── server.js
│   └── package.json
│
├── .env.
├── README.md
├── package.json
└── package-lock.json
```
---

## ⚙️ Tech Stack

### Frontend
- ⚛️ **React (Vite)**
- 🎨 **TailwindCSS**
- 🔄 **Axios** for HTTP requests
- 🧭 **React Router** for navigation

### Backend
- 🟢 **Node.js + Express.js**
- 🍃 **MongoDB + Mongoose**
- 🔑 **JWT (JSON Web Token)** for authentication
- 🧩 **dotenv** for environment variables
- 🚦 **CORS** for cross-origin access

---
## ▶️ How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/online-auction-webapp.git
cd online-auction-webapp
```

---

### 2️⃣ Run Backend

```bash
cd backend
npm install
npm run dev
```

The backend server will run at:

```
http://localhost:5000
```

---

### 3️⃣ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---
