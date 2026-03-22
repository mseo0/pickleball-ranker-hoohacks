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
      <div>
        <div className="mb-1 text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">
          Player Rating
        </div>
        <div className="font-display text-[72px] leading-none text-[var(--accent)]">{rating}</div>
        <div className={`mt-1 text-[12px] ${ratingDelta >= 0 ? 'text-[var(--green)]' : 'text-[#f87171]'}`}>
          {ratingDelta >= 0 ? '▲' : '▼'} {deltaPrefix}{Math.abs(ratingDelta)} over last 5 matches
        </div>
      </div>
    </section>
  )
}

export default EloHero
