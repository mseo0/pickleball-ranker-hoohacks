import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { fetchUsers, saveUsers } from '../../auth/authUtils'

export default function AccountSwitcher() {
  const { currentUser, logout, switchAccount } = useAuth()
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(setUsers)
  }, [currentUser])

  const deleteAccount = async (id, event) => {
    event.stopPropagation()
    const updated = users.filter((user) => user.id !== id)
    await saveUsers(updated)
    setUsers(updated)

    if (id === currentUser?.id) {
      logout()
    }
  }

  if (users.length === 0) return null

  return (
    <div className="w-full max-w-[360px]">
      <div className="mb-[8px] text-[11px] uppercase tracking-[0.06em] text-[var(--muted)]">
        Saved Accounts
      </div>
      <div className="flex flex-col gap-[8px]">
        {users.map((user) => {
          const isCurrent = user.id === currentUser?.id
          return (
            <div
              key={user.id}
              onClick={() => switchAccount(user.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  switchAccount(user.id)
                }
              }}
              className="flex cursor-pointer items-center gap-[10px] rounded-[12px] bg-[var(--card)] px-[12px] py-[11px] text-left"
              style={{
                border: isCurrent
                  ? '1px solid rgba(200,241,53,0.4)'
                  : '1px solid rgba(200,241,53,0.12)',
              }}
            >
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[rgba(200,241,53,0.14)] text-[12px] font-semibold text-[var(--accent)]">
                {user.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-[var(--text)]">{user.username}</div>
                <div className="truncate text-[11px] text-[var(--muted)]">{user.profile?.city || 'Unknown'}</div>
              </div>
              <button
                type="button"
                onClick={(event) => deleteAccount(user.id, event)}
                className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[rgba(200,241,53,0.12)] text-[12px] text-[var(--muted)] transition-colors hover:border-[rgba(248,113,113,0.3)] hover:text-[#f87171]"
                aria-label={`Delete ${user.username}`}
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
