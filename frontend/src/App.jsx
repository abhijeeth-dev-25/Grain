import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import Settings from "./pages/Settings";
import CoursePage from "./pages/CoursePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/edit-course/:id" element={<EditCourse />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/course/:id" element={<CoursePage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
