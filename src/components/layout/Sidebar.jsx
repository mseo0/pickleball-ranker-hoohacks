import { Grid2x2, Heart, Newspaper, ShoppingBag, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/', label: 'Home', icon: Grid2x2, end: true },
      { to: '/health', label: 'Health', icon: Heart },
      { to: '/community', label: 'Community', icon: Users },
    ],
  },
  {
    label: 'Store',
    items: [
      { to: '/gear', label: 'My Gear', icon: ShoppingBag },
      { to: '/news', label: 'News & Market', icon: Newspaper },
    ],
  },
]

function PickleballMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3 Q13 10 10 17" />
      <path d="M3 10 Q10 13 17 10" />
    </svg>
  )
}

function Sidebar() {
  return (
    <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] lg:flex">
      <div className="border-b border-[var(--border)] px-5 pb-6 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--accent)] text-[var(--logo-icon-ink)]">
            <PickleballMark />
          </div>
          <span className="font-display text-[20px] tracking-[0.08em] text-[var(--accent)]">
            Pickelo
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 pb-1 pt-3 text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]/80">
              {group.label}
            </div>
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                end={end}
                to={to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 rounded-[8px] px-3 py-[9px] text-[13px] transition-colors',
                    isActive
                      ? 'bg-[color:color-mix(in_srgb,var(--accent)_13%,transparent)] font-medium text-[var(--accent)]'
                      : 'text-[var(--muted)] hover:bg-[color:color-mix(in_srgb,var(--accent)_7%,transparent)]',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={isActive ? 'h-4 w-4 text-[var(--accent)]' : 'h-4 w-4 text-[var(--muted)]'}
                      strokeWidth={1.8}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-2.5 rounded-[8px] px-2 py-2">
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_16%,transparent)] text-[11px] font-semibold text-[var(--accent)]">
            AJ
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-[var(--text)]">Alex Johnson</div>
            <div className="truncate text-[11px] text-[var(--muted)]">Gold III · #84 Local</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
