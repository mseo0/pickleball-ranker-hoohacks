function CourtSelector({ courts, selectedCourts, onToggle }) {
  return (
    <div className="grid grid-cols-3 gap-[8px]">
      {courts.map((court) => {
        const selected = selectedCourts.includes(court.id)
        return (
          <button
            key={court.id}
            type="button"
            onClick={() => onToggle(court.id)}
            className={[
              'rounded-[8px] px-[10px] py-[9px] text-left',
              selected
                ? 'border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.10)]'
                : 'border border-[rgba(200,241,53,0.10)] bg-[var(--card2)]',
            ].join(' ')}
          >
            <div className="text-[11px] font-medium text-[var(--text)]">{court.name}</div>
            <div className="mt-[1px] text-[9px] text-[var(--muted)]">{court.dist}</div>
            <div className="mt-[5px] flex items-center gap-[4px]">
              <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: court.color }} />
              <span className="text-[9px]" style={{ color: court.color }}>
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
