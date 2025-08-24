import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Home from "../pages/Home";
import MyRentals from "../pages/MyRentals";
import Profile from "../pages/Profile";

export function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/rentals" element={<ProtectedRoute><MyRentals /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  );
}