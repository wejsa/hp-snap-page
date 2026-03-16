import { sections } from '../../data/sections';
import styles from './Header.module.css';

interface HeaderProps {
  activeIndex: number;
  scrollToSection: (index: number) => void;
}

export function Header({ activeIndex, scrollToSection }: HeaderProps) {
  const isScrolled = activeIndex > 0;

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <button
        className={`${styles.logo} ${isScrolled ? styles.logoScrolled : ''}`}
        onClick={() => scrollToSection(0)}
      >
        Homepage
      </button>

      <nav className={styles.nav}>
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`${styles.navLink} ${isScrolled ? styles.navLinkScrolled : ''} ${activeIndex === index ? styles.navLinkActive : ''}`}
            onClick={() => scrollToSection(index)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <button className={styles.hamburger} aria-label="메뉴 열기">
        <span className={`${styles.hamburgerLine} ${isScrolled ? styles.hamburgerLineScrolled : ''}`} />
        <span className={`${styles.hamburgerLine} ${isScrolled ? styles.hamburgerLineScrolled : ''}`} />
        <span className={`${styles.hamburgerLine} ${isScrolled ? styles.hamburgerLineScrolled : ''}`} />
      </button>
    </header>
  );
}
