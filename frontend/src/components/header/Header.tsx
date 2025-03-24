import { useState } from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getToken, logout, username } = useAuth();

  const buttonVariants = {
    default: { scale: 1, backgroundColor: '#ffffff' },
    hover: { scale: 1.05, backgroundColor: '#f0f0f0' },
    pressed: { scale: 0.95, backgroundColor: '#e0e0e0' },
  };

  const handleAuthClick = () => {
    if (getToken()) {
      logout();
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const serviceLinks = [
    {
      title: 'My Patients',
      description: 'Track and monitor patient progress',
      icon: '👥',
      path: '/caseload',
    },
    {
      title: 'Test Results',
      description: 'Visualize patient outcomes and practice metrics',
      icon: '📊',
      path: '/tests',
    },
  ];

  return (
    <header className="header">
      <nav className="nav-container">
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
          {serviceLinks.map((service, index) => (
            <motion.button
              key={index}
              initial="default"
              whileHover="hover"
              whileTap="pressed"
              variants={buttonVariants}
              className="nav-link"
              onClick={() => navigate(service.path)}
            >
              <span>{service.icon}</span> {service.title}
            </motion.button>
          ))}
          <motion.button
            initial="default"
            whileHover="hover"
            whileTap="pressed"
            variants={buttonVariants}
            className="nav-link"
            onClick={() => navigate('/contact')}
          >
            <i className="fas fa-paper-plane"></i> Contact Us
          </motion.button>
          <motion.button
            initial="default"
            whileHover="hover"
            whileTap="pressed"
            variants={buttonVariants}
            className="nav-link"
            onClick={handleAuthClick}
          >
            <i className={`fas fa-sign-${getToken() ? 'out' : 'in'}-alt`}></i>
            {getToken() ? ' Log Out' : ' Log In'}
          </motion.button>
          {getToken() && username && (
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
