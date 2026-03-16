import { ScrollContainer, SectionWrapper, HeroTallSection } from './components/common/ScrollContainer';
import { Header } from './components/Layout/Header';
import { DotNavigation } from './components/Layout/DotNavigation';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ContactSection } from './components/sections/ContactSection';
import { useActiveSection } from './hooks/useActiveSection';
import { useScrollProgress } from './hooks/useScrollProgress';
import { sections } from './data/sections';
import aboutStyles from './components/sections/AboutSection.module.css';
import servicesStyles from './components/sections/ServicesSection.module.css';
import contactStyles from './components/sections/ContactSection.module.css';

function App() {
  const { containerRef, activeIndex, scrollToSection } = useActiveSection(sections.length);
  const { sectionRef, progress } = useScrollProgress(containerRef);

  return (
    <>
      <Header activeIndex={activeIndex} scrollToSection={scrollToSection} />
      <DotNavigation activeIndex={activeIndex} scrollToSection={scrollToSection} />

      <ScrollContainer ref={containerRef}>
        <HeroTallSection id="hero" sectionRef={sectionRef}>
          <HeroSection progress={progress} />
        </HeroTallSection>

        <SectionWrapper id="about" className={aboutStyles.about}>
          <AboutSection />
        </SectionWrapper>

        <SectionWrapper id="services" className={servicesStyles.services}>
          <ServicesSection />
        </SectionWrapper>

        <SectionWrapper id="contact" className={contactStyles.contact}>
          <ContactSection />
        </SectionWrapper>
      </ScrollContainer>
    </>
  );
}

export default App;
