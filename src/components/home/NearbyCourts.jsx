import CourtGauge from './CourtGauge'

function NearbyCourts({ courts }) {
  return (
    <section className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-5 py-[18px]">
      <div className="mb-[10px] flex items-center justify-between">
        <h2 className="font-display text-[15px] tracking-[0.06em] text-[var(--text)]">
          Nearby Courts
        </h2>
        <button type="button" className="text-[11px] text-[var(--accent)]">
          Map →
        </button>
      </div>

      <div className="space-y-[10px]">
        {courts.map((court) => (
          <div
            key={court.name}
            className="rounded-[8px] border border-[var(--border)] bg-[var(--card2)] px-[14px] py-3"
          >
            <div className="mb-[10px] flex items-start justify-between gap-3">
              <div>
                <div className="text-[14px] font-medium text-[var(--text)]">{court.name}</div>
                <div className="text-[11px] text-[var(--muted)]">
                  {court.dist} · {court.open} courts open
                </div>
              </div>
              <div className="text-[11px] text-[var(--muted)]">{court.waiting} waiting</div>
            </div>
            <CourtGauge occupancy={court.occupancy} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default NearbyCourts
