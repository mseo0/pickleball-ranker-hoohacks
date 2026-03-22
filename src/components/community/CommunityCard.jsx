const badgeStyles = {
  open: {
    background: 'rgba(74,222,128,0.20)',
    color: '#4ade80',
    border: 'rgba(74,222,128,0.30)',
    label: 'Open',
  },
  rated: {
    background: 'rgba(200,241,53,0.15)',
    color: '#C8F135',
    border: 'rgba(200,241,53,0.30)',
    label: 'Rated',
  },
  comp: {
    background: 'rgba(248,113,113,0.15)',
    color: '#f87171',
    border: 'rgba(248,113,113,0.30)',
    label: 'Comp',
  },
  casual: {
    background: 'rgba(100,160,255,0.15)',
    color: '#88b4ff',
    border: 'rgba(100,160,255,0.30)',
    label: 'Casual',
  },
}

function CommunityCard({ community }) {
  const actionText = community.joinType === 'request' ? 'Request' : community.joined ? 'Joined' : 'Join'
  const actionClasses =
    community.joinType === 'request'
      ? 'border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.10)] text-[#f87171]'
      : community.joined
        ? 'border-[rgba(200,241,53,0.10)] bg-[rgba(200,241,53,0.06)] text-[var(--muted)]'
        : 'border-[rgba(200,241,53,0.28)] bg-[rgba(200,241,53,0.12)] text-[var(--accent)]'

  return (
    <article
      className={[
        'cursor-pointer overflow-hidden rounded-[12px] bg-[var(--card)] transition-colors',
        community.joined
          ? 'border border-[rgba(200,241,53,0.28)]'
          : 'border border-[rgba(200,241,53,0.12)] hover:border-[rgba(200,241,53,0.30)]',
      ].join(' ')}
    >
      <div className="relative flex h-[64px] items-end px-[10px] py-[7px]" style={{ background: community.gradient }}>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 20%, rgba(15,26,15,0.85))' }}
        />
        <div className="relative z-[1] flex gap-[4px]">
          {community.badges.map((badge) => {
            const style = badgeStyles[badge]
            return (
              <span
                key={badge}
                className="rounded-[20px] border px-[7px] py-[2px] text-[9px] font-semibold"
                style={{
                  background: style.background,
                  color: style.color,
                  borderColor: style.border,
                }}
              >
                {style.label}
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col px-[12px] pb-[12px] pt-[10px]">
        <div className="font-display text-[14px] tracking-[0.04em] text-[var(--text)]">{community.name}</div>
        <div className="mt-[2px] text-[10px] leading-[1.4] text-[var(--muted)]">{community.desc}</div>
        {community.requirementLabel ? (
          <div className="mt-[4px] text-[9px] uppercase tracking-[0.06em] text-[#f87171]">
            {community.requirementLabel}
          </div>
        ) : null}

        <div className="mt-[8px] flex items-center justify-between gap-[8px]">
          <div className="flex items-center">
            {community.memberStack.map((member, index) => (
              <div
                key={`${community.id}-${member.initials}`}
                className="flex h-[15px] w-[15px] items-center justify-center rounded-full border-[1.5px] border-[var(--card)] text-[6px] font-bold"
                style={{
                  background: member.bg,
                  color: member.color,
                  marginLeft: index === 0 ? 0 : -3,
                }}
              >
                {member.initials}
              </div>
            ))}
            <span className="ml-[5px] text-[10px] text-[var(--muted)]">{community.members} members</span>
          </div>

          <button type="button" className={`rounded-[20px] border px-[10px] py-[3px] text-[10px] font-semibold ${actionClasses}`}>
            {actionText}
          </button>
        </div>
      </div>
    </article>
  )
}

export default CommunityCard
