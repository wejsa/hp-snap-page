import { ScrollContainer, SectionWrapper } from './components/common/ScrollContainer';
import { Header } from './components/Layout/Header';
import { DotNavigation } from './components/Layout/DotNavigation';
import { HeroSection } from './components/sections/HeroSection';
import { useActiveSection } from './hooks/useActiveSection';
import { sections } from './data/sections';
import styles from './components/sections/HeroSection.module.css';

function App() {
  const { containerRef, activeIndex, scrollToSection } = useActiveSection(sections.length);

  return (
    <>
      <Header activeIndex={activeIndex} scrollToSection={scrollToSection} />
      <DotNavigation activeIndex={activeIndex} scrollToSection={scrollToSection} />

      <ScrollContainer ref={containerRef}>
        <SectionWrapper id="hero" className={styles.hero}>
          <HeroSection onCtaClick={() => scrollToSection(1)} />
        </SectionWrapper>

        <SectionWrapper id="about">
          <h2 style={{ fontSize: '2rem', color: '#64748b' }}>About</h2>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Section placeholder</p>
        </SectionWrapper>

        <SectionWrapper id="services">
          <h2 style={{ fontSize: '2rem', color: '#64748b' }}>Services</h2>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Section placeholder</p>
        </SectionWrapper>

        <SectionWrapper id="contact">
          <h2 style={{ fontSize: '2rem', color: '#64748b' }}>Contact</h2>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Section placeholder</p>
        </SectionWrapper>
      </ScrollContainer>
    </>
  );
}

export default App;
