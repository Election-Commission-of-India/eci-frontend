import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  return (
    <header className="bg-white shadow-sm border-b border-black-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {isAuthenticated ? (
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2"></div>

              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>

              <div
                onClick={() => {
                  navigate("/home");
                }}
                className="  cursor-pointer hidden md:flex flex-col border-l border-gray-300 pl-3 md:pl-4"
              >
                <span className="text-sm md:text-base font-semibold text-gray-700">
                  मतदाता सेवा पोर्टल
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-600">
                  VOTERS' SERVICE PORTAL
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <Link
                to="/my-applications"
                className="flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                My Application
              </Link>
             
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 font-medium"
              >
                Logout
              </button>
             
             
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2"></div>

              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>

              <div
                onClick={() => {
                  navigate("/home");
                }}
                className="  cursor-pointer hidden md:flex flex-col border-l border-gray-300 pl-3 md:pl-4"
              >
                <span className="text-sm md:text-base font-semibold text-gray-700">
                  मतदाता सेवा पोर्टल
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-600">
                  VOTERS' SERVICE PORTAL
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors"
              ></Link>

              <Link
                to="/register"
                className="flex  bg-gray-200  p-2  rounded-md items-center gap-2 text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sign-Up
              </Link>
            </div>
          </div>
        )}

        <div
          onClick={() => {
            navigate("/home");
          }}
          className="md:hidden pb-2 border-t border-gray-100 pt-2"
        >
          <div className="flex flex-col text-center">
            <span className="text-xs font-semibold text-gray-700">
              मतदाता सेवा पोर्टल
            </span>
            <span className="text-xs font-medium text-gray-600">
              VOTERS' SERVICE PORTAL
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
