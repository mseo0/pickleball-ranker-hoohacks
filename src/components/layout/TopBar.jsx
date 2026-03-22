function TopBar({ currentUser, pageTitle }) {
  const title = pageTitle === 'Dashboard' ? `WELCOME BACK, ${currentUser.username.toUpperCase()}` : pageTitle

  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-[28px] py-[16px]"
      style={{ background: 'var(--topbar-bg)', borderBottom: '1px solid var(--border-sub)' }}
    >
      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          fontWeight: 400,
          color: 'var(--text)',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-[10px]">
        {pageTitle === 'Community' ? (
          <button
            type="button"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-dark)',
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
      </div>
    </header>
  )
}

export default TopBar
