import { useState } from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { token, logout, username } = useAuth();

  const buttonVariants = {
    default: { scale: 1, backgroundColor: '#ffffff' },
    hover: { scale: 1.05, backgroundColor: '#f0f0f0' },
    pressed: { scale: 0.95, backgroundColor: '#e0e0e0' },
  };

  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  const handleAuthClick = () => {
    if (token) {
      logout();
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <img
            src="/logo.png"
            alt="Company Logo"
            onClick={() => navigate('/home')}
          />
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <motion.button
            initial="default"
            whileHover="hover"
            whileTap="pressed"
            variants={buttonVariants}
            className="nav-link"
            onClick={() => navigate('/home')}
          >
            <i className="fas fa-home"></i> Home
          </motion.button>
          <div
            className="services-container"
            onMouseEnter={() => setShowServicesDropdown(true)}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <motion.button
              initial="default"
              whileHover="hover"
              whileTap="pressed"
              variants={buttonVariants}
              className="nav-link"
              onClick={() => navigate('/services')}
            >
              <i className="fas fa-concierge-bell"></i> Services
            </motion.button>

            {showServicesDropdown && (
              <div className="services-dropdown">
                <motion.button
                  initial="default"
                  whileHover="hover"
                  whileTap="pressed"
                  variants={buttonVariants}
                  className="nav-link dropdown-item"
                  onClick={() => navigate('/caseload')}
                >
                  <i className="fas fa-users"></i> Caseload
                </motion.button>
                <motion.button
                  initial="default"
                  whileHover="hover"
                  whileTap="pressed"
                  variants={buttonVariants}
                  className="nav-link dropdown-item"
                  onClick={() => navigate('/record')}
                >
                  <i className="fas fa-microphone"></i> Record
                </motion.button>
              </div>
            )}
          </div>
          <motion.button
            initial="default"
            whileHover="hover"
            whileTap="pressed"
            variants={buttonVariants}
            className="nav-link"
            onClick={() => navigate('/contact')}
          >
            <i className="fas fa-envelope"></i> Contact Us
          </motion.button>
          <motion.button
            initial="default"
            whileHover="hover"
            whileTap="pressed"
            variants={buttonVariants}
            className="nav-link"
            onClick={handleAuthClick}
          >
            <i className={`fas fa-sign-${token ? 'out' : 'in'}-alt`}></i>
            {token ? ' Log Out' : ' Log In'}
          </motion.button>
          {token && username && (
            <div className="user-info">
              <span className="username">Welcome, {username}</span>
            </div>
          )}
        </div>

        <div
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
