function getCurrentStreak(matches) {
  if (!matches.length) {
    return { value: '0', sub: 'No matches logged' }
  }

  const firstResult = matches[0].result
  let streakLength = 0

  for (const match of matches) {
    if (match.result !== firstResult) {
      break
    }
    streakLength += 1
  }

  return {
    value: `${streakLength}${firstResult}`,
    sub: firstResult === 'W' ? 'Current win streak' : 'Current skid',
  }
}

function StatsRow({ localRank = 1, matches = [] }) {
  const streak = getCurrentStreak(matches)
  const stats = [
    { label: 'Matches', value: '142', sub: '68% win rate' },
    { label: 'Streak', value: streak.value, sub: streak.sub },
    { label: 'Local Rank', value: `#${localRank}`, sub: 'Charlottesville' },
  ]

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
