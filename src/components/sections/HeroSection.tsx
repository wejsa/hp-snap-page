import styles from './HeroSection.module.css';

interface HeroSectionProps {
  progress: number;
}

export function HeroSection({ progress }: HeroSectionProps) {
  // Split distance: 0 at start, up to 40vw at full progress
  const splitDistance = progress * 40; // vw units
  const opacity = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
  const indicatorOpacity = 1 - progress * 3; // fades out quickly

  return (
    <>
      {/* Video background — replace src with your video */}
      <video
        className={styles.videoBg}
        autoPlay
        muted
        loop
        playsInline
        poster=""
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Fallback background (shows when video fails to load) */}
      <div className={styles.fallbackBg} />

      {/* Dark overlay */}
      <div className={styles.overlay} />

      {/* Split text: RE ← → QM */}
      <div className={styles.textContainer} style={{ opacity }}>
        <span
          className={styles.splitText}
          style={{ transform: `translateX(-${splitDistance}vw)` }}
        >
          RE
        </span>
        <span
          className={styles.splitText}
          style={{ transform: `translateX(${splitDistance}vw)` }}
        >
          QM
        </span>
      </div>

      {/* Scroll indicator */}
      <div
        className={styles.scrollIndicator}
        style={{ opacity: Math.max(0, indicatorOpacity) }}
      >
        <span>Scroll</span>
        <div className={styles.scrollArrow} />
      </div>
    </>
  );
}
