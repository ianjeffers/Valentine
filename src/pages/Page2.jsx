/**
 * Page 2: Psychological Manipulation.
 * No → back to Valentine page (1). Yes → next No page (3).
 */
export default function Page2({ onYes, onNo }) {
  return (
    <div className="screen">
      <h1 className="screen__title">Interesting choice.</h1>
      <p className="screen__subtext">
        You really want to hit "No," huh?
      </p>
      <div className="screen__buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', minHeight: 80 }}>
        <button type="button" className="btn btn--yes" onClick={() => onYes(2)}>
          Yes
        </button>
        <button type="button" className="btn btn--no" onClick={() => onNo(1)}>
          No
        </button>
      </div>
    </div>
  )
}
