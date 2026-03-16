import type { ReactNode, CSSProperties } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
}

export function AnimatedSection({
  children,
  delay = 0,
  direction = 'up',
  className,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translateY(40px)';
      case 'left': return 'translateX(-40px)';
      case 'right': return 'translateX(40px)';
      case 'none': return 'none';
    }
  };

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
