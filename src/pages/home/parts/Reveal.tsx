import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

/** Shows its content with a short fade when it enters the viewport (at once with reduced motion). */
const Reveal: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    if (visible || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);
  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(8px)',
        transition: 'opacity 600ms ease-out, transform 600ms ease-out',
      }}
    >
      {children}
    </Box>
  );
};

export default Reveal;
