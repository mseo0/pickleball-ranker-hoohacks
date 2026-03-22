function ThemeToggle({ isDark, onToggle }) {
  return (
    <div
      style={{
        display: 'flex',
        background: isDark ? '#162016' : '#e4edd8',
        border: isDark
          ? '1px solid rgba(200,241,53,0.20)'
          : '1px solid rgba(80,120,40,0.20)',
        borderRadius: '30px',
        padding: '3px',
        gap: '2px',
      }}
    >
      <button
        type="button"
        onClick={() => onToggle('dark')}
        aria-label="Switch to dark mode"
        aria-pressed={isDark}
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? '#C8F135' : 'transparent',
          transition: 'background 0.2s',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDark ? '#0f1a0f' : '#7a9a6a'}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => onToggle('light')}
        aria-label="Switch to light mode"
        aria-pressed={!isDark}
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: !isDark ? '#3d7a00' : 'transparent',
          transition: 'background 0.2s',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={!isDark ? '#ffffff' : '#7a9a7a'}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>
    </div>
  )
}

function TopBar({ pageTitle, theme, setTheme }) {
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-sub)] bg-[var(--bg)] px-5 pb-[14px] pt-[18px] sm:px-7">
      <h1 className="font-display text-[22px] tracking-[0.06em] text-[var(--text)]">
        {pageTitle}
      </h1>

      <ThemeToggle isDark={isDark} onToggle={setTheme} />
    </header>
  )
}

export default TopBar
