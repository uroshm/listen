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

  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

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
      title: 'Speech Recognition',
      description: 'AI-powered analysis for accurate speech assessment',
      icon: '🎯',
      path: '/record',
    },
    {
      title: 'Patient Management',
      description: 'Track and monitor patient progress',
      icon: '👥',
      path: '/caseload',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Visualize patient outcomes and practice metrics',
      icon: '📊',
      path: '/analytics',
    },
  ];

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
              className="nav-link"
              initial={{ backgroundColor: 'transparent' }}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
            >
              <span>Services</span>
              <i
                className="fas fa-chevron-down"
                style={{ fontSize: '12px', marginLeft: '4px' }}
              ></i>
            </motion.button>

            {showServicesDropdown && (
              <div className="mega-dropdown">
                <div className="dropdown-header">
                  <h3>Services & Tools</h3>
                  <p>Everything you need for speech therapy management</p>
                </div>
                <div className="dropdown-grid">
                  {serviceLinks.map((service, index) => (
                    <motion.a
                      key={index}
                      href={service.path}
                      className="dropdown-item-large"
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                    >
                      <span className="item-icon">{service.icon}</span>
                      <div className="item-content">
                        <h4>{service.title}</h4>
                        <p>{service.description}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
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
