import './Home.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
        <h1>The Listen Application</h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Listen is a free, open-source, multi-purpose tool designed
          specifically for speech-language pathologists (SLPs). It provides an
          all-in-one solution for SLPs to enhance their work with clients
          through advanced features such as real-time speech recognition, record
          keeping, goal setting, goal tracking, and analytics.
          <br />
          <br />
          By leveraging AI and cutting-edge speech technology, Listen empowers
          SLPs to streamline their workflow, track progress, and make informed
          decisions based on data insights.
          <br />
          <br />
          Whether you're documenting therapy sessions, setting specific
          communication goals for clients, or analyzing speech patterns, Listen
          offers a reliable and user-friendly platform tailored to meet the
          unique needs of speech therapy professionals. We encourage
          contributions to help further develop this tool, making it even more
          robust and accessible. If you're interested in getting involved,
          please visit our GitHub repository and become part of the Listen
          community.
        </motion.p>
      </section>

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
