import { ScrollContainer, SectionWrapper } from './components/common/ScrollContainer';
import { useActiveSection } from './hooks/useActiveSection';
import { sections } from './data/sections';

function App() {
  const { containerRef, activeIndex, scrollToSection } = useActiveSection(sections.length);

  // activeIndex, scrollToSection은 Step 2에서 Header/DotNavigation에 전달
  console.log('Active section:', activeIndex, scrollToSection);

  return (
    <ScrollContainer ref={containerRef}>
      {sections.map((section) => (
        <SectionWrapper key={section.id} id={section.id}>
          <h2 style={{ fontSize: '2rem', color: '#64748b' }}>
            {section.label}
          </h2>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
            Section placeholder — {section.id}
          </p>
        </SectionWrapper>
      ))}
    </ScrollContainer>
  );
}

export default App;
