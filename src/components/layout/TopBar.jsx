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

function TopBar({ currentUser, pageTitle, theme, setTheme }) {
  const isDark = theme === 'dark'
  const title = pageTitle === 'Dashboard' ? `WELCOME BACK, ${currentUser.username.toUpperCase()}` : pageTitle

  const searchPlaceholder = pageTitle === 'Community' ? 'Search communities…' : 'Search...'

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-[28px] py-[16px]"
      style={{ background: '#0c140c', borderBottom: '1px solid rgba(200,241,53,0.08)' }}
    >
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          fontWeight: 400,
          color: '#e8f0e8',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-[10px]">
        <label className="flex h-[36px] w-[200px] items-center gap-[8px] rounded-[8px] border border-[rgba(200,241,53,0.18)] bg-[var(--card)] px-[12px]">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7a9a7a"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-[12px] text-[var(--text)] outline-none placeholder:text-[var(--dim)]"
          />
        </label>

        {pageTitle === 'Community' ? (
          <button
            type="button"
            style={{
              background: '#C8F135',
              color: '#0c140c',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '8px',
              padding: '7px 14px',
              border: 'none',
              boxShadow: 'none',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Create Community</span>
          </button>
        ) : null}

        <ThemeToggle isDark={isDark} onToggle={setTheme} />
      </div>
    </header>
  )
}

export default TopBar
