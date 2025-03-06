import './Home.css';
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

const Home = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const values = [
    'Free access to quality care',
    'Excellence in service delivery',
    'Commitment to client success',
    'Independent and innovative advice',
  ];

  return (
    <div className="about-container">
      <section className="hero">
        <h1>About Listen</h1>
        <p>
          Listen is a speech recognition application used by speech language
          pathologists. It is free to use and open source. Please consider
          contributing to the project on GitHub.
        </p>
      </section>

      <div className="team">
        <h2>Our Team</h2>
        <p>
          Our team of experts is here to help you with all your Listen needs.
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

export default Home;
