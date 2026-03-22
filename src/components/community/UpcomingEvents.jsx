import SectionHeader from '../layout/SectionHeader'

function UpcomingEvents({ events }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <SectionHeader title="UPCOMING EVENTS" link="+ Add" />
      <div className="flex flex-col gap-[8px]">
        {events.map((event) => (
          <article
            key={`${event.day}-${event.title}`}
            className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-[12px] py-[10px]"
          >
            <div className="flex items-start gap-[10px]">
              <div
                className="min-w-[34px] rounded-[8px] px-[8px] py-[6px] text-center"
                style={{ background: `${event.accentColor}14` }}
              >
                <div className="font-display text-[17px] leading-none" style={{ color: event.accentColor }}>
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
