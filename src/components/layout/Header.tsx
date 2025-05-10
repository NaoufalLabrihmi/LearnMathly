import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/80 shadow-2xl border-b-2 border-blue-200/60 backdrop-blur-xl animate-fade-in-fast">
      <div className="mx-auto max-w-6xl flex justify-between items-center h-16 px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            LearnMathly
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-8 w-full justify-end">
        <Link to="/about" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
            About
          </Link>
          <Link to="/courses" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
            Courses
          </Link>
          <Link to="/videos" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
            Videos
          </Link>
          
          {user ? (
            <>
              <Link to="/create-course" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
                Create Course
              </Link>
              <Link to="/upload-video" className="text-blue-700 font-semibold hover:text-blue-900 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-blue-100/40">
                Upload Video
              </Link>
              <Button onClick={handleLogout} className="ml-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold rounded-full px-5 py-2 flex items-center gap-2 shadow-md hover:from-pink-600 hover:to-fuchsia-600 transition-all border-0">
                <LogOut className="w-5 h-5 mr-1" /> Log out
              </Button>
            </>
          ) : null}
          
        </nav>
      </div>
    </header>
  );
}
