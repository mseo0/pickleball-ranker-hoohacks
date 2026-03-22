import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'

function EyeToggle({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[16px] w-[16px]" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open ? <path d="M4 4l16 16" /> : null}
    </svg>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-[5px] text-[11px] uppercase tracking-[0.06em] text-[var(--muted)]">{label}</div>
      {children}
      {error ? <div className="mt-[6px] text-[12px] text-[#f87171]">{error}</div> : null}
    </label>
  )
}

export default function LoginForm({ onSwitchToRegister }) {
  const { error, login, setError } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!identifier.trim()) nextErrors.identifier = 'Email or username is required.'
    if (!password) nextErrors.password = 'Password is required.'
    setFieldErrors(nextErrors)
    setError(null)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    await login(identifier.trim(), password)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
      <Field label="Email or Username" error={fieldErrors.identifier}>
        <input
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          className="w-full rounded-[9px] border border-[rgba(200,241,53,0.15)] bg-[var(--card2)] px-[14px] py-[11px] text-[14px] text-[var(--text)] outline-none focus:border-[rgba(200,241,53,0.5)]"
        />
      </Field>

      <Field label="Password" error={fieldErrors.password}>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-[9px] border border-[rgba(200,241,53,0.15)] bg-[var(--card2)] px-[14px] py-[11px] pr-[42px] text-[14px] text-[var(--text)] outline-none focus:border-[rgba(200,241,53,0.5)]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[var(--muted)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeToggle open={showPassword} />
          </button>
        </div>
      </Field>

      {error ? <div className="text-[12px] text-[#f87171]">{error}</div> : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center rounded-[10px] bg-[var(--accent)] px-[13px] py-[13px] font-display text-[15px] tracking-[0.06em] text-[#0f1a0f] disabled:opacity-70"
      >
        {submitting ? (
          <span className="h-[18px] w-[18px] animate-spin rounded-full border-[2px] border-[rgba(15,26,15,0.2)] border-t-[#0f1a0f]" />
        ) : (
          'SIGN IN'
        )}
      </button>

      <div className="text-center text-[12px] text-[var(--muted)]">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-[var(--accent)]">
          Create one
        </button>
      </div>
    </form>
  )
}
