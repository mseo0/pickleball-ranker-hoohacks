import SectionHeader from '../layout/SectionHeader'

const stats = [
  { value: '247', color: '#e8f0e8', label: 'Members' },
  { value: '1642', color: '#C8F135', label: 'Avg ELO' },
  { value: '38', color: '#e8f0e8', label: 'Active Today' },
  { value: '94%', color: '#4ade80', label: 'Match Rate' },
]

function ClubQuickStats() {
  return (
    <section className="flex flex-col gap-[10px]">
      <SectionHeader title="CVille Pickleballers" link="View →" />
      <div className="flex flex-col gap-[10px] rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-[14px] py-[12px]">
        <p className="text-[11px] leading-[1.5] text-[var(--muted)]">
          Weekly sessions at Darden Towe and McIntire. Thursday evenings = rated sessions (1400+ ELO).
        </p>
        <div className="grid grid-cols-2 gap-[8px]">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[8px] bg-[var(--card2)] p-[9px] text-center">
              <div className="font-display text-[20px]" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[9px] uppercase tracking-[0.05em] text-[var(--muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClubQuickStats
