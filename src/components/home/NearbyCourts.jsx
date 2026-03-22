import SectionHeader from '../layout/SectionHeader'

function formatCourtAddress(address) {
  const parts = address.split(',').map((part) => part.trim())
  if (parts.length < 3) {
    return address
  }

  return parts.slice(0, 3).join(', ')
}

function NearbyCourts({ courts, isLoading = false }) {
  return (
    <section className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-5 py-[18px]">
      <div className="mb-[10px]">
        <SectionHeader title="NEARBY COURTS" />
      </div>

      {isLoading ? (
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--card2)] px-[14px] py-[13px] text-[12px] text-[var(--muted)]">
          Getting your location...
        </div>
      ) : null}

      {!isLoading ? <div className="space-y-[10px]">
        {courts.map((court) => (
          <div
            key={court.id ?? court.name}
            className="rounded-[10px] border border-[var(--border)] bg-[var(--card2)] px-[14px] py-[13px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[14px] font-medium text-[var(--text)]">{court.name}</div>
                <div className="mt-[3px] flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">
                  {court.distanceLabel ? <span>{court.distanceLabel}</span> : null}
                  <span>{court.courtCount} courts</span>
                  <span>{court.netType === 'permanent' ? 'Permanent nets' : 'Portable nets'}</span>
                </div>
              </div>
              <div className="shrink-0 whitespace-nowrap rounded-full border border-[var(--border)] px-2.5 py-[5px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                {court.cost.label}
              </div>
            </div>
            <a
              href={court.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-2 block truncate text-[11px] text-[var(--muted)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--text)]"
              title={formatCourtAddress(court.address)}
            >
              <span>{formatCourtAddress(court.address)}</span>
              <span className="ml-2 text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]/75 transition-colors group-hover:text-[var(--accent)]">
                Maps
              </span>
            </a>
            <div className="mt-2 flex flex-wrap gap-2">
              {court.categories?.slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-[rgba(200,241,53,0.08)] px-2.5 py-1 text-[9px] uppercase tracking-[0.08em] text-[var(--muted)]"
                >
                  {category.replaceAll('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div> : null}
    </section>
  )
}

export default NearbyCourts
