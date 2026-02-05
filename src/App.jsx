import { useState, useCallback } from 'react'
import Page1 from './pages/Page1'
import Page1B from './pages/Page1B'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
import Page5 from './pages/Page5'
import Page6 from './pages/Page6'
import WinScreen from './WinScreen'

/**
 * Progressive Valentine game.
 * 1 → No → 2 (Interesting) → 3 (Wow) → 4 (Will you not) → 5 (Boss) → 6 (Basket) → 7 (Minecraft)
 */
export default function App() {
  const [page, setPage] = useState(1)
  const [showWin, setShowWin] = useState(false)
  const [slainByLove, setSlainByLove] = useState(false)
  const [returnedToStart, setReturnedToStart] = useState(false)

  const onYes = useCallback((fromPage) => {
    if (fromPage === 7) {
      setSlainByLove(true)
      setShowWin(true)
    } else if (fromPage >= 2 && fromPage <= 6) {
      setPage(fromPage + 1)
    } else {
      setShowWin(true)
    }
  }, [])

  /** Go to a specific page (e.g. 1) or advance to next. */
  const onNo = useCallback((targetPage) => {
    if (typeof targetPage === 'number') {
      if (targetPage === 1) setReturnedToStart(true)
      setPage(targetPage)
    } else {
      setPage((p) => p + 1)
    }
  }, [])

  const onChooseYes = useCallback(() => setShowWin(true), [])

  if (showWin) return <WinScreen />

  switch (page) {
    case 1:
      return <Page1 onYes={onYes} onNo={onNo} isReturning={returnedToStart} />
    case 2:
      return <Page2 onYes={onYes} onNo={onNo} />
    case 3:
      return <Page3 onYes={onYes} onNo={onNo} />
    case 4:
      return <Page1B onYes={onYes} onChooseYes={onChooseYes} />
    case 5:
      return <Page4 onYes={onYes} onNo={onNo} onLose={() => setPage(1)} />
    case 6:
      return <Page5 onYes={onYes} onNo={onNo} />
    case 7:
      return <Page6 onYes={onYes} slainByLove={slainByLove} />
    default:
      return <Page1 onYes={onYes} onNo={onNo} />
  }
}
