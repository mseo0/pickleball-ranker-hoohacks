function ActivityIcon({ icon, stroke }) {
  if (icon === 'heart') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-[12px] w-[12px]" stroke={stroke} strokeWidth="1.8">
        <path d="M12 20s-6.5-3.9-8.6-8C1.7 8.7 3.1 5 7 5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.9 0 5.3 3.7 3.6 7-2.1 4.1-8.6 8-8.6 8Z" />
      </svg>
    )
  }

  if (icon === 'user-plus') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-[12px] w-[12px]" stroke={stroke} strokeWidth="1.8">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M16 11h6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[12px] w-[12px]" stroke={stroke} strokeWidth="1.8">
      <path d="m12 3 2.8 5.7L21 9.6l-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  )
}

function RecentActivity({ activity }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500, color: '#e8f0e8' }}>
        Recent Activity
      </div>
      <div
        className="px-[14px] py-[10px]"
        style={{ background: '#142014', border: '1px solid rgba(200,241,53,0.12)', borderRadius: '12px' }}
      >
        {activity.map((item, index) => (
          <div
            key={`${item.time}-${index}`}
            className={[
              'flex gap-[10px] py-[8px]',
              index !== activity.length - 1 ? 'border-b border-[rgba(200,241,53,0.06)]' : '',
            ].join(' ')}
          >
            <div
              className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px]"
              style={{ background: item.iconBg }}
            >
              <ActivityIcon icon={item.icon} stroke={item.iconStroke} />
            </div>
            <div>
              <div className="text-[11px] leading-[1.4] text-[var(--text)]">
                {item.text.map((part, idx) => {
                  const isHighlight =
                    ['Asia', 'Naython', 'Timothy', 'Leo', 'Zane'].includes(part)
                  return (
                    <span
                      key={`${part}-${idx}`}
                      className={isHighlight ? 'font-medium text-[var(--accent)]' : ''}
                    >
                      {part}
                    </span>
                  )
                })}
              </div>
              <div className="mt-[2px] text-[9px] text-[var(--muted)]">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecentActivity
