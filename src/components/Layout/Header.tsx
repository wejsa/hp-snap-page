import { useState, useEffect } from 'react';
import { sections } from '../../data/sections';
import styles from './Header.module.css';

interface HeaderProps {
  activeIndex: number;
  scrollToSection: (index: number) => void;
}

export function Header({ activeIndex, scrollToSection }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = activeIndex > 0;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeIndex]);

  const handleNavClick = (index: number) => {
    scrollToSection(index);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''} ${mobileMenuOpen ? styles.headerMenuOpen : ''}`}>
      <button
        className={`${styles.logo} ${isScrolled || mobileMenuOpen ? styles.logoScrolled : ''}`}
        onClick={() => handleNavClick(0)}
      >
        Homepage
      </button>

      <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`${styles.navLink} ${isScrolled || mobileMenuOpen ? styles.navLinkScrolled : ''} ${activeIndex === index ? styles.navLinkActive : ''}`}
            onClick={() => handleNavClick(index)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <button
        className={styles.hamburger}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
      >
        <span className={`${styles.hamburgerLine} ${isScrolled || mobileMenuOpen ? styles.hamburgerLineScrolled : ''} ${mobileMenuOpen ? styles.hamburgerLineOpen1 : ''}`} />
        <span className={`${styles.hamburgerLine} ${isScrolled || mobileMenuOpen ? styles.hamburgerLineScrolled : ''} ${mobileMenuOpen ? styles.hamburgerLineOpen2 : ''}`} />
        <span className={`${styles.hamburgerLine} ${isScrolled || mobileMenuOpen ? styles.hamburgerLineScrolled : ''} ${mobileMenuOpen ? styles.hamburgerLineOpen3 : ''}`} />
      </button>
    </header>
  );
}
