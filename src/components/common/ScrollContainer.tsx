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

interface HeroTallSectionProps {
  id: string;
  children: ReactNode;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function HeroTallSection({ id, children, sectionRef, className }: HeroTallSectionProps) {
  return (
    <div id={id} ref={sectionRef} className={`${styles.heroTall} ${className ?? ''}`}>
      <div className={styles.heroSticky}>
        {children}
      </div>
    </div>
  );
}
