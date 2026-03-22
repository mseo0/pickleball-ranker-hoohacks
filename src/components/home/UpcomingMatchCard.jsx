function UpcomingMatchCard({ match, onCancel }) {
  return (
    <section className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center justify-between bg-[rgba(200,241,53,0.08)] px-4 py-3">
        <div className="font-display text-[18px] tracking-[0.05em] text-[var(--accent)]">Your Next Match</div>
        <div className="text-[11px] text-[var(--muted)]">
          {match.scheduledDate} · {match.scheduledTime}
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
              style={{
                background: match.opponent.avatarBg,
                color: match.opponent.avatarColor,
                borderColor: `${match.opponent.avatarColor}55`,
              }}
            >
              <span className="text-[13px] font-bold">{match.opponent.avatar}</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold text-[var(--text)]">{match.opponent.name}</div>
              <div className="truncate text-[11px] text-[var(--muted)]">
                {match.opponent.eloRating} ELO · {match.opponent.rank} · {match.court.distMiles} mi
              </div>
            </div>
          </div>
          <div className="rounded-full bg-[rgba(74,222,128,0.12)] px-3 py-1 text-[11px] font-semibold text-[var(--green)]">
            {match.matchQuality}% fit
          </div>
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-[10px] border border-[rgba(200,241,53,0.08)] bg-[var(--card2)]">
          <div className="border-r border-[rgba(200,241,53,0.08)] px-3 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.06em] text-[var(--muted)]">Court</div>
            <div className="mt-1 text-[12px] font-medium text-[var(--text)]">{match.court.name}</div>
          </div>
          <div className="border-r border-[rgba(200,241,53,0.08)] px-3 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.06em] text-[var(--muted)]">Format</div>
            <div className="mt-1 text-[12px] font-medium text-[var(--text)]">{match.format}</div>
          </div>
          <div className="px-3 py-3 text-center">
            <div className="text-[10px] uppercase tracking-[0.06em] text-[var(--muted)]">ELO</div>
            <div className="mt-1 text-[12px] font-medium text-[var(--yellow)]">±{match.eloStake} pts</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.open(match.court.mapsUrl, '_blank', 'noopener,noreferrer')}
            className="flex-1 rounded-[10px] bg-[var(--accent)] px-4 py-3 text-[12px] font-semibold text-[var(--accent-dark)]"
          >
            Get Directions
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-[10px] border border-[rgba(248,113,113,0.24)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-[12px] font-semibold text-[#f87171]"
          >
            Cancel Match
          </button>
        </div>
      </div>
    </section>
  )
}

export default UpcomingMatchCard
