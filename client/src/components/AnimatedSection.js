// AnimatedSection.js
import React from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedSection = ({ children }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 }); // Trigger when 50% of the section is visible

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }} // Start hidden and slightly below
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} // Animate when in view
      transition={{ duration: 0.5 }} // Animation duration
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;