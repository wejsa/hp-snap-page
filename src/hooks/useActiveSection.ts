import { useEffect, useRef, useState, useCallback } from 'react';

export function useActiveSection(sectionCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const children = Array.from(container.children) as HTMLElement[];

        // Find the section whose midpoint is closest to the viewport center
        const viewportCenter = scrollTop + viewportHeight / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        for (let i = 0; i < children.length; i++) {
          const el = children[i];
          const sectionCenter = el.offsetTop + el.offsetHeight / 2;
          const distance = Math.abs(viewportCenter - sectionCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        }

        setActiveIndex(closestIndex);
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [sectionCount]);

  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const target = container.children[index] as HTMLElement | undefined;
    if (!target) return;

    // For the hero tall section, scroll to its end (so next section is visible)
    // For other sections, scroll to their start
    if (index === 0) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return { containerRef, activeIndex, scrollToSection };
}
