import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Links */}
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-orange-600 font-medium">Books</Link>
            <Link to="/rentals" className="hover:text-orange-600 font-medium">My Rentals</Link>
            <Link to="/profile" className="hover:text-orange-600 font-medium">Profile</Link>
          </div>

          {/* User info */}
          {user && (
            <div className="flex items-center gap-3">
              <img src={user.image} alt="avatar" className="w-8 h-8 rounded-full border" />
              <span className="font-semibold">{user.firstName}</span>
              <button
                onClick={handleLogout}
                className="ml-4 bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
