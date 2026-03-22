const scopeOptions = [
  { id: 'anyone', label: 'Anyone on Pickelo' },
  { id: 'specific', label: 'Specific Communities' },
  { id: 'my-communities', label: 'My Communities Only' },
]

const TOGGLE_ROW_STYLE = {
  display: 'flex',
  gap: '6px',
  width: '100%',
}

const ACTIVE_BUTTON_STYLE = {
  flex: 1,
  padding: '9px 12px',
  borderRadius: '8px',
  background: '#C8F135',
  border: 'none',
  color: '#0c140c',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  textAlign: 'center',
}

const INACTIVE_BUTTON_STYLE = {
  flex: 1,
  padding: '9px 12px',
  borderRadius: '8px',
  background: 'transparent',
  border: '1px solid rgba(200,241,53,0.18)',
  color: '#7a9a7a',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  fontWeight: 400,
  cursor: 'pointer',
  textAlign: 'center',
}

function PoolScopeToggle({ value, onChange }) {
  return (
    <div style={TOGGLE_ROW_STYLE}>
      {scopeOptions.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            style={active ? ACTIVE_BUTTON_STYLE : INACTIVE_BUTTON_STYLE}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default PoolScopeToggle
