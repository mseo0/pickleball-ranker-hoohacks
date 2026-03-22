function UpcomingEvents({ events }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500, color: '#e8f0e8' }}>
          Upcoming Events
        </div>
        <div style={{ fontSize: '11px', color: '#C8F135', cursor: 'pointer' }}>+ Add</div>
      </div>
      <div className="flex flex-col gap-[8px]">
        {events.length === 0 ? (
          <div
            className="px-[12px] py-[14px] text-[11px] text-[var(--muted)]"
            style={{ background: '#142014', border: '1px solid rgba(200,241,53,0.12)', borderRadius: '12px' }}
          >
            No upcoming events right now.
          </div>
        ) : null}
        {events.map((event) => (
          <article
            key={`${event.day}-${event.title}`}
            className="px-[12px] py-[10px]"
            style={{ background: '#142014', border: '1px solid rgba(200,241,53,0.12)', borderRadius: '12px' }}
          >
            <div className="flex items-start gap-[10px]">
              <div
                className="min-w-[36px] rounded-[8px] px-[9px] py-[7px] text-center"
                style={{ background: event.accentColor === '#C8F135' ? 'rgba(200,241,53,0.10)' : 'rgba(136,180,255,0.08)' }}
              >
                <div className="font-display text-[19px] leading-none" style={{ color: event.accentColor }}>
                  {event.day}
                </div>
                <div className="mt-[2px] text-[8px] uppercase text-[var(--muted)]">{event.month}</div>
              </div>
              <div>
                <div className="text-[12px] font-medium text-[var(--text)]">{event.title}</div>
                <div className="mt-[2px] text-[10px] text-[var(--muted)]">{event.meta}</div>
                <div className="mt-[3px] text-[10px]" style={{ color: event.fillColor }}>
                  {event.fillText}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default UpcomingEvents
