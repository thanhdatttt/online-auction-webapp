# 🛒 Online Auction Web App

An **online auction platform** built with **React**, **Node.js**, **TailwindCSS**, and **MongoDB**, allowing users to bid on products in real-time, manage auction listings, and securely process transactions.

This project demonstrates a **modern full-stack web architecture** with a RESTful API, responsive frontend, authentication, and persistent data storage.

---

## 🚀 Main Features

### 🧭 User Features

* User authentication (Sign up, Log in, Log out)
* Create, edit, and delete auction listings
* Place and update bids in real-time (WebSockets (Socket.IO))
* View product details and auction countdown timers
* Responsive UI
* User profile and watchlist

### ⚙️ Admin Features

* Manage all user accounts and product listings
* Remove inappropriate items or bids
* Dashboard with active auction statistics

### 💡 Technical Highlights

* Full-stack JavaScript (React + Node.js)
* RESTful API design
* Secure password hashing and JWT authentication
* Real-time updates via WebSockets or polling
* Modular MVC backend architecture
* TailwindCSS with modern design

---

## 📁 Project Structure

```text
online-auction-webapp/
│
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── stores/          # Zustand state management
│   │   ├── services/        # API service layer
│   │   ├── libs/            # Custom hooks & shared logic
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── cron/            # Cron
│   │   ├── middlewares/     # Auth & error handling
│   │   ├── configs/         # Environment & DB config
│   │   └── index.js
│   └── package.json
├── .gitignore
├── README.md
```

---

## ⚙️ Tech Stack

### Frontend

* ⚛️ **React (Vite)**
* 🎨 **TailwindCSS**
* 🧭 **React Router**
* 🔄 **Axios** for HTTP requests
* 🧠 **Zustand** for state management

### Backend

* 🟢 **Node.js + Express.js**
* 🍃 **MongoDB + Mongoose**
* 🔑 **JWT (JSON Web Token)** authentication
* 🧩 **dotenv** for environment variables
* 🚦 **CORS** for cross-origin access

### Deployment

* **Vercel (Frontend)**
* **Render (Backend)**

---

## 🍃 MongoDB Setup (MongoDB Atlas)

This project uses **MongoDB Atlas** as the cloud database service.

### 1️⃣ Create MongoDB Atlas Account

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Sign up or log in
3. Create a **Free Cluster (M0)**

---

### 2️⃣ Create Database User

1. Navigate to **Database Access**
2. Click **Add New Database User**
3. Choose **Password Authentication**
4. Set username & password
5. Grant **Read and Write to Any Database**

---

### 3️⃣ Allow Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. Choose one option:
   - `0.0.0.0/0` (Allow access from anywhere – development only)
   - Or your current IP address

---

### 4️⃣ Get MongoDB Connection String

1. Go to **Database → Connect → Connect your application**
2. Copy the connection string:

```text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority
```

3. Replace `<username>`, `<password>`, and `<database>` with your values

---

### 5️⃣ Configure Backend Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auction_db
JWT_SECRET=your_jwt_secret
```

---

### ✅ Test MongoDB Connection

Start the backend server:

```bash
npm run dev
```

If connected successfully, you should see:

```text
MongoDB connected
```

## ▶️ Running the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/online-auction-webapp.git
cd online-auction-webapp
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Backend runs at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🌍 Deployment

This project uses **Vercel** for the frontend and **Render** for the backend.

---

### 🚀 Frontend Deployment (Vercel)

1. Push the repository to GitHub
2. Go to **[https://vercel.com](https://vercel.com)**
3. Create a **New Project** and import the repo
4. Select the `client/` directory
5. Configure:

   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
6. Add environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

7. Deploy

Frontend URL:

```
https://your-frontend.vercel.app
```

---

### 🖥️ Backend Deployment (Render)

1. Go to **[https://render.com](https://render.com)**

2. Create **New → Web Service**

3. Connect GitHub repository

4. Select the `server/` directory

5. Configure:

   * **Runtime:** Node
   * **Build Command:** `npm install`
   * **Start Command:** `npm run start`

6. Add environment variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Backend URL:

```
https://your-backend-name.onrender.com
```

---

### 🔗 Connecting Frontend & Backend

Ensure Axios uses the deployed backend URL:

```js
axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

---

## 📌 Future Improvements

* Payment gateway integration
* Notification system
* Admin analytics dashboard
* Unit & integration tests

---

## 👤 Authors
### Auctiz team
* **Thanh Dat Pham**
Full-stack Developer
* **Van Minh Nguyen**
Full-stack Developer
* **Minh Giang Hoang**
Full-stack Developer
* **Xuan Hung Mai**
Full-stack Developer
