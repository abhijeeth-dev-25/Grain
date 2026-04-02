# ![Grain Hero Banner](assets/banner.png)

# Grain — Premium Educational Marketplace

**Grain** is a state-of-the-art, full-stack educational ecosystem designed for the modern learner and educator. Built with a "Security-First, UI-Second" philosophy, Grain combines a high-end, tactile bistro-inspired aesthetic with enterprise-grade authentication and real-time interactive features.

---

## 🌟 Platform Highlights

### 🎨 Elite User Experience
- **Responsive Role-Adaptive UI:** A seamless experience that transforms dynamically based on whether you are an Anonymous guest, a Student, or an Administrator.
- **Micro-Animations & Glassmorphism:** Subtle, smooth transitions and frosted-glass components provide a premium, modern feel.
- **Tactile Course Management:** An intuitive, card-based curriculum builder for admins and a streamlined checkout/wishlist flow for students.

### 🔒 Advanced "Ironclad" Security
Grain implements a hardware-resilient authentication architecture to protect user data and sessions:
- **Dual-Token System:** Utilizes **15-minute Access Tokens** (JWT) and **7-day Refresh Tokens** (Crypto-random) for the perfect balance of security and convenience.
- **Stateful Token Rotation:** Refresh tokens are "rotated" (swapped) upon every use, instantly invalidating the old token and preventing common replay attacks.
- **Mongoose TTL Garbage Collection:** Automatic, database-level cleanup of expired blocklisted tokens and refresh tokens using native MongoDB TTL indexes—keeping the database lean and performant.
- **Remote "Logout All" & Versioning:** Admins and users can invalidate *all* active sessions across all devices instantly by incrementing a `tokenVersion` on the user model.

### ⚡ Innovative Features
- **Real-time AI Search:** A high-speed, debounced search box that fetches course results as you type, providing instant feedback.
- **Smart Heartbeat Mechanism:** A background "heartbeat" service that silently verifies session integrity, detecting remote logouts and presenting a custom animated security overlay.
- **JSDoc Self-Documentation:** The backend is fully documented using JSDoc, ensuring high maintainability and developer-friendly onboarding.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router v7, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose (TTL Indexes, Soft Deletes) |
| **Auth** | JWT, bcryptjs, Crypto-Rotation, Axios Interceptors |
| **Deployment** | Vercel (Frontend), Railway/Render/Local (Backend) |

---

## 📁 Project Architecture

```text
Grain/
├── backend/                # Enterprise Express.js API
│   ├── src/
│   │   ├── controllers/    # Business logic with JSDoc
│   │   ├── middleware/     # Auth, RBAC, and Validation
│   │   ├── models/         # Mongoose Schemas (User, Course, RefreshToken, Blocklist)
│   │   ├── routes/         # RESTful API endpoints
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/               # Modern React Application
│   ├── src/
│   │   ├── components/     # Atomic UI elements (SearchBox, Navbar, etc.)
│   │   ├── context/        # AuthContext with sophisticated Axios Interceptors
│   │   ├── pages/          # Full-page route components
│   │   ├── App.jsx         # Routing & Protected Route setup
│   │   └── index.css       # Design system & Tailwind 4 config
│   └── package.json
└── assets/                 # Brand assets & documentation media
```

---

## 🔌 API Ecosystem

### 🔑 Authentication & Identity
- `POST /api/auth/signup` - Register with role selection.
- `POST /api/auth/login` - Receive initial Access & Refresh tokens.
- `POST /api/auth/refresh` - Swap an old refresh token for a new pair (Rotation).
- `POST /api/auth/logout` - [Protected] Invalidate current session and blocklist token.
- `POST /api/auth/logout-all` - [Protected] Invalidate sessions on all devices.
- `GET /api/auth/verify` - [Protected] Heartbeat endpoint for session validation.

### 📚 Course Management
- `GET /api/courses` - List all active courses.
- `GET /api/courses/search` - Real-time title/category search.
- `POST /api/courses/add` - [Admin] Create a new course curriculum.
- `PUT /api/courses/:id` - [Admin] Update existing course details.
- `DELETE /api/courses/:id` - [Admin] Remove a course from the platform.

### 👤 Profile & Social
- `GET /api/profile` - [Protected] Get personal dashboard data.
- `POST /api/wishlist/toggle` - [Protected] Manage saved courses.

---

## 🚀 Execution & Deployment

### Local Development
1. **Clone & Install:**
   ```bash
   npm install && cd backend && npm install && cd ../frontend && npm install
   ```
2. **Environment Configuration:**
   Create a `.env` in `backend/`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_ultra_secure_secret
   ```
3. **Run Platform:**
   - Backend: `npm run dev` (from /backend)
   - Frontend: `npm run dev` (from /frontend)

### Vercel Deployment
To deploy the frontend to Vercel, ensure you set the following Environment Variables in the Vercel Dashboard:
- `VITE_API_URL`: The URL of your deployed backend API.
- `VITE_APP_NAME`: `Grain`

---

## 📄 License
Grain is licensed under the MIT License. See `LICENSE` for more details.

---
*Built with ❤️ by the Grain Development Team.*
