import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export function AnimatedMetric({ value, label, subtext, prefix = '', suffix = '', highlightColor = 'text-gold' }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(0);

  // If value is numeric, animate count
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
  const isNumber = !isNaN(numericValue) && typeof value === 'number';

  useEffect(() => {
    if (!isInView || !isNumber) return;

    let start = 0;
    const end = numericValue;
    const duration = 1200;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = (end - start) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, isNumber, numericValue]);

  return (
    <div ref={ref} className="text-center select-none">
      <motion.p
        className={`font-serif text-3xl font-bold tracking-tight ${highlightColor}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        {prefix}
        {isNumber ? displayValue : value}
        {suffix}
      </motion.p>
      {label && <p className="font-semibold text-xs text-ivory/90 mt-1">{label}</p>}
      {subtext && <p className="text-[11px] text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  );
}

