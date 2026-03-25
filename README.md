# Grain - Educational Resources and Course Marketplace

Grain is a full-stack educational platform and course marketplace where users can discover, add, and manage courses with a role-based access control system.

## 🚀 Features

- **User Authentication:** Secure login and signup functionality using JWT and bcrypt.
- **Role-Based Access Control (RBAC):** Secure access levels for "user" and "admin" roles.
- **Explore Courses:** Browse available educational resources and courses (open to all).
- **Admin Course Management:** Exclusive access for admins to Create, Update, and Delete courses (CRUD).
- **User Profiles:** Manage personal user profiles.
- **Wishlist:** Save favorite courses for later.

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
- **Authentication:** JWT (JSON Web Tokens) with embedded roles & bcryptjs
- **Middleware:** CORS and custom RBAC authorization filters

## 📁 Project Structure

```text
Grain/
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── controllers/# Logic for handling requests
│   │   ├── middleware/ # Auth and RBAC middlewares
│   │   ├── models/     # Mongoose schemas (User, Course)
│   │   ├── routes/     # API endpoints (auth, course, profile, wishlist)
│   │   └── server.js   # Entry point
│   └── package.json
└── frontend/           # React frontend application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # React context (AuthContext)
    │   ├── pages/      # Route pages
    │   ├── App.jsx     # Main application routing
    │   └── main.jsx    # React DOM render
    └── package.json
```

## 🔌 API Endpoints (Brief Overview)

### Authentication
- `POST /api/auth/signup` - Register a new user (optional `role` field).
- `POST /api/auth/login` - Authenticate user and receive JWT.

### Courses
- `GET /api/courses` - List all courses.
- `GET /api/courses/:id` - Get specific course details.
- `POST /api/courses/add` - **[Admin Only]** Create a new course.
- `PUT /api/courses/:id` - **[Admin Only]** Update an existing course.
- `DELETE /api/courses/:id` - **[Admin Only]** Remove a course.

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
   # SECRET_KEY=your_secret_key (Optional if using the default "SECRET_KEY")
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
   *The application will be accessible at `http://localhost:5173`.*
