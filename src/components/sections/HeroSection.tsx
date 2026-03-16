import styles from './HeroSection.module.css';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Creating Digital
          <br />
          Experiences
        </h1>
        <p className={styles.subtitle}>
          혁신적인 기술과 창의적인 디자인으로
          <br />
          최고의 디지털 경험을 만들어갑니다.
        </p>
        <button className={styles.cta} onClick={onCtaClick}>
          자세히 보기
          <span aria-hidden="true">&darr;</span>
        </button>
      </div>
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.scrollArrow} />
      </div>
    </>
  );
}
