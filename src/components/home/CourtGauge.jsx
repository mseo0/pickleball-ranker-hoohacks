function getGaugeState(occupancy) {
  if (occupancy <= 39) {
    return {
      label: 'Open',
      labelColor: '#a3e635',
      fill: 'linear-gradient(90deg,#22c55e,#a3e635)',
    }
  }

  if (occupancy <= 74) {
    return {
      label: 'Busy',
      labelColor: '#facc15',
      fill: 'linear-gradient(90deg,#22c55e,#facc15)',
    }
  }

  return {
    label: 'Full',
    labelColor: '#ef4444',
    fill: 'linear-gradient(90deg,#f59e0b,#ef4444)',
  }
}

function CourtGauge({ occupancy }) {
  const state = getGaugeState(occupancy)

  return (
    <div>
      <div className="flex items-center gap-[10px]">
        <div className="h-[9px] flex-1 overflow-hidden rounded-[5px] border border-[var(--border)] bg-[var(--card2)]">
          <div
            className="h-full rounded-[5px] transition-[width] duration-[400ms] ease-out"
            style={{ width: `${occupancy}%`, background: state.fill }}
          />
        </div>
        <div className="min-w-10 text-right text-[11px] font-semibold" style={{ color: state.labelColor }}>
          {state.label}
        </div>
      </div>
      <div className="mt-[3px] flex justify-between text-[9px] text-[var(--dim)]">
        <span>Empty</span>
        <span>Moderate</span>
        <span>Full</span>
      </div>
    </div>
  )
}

export default CourtGauge
