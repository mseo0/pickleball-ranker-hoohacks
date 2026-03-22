const matchTypeOptions = [
  { id: 'rated', label: 'Rated' },
  { id: 'unrated', label: 'Unrated' },
  { id: 'competitive', label: 'Competitive' },
  { id: 'casual', label: 'Casual only' },
  { id: 'doubles', label: 'Doubles' },
  { id: 'singles', label: 'Singles' },
]

const CHIP_ROW_STYLE = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
}

const ACTIVE_CHIP_STYLE = {
  fontSize: '11px',
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  borderRadius: '20px',
  padding: '5px 13px',
  background: 'rgba(200,241,53,0.10)',
  border: '1px solid rgba(200,241,53,0.38)',
  color: '#C8F135',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const INACTIVE_CHIP_STYLE = {
  fontSize: '11px',
  fontWeight: 400,
  fontFamily: "'DM Sans', sans-serif",
  borderRadius: '20px',
  padding: '5px 13px',
  background: 'transparent',
  border: '1px solid rgba(200,241,53,0.13)',
  color: '#7a9a7a',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

function MatchTypeFilters({ value, onToggle }) {
  return (
    <div style={CHIP_ROW_STYLE}>
      {matchTypeOptions.map((option) => {
        const active = value.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onToggle(option.id)}
            style={active ? ACTIVE_CHIP_STYLE : INACTIVE_CHIP_STYLE}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default MatchTypeFilters
