# Grain - Educational Resources and Course Marketplace

Grain is a premium, full-stack educational platform and course marketplace. It features a sleek, modern UI with a robust Role-Based Access Control (RBAC) system, allowing users to discover courses, manage wishlists, and empowering admins to create and manage the platform's curriculum.

## ✨ Platform Highlights

### 🎨 Premium User Interface
- **Dynamic Hero Section:** A highly responsive, role-aware landing page that adapts to Anonymous Users, Students, and Admins.
- **Modern Dashboard Layouts:** Clean, responsive profile and course viewing pages built with Tailwind CSS, featuring soft shadows, glassmorphic elements, and polished focus states.
- **Curriculum Builder:** An intuitive, card-based course creation and editing interface for Administrators.
- **Smart Components:** Interactive wishlist buttons, sticky sidebars, and z-index optimized search dropdowns.

### 🔒 Highly Secure Authentication (JWT + Blocklisting)
Grain implements an advanced, hardened authentication system to ensure maximum data security:
- **1-Day Token Expiry:** JWT tokens strictly expire after 24 hours, minimizing the attack window for stolen tokens.
- **MongoDB Token Blocklist:** Upon user logout, the active token is immediately extracted, decoded, and pushed to a dedicated `Blocklist` collection in the database.
- **Automated TTL Cleanup:** The MongoDB Blocklist schema utilizes a native **Time-To-Live (TTL) index** (`expires: 0`). This tells the database to automatically delete the blocklisted token precisely when its original encoded `exp` timestamp is reached, keeping the database perfectly clean without cron jobs.
- **Pre-Flight Middleware:** Every secured API request runs through a `protect` middleware that intercepts the request, checks the `Blocklist` database first, and immediately rejects it (`401 Unauthorized`) if the token was previously logged out or invalidated.

### 🛡️ Role-Based Access Control (RBAC)
- **Anonymous:** Can browse the marketplace, search courses, and view course details.
- **Student / User:** Can manage their personal profile and add/remove courses from their Wishlist.
- **Administrator:** Dashboard access to Create, Update, and Delete courses, alongside full user privileges.
- **Protected Routing:** Strict frontend and backend route guarding to prevent unauthorized role escalation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with Vite ⚡
- **Styling:** Tailwind CSS 4 (Custom Premium Aesthetic)
- **Routing:** React Router v7
- **State Management:** React Context API (`AuthContext`)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens) + bcryptjs
- **Security:** MongoDB TTL Blocklisting & Custom RBAC Authorization Middleware

---

## 📁 Project Structure

```text
Grain/
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── controllers/# Logic for handling requests
│   │   ├── middleware/ # Auth (Blocklist check) and RBAC middlewares
│   │   ├── models/     # Mongoose schemas (User, Course, Blocklist)
│   │   ├── routes/     # API endpoints (auth, course, profile, wishlist)
│   │   └── server.js   # Entry point
│   └── package.json
└── frontend/           # React frontend application
    ├── src/
    │   ├── components/ # Reusable UI components (Navbar, CourseCard, etc)
    │   ├── context/    # React context (AuthContext featuring Blocklist API hooks)
    │   ├── pages/      # Route pages (Home, Profile, AddCourse, CoursePage)
    │   ├── App.jsx     # Main application routing & ProtectedRoutes setup
    │   └── main.jsx    # React DOM render
    └── package.json
```

---

## 🔌 API Endpoints (Brief Overview)

### Authentication
- `POST /api/auth/signup` - Register a new user (optional `role` field).
- `POST /api/auth/login` - Authenticate user, verify bcrypt, and receive 1-day JWT.
- `POST /api/auth/logout` - **[Protected]** Invalidate and blocklist the current active JWT token.

### Courses
- `GET /api/courses` - List all courses.
- `GET /api/courses/:id` - Get specific course details.
- `POST /api/courses/add` - **[Admin Only]** Create a new course.
- `PUT /api/courses/:id` - **[Admin Only]** Update an existing course.
- `DELETE /api/courses/:id` - **[Admin Only]** Remove a course.

### User & Wishlist
- `GET /api/profile` - **[Protected]** Get user details.
- `GET /api/wishlist` - **[Protected]** Retrieve user's wishlisted items.
- `POST /api/wishlist/toggle` - **[Protected]** Add/remove a course from the wishlist.

---

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
4. Start the server (Dev mode uses Nodemon):
   ```bash
   npx nodemon src/server.js
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
