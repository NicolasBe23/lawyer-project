"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

type AnimatedListItemProps = {
  children: ReactNode;
  index: number;
  delay?: number;
  duration?: number;
  amount?: number;
  initialScale?: number;
  className?: string;
};

export const AnimatedListItem = ({
  children,
  index,
  delay = 0.04,
  duration = 0.2,
  amount = 0.4,
  initialScale = 0.7,
  className,
}: AnimatedListItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      initial={{ scale: initialScale, opacity: 0 }}
      animate={
        inView
          ? { scale: 1, opacity: 1 }
          : { scale: initialScale, opacity: 0 }
      }
      transition={{ duration, delay: index * delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
