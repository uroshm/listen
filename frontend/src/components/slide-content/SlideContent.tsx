import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SlideContent.css';
import { useNavigate } from 'react-router-dom';

interface Slide {
  title: string;
  content: string;
  imageUrl?: string;
  path: string;
}

interface SlideContentProps {
  slides: Slide[];
}

const SlideContent = ({ slides }: SlideContentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('forward');

  useEffect(() => {
    const timeBetweenSlides = 12000;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, timeBetweenSlides);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setDirection('backward');
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleNextSlide = () => {
    setDirection('forward');
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const navigate = useNavigate();
  const handleSlideClick = () => {
    navigate(slides[currentIndex].path);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="slide-creator">
      <div className="slides-container">
        <button
          className="slide-nav-button slide-nav-button--prev"
          onClick={handlePrevSlide}
          aria-label="Previous slide"
        >
          &#10094;
        </button>

        <div className="slides-preview">
          <AnimatePresence
            initial={false}
            custom={direction === 'forward' ? 1 : -1}
            mode="popLayout"
          >
            <motion.div
              key={currentIndex}
              custom={direction === 'forward' ? 1 : -1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  handleNextSlide();
                } else if (swipe > swipeConfidenceThreshold) {
                  handlePrevSlide();
                }
              }}
              className="slide-preview"
              onClick={handleSlideClick}
            >
              <h3>{slides[currentIndex].title}</h3>
              <p>{slides[currentIndex].content}</p>
              {slides[currentIndex].imageUrl && (
                <motion.img
                  src={slides[currentIndex].imageUrl}
                  alt={slides[currentIndex].title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          className="slide-nav-button slide-nav-button--next"
          onClick={handleNextSlide}
          aria-label="Next slide"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default SlideContent;
