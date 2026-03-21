const stats = [
  { label: 'Matches', value: '142', sub: '68% win rate' },
  { label: 'Streak', value: '7W', sub: 'Personal best' },
  { label: 'Local Rank', value: '#84', sub: 'Charlottesville' },
]

function StatsRow() {
  return (
    <section className="grid gap-[10px] md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[10px] border border-[var(--border)] bg-[var(--card2)] p-[14px]"
        >
          <div className="text-[10px] uppercase tracking-[0.06em] text-[var(--muted)]">
            {stat.label}
          </div>
          <div className="font-display text-[30px] leading-[1.1] text-[var(--text)]">{stat.value}</div>
          <div className="text-[11px] text-[var(--muted)]">{stat.sub}</div>
        </div>
      ))}
    </section>
  )
}

export default StatsRow
