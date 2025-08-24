import { BrowserRouter as Router, } from "react-router-dom";

import { AppContent } from "./components/AppContent";

export default function App() {
  return (
    <Router>
      {/* <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/rentals" element={<ProtectedRoute><MyRentals /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes> */}
      <AppContent />
    </Router>
  );
}
