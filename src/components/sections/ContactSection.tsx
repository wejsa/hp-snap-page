import type { FormEvent } from 'react';
import { AnimatedSection } from '../common/AnimatedSection';
import styles from './ContactSection.module.css';

const contactInfo = [
  { icon: '📧', label: '이메일', value: 'contact@homepage-sample.com' },
  { icon: '📞', label: '전화', value: '02-1234-5678' },
  { icon: '📍', label: '주소', value: '서울특별시 강남구 테헤란로 123' },
  { icon: '🕐', label: '업무시간', value: '평일 09:00 - 18:00' },
];

export function ContactSection() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.inner}>
      <AnimatedSection direction="up" className={styles.header}>
        <p className={styles.label}>Contact Us</p>
        <h2 className={styles.title}>문의하기</h2>
      </AnimatedSection>

      <div className={styles.content}>
        <AnimatedSection direction="left" className={styles.formBlock}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="name">이름</label>
              <input className={styles.input} id="name" type="text" placeholder="홍길동" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="email">이메일</label>
              <input className={styles.input} id="email" type="email" placeholder="hong@example.com" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="message">메시지</label>
              <textarea className={styles.textarea} id="message" placeholder="문의 내용을 입력해주세요" />
            </div>
            <button type="submit" className={styles.submitBtn}>보내기</button>
          </form>
        </AnimatedSection>

        <AnimatedSection direction="right" className={styles.infoBlock}>
          {contactInfo.map((info) => (
            <div key={info.label} className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <span role="img" aria-label={info.label}>{info.icon}</span>
              </div>
              <div>
                <div className={styles.infoLabel}>{info.label}</div>
                <div className={styles.infoValue}>{info.value}</div>
              </div>
            </div>
          ))}
        </AnimatedSection>
      </div>

      <footer className={styles.footer}>
        <p className={styles.copyright}>&copy; 2026 Homepage Sample. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <span className={styles.footerLink}>개인정보처리방침</span>
          <span className={styles.footerLink}>이용약관</span>
        </div>
      </footer>
    </div>
  );
}
