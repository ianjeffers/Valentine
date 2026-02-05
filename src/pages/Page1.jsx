/**
 * Page 1: Overly Formal. When returning from No on page 2/3, show "Alright, let's try this again."
 */
export default function Page1({ onYes, onNo, isReturning }) {
  return (
    <div className="screen">
      <h1 className="screen__title">Valentine Proposal Request</h1>
      <p className="screen__subtext">
        {isReturning ? "Alright, let's try this again." : 'Please select one of the following legally binding options.'}
      </p>
      <div className="screen__buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn--yes" onClick={() => onYes(1)}>
          Yes
        </button>
        <button type="button" className="btn btn--no" onClick={onNo}>
          No
        </button>
      </div>
    </div>
  )
}
