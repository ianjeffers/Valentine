import { useState, useRef, useEffect } from 'react'

const BOSS_HP_MAX = 5
const PLAYER_HP_MAX = 5
const TURN_DELAY_MS = 800
const BOSS_COUNTER_DELAY_MS = 550
const MESSAGE_DURATION_MS = 1100
const BLOCK_COOLDOWN_TURNS = 2
const HEAL_COOLDOWN_TURNS = 3

/**
 * Page 4: Pokemon-style battle with tactics.
 * Attack (1 dmg, take 1 counter) | Block (negate next counter, 2-turn cd) | Heal (+1 HP, no counter, 3-turn cd)
 */
export default function Page4({ onYes, onNo, onLose }) {
  const [bossHp, setBossHp] = useState(BOSS_HP_MAX)
  const [playerHp, setPlayerHp] = useState(PLAYER_HP_MAX)
  const [noUnlocked, setNoUnlocked] = useState(false)
  const [hitFlash, setHitFlash] = useState(false)
  const [playerHitFlash, setPlayerHitFlash] = useState(false)
  const [ready, setReady] = useState(true)
  const [lost, setLost] = useState(false)
  const [battleLog, setBattleLog] = useState("Love Guardian blocks the way! What will you do?")
  const [nextCounterBlocked, setNextCounterBlocked] = useState(false)
  const [blockCooldown, setBlockCooldown] = useState(0)
  const [healCooldown, setHealCooldown] = useState(0)
  const counterTimeoutRef = useRef(null)

  const endTurn = (decrementCooldowns = true) => {
    if (decrementCooldowns) {
      setBlockCooldown((c) => Math.max(0, c - 1))
      setHealCooldown((c) => Math.max(0, c - 1))
    }
    setTimeout(() => setReady(true), TURN_DELAY_MS)
    setTimeout(() => setBattleLog("What will you do?"), MESSAGE_DURATION_MS)
  }

  useEffect(() => {
    if (!lost || !onLose) return
    const t = setTimeout(() => onLose(), 2200)
    return () => clearTimeout(t)
  }, [lost, onLose])

  const doAttack = () => {
    if (bossHp <= 0 || !ready || lost) return
    setReady(false)
    setHitFlash(true)
    setTimeout(() => setHitFlash(false), 120)
    setBattleLog("You used Tackle!")
    const newBossHp = bossHp - 1
    setBossHp(newBossHp)
    if (newBossHp === 0) {
      setBattleLog("Love Guardian fainted! The path to No is open.")
      setNoUnlocked(true)
      endTurn(false)
      return
    }
    counterTimeoutRef.current = setTimeout(() => {
      setBattleLog(nextCounterBlocked ? "Love Guardian used Counter! (Blocked!)" : "Love Guardian used Counter!")
      setNextCounterBlocked(false)
      if (!nextCounterBlocked) {
        setPlayerHitFlash(true)
        setTimeout(() => setPlayerHitFlash(false), 200)
        setPlayerHp((h) => {
          const newHp = h - 1
          if (newHp <= 0) setLost(true)
          return newHp
        })
      }
      endTurn()
      counterTimeoutRef.current = null
    }, BOSS_COUNTER_DELAY_MS)
  }

  const doBlock = () => {
    if (!ready || lost || blockCooldown > 0) return
    setReady(false)
    setBattleLog("You braced for the next attack!")
    setNextCounterBlocked(true)
    setBlockCooldown(BLOCK_COOLDOWN_TURNS)
    endTurn(false)
    setTimeout(() => setReady(true), TURN_DELAY_MS)
    setTimeout(() => setBattleLog("What will you do?"), MESSAGE_DURATION_MS)
  }

  const doHeal = () => {
    if (!ready || lost || healCooldown > 0) return
    setReady(false)
    setBattleLog("You used Heal! HP restored.")
    setPlayerHp((h) => Math.min(PLAYER_HP_MAX, h + 1))
    setHealCooldown(HEAL_COOLDOWN_TURNS)
    endTurn(false)
    setTimeout(() => setReady(true), TURN_DELAY_MS)
    setTimeout(() => setBattleLog("What will you do?"), MESSAGE_DURATION_MS)
  }

  useEffect(() => () => {
    if (counterTimeoutRef.current) clearTimeout(counterTimeoutRef.current)
  }, [])

  if (lost) {
    return (
      <div className="screen">
        <h1 className="screen__title">You blacked out!</h1>
        <p className="screen__subtext">The Love Guardian was too strong. Try again?</p>
        <p style={{ fontSize: '0.9rem', color: '#e8b4c8', marginTop: '1rem' }}>Sending you back...</p>
      </div>
    )
  }

  const canBlock = blockCooldown === 0 && bossHp > 0
  const canHeal = healCooldown === 0 && bossHp > 0

  return (
    <div className="screen">
      <h1 className="screen__title">One more chance. Be my valentine?</h1>
      <p className="screen__subtext">
        No is guarded by an ancient force. I'd probably choose yes.
      </p>

      <div className="pokemon-battle">
        <div className="pokemon-battle__arena">
          <div
            className="pokemon-battle__trainer pokemon-battle__trainer--player"
            style={{
              border: playerHitFlash ? '3px solid #ff5555' : '3px solid transparent',
              transition: 'border 0.2s ease',
            }}
          >
            <div className="pokemon-battle__sprite pokemon-battle__sprite--player">
              😊
            </div>
            <div className="pokemon-battle__name">You</div>
            <div className="pokemon-battle__hp-bar-wrap">
              <div
                className="pokemon-battle__hp-bar pokemon-battle__hp-bar--player"
                style={{ width: `${(playerHp / PLAYER_HP_MAX) * 100}%` }}
              />
            </div>
            <div className="pokemon-battle__hp-text">{playerHp}/{PLAYER_HP_MAX}</div>
            {(blockCooldown > 0 || healCooldown > 0) && (
              <div className="pokemon-battle__cooldowns">
                {blockCooldown > 0 && <span title="Block cooldown">🛡 {blockCooldown}</span>}
                {healCooldown > 0 && <span title="Heal cooldown">💚 {healCooldown}</span>}
              </div>
            )}
          </div>

          <div className="pokemon-battle__vs">VS</div>

          <div
            className="pokemon-battle__trainer pokemon-battle__trainer--enemy"
            style={{
              border: hitFlash ? '3px solid #ffaa00' : '3px solid transparent',
              transition: 'border 0.15s ease',
            }}
          >
            <div className="pokemon-battle__sprite pokemon-battle__sprite--enemy">
              {bossHp > 0 ? '❤️' : '💤'}
            </div>
            <div className="pokemon-battle__name">Love Guardian</div>
            <div className="pokemon-battle__hp-bar-wrap">
              <div
                className="pokemon-battle__hp-bar pokemon-battle__hp-bar--enemy"
                style={{ width: `${(bossHp / BOSS_HP_MAX) * 100}%` }}
              />
            </div>
            <div className="pokemon-battle__hp-text">{bossHp}/{BOSS_HP_MAX}</div>
          </div>
        </div>

        {!noUnlocked && (
          <div className="pokemon-battle__dialog">
            <p className="pokemon-battle__log">{battleLog}</p>
          </div>
        )}

        <div className="pokemon-battle__actions">
          {!noUnlocked ? (
            <>
              <button
                type="button"
                className="btn pokemon-battle__fight"
                onClick={doAttack}
                disabled={!ready || bossHp <= 0}
                style={{ opacity: ready && bossHp > 0 ? 1 : 0.6, cursor: ready && bossHp > 0 ? 'pointer' : 'not-allowed' }}
              >
                Attack
              </button>
              <button
                type="button"
                className="btn pokemon-battle__block"
                onClick={doBlock}
                disabled={!ready || !canBlock}
                title="Negate the next counter. Cooldown 2 turns."
                style={{ opacity: ready && canBlock ? 1 : 0.6 }}
              >
                Block {blockCooldown > 0 ? `(${blockCooldown})` : ''}
              </button>
              <button
                type="button"
                className="btn pokemon-battle__heal"
                onClick={doHeal}
                disabled={!ready || !canHeal}
                title="Restore 1 HP. No counter. Cooldown 3 turns."
                style={{ opacity: ready && canHeal ? 1 : 0.6 }}
              >
                Heal {healCooldown > 0 ? `(${healCooldown})` : ''}
              </button>
              <button type="button" className="btn btn--yes" onClick={() => onYes(5)}>
                Yes (give up)
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn--yes" onClick={() => onYes(5)}>
                Yes
              </button>
              <button type="button" className="btn btn--no" onClick={() => onNo()} style={{ animation: 'fadeIn 0.4s ease' }}>
                No
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
