import React, { useContext } from 'react';
import '../style/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface NavbarProps {
  showAuthButtons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuthButtons = true }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          {showAuthButtons && user && (
            <span className="nav-link" onClick={() => navigate('/homepage')}>Home</span>
          )}
        </div>
        <span
          className="navbar-title"
          onClick={() => {
            console.log('TeamHearing clicked!');
            navigate('/homepage');
          }}
        >
          TeamHearing
        </span>
        <div className="navbar-right">
          {showAuthButtons && user && (
            <>
              <a href="/profile" className="nav-link">Profile</a>
              <span className="nav-link" onClick={handleLogout}>Logout</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;