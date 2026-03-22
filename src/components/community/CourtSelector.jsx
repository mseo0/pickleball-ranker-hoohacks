const TILE_ROW_STYLE = {
  display: 'flex',
  gap: '8px',
}

const SELECTED_TILE_STYLE = {
  background: 'rgba(200,241,53,0.08)',
  border: '1px solid rgba(200,241,53,0.35)',
  borderRadius: '9px',
  padding: '10px 12px',
  cursor: 'pointer',
  flex: 1,
}

const UNSELECTED_TILE_STYLE = {
  background: '#1a2a1a',
  border: '1px solid rgba(200,241,53,0.10)',
  borderRadius: '9px',
  padding: '10px 12px',
  cursor: 'pointer',
  flex: 1,
}

const COURT_NAME_STYLE = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#e8f0e8',
}

const DISTANCE_STYLE = {
  fontSize: '9px',
  color: '#7a9a7a',
  marginTop: '2px',
}

const STATUS_ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  marginTop: '6px',
}

function CourtSelector({ courts, selectedCourts, onToggle }) {
  return (
    <div style={TILE_ROW_STYLE}>
      {courts.map((court) => {
        const selected = selectedCourts.includes(court.id)
        return (
          <button
            key={court.id}
            type="button"
            onClick={() => onToggle(court.id)}
            style={selected ? SELECTED_TILE_STYLE : UNSELECTED_TILE_STYLE}
          >
            <div style={COURT_NAME_STYLE}>{court.name}</div>
            <div style={DISTANCE_STYLE}>{court.dist}</div>
            <div style={STATUS_ROW_STYLE}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: court.color,
                }}
              />
              <span style={{ fontSize: '10px', fontWeight: 500, color: court.color }}>
                {court.status}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default CourtSelector
