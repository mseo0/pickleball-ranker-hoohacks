const slotLabels = {
  '8am': '8–10 AM',
  '10am': '10–12 PM',
  '12pm': '12–2 PM',
  '2pm': '2–4 PM',
  '4pm': '4–6 PM',
  '6pm': '6–8 PM',
}

function TimeSlotSelector({ slots, selectedSlots, onToggle }) {
  return (
    <div className="flex flex-wrap gap-[6px]">
      {slots.map((slot) => {
        const selected = selectedSlots.includes(slot)
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onToggle(slot)}
            className={[
              'rounded-[6px] border px-[9px] py-[5px] text-[10px]',
              selected
                ? 'border-[rgba(200,241,53,0.30)] bg-[rgba(200,241,53,0.12)] font-medium text-[var(--accent)]'
                : 'border-[rgba(200,241,53,0.10)] bg-[var(--card2)] text-[var(--muted)]',
            ].join(' ')}
          >
            {slotLabels[slot]}
          </button>
        )
      })}
    </div>
  )
}

export default TimeSlotSelector
