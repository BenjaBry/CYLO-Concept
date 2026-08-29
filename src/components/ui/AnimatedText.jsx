import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedText({ text, className }) {
  const words = text.split(' ');
  return (
    <div className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2em' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
