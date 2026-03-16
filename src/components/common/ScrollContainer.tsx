import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import styles from './ScrollContainer.module.css';

interface ScrollContainerProps {
  children: ReactNode;
}

export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  ({ children }, ref) => {
    return (
      <div ref={ref} className={styles.container}>
        {children}
      </div>
    );
  }
);

ScrollContainer.displayName = 'ScrollContainer';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section id={id} className={`${styles.section} ${className ?? ''}`}>
      {children}
    </section>
  );
}
