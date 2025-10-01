import React from 'react';
import '../style/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <span className="nav-link" onClick={() => navigate('/homepage')}>Home</span>
        </div>
        <span className="navbar-title">TeamHearing</span>
        <div className="navbar-right">
          <span className="nav-link" onClick={() => navigate('/profile')}>Profile</span>
          <span className="nav-link" onClick={() => {/* Add logout logic here */ }}>Log Out</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
