import { AnimatedSection } from '../common/AnimatedSection';
import styles from './AboutSection.module.css';

const stats = [
  { number: '10+', label: '년 경력' },
  { number: '200+', label: '완료 프로젝트' },
  { number: '50+', label: '파트너사' },
  { number: '99%', label: '고객 만족도' },
];

export function AboutSection() {
  return (
    <div className={styles.inner}>
      <AnimatedSection direction="left" className={styles.textBlock}>
        <p className={styles.label}>About Us</p>
        <h2 className={styles.title}>
          기술로 세상을
          <br />
          연결합니다
        </h2>
        <p className={styles.description}>
          우리는 10년 이상의 경험을 바탕으로 최신 기술과 혁신적인 사고를 결합하여
          고객에게 최적의 디지털 솔루션을 제공합니다. 작은 스타트업부터 대기업까지,
          각 비즈니스에 맞춤화된 접근 방식으로 성공적인 결과를 이끌어냅니다.
        </p>
      </AnimatedSection>

      <div className={styles.visual}>
        {stats.map((stat, index) => (
          <AnimatedSection key={stat.label} delay={index * 150} direction="up">
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
