import { useEffect, useRef, useState } from 'react';

export function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const viewportHeight = container.clientHeight;

        // progress: 0 when at top of section, 1 when scrolled through the extra space
        const scrollableDistance = sectionHeight - viewportHeight;
        if (scrollableDistance <= 0) {
          setProgress(0);
          return;
        }

        const relativeScroll = scrollTop - sectionTop;
        const p = Math.max(0, Math.min(1, relativeScroll / scrollableDistance));
        setProgress(p);
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return { sectionRef, progress };
}
