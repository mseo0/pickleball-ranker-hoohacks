function EloPill({ label, value }) {
  return (
    <div
      style={{
        background: '#1a2a1a',
        border: '1px solid rgba(200,241,53,0.20)',
        borderRadius: '8px',
        padding: '8px 14px',
        flex: 1,
      }}
    >
      <span
        style={{
          fontSize: '8px',
          color: '#7a9a7a',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'block',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          color: '#C8F135',
          lineHeight: 1.1,
          display: 'block',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function EloRangeSelector({
  userElo,
  eloMin,
  eloMax,
  rangeDelta,
  isAdjusting,
  onToggleAdjust,
  onAdjust,
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[10px]">
        <EloPill label="Min ELO" value={eloMin} />
        <div className="shrink-0 text-[16px] text-[var(--dim)]">↔</div>
        <EloPill label="Max ELO" value={eloMax} />
        <div className="shrink-0 text-right">
          <div className="text-[10px] text-[var(--muted)]">±{rangeDelta} default</div>
          <button type="button" onClick={onToggleAdjust} className="block text-[10px] text-[var(--accent)]">
            Adjust
          </button>
        </div>
      </div>

      {isAdjusting ? (
        <div className="rounded-[10px] border border-[rgba(200,241,53,0.12)] bg-[var(--card2)] px-[12px] py-[10px]">
          <div className="mb-[6px] flex items-center justify-between text-[10px] text-[var(--muted)]">
            <span>Range around your {userElo} ELO</span>
            <span>±{rangeDelta}</span>
          </div>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={rangeDelta}
            onChange={(event) => onAdjust(Number(event.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>
      ) : null}
    </div>
  )
}

export default EloRangeSelector
