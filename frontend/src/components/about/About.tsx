import './About.css';
import SlideContent from '../slide-content/SlideContent';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const employeeSlides = [
  {
    title: 'John Doe',
    content: '',
    imageUrl: '/employee_1.jpeg',
    path: '',
  },
  {
    title: 'Jane Smith',
    content: '',
    imageUrl: '/employee_2.jpeg',
    path: '',
  },
  {
    title: 'Bob Poe',
    content: '',
    imageUrl: '/employee_3.jpeg',
    path: '',
  },
];

const About = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const values = [
    'Integrity in all our dealings',
    'Excellence in service delivery',
    'Commitment to client success',
    'Continuous professional development',
  ];

  return (
    <div className="about-container">
      <section className="hero">
        <h1>About Company Widgets</h1>
        <p>
          Company Widgets is a whole saler of widgets. We provide the best
          quality widgets at the most competitive prices. Our team of experts is
          here to help you with all your widget needs.
        </p>
      </section>

      <div className="team">
        <h2>Our Team</h2>
        <p>
          Our team of experts is here to help you with all your widget needs.
        </p>
        <SlideContent slides={employeeSlides} />
      </div>

      <section className="mainContent">
        <div className="values">
          <h2>Our Values</h2>
          <motion.div layout className="values-grid">
            <AnimatePresence>
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  layoutId={`value-${index}`}
                  className={`value-item ${selectedId === index ? 'selected' : ''}`}
                  onClick={() =>
                    setSelectedId(selectedId === index ? null : index)
                  }
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: selectedId === index ? 1.1 : 1,
                    zIndex: selectedId === index ? 2 : 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: selectedId === index ? 1.1 : 1.05 }}
                >
                  {value}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
