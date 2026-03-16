import { sections } from '../../data/sections';
import styles from './DotNavigation.module.css';

interface DotNavigationProps {
  activeIndex: number;
  scrollToSection: (index: number) => void;
}

export function DotNavigation({ activeIndex, scrollToSection }: DotNavigationProps) {
  return (
    <nav className={styles.container} aria-label="섹션 네비게이션">
      {sections.map((section, index) => (
        <div key={section.id} className={styles.dotWrapper}>
          <span className={styles.label}>{section.label}</span>
          <button
            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`${section.label} 섹션으로 이동`}
            aria-current={activeIndex === index ? 'true' : undefined}
          />
        </div>
      ))}
    </nav>
  );
}
