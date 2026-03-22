const badgeStyles = {
  open: {
    background: 'rgba(74,222,128,0.22)',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.35)',
    label: 'Open',
  },
  rated: {
    background: 'rgba(200,241,53,0.16)',
    color: '#C8F135',
    border: '1px solid rgba(200,241,53,0.30)',
    label: 'Rated',
  },
  comp: {
    background: 'rgba(248,113,113,0.18)',
    color: '#f87171',
    border: '1px solid rgba(248,113,113,0.32)',
    label: 'Comp',
  },
  casual: {
    background: 'rgba(136,180,255,0.16)',
    color: '#88b4ff',
    border: '1px solid rgba(136,180,255,0.30)',
    label: 'Casual',
  },
}

const BADGE_BASE_STYLE = {
  borderRadius: '20px',
  padding: '3px 8px',
  fontSize: '10px',
  fontWeight: 600,
}

function CommunityCard({ community }) {
  const actionText = community.joinType === 'request' ? 'Request' : community.joined ? 'Joined' : 'Join'
  const actionStyle =
    community.joinType === 'request'
      ? {
          border: '1px solid rgba(248,113,113,0.28)',
          background: 'rgba(248,113,113,0.10)',
          color: '#f87171',
        }
      : community.joined
        ? {
            border: '1px solid rgba(200,241,53,0.12)',
            background: 'rgba(200,241,53,0.08)',
            color: '#7a9a7a',
          }
        : {
            border: '1px solid rgba(200,241,53,0.30)',
            background: 'rgba(200,241,53,0.12)',
            color: '#C8F135',
          }

  return (
    <article
      className="cursor-pointer overflow-hidden transition-colors"
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#142014',
        border: community.joined
          ? '1px solid rgba(200,241,53,0.25)'
          : '1px solid rgba(200,241,53,0.10)',
      }}
    >
      <div
        className="relative flex items-end"
        style={{ height: '120px', background: community.gradient, padding: '8px' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(12,20,12,0.90))' }}
        />
        <div className="relative z-[1] flex gap-[4px]">
          {community.badges.map((badge) => {
            const style = badgeStyles[badge]
            return (
              <span
                key={badge}
                style={{
                  ...BADGE_BASE_STYLE,
                  background: style.background,
                  color: style.color,
                  border: style.border,
                }}
              >
                {style.label}
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col" style={{ padding: '12px 14px 14px' }}>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '16px',
            color: '#e8f0e8',
            letterSpacing: '0.03em',
          }}
        >
          {community.name}
        </div>
        <div className="mt-[3px] text-[11px] leading-[1.4] text-[var(--muted)]">{community.desc}</div>
        {community.requirementLabel ? (
          <div className="mt-[4px] text-[9px] uppercase tracking-[0.06em] text-[#f87171]">
            {community.requirementLabel}
          </div>
        ) : null}

        <div className="mt-[10px] flex items-center justify-between gap-[8px]">
          <div className="flex items-center">
            {community.memberStack.map((member, index) => (
              <div
                key={`${community.id}-${member.initials}`}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-[2px] border-[var(--card)] text-[7px] font-bold"
                style={{
                  background: member.bg,
                  color: member.color,
                  marginLeft: index === 0 ? 0 : -5,
                }}
              >
                {member.initials}
              </div>
            ))}
            <span className="ml-[6px] text-[10px] text-[var(--muted)]">{community.members}</span>
          </div>

          <button
            type="button"
            style={{
              ...actionStyle,
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '10px',
              fontWeight: 600,
            }}
          >
            {actionText}
          </button>
        </div>
      </div>
    </article>
  )
}

export default CommunityCard
