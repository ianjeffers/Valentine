import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

/**
 * Page 6: Minecraft-themed end. No is disabled and fades away.
 * Minecraft chatbox-style popup: "No has left the game".
 * Only Yes remains; clicking Yes shows "No was slain by love." and celebration.
 */
export default function Page6({ onYes, slainByLove }) {
  const [noVisible, setNoVisible] = useState(true)
  const [vanishDone, setVanishDone] = useState(false)
  const celebrated = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setNoVisible(false)
      setTimeout(() => setVanishDone(true), 450)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  const handleYes = () => {
    onYes(7)
    if (celebrated.current) return
    celebrated.current = true
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#ff6b9d', '#c44569', '#ff9ebb', '#fff'],
    })
  }

  return (
    <>
      <div className="screen screen--minecraft">
        <h1 className="screen__title">The end.</h1>
        <p className="screen__subtext">
          {vanishDone ? (slainByLove ? 'No was slain by love.' : "There's only one option left.") : '...'}
        </p>
        <div className="screen__buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100, gap: '1rem' }}>
          <button
            type="button"
            className="btn btn--no"
            disabled
            aria-hidden={!noVisible}
            style={{
              opacity: noVisible ? 1 : 0,
              transform: noVisible ? 'scale(1)' : 'scale(0.2)',
              pointerEvents: 'none',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            No
          </button>
          <button type="button" className="btn btn--yes" onClick={handleYes}>
            Yes
          </button>
        </div>
      </div>

      {vanishDone && (
        <div className="minecraft-chat minecraft-chat--popup">
          <div className="minecraft-chat__message">
            No has left the game
          </div>
          {slainByLove && (
            <div className="minecraft-chat__message minecraft-chat__message--slain">
              No was slain by love❤️
            </div>
          )}
        </div>
      )}
    </>
  )
}
