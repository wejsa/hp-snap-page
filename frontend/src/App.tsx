import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const TOTAL_SECTIONS = 9
const ANIM_DURATION = 400

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [lineWidth, setLineWidth] = useState(0)
  const [brandOpacity, setBrandOpacity] = useState(0)
  const [lineStyle, setLineStyle] = useState<React.CSSProperties>({})
  const [kioskLeft, setKioskLeft] = useState('50%')
  const targetSection = useRef(0)
  const isAnimating = useRef(false)
  const touchStartY = useRef(0)
  const rafId = useRef(0)
  const brandRef = useRef<HTMLDivElement>(null)

  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Compute brand state from raw scroll position (continuous)
  const updateBrandFromScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollTop = container.scrollTop
    const vh = window.innerHeight

    // Section 1 (idx 1): text fades in
    // Section 2-4 (idx 2-4): line grows from 0 to max
    // Section 5 (idx 5): white bg, line stays max
    const progress = scrollTop / vh // continuous section progress

    // Brand visibility: fade in during section 1 (progress 0.5 ~ 1.5)
    if (progress < 0.5) {
      setBrandOpacity(0)
    } else if (progress < 1.5) {
      setBrandOpacity(Math.min(1, (progress - 0.5)))
    } else if (progress > 6.5) {
      setBrandOpacity(Math.max(0, 1 - (progress - 6.5) * 2))
    } else {
      setBrandOpacity(1)
    }

    // Line width: grows from section 2 to 5 (progress 1.5 ~ 4.5)
    // Map to 0 ~ maxWidth
    const maxWidth = Math.min(window.innerWidth * 0.4, 520)
    if (progress < 1.5) {
      setLineWidth(0)
    } else if (progress < 4.5) {
      const lineProgress = (progress - 1.5) / 3 // 0 ~ 1
      setLineWidth(lineProgress * maxWidth)
    } else {
      setLineWidth(maxWidth)
    }

    // Current section for navbar/indicator
    const idx = Math.round(progress)
    setCurrentSection(idx)
  }, [])

  // Scroll tracking with rAF for smoothness
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(updateBrandFromScroll)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    updateBrandFromScroll()
    return () => {
      container.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId.current)
    }
  }, [updateBrandFromScroll])

  // Calculate line position from Z to E
  useEffect(() => {
    const brand = brandRef.current
    if (!brand || lineWidth === 0) {
      setLineStyle({ width: 0 })
      return
    }

    const brandRect = brand.getBoundingClientRect()
    const zEl = brand.querySelector('.brand-z')
    const eEl = brand.querySelector('.brand-e')
    if (!zEl || !eEl) return

    const zRect = zEl.getBoundingClientRect()
    const eRect = eEl.getBoundingClientRect()

    // Line starts from Z's right edge (where Z bottom stroke ends)
    const lineStart = zRect.right - brandRect.left -10
    // Line ends at E's left edge
    const lineEnd = eRect.left - brandRect.left + 20
    const actualWidth = lineEnd - lineStart

    // Z의 하단 획은 글자 높이의 약 78% 지점
    const brandHeight = brandRect.height
    const lineBottom = brandHeight * 0.06

    setLineStyle({
      width: `${Math.max(0, actualWidth)}px`,
      left: `${lineStart}px`,
      bottom: `${lineBottom}px`,
    })

    // Kiosk image: centered between Z right and E left
    const midpoint = (zRect.right + eRect.left) / 2 - brandRect.left
    setKioskLeft(`${midpoint}px`)
  }, [lineWidth])

  // Smooth scroll to section
  const smoothScrollTo = useCallback((index: number) => {
    const container = containerRef.current
    if (!container || isAnimating.current) return

    const clamped = Math.max(0, Math.min(TOTAL_SECTIONS - 1, index))
    if (clamped === targetSection.current) return

    isAnimating.current = true
    targetSection.current = clamped

    const start = container.scrollTop
    const end = clamped * window.innerHeight
    const distance = end - start
    let startTime: number | null = null

    const easing = (t: number) => t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2

    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / ANIM_DURATION, 1)

      container.scrollTop = start + distance * easing(progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        container.scrollTop = end
        setTimeout(() => { isAnimating.current = false }, 100)
      }
    }

    requestAnimationFrame(animate)
  }, [])

  // Wheel
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isAnimating.current) return

      const direction = e.deltaY > 0 ? 1 : -1
      let jump = 1

      // 섹션 1~5 (영상 구간): 스크롤 강도에 따라 여러 섹션 점프
      if (targetSection.current < 5 && direction > 0 || targetSection.current <= 5 && direction < 0) {
        const absDelta = Math.abs(e.deltaY)
        if (absDelta > 300) jump = 5
        else if (absDelta > 200) jump = 4
        else if (absDelta > 120) jump = 3
        else if (absDelta > 60) jump = 2
      }

      smoothScrollTo(targetSection.current + direction * jump)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [smoothScrollTo])

  // Touch
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      if (isAnimating.current) return
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(diff) > 40) smoothScrollTo(targetSection.current + (diff > 0 ? 1 : -1))
    }

    container.addEventListener('touchstart', onStart, { passive: true })
    container.addEventListener('touchend', onEnd, { passive: true })
    return () => { container.removeEventListener('touchstart', onStart); container.removeEventListener('touchend', onEnd) }
  }, [smoothScrollTo])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); smoothScrollTo(targetSection.current + 1) }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); smoothScrollTo(targetSection.current - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [smoothScrollTo])

  const isWhite = currentSection >= 5

  return (
    <>
      {/* Fixed video background */}
      <div className={`fixed-video-bg ${isWhite ? 'hidden' : ''}`}>
        <video autoPlay muted loop playsInline preload="auto" src={`${import.meta.env.BASE_URL}hero-bg.mp4`} />
        <div className="fixed-video-overlay" />
      </div>

      {/* Fixed brand text - line width driven by scroll position */}
      <div
        ref={brandRef}
        className={`fixed-brand ${isWhite ? 'dark' : ''}`}
        style={{ opacity: brandOpacity }}
      >
        <span className="brand-left-group">
          <span>DO</span><span className="brand-z">Z</span><span className="brand-n">N</span>
        </span>
        <span className="brand-gap" style={{ width: `${lineWidth}px` }} />
        <span className="brand-right-group">
          <span className="brand-e">E</span><span>XCHANGE</span>
        </span>
        {/* Line: absolute, from N start to E end */}
        <div className="brand-line" style={lineStyle} />
        {/* Kiosk image: shows on section 7 */}
        <div className={`kiosk-image ${currentSection === 6 ? 'visible' : currentSection > 6 ? 'exit-up' : ''}`} style={{ left: kioskLeft }}>
          <img src={`${import.meta.env.BASE_URL}kiosk.jpg`} alt="DOZN Exchange 무인환전기" />
        </div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${isWhite ? 'dark-mode' : ''}`}>
        <div className="logo" onClick={() => smoothScrollTo(0)}>DOZN EXCHANGE</div>
        <div className="nav-links">
          <a onClick={() => smoothScrollTo(7)}>서비스</a>
          <a onClick={() => smoothScrollTo(8)}>렌탈/제휴 문의</a>
          <a>위치</a>
          <a>고객센터</a>
        </div>
      </nav>

      {/* Page Indicator */}
      <div className={`page-indicator ${isWhite ? 'dark-mode' : ''}`}>
        {Array.from({ length: TOTAL_SECTIONS }, (_, i) => (
          <div
            key={i}
            className={`page-dot ${currentSection === i ? 'active' : ''}`}
            onClick={() => smoothScrollTo(i)}
          />
        ))}
      </div>

      {/* Fullpage Container */}
      <div className="fullpage-container" ref={containerRef}>
        <section className="section" ref={el => { sectionRefs.current[0] = el }} />
        <section className="section" ref={el => { sectionRefs.current[1] = el }} />
        <section className="section" ref={el => { sectionRefs.current[2] = el }} />
        <section className="section" ref={el => { sectionRefs.current[3] = el }} />
        <section className="section" ref={el => { sectionRefs.current[4] = el }} />
        <section className="section white-bg" ref={el => { sectionRefs.current[5] = el }} />

        {/* Section 7: 섹션6과 동일 구조 + 키오스크 이미지는 fixed-brand 내부에서 표시 */}
        <section className="section white-bg" ref={el => { sectionRefs.current[6] = el }} />

        {/* Section 8: 더즌 익스체인지만의 경쟁력 */}
        <section className="section white-bg" ref={el => { sectionRefs.current[7] = el }}>
          <div className="competence-section">
            <h2 className="section-title">더즌 익스체인지만의 경쟁력</h2>
            <div className="competence-grid">
              <div className="competence-card">
                <div className="competence-number">01</div>
                <h3>365일, 24시간 환전</h3>
                <p>365일, 24시간 동안 언제든지, 편리하게, 환전 서비스를 무인으로 제공할 수 있습니다.</p>
              </div>
              <div className="competence-card">
                <div className="competence-number">02</div>
                <h3>15개 통화, 최저 환율</h3>
                <p>USD, CNY, JPY, TWD 등 주요 통화를 포함한 15개 국가의 외화 통화를 최저 환율로 환전할 수 있습니다.</p>
              </div>
              <div className="competence-card">
                <div className="competence-number">03</div>
                <h3>안정적인 유지보수</h3>
                <p>국내 최대의 보안 업체 및 현금 수송망을 이용해 안전하게 관리하고, 24시간 고객서비스를 제공합니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: 원스톱 환전 서비스 이용하기 */}
        <section className="section white-bg" ref={el => { sectionRefs.current[8] = el }}>
          <div className="onestop-section">
            <h2 className="section-title">원스톱 환전 서비스 이용하기</h2>
            <div className="onestop-steps">
              <div className="onestop-step">
                <div className="step-number">01</div>
                <div className="step-icon">💱</div>
                <p>원화로 환전할<br />외화 선택</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="onestop-step">
                <div className="step-number">02</div>
                <div className="step-icon">🪪</div>
                <p>여권 및<br />신분증 스캔</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="onestop-step">
                <div className="step-number">03</div>
                <div className="step-icon">💵</div>
                <p>외화 투입</p>
              </div>
              <div className="step-arrow">→</div>
              <div className="onestop-step">
                <div className="step-number">04</div>
                <div className="step-icon">✅</div>
                <p>환전 완료</p>
              </div>
            </div>
            <p className="onestop-desc">
              공항, 호텔, 카지노, 관광지 등 대한민국 어디서든<br />쉽고 간편한 무인환전기를 만나보세요.
            </p>
          </div>
          <footer className="footer">
            <div className="footer-top">
              <div className="footer-info">
                <div className="footer-logo">DOZN EXCHANGE</div>
                <p>서울시 서초구 강남대로 465, B동 16층</p>
                <p>고객센터 070-5154-9610</p>
                <p>사업자등록번호 378-88-00880</p>
              </div>
              <div className="footer-links">
                <a href="#">이용약관</a>
                <a href="#">개인정보처리방침</a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>Copyright &copy; DOZN. All rights reserved.</span>
            </div>
          </footer>
        </section>
      </div>
    </>
  )
}

export default App
