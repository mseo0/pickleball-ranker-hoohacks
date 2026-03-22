const slotLabels = {
  '8am': '8–10 AM',
  '10am': '10–12 PM',
  '12pm': '12–2 PM',
  '2pm': '2–4 PM',
  '4pm': '4–6 PM',
  '6pm': '6–8 PM',
}

const SLOT_ROW_STYLE = {
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
}

const SELECTED_SLOT_STYLE = {
  fontSize: '11px',
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  borderRadius: '7px',
  padding: '6px 11px',
  background: 'rgba(200,241,53,0.10)',
  border: '1px solid rgba(200,241,53,0.38)',
  color: '#C8F135',
  cursor: 'pointer',
}

const UNSELECTED_SLOT_STYLE = {
  fontSize: '11px',
  fontWeight: 400,
  fontFamily: "'DM Sans', sans-serif",
  borderRadius: '7px',
  padding: '6px 11px',
  background: '#1a2a1a',
  border: '1px solid rgba(200,241,53,0.10)',
  color: '#7a9a7a',
  cursor: 'pointer',
}

function TimeSlotSelector({ slots, selectedSlots, onToggle }) {
  return (
    <div style={SLOT_ROW_STYLE}>
      {slots.map((slot) => {
        const selected = selectedSlots.includes(slot)
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onToggle(slot)}
            style={selected ? SELECTED_SLOT_STYLE : UNSELECTED_SLOT_STYLE}
          >
            {slotLabels[slot]}
          </button>
        )
      })}
    </div>
  )
}

export default TimeSlotSelector
