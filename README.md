# Grain - Educational Resources and Course Marketplace

Grain is a full-stack educational platform and course marketplace where users can discover, add, and manage courses. 

## 🚀 Features

- **User Authentication:** Secure login and signup functionality using JWT and bcrypt.
- **Explore Courses:** Browse available educational resources and courses.
- **Course Management:** Add and detail new courses on the platform.
- **User Profiles:** Manage personal user profiles.
- **Wishlist:** Save favorite courses for later (API support available).

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with Vite ⚡
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Middleware:** CORS for cross-origin requests

## 📁 Project Structure

```text
Grain/
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── controllers/# Logic for handling requests
│   │   ├── middleware/ # Custom Express middlewares
│   │   ├── models/     # Mongoose schemas (User, Course)
│   │   ├── routes/     # API endpoints (auth, course, profile, wishlist)
│   │   └── server.js   # Entry point
│   └── package.json
└── frontend/           # React frontend application
    ├── src/
    │   ├── components/ # Reusable UI components (e.g., Navbar)
    │   ├── context/    # React context (AuthContext)
    │   ├── pages/      # Route pages (Home, Login, Signup, Profile, AddCourse, CoursePage)
    │   ├── App.jsx     # Main application routing
    │   └── main.jsx    # React DOM render
    └── package.json
```

## ⚙️ Local Setup and Execution

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or MongoDB Atlas)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend/` root directory and add:
   ```env
   MONGO_URI=mongodb://localhost:27017/eduapp
   # Add your JWT_SECRET here if your auth implementation requires it
   ```
4. Start the server:
   ```bash
   node src/server.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173` (or the port specified by Vite).*
