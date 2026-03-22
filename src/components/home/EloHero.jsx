import { useAuth } from '../../auth/AuthContext'

function EloHero() {
  const { currentUser } = useAuth()
  const rating = currentUser?.profile?.eloRating ?? 1200
  const recentMatches = currentUser?.recentMatches ?? []
  const ratingDelta = recentMatches.reduce(
    (total, match) => total + (match.result === 'W' ? 100 : -100),
    0,
  )
  const deltaPrefix = ratingDelta >= 0 ? '+' : '−'

  return (
    <section className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-5 py-[18px]">
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        <div className="flex-1">
          <div className="mb-1 text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">
            Player Rating
          </div>
          <div className="font-display text-[72px] leading-none text-[var(--accent)]">{rating}</div>
          <div className={`mt-1 text-[12px] ${ratingDelta >= 0 ? 'text-[var(--green)]' : 'text-[#f87171]'}`}>
            {ratingDelta >= 0 ? '▲' : '▼'} {deltaPrefix}{Math.abs(ratingDelta)} over last 5 matches
          </div>
        </div>

        <div className="flex w-full flex-col gap-[6px] md:w-[160px]">
          <div className="text-[10px] uppercase tracking-[0.06em] text-[var(--muted)]">
            30-Day Trend
          </div>
          <svg viewBox="0 0 160 80" className="block w-full flex-1">
            <defs>
              <linearGradient id="eloTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,68 L16,63 L32,57 L48,61 L64,52 L80,45 L96,38 L112,30 L128,20 L144,12 L160,8 L160,80 L0,80Z"
              fill="url(#eloTrendGradient)"
            />
            <path
              d="M0,68 L16,63 L32,57 L48,61 L64,52 L80,45 L96,38 L112,30 L128,20 L144,12 L160,8"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="160" cy="8" r="4" fill="var(--accent)" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default EloHero
