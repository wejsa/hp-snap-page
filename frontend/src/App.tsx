import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const TOTAL_SECTIONS = 9
const ANIM_DURATION = 400
const VIDEOS = ['snap-main1.mp4', 'snap-main2.mp4']

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [lineWidth, setLineWidth] = useState(0)
  const [brandOpacity, setBrandOpacity] = useState(0)
  const [lineStyle, setLineStyle] = useState<React.CSSProperties>({})
  const [kioskLeft, setKioskLeft] = useState('50%')
  const [activeVideo, setActiveVideo] = useState(0) // 0 or 1 (which video element is active)
  const videoSrcIndex = useRef([0, 1]) // which VIDEOS index each element plays
  const targetSection = useRef(0)
  const isAnimating = useRef(false)
  const touchStartY = useRef(0)
  const rafId = useRef(0)
  const brandRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null])

  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  // Video ended → crossfade to next video
  const handleVideoEnded = useCallback((slot: number) => {
    if (slot !== activeVideo) return
    const nextSlot = slot === 0 ? 1 : 0
    // Prepare next video's src
    const nextSrcIndex = (videoSrcIndex.current[slot] + 1) % VIDEOS.length
    videoSrcIndex.current[nextSlot] = nextSrcIndex
    const nextVideo = videoRefs.current[nextSlot]
    if (nextVideo) {
      nextVideo.src = `${import.meta.env.BASE_URL}${VIDEOS[nextSrcIndex]}`
      nextVideo.load()
      nextVideo.play().catch(() => { })
    }
    // Crossfade
    setActiveVideo(nextSlot)
  }, [activeVideo])

  // Compute brand state from raw scroll position (continuous)
  const updateBrandFromScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollTop = container.scrollTop
    const vh = window.innerHeight

    const progress = scrollTop / vh

    // Brand visibility: fade in during section 1 (progress 0.5 ~ 1.5)
    if (progress < 0.5) {
      setBrandOpacity(0)
    } else if (progress < 1.5) {
      setBrandOpacity(Math.min(1, (progress - 0.5)))
    } else if (progress > 8.5) {
      setBrandOpacity(Math.max(0, 1 - (progress - 8.5) * 2))
    } else {
      setBrandOpacity(1)
    }

    // Line width: grows from section 2 to 5 (progress 1.5 ~ 4.5)
    const maxWidth = Math.min(window.innerWidth * 0.4, 520)
    if (progress < 1.5) {
      setLineWidth(0)
    } else if (progress < 4.5) {
      const lineProgress = (progress - 1.5) / 3
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

    const lineStart = zRect.right - brandRect.left - 10
    const lineEnd = eRect.left - brandRect.left + 20
    const actualWidth = lineEnd - lineStart

    const brandHeight = brandRect.height
    const lineBottom = brandHeight * 0.05

    setLineStyle({
      width: `${Math.max(0, actualWidth)}px`,
      left: `${lineStart}px`,
      bottom: `${lineBottom}px`,
    })

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
      {/* Fixed video background - 2 videos crossfading */}
      <div className={`fixed-video-bg ${isWhite ? 'hidden' : ''}`}>
        <video
          ref={el => { videoRefs.current[0] = el }}
          className={`bg-video ${activeVideo === 0 ? 'active' : ''}`}
          autoPlay
          muted
          playsInline
          preload="auto"
          src={`${import.meta.env.BASE_URL}${VIDEOS[0]}`}
          onEnded={() => handleVideoEnded(0)}
        />
        <video
          ref={el => { videoRefs.current[1] = el }}
          className={`bg-video ${activeVideo === 1 ? 'active' : ''}`}
          muted
          playsInline
          preload="auto"
          src={`${import.meta.env.BASE_URL}${VIDEOS[1]}`}
          onEnded={() => handleVideoEnded(1)}
        />
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
        {/* Section 7: exchange */}
        <div className={`kiosk-image ${currentSection === 6 ? 'visible' : currentSection > 6 ? 'exit-up' : ''}`} style={{ left: kioskLeft }}>
          <img src={`${import.meta.env.BASE_URL}exchange.png`} alt="환전 서비스" />
        </div>
        {/* Section 8: transit-card */}
        <div className={`kiosk-image ${currentSection === 7 ? 'visible' : currentSection > 7 ? 'exit-up' : ''}`} style={{ left: kioskLeft }}>
          <img src={`${import.meta.env.BASE_URL}transit-card.png`} alt="교통카드 서비스" />
        </div>
        {/* Section 9: voucher */}
        <div className={`kiosk-image ${currentSection === 8 ? 'visible' : currentSection > 8 ? 'exit-up' : ''}`} style={{ left: kioskLeft }}>
          <img src={`${import.meta.env.BASE_URL}voucher.png`} alt="바우처 서비스" />
        </div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${isWhite ? 'dark-mode' : ''}`}>
        <div className="logo" onClick={() => smoothScrollTo(0)}>DOZN EXCHANGE</div>
        <div className="nav-links">
          <a>서비스</a>
          <a>렌탈/제휴 문의</a>
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

        {/* Section 7: exchange (fixed-brand 내부에서 표시) */}
        <section className="section white-bg" ref={el => { sectionRefs.current[6] = el }} />

        {/* Section 8: transit-card (fixed-brand 내부에서 표시) */}
        <section className="section white-bg" ref={el => { sectionRefs.current[7] = el }} />

        {/* Section 9: voucher (fixed-brand 내부에서 표시) */}
        <section className="section white-bg" ref={el => { sectionRefs.current[8] = el }} />
      </div>
    </>
  )
}

export default App
