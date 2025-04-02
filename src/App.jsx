import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Flash from "./pages/Flash";
import Home from "./pages/Home";
import SignInSuccess from "./pages/SignInSuccess";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UploadImage from "./pages/UploadImage";
import Reports from "./pages/Reports";
import ScanResults from "./pages/ScanResults";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import Insight from "./pages/Insight";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Flash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signinsuccess"
          element={
            <ProtectedRoute>
              <SignInSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-image"
          element={
            <ProtectedRoute>
              <UploadImage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan-results"
          element={
            <ProtectedRoute>
              <ScanResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insight"
          element={
            <ProtectedRoute>
              <Insight />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
