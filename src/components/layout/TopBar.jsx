function TopBar({ pageTitle, theme, setTheme }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-sub)] bg-[var(--bg)] px-5 pb-[14px] pt-[18px] sm:px-7">
      <h1 className="font-display text-[22px] tracking-[0.06em] text-[var(--text)]">
        {pageTitle}
      </h1>

      <div className="flex rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-[3px]">
        {['dark', 'light'].map((option) => {
          const isActive = theme === option
          const activeText = option === 'dark' ? 'text-[#0f1a0f]' : 'text-white'

          return (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              className={[
                'rounded-[14px] px-[10px] py-[3px] text-[11px] transition-colors',
                isActive
                  ? `bg-[var(--accent)] font-semibold ${activeText}`
                  : 'text-[var(--muted)]',
              ].join(' ')}
            >
              {option === 'dark' ? 'Dark' : 'Light'}
            </button>
          )
        })}
      </div>
    </header>
  )
}

export default TopBar
