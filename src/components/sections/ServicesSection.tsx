import { AnimatedSection } from '../common/AnimatedSection';
import styles from './ServicesSection.module.css';

const services = [
  {
    icon: '🌐',
    title: '웹 개발',
    description: '최신 기술 스택을 활용한 고성능 웹 애플리케이션을 개발합니다. React, Next.js, Node.js 기반의 풀스택 솔루션을 제공합니다.',
  },
  {
    icon: '📱',
    title: '모바일 앱',
    description: 'iOS와 Android를 아우르는 크로스 플랫폼 앱 개발로 효율적이고 일관된 사용자 경험을 구현합니다.',
  },
  {
    icon: '🎨',
    title: 'UI/UX 디자인',
    description: '사용자 중심의 직관적인 인터페이스 설계와 시각적으로 매력적인 디자인으로 브랜드 가치를 높여드립니다.',
  },
];

export function ServicesSection() {
  return (
    <div className={styles.inner}>
      <AnimatedSection direction="up" className={styles.header}>
        <p className={styles.label}>Our Services</p>
        <h2 className={styles.title}>무엇을 도와드릴까요?</h2>
      </AnimatedSection>

      <div className={styles.grid}>
        {services.map((service, index) => (
          <AnimatedSection key={service.title} delay={index * 200} direction="up">
            <div className={styles.card}>
              <div className={styles.icon}>
                <span role="img" aria-label={service.title}>{service.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
