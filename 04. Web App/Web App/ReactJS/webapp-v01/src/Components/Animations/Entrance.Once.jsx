import React from 'react';
import { motion } from 'framer-motion';

export function OnceFadeIn({ children, duration = 1000, delay = 0 }){
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration:duration/1000, delay:delay/1000 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};

export function OnceFlyInX({ direction = 'left', duration = 1000, delay = 0, children}){
  return (
    <motion.div
      initial={{ x: direction === 'top' ? -100 : 100, opacity: 0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:duration/1000, delay:delay/1000 }}
    >
      {children}
    </motion.div>
  );
};

export function OnceFlyInY({ direction = 'top', duration = 1000, delay = 0, children}){
  return (
    <motion.div
      initial={{ y: direction === 'top' ? -100 : 100, opacity: 0 }}
      animate={{y:0, opacity:1}}
      transition={{ duration:duration/1000, delay:delay/1000 }}
    >
      {children}
    </motion.div>
  );
};

export function OnceZoomIn({ children, duration = 1000, delay = 0 }){
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration:duration/1000, delay:delay/1000 }}
    >
      {children}
    </motion.div>
  );
};