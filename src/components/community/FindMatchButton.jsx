function SearchPlusIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0c140c"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  )
}

function FindMatchButton({ summary, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        background: '#C8F135',
        borderRadius: '10px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '20px',
            color: '#0c140c',
            letterSpacing: '0.05em',
            display: 'block',
          }}
        >
          Find My Match
        </span>
        <span
          style={{
            fontSize: '10px',
            color: 'rgba(12,20,12,0.60)',
            marginTop: '2px',
            display: 'block',
          }}
        >
          {summary}
        </span>
      </div>
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(12,20,12,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <SearchPlusIcon />
      </div>
    </button>
  )
}

export default FindMatchButton
