import { ScrollContainer, SectionWrapper } from './components/common/ScrollContainer';
import { Header } from './components/Layout/Header';
import { DotNavigation } from './components/Layout/DotNavigation';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { useActiveSection } from './hooks/useActiveSection';
import { sections } from './data/sections';
import heroStyles from './components/sections/HeroSection.module.css';
import aboutStyles from './components/sections/AboutSection.module.css';
import servicesStyles from './components/sections/ServicesSection.module.css';

function App() {
  const { containerRef, activeIndex, scrollToSection } = useActiveSection(sections.length);

  return (
    <>
      <Header activeIndex={activeIndex} scrollToSection={scrollToSection} />
      <DotNavigation activeIndex={activeIndex} scrollToSection={scrollToSection} />

      <ScrollContainer ref={containerRef}>
        <SectionWrapper id="hero" className={heroStyles.hero}>
          <HeroSection onCtaClick={() => scrollToSection(1)} />
        </SectionWrapper>

        <SectionWrapper id="about" className={aboutStyles.about}>
          <AboutSection />
        </SectionWrapper>

        <SectionWrapper id="services" className={servicesStyles.services}>
          <ServicesSection />
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
