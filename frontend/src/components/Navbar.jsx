import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RequestMovieModal from './RequestMovieModal';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddMovie = () => {
    if (currentUser) {
      navigate('/upload');
    } else {
      navigate('/auth');
    }
  };

  const handleRequestMovie = () => {
    setIsRequestModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-dark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary dark:text-primary-light">CrowdStream</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button 
              onClick={handleAddMovie}
              className="btn btn-primary"
            >
              Add a Movie
            </button>
            <button 
              onClick={handleRequestMovie}
              className="btn btn-secondary"
            >
              Request a Movie
            </button>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Hello, {currentUser.name || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-outline text-gray-700 dark:text-gray-300">
                Login / Signup
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <ThemeToggle />
            <button 
              onClick={handleAddMovie}
              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-lighter"
            >
              Add a Movie
            </button>
            <button 
              onClick={handleRequestMovie}
              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-lighter"
            >
              Request a Movie
            </button>
            {currentUser ? (
              <>
                <span className="block px-4 py-2 text-gray-700 dark:text-gray-300">
                  Hello, {currentUser.name || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-lighter"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-dark-lighter"
              >
                Login / Signup
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Request Movie Modal */}
      <RequestMovieModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
      />
    </nav>
  );
}

export default Navbar;