import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="glass-card border-2 border-blue-200/60 shadow-xl backdrop-blur-xl mt-16 mb-4 mx-auto w-[95vw] max-w-6xl animate-fade-in-fast">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              LearnMathly
              </span>
            </Link>
            <p className="text-blue-900/80 font-medium">
              An interactive platform for teachers and students to create and participate in course-based learning.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-blue-700 hover:text-blue-900 font-semibold transition-colors duration-150">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-blue-700 hover:text-blue-900 font-semibold transition-colors duration-150">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-700 hover:text-blue-900 font-semibold transition-colors duration-150">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-blue-900">Contact</h3>
            <p className="text-blue-900/80 mb-2 font-medium">support@LearnMathly.com</p>
            <p className="text-blue-900/80 font-medium">123 Education Lane, Knowledge City</p>
          </div>
        </div>
        
        <div className="border-t border-blue-100 mt-8 pt-6">
          <p className="text-center text-blue-700 font-semibold">
            © {new Date().getFullYear()} LearnMathly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
