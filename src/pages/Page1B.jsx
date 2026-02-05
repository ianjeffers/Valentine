/**
 * Page 2: "Will you not be my valentine?"
 * Yes → next No sequence (page 3). No → You said Yes! (win).
 */
export default function Page1B({ onYes, onChooseYes }) {
  return (
    <div className="screen">
      <h1 className="screen__title">Will you not be my valentine?</h1>
      <div className="screen__buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', minHeight: 80 }}>
        <button type="button" className="btn btn--yes" onClick={() => onYes(4)}>
          Yes
        </button>
        <button type="button" className="btn btn--no" onClick={onChooseYes}>
          No
        </button>
      </div>
    </div>
  )
}
