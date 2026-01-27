import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-black-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              
             
            </div>

            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>

            <div className="hidden md:flex flex-col border-l border-gray-300 pl-3 md:pl-4">
              <span className="text-sm md:text-base font-semibold text-gray-700">
                मतदाता सेवा पोर्टल
              </span>
              <span className="text-xs md:text-sm font-medium text-gray-600">
                VOTERS' SERVICE PORTAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {isAuthenticated() ? (
              <>
                <span className="text-sm md:text-base text-gray-700">
                  Welcome, User
                </span>
                <button
                  onClick={handleLogout}
                  className="flex bg-red-100 hover:bg-red-200 p-2 rounded-md items-center gap-2 text-sm md:text-base text-red-700 hover:text-red-800 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="flex  bg-gray-200  p-2  rounded-md items-center gap-2 text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign-Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div onClick={()=>{

          navigate("/home");

        }} className="md:hidden pb-2 border-t border-gray-100 pt-2">
          <div  className="flex flex-col text-center">
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