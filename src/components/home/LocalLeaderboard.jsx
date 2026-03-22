import SectionHeader from '../layout/SectionHeader'
import FindMatchButton from './FindMatchButton'

function LocalLeaderboard({ entries }) {
  return (
    <section className="rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-[14px] py-[11px]">
      <SectionHeader title="LOCAL LEADERBOARD" />

      <div className="flex flex-col">
        {entries.map((entry, index) => (
          <div
            key={`${entry.rank}-${entry.name}`}
            className={[
              'flex items-center gap-2 py-[7px]',
              index !== entries.length - 1 ? 'border-b border-[var(--border-sub)]' : '',
            ].join(' ')}
          >
            <div
              className="w-[18px] text-center text-[11px]"
              style={{ color: entry.isMe ? 'var(--accent)' : 'var(--muted)' }}
            >
              {entry.rank}
            </div>
            <div
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
              style={{ background: entry.avatarBg, color: entry.avatarColor }}
            >
              {entry.initials}
            </div>
            <div
              className="flex-1 text-[13px]"
              style={{ color: entry.isMe ? 'var(--accent)' : 'var(--text)' }}
            >
              {entry.name}
            </div>
            <div className="font-display text-[16px] text-[var(--accent)]">{entry.score}</div>
          </div>
        ))}
      </div>

      <FindMatchButton />
    </section>
  )
}

export default LocalLeaderboard
