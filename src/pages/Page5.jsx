import { useState, useRef, useEffect } from 'react'

const GAME_WIDTH = 320
const GAME_HEIGHT = 240
const BALL_R = 10
const BASKET_W = 50
const BASKET_H = 40
const BASKET_Y = 30
const HOOP_W = 44
const GRAVITY = 0.35
const BALL_START = { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 40 }

/**
 * Page 5: Make the basket. One ball that respawns at anchor after a miss.
 * Pull-back is drawn from anchor to cursor; release to shoot.
 */
export default function Page5({ onYes, onNo }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [aiming, setAiming] = useState(false)
  const [dragCurrent, setDragCurrent] = useState(null)
  const [ball, setBall] = useState({ ...BALL_START, vx: 0, vy: 0, active: false })
  const [basketX] = useState(GAME_WIDTH / 2 - BASKET_W / 2)
  const [madeBasket, setMadeBasket] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const animRef = useRef(null)

  const checkHoop = (x, y) => {
    const cx = basketX + BASKET_W / 2
    const top = BASKET_Y
    const bottom = BASKET_Y + BASKET_H * 0.6
    const left = cx - HOOP_W / 2
    const right = cx + HOOP_W / 2
    if (y + BALL_R >= top && y - BALL_R <= bottom && x >= left && x <= right) {
      setMadeBasket(true)
      return true
    }
    return false
  }

  useEffect(() => {
    if (!ball.active) return
    const step = () => {
      setBall((b) => {
        if (!b.active) return b
        let { x, y, vx, vy } = b
        vy += GRAVITY
        x += vx
        y += vy
        if (checkHoop(x, y)) return { ...b, active: false }
        if (y > GAME_HEIGHT + 30 || x < -20 || x > GAME_WIDTH + 20) {
          return { ...BALL_START, vx: 0, vy: 0, active: false }
        }
        return { x, y, vx: vx * 0.998, vy, active: true }
      })
      animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [ball.active])

  const getGameCoords = (e) => {
    if (!containerRef.current) return null
    const rect = containerRef.current.getBoundingClientRect()
    const scaleX = GAME_WIDTH / rect.width
    const scaleY = GAME_HEIGHT / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handlePointerDown = (e) => {
    if (ball.active || madeBasket) return
    const coords = getGameCoords(e)
    if (!coords) return
    dragStart.current = { x: coords.x, y: coords.y }
    setAiming(true)
    setDragCurrent(coords)
  }

  const handlePointerMove = (e) => {
    if (!aiming || ball.active || madeBasket) return
    const coords = getGameCoords(e)
    if (coords) setDragCurrent(coords)
  }

  const handlePointerUp = (e) => {
    if (!aiming || ball.active || madeBasket) return
    const coords = getGameCoords(e)
    if (!coords) {
      setAiming(false)
      setDragCurrent(null)
      return
    }
    const dx = BALL_START.x - coords.x
    const dy = BALL_START.y - coords.y
    const mag = Math.min(Math.hypot(dx, dy) * 0.18, 14)
    const angle = Math.atan2(dy, dx)
    setBall({
      ...BALL_START,
      vx: Math.cos(angle) * mag,
      vy: Math.sin(angle) * mag - 4,
      active: true,
    })
    setAiming(false)
    setDragCurrent(null)
  }

  const handlePointerLeave = () => {
    if (aiming) {
      setAiming(false)
      setDragCurrent(null)
    }
  }

  const ballX = ball.active ? ball.x : BALL_START.x
  const ballY = ball.active ? ball.y : BALL_START.y
  const showPullBack = aiming && dragCurrent && !ball.active && !madeBasket

  return (
    <div className="screen">
      <h1 className="screen__title">Make the basket.</h1>
      <p className="screen__subtext">
        You can only say No if you make the basket.
      </p>
      <div className="screen__buttons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div
          ref={containerRef}
          style={{
            width: '100%',
            maxWidth: GAME_WIDTH,
            aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
            background: 'linear-gradient(180deg, #2d1b2d 0%, #1a0a1a 100%)',
            borderRadius: 12,
            border: '2px solid #4a2c3a',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              cursor: ball.active || madeBasket ? 'default' : 'crosshair',
            }}
          />
          {/* Basket */}
          <div
            style={{
              position: 'absolute',
              left: `${(basketX / GAME_WIDTH) * 100}%`,
              top: `${(BASKET_Y / GAME_HEIGHT) * 100}%`,
              width: `${(BASKET_W / GAME_WIDTH) * 100}%`,
              height: `${(BASKET_H / GAME_HEIGHT) * 100}%`,
              pointerEvents: 'none',
              transform: 'translateY(-50%)',
            }}
          >
            <div
              style={{
                width: (HOOP_W / BASKET_W) * 100 + '%',
                height: '35%',
                margin: '0 auto',
                border: '3px solid #8b6914',
                borderRadius: '50%',
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                width: '100%',
                height: '30%',
                marginTop: '-2%',
                background: 'linear-gradient(90deg, #6b4a1a, #8b6914)',
                borderRadius: '0 0 4px 4px',
              }}
            />
          </div>
          {/* Pull-back: line from anchor (ball) to cursor - no extra circle at anchor */}
          {showPullBack && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="pull-line" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e8a0b8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#c44569" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <line
                  x1={BALL_START.x}
                  y1={BALL_START.y}
                  x2={dragCurrent.x}
                  y2={dragCurrent.y}
                  stroke="url(#pull-line)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1={BALL_START.x}
                  y1={BALL_START.y}
                  x2={dragCurrent.x}
                  y2={dragCurrent.y}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx={dragCurrent.x} cy={dragCurrent.y} r="12" fill="rgba(196, 69, 105, 0.7)" stroke="#e8a0b8" strokeWidth="3" />
              </svg>
            </div>
          )}
          {/* Single ball: at anchor when idle, at ball pos when active */}
          {!madeBasket && (
            <div
              style={{
                position: 'absolute',
                left: `${(ballX / GAME_WIDTH) * 100}%`,
                top: `${(ballY / GAME_HEIGHT) * 100}%`,
                width: `${(BALL_R * 2 / GAME_WIDTH) * 100}%`,
                aspectRatio: '1',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #c44569, #8b2a4a)',
                border: '2px solid #e8a0b8',
                pointerEvents: 'none',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>
        <p style={{ fontSize: '0.85rem', color: '#e8b4c8' }}>
          {madeBasket
            ? "Wow. I see how it is. Last chance. Will you be my valentine?"
            : 'Drag back from the ball and release to shoot.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--yes" onClick={() => onYes(6)}>
            Yes
          </button>
          {madeBasket && (
            <button type="button" className="btn btn--no" onClick={() => onNo()} style={{ animation: 'fadeIn 0.4s ease' }}>
              No
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
