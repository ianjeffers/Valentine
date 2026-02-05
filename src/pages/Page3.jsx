import { useState, useCallback, useRef, useEffect } from 'react'

const RUN_RADIUS = 95
const RUN_STRENGTH = 18

/**
 * Page 3: Guilt Trip. No stays still. Yes runs away from the cursor across the whole screen.
 */
export default function Page3({ onYes, onNo }) {
  const containerRef = useRef(null)
  const yesRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const posRef = useRef({ x: 0, y: 0 })
  const initialized = useRef(false)

  const updateYesPosition = useCallback((x, y) => {
    if (!containerRef.current || !yesRef.current) return
    const cr = containerRef.current.getBoundingClientRect()
    const br = yesRef.current.getBoundingClientRect()
    const halfW = br.width / 2
    const halfH = br.height / 2
    const nx = Math.max(halfW, Math.min(cr.width - halfW, x))
    const ny = Math.max(halfH, Math.min(cr.height - halfH, y))
    posRef.current = { x: nx, y: ny }
    setPos({ x: nx, y: ny })
  }, [])

  useEffect(() => {
    if (!containerRef.current || !yesRef.current || initialized.current) return
    initialized.current = true
    const cr = containerRef.current.getBoundingClientRect()
    updateYesPosition(cr.width / 2 - 180, cr.height / 2)
  }, [updateYesPosition])

  useEffect(() => {
    const onMove = (e) => {
      if (!containerRef.current || !yesRef.current) return
      const cr = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - cr.left
      const mouseY = e.clientY - cr.top
      const { x: cx, y: cy } = posRef.current
      const dx = mouseX - cx
      const dy = mouseY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < RUN_RADIUS && dist > 0) {
        const angle = Math.atan2(dy, dx)
        updateYesPosition(
          cx - Math.cos(angle) * RUN_STRENGTH,
          cy - Math.sin(angle) * RUN_STRENGTH
        )
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [updateYesPosition])

  return (
    <div className="screen">
      <h1 className="screen__title">Wow. Okay.</h1>
      <p className="screen__subtext">
        After everything we've been through, you still want to say no?
      </p>
      <div
        ref={containerRef}
        className="screen__buttons screen__buttons--full"
        style={{
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: 180,
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        <button
          ref={yesRef}
          type="button"
          className="btn btn--yes"
          onClick={() => onYes(3)}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.12s ease-out, top 0.12s ease-out',
          }}
        >
          Yes
        </button>
        <button
          type="button"
          className="btn btn--no"
          onClick={() => onNo(1)}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(80px, -50%)',
          }}
        >
          No
        </button>
      </div>
    </div>
  )
}
