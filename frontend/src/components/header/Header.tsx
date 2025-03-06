import { useState } from 'react';
import { motion } from 'framer-motion';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '../shopping-cart/ShoppingCartIcon';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const buttonVariants = {
    default: { scale: 1, backgroundColor: '#ffffff' },
    hover: { scale: 1.05, backgroundColor: '#f0f0f0' },
    pressed: { scale: 0.95, backgroundColor: '#e0e0e0' },
  };

  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

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
            Home
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
              Services
            </motion.button>

            {showServicesDropdown && (
              <div className="services-dropdown">
                <motion.button
                  initial="default"
                  whileHover="hover"
                  whileTap="pressed"
                  variants={buttonVariants}
                  className="nav-link dropdown-item"
                  onClick={() => navigate('/record')}
                >
                  Record
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
            Contact Us
          </motion.button>
          <motion.button
            initial="default"
            whileHover="hover"
            whileTap="pressed"
            variants={buttonVariants}
            className="nav-link"
            onClick={() => navigate('/login')}
          >
            Login
          </motion.button>
          <div
            className="shopping-cart-container"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <motion.button
              initial="default"
              whileHover="hover"
              whileTap="pressed"
              variants={buttonVariants}
              className="nav-link"
              onClick={() => navigate('/shopping-cart')}
            >
              <img
                src="/shoppingCart.png"
                alt="Shopping Cart"
                className="shopping-cart-icon"
              />
            </motion.button>
            {isCartOpen && (
              <div className="shopping-cart-dropdown">
                <ShoppingCartIcon />
              </div>
            )}
          </div>
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
