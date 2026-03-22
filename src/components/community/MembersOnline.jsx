import SectionHeader from '../layout/SectionHeader'

function MembersOnline({ members }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <SectionHeader title="MEMBERS ONLINE" link={`${members.length} active`} />
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-[12px] py-[8px]">
        {members.map((member, index) => (
          <div
            key={`${member.name}-${member.elo}`}
            className={[
              'flex items-center gap-[10px] py-[8px]',
              index !== members.length - 1 ? 'border-b border-[rgba(200,241,53,0.06)]' : '',
            ].join(' ')}
          >
            <div
              className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-[10px] font-bold"
              style={{ background: member.bg, color: member.color }}
            >
              {member.initials}
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-medium text-[var(--text)]">{member.name}</div>
              <div className="mt-[1px] text-[10px]" style={{ color: member.statusColor }}>
                {member.status}
              </div>
            </div>
            <div className="font-display text-[15px] text-[var(--accent)]">{member.elo}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MembersOnline
