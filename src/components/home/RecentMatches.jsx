import SectionHeader from '../layout/SectionHeader'

function RecentMatches({ matches }) {
  return (
    <section className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-5 py-[18px]">
      <div className="mb-[10px]">
        <SectionHeader title="RECENT MATCHES" />
      </div>

      {matches.map((match, index) => {
        const isWin = match.result === 'W'
        return (
          <div
            key={`${match.players}-${match.meta}`}
            className={[
              'flex items-center gap-[10px] py-[9px]',
              index !== matches.length - 1 ? 'border-b border-[var(--border-sub)]' : '',
            ].join(' ')}
          >
            <div
              className={[
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] text-[10px] font-semibold',
                isWin
                  ? 'bg-[color:color-mix(in_srgb,var(--green)_15%,transparent)] text-[var(--green)]'
                  : 'bg-[color:rgba(248,113,113,0.12)] text-[#f87171]',
              ].join(' ')}
            >
              {match.result}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-[var(--text)]">{match.players}</div>
              <div className="mt-[1px] text-[10px] text-[var(--muted)]">{match.meta}</div>
            </div>

            <div className="font-display text-[17px] text-[var(--text)]">{match.score}</div>
            <div
              className={[
                'min-w-7 text-right text-[12px]',
                match.elo > 0 ? 'text-[var(--green)]' : 'text-[#f87171]',
              ].join(' ')}
            >
              {match.elo > 0 ? `+${match.elo}` : `−${Math.abs(match.elo)}`}
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default RecentMatches
