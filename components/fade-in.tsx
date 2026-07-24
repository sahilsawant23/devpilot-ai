'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

type Props = {
  delay?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
};

export function FadeIn({ delay = 0, y = 16, className, children }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const shouldReduce = useReducedMotion();
  const reduce = mounted && shouldReduce;

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
