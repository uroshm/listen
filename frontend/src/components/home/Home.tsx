import './Home.css';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      title: 'Listen Copilot',
      description:
        'Real-time assistant providing analysis of speech patterns using advanced AI technology.',
      icon: '🤖',
    },
    {
      title: 'Automated Testing',
      description:
        'Insightful and automated analytics with built-in tests to let you focus on what matters most, providing care and therapy.',
      icon: '📊',
    },
    {
      title: 'Security',
      description:
        'Listen is built from the ground up with privacy and security in mind, and is HIPAA compliant.',
      icon: '🔒',
    },
  ];

  return (
    <div className="about-container">
      <section className="hero">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Listen.ai
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Listen is a new generation assistant that helps speech-language
            pathologists deliver better outcomes through AI-powered tools and
            analytics.
          </motion.p>
        </div>
      </section>

      <section className="mainContent">
        <div className="container">
          <motion.div
            className="features-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Practice?</h2>
          <p>Join thousands of speech-language pathologists using Listen.</p>
          <a href="/login" className="cta-button">
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
