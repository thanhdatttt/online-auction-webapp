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
## 🏗️ Project Structure

online-auction-app/
│
├── client/ # React + TailwindCSS frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page-level components (Home, Product, Profile)
│ │ ├── hooks/ # Custom React hooks
│ │ ├── utils/ # Helper functions
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── public/
│ ├── package.json
│ └── ...
│
├── server/ # Node.js + Express + MongoDB backend
│ ├── models/ # Mongoose models
│ ├── routes/ # Express routes (auth, auctions, bids)
│ ├── controllers/ # Route logic and DB operations
│ ├── middleware/ # Authentication and error handling
│ ├── config/ # Database connection, environment setup
│ ├── server.js # Entry point
│ ├── .env.example
│ └── package.json
│
├── .gitignore
├── README.md
└── package.json
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
