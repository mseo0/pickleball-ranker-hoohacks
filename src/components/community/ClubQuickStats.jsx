function ClubQuickStats({ totalMembers = 0, avgElo = 0, activeToday = 0 }) {
  const stats = [
    { value: String(totalMembers), color: '#e8f0e8', label: 'Members' },
    { value: String(avgElo), color: '#C8F135', label: 'Avg ELO' },
    { value: String(activeToday), color: '#e8f0e8', label: 'Active Today' },
    { value: '94%', color: '#4ade80', label: 'Match Rate' },
  ]

  return (
    <section className="flex flex-col gap-[10px]">
      <div className="flex items-center justify-between">
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500, color: '#e8f0e8' }}>
          CVille Pickleballers
        </div>
        <div style={{ fontSize: '11px', color: '#C8F135', cursor: 'pointer' }}>View →</div>
      </div>
      <div
        className="flex flex-col gap-[10px] px-[14px] py-[12px]"
        style={{ background: '#142014', border: '1px solid rgba(200,241,53,0.12)', borderRadius: '12px' }}
      >
        <p className="text-[11px] leading-[1.5] text-[var(--muted)]">
          Weekly sessions at Darden Towe and McIntire. Thursday evenings = rated sessions (1400+ ELO).
        </p>
        <div className="grid grid-cols-2 gap-[8px]">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[8px] bg-[var(--card2)] p-[10px] text-center">
              <div className="font-display text-[22px]" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[9px] uppercase tracking-[0.06em] text-[var(--muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClubQuickStats
