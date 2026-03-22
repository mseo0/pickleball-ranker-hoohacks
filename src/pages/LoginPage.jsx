import { useState } from 'react'
import AccountSwitcher from '../components/auth/AccountSwitcher'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

function PickleballMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3 Q13 10 10 17" />
      <path d="M3 10 Q10 13 17 10" />
    </svg>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState('signin')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 py-10">
      <div className="mb-[20px] flex items-center gap-[10px] text-[var(--accent)]">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[var(--accent)] text-[#0f1a0f]">
          <PickleballMark />
        </div>
        <div className="font-display text-[34px] tracking-[0.08em]">PICKLERANK</div>
      </div>

      <div className="mb-[16px] flex w-full max-w-[360px] gap-[24px] border-b border-[rgba(200,241,53,0.12)]">
        {[
          ['signin', 'Sign In'],
          ['register', 'Create Account'],
        ].map(([id, label]) => {
          const active = mode === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={[
                'pb-[10px] text-[14px] transition-colors',
                active
                  ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
                  : 'text-[var(--muted)]',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="w-full max-w-[360px] rounded-[14px] border border-[rgba(200,241,53,0.15)] bg-[var(--card)] p-[20px]">
        {mode === 'signin' ? (
          <LoginForm onSwitchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode('signin')} />
        )}
      </div>

      <div className="mt-[16px] flex w-full justify-center">
        <AccountSwitcher />
      </div>
    </div>
  )
}
