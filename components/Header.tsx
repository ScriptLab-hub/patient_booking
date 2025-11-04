import React from 'react';
import { useAuth } from './AuthContext';
import { Page } from '../App';

interface HeaderProps {
    navigate: (page: Page) => void;
}

const NavLink: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
    <button onClick={onClick} className="text-gray-600 hover:text-primary transition-colors px-2 py-1">{children}</button>
);

const Header: React.FC<HeaderProps> = ({ navigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('home')} className="text-2xl font-bold text-primary">
          MedEase
        </button>
        <nav className="hidden md:flex items-center space-x-6">
            <NavLink onClick={() => navigate('home')}>Home</NavLink>
            <NavLink onClick={() => navigate('about')}>About</NavLink>
            <NavLink onClick={() => navigate('departments')}>Departments</NavLink>
            {user ? (
                <>
                    <NavLink onClick={() => navigate('book')}>Book Appointment</NavLink>
                    <NavLink onClick={() => navigate('my-appointments')}>My Appointments</NavLink>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-primary transition-colors px-2 py-1">Logout</button>
                </>
            ) : (
                <>
                    <NavLink onClick={() => navigate('login')}>Login</NavLink>
                    <button onClick={() => navigate('register')} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                        Sign Up
                    </button>
                </>
            )}
        </nav>
        {/* A mobile menu could be added here if needed for smaller screen sizes */}
      </div>
    </header>
  );
};

export default Header;