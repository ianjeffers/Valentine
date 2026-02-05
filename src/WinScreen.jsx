import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

const PREGO_YELP_URL = 'https://www.yelp.com/biz/prego-restaurant-tustin-3'

/**
 * Shown when user says Yes. Confetti + thank you + Yelp snapshot for Prego Restaurant.
 */
export default function WinScreen() {
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff6b9d', '#c44569', '#ff9ebb', '#e8a0b8', '#fff'],
    })
    const t2 = setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0.2, y: 0.7 }, colors: ['#ff6b9d', '#ff9ebb'] })
    }, 200)
    const t3 = setTimeout(() => {
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 0.8, y: 0.7 }, colors: ['#ff6b9d', '#ff9ebb'] })
    }, 400)
    return () => {
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div className="screen win-screen">
      <div className="win-screen__hearts" aria-hidden>
        <span className="win-screen__heart">❤️</span>
        <span className="win-screen__heart">💕</span>
        <span className="win-screen__heart">💗</span>
        <span className="win-screen__heart">💖</span>
        <span className="win-screen__heart">💘</span>
      </div>

      <h1 className="win-screen__title">You said Yes!</h1>
      <p className="win-screen__subtext">Happy Valentine&apos;s Day.</p>
      <p className="win-screen__tagline">Can&apos;t wait to celebrate with you.</p>

      <a
        href={PREGO_YELP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="yelp-card win-screen__card"
      >
        <div className="yelp-card__header">
          <span className="yelp-card__stars">★★★★☆</span>
          <span className="yelp-card__rating">4.2</span>
          <span className="yelp-card__reviews">(653 reviews)</span>
        </div>
        <h2 className="yelp-card__name">Prego Restaurant</h2>
        <p className="yelp-card__meta">$$$ · Italian, Seafood, Steakhouses</p>
        <p className="yelp-card__address">2409 Park Ave, Tustin, CA 92782</p>
        <p className="yelp-card__vibe">Romantic · Classy · Upscale</p>
        <span className="yelp-card__cta">View on Yelp →</span>
      </a>
    </div>
  )
}
