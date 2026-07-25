# 🛡️ CardShield — Dark Web Credit Card Checker

CardShield is a modern, full-stack web application designed to simulate checking if a user's credit card details have been compromised and leaked on the Dark Web. It features a premium UI, interactive 3D elements, real-time statistics via WebSockets, and a robust backend.

## ✨ Features

- **Interactive 3D Card Preview:** Enter your card details and watch the 3D card update in real-time. It supports mouse-tracking tilt effects and automatically flips to show the CVV.
- **Dark Web Database Simulation:** Securely scans against a seeded MongoDB database to check for compromised cards.
- **Real-Time Live Statistics:** Powered by **Socket.io**, the dashboard instantly updates across all connected clients whenever a card is checked or removed.
- **Premium Glassmorphism UI:** Built with custom CSS, fluid animations, and high-quality SVG icons.
- **One-Click Data Removal:** Simulate removing your compromised data from the dark web database.
- **Security-First Approach:** Implements SHA-256 hashing for card lookups and rate-limiting to prevent abuse.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Custom Vanilla CSS (Premium Dark Theme / Glassmorphism)
- **Real-Time:** Socket.io-client
- **Typography:** Source Sans 3 (Google Fonts)

### Backend
- **Server:** Node.js & Express.js
- **Database:** MongoDB & Mongoose
- **Real-Time:** Socket.io
- **Security:** Helmet, Express Rate Limit, Crypto (SHA-256)

---

## 🚀 Getting Started

Follow these instructions to get the project running locally.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

### 2. Installation

Install dependencies for both the client and the server.

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 3. Environment Variables

Create a `.env` file in the **server** directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/creditcard-checker
CLIENT_URL=http://localhost:3000
```

Create a `.env.local` file in the **client** directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Seed the Database

Before running the app, populate the database with sample compromised cards so you have something to search for!

```bash
cd server
node seed.js
```
*(This will output a list of valid test card numbers you can use in the UI).*

### 5. Running the Application

You will need two terminals running simultaneously.

**Start the Backend Server (Terminal 1):**
```bash
cd server
npm run dev
```

**Start the Frontend Client (Terminal 2):**
```bash
cd client
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## ⚠️ Disclaimer
This application is a **simulation/demonstration tool** created for educational purposes. 
**Never enter your real credit card information into untrusted applications.** All data processed in this application is handled locally or via the configured MongoDB instance.
