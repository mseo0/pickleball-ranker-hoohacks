function MembersOnline({ members }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between">
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 500, color: '#e8f0e8' }}>
          Members Online
        </div>
        <div style={{ fontSize: '11px', color: '#C8F135', cursor: 'pointer' }}>{members.length} active</div>
      </div>
      <div
        className="px-[14px] py-[10px]"
        style={{ background: '#142014', border: '1px solid rgba(200,241,53,0.12)', borderRadius: '12px' }}
      >
        {members.map((member, index) => (
          <div
            key={`${member.name}-${member.elo}`}
            className={[
              'flex items-center gap-[10px] py-[9px]',
              index !== members.length - 1 ? 'border-b border-[rgba(200,241,53,0.06)]' : '',
            ].join(' ')}
          >
            <div
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[10px] font-bold"
              style={{ background: member.bg, color: member.color }}
            >
              {member.initials}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-[var(--text)]">{member.name}</div>
              <div className="mt-[1px] text-[10px]" style={{ color: member.statusColor }}>
                {member.status}
              </div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: '#C8F135' }}>
              {member.elo}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MembersOnline
