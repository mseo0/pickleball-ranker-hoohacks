import { useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { getActiveLocation, isValidEmail, isValidPassword } from '../../auth/authUtils'

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

export default function RegisterForm({ onSwitchToLogin }) {
  const { error, register, setError } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [locating, setLocating] = useState(false)

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.username.trim()) nextErrors.username = 'Username is required.'
    else if (form.username.trim().length < 2) nextErrors.username = 'Username must be at least 2 characters.'

    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!isValidEmail(form.email.trim())) nextErrors.email = 'Please enter a valid email address.'

    if (!form.password) nextErrors.password = 'Password is required.'
    else if (!isValidPassword(form.password)) nextErrors.password = 'Password must be at least 6 characters.'

    if (!form.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.'
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'

    if (!form.city.trim()) nextErrors.city = 'City is required.'

    setFieldErrors(nextErrors)
    setError(null)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      city: form.city.trim(),
    })
    setSubmitting(false)
  }

  const handleUseLocation = async () => {
    setLocating(true)
    setError(null)
    setFieldErrors((prev) => ({ ...prev, city: undefined }))

    try {
      const location = await getActiveLocation()
      setField('city', location.label)
    } catch (error) {
      setFieldErrors((prev) => ({
        ...prev,
        city: error instanceof Error ? error.message : 'Unable to fetch your current location.',
      }))
    } finally {
      setLocating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
      <Field label="Username" error={fieldErrors.username}>
        <input
          type="text"
          value={form.username}
          onChange={(event) => setField('username', event.target.value)}
          className="w-full rounded-[9px] border border-[rgba(200,241,53,0.15)] bg-[var(--card2)] px-[14px] py-[11px] text-[14px] text-[var(--text)] outline-none focus:border-[rgba(200,241,53,0.5)]"
        />
      </Field>

      <Field label="Email" error={fieldErrors.email}>
        <input
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setField('email', event.target.value)}
          className="w-full rounded-[9px] border border-[rgba(200,241,53,0.15)] bg-[var(--card2)] px-[14px] py-[11px] text-[14px] text-[var(--text)] outline-none focus:border-[rgba(200,241,53,0.5)]"
        />
      </Field>

      <Field label="Password" error={fieldErrors.password}>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(event) => setField('password', event.target.value)}
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

      <Field label="Confirm Password" error={fieldErrors.confirmPassword}>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(event) => setField('confirmPassword', event.target.value)}
            className="w-full rounded-[9px] border border-[rgba(200,241,53,0.15)] bg-[var(--card2)] px-[14px] py-[11px] pr-[42px] text-[14px] text-[var(--text)] outline-none focus:border-[rgba(200,241,53,0.5)]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[var(--muted)]"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <EyeToggle open={showConfirmPassword} />
          </button>
        </div>
      </Field>

      <Field label="City" error={fieldErrors.city}>
        <div className="flex gap-[8px]">
          <input
            type="text"
            placeholder="Charlottesville"
            value={form.city}
            onChange={(event) => setField('city', event.target.value)}
            className="w-full rounded-[9px] border border-[rgba(200,241,53,0.15)] bg-[var(--card2)] px-[14px] py-[11px] text-[14px] text-[var(--text)] outline-none focus:border-[rgba(200,241,53,0.5)]"
          />
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={locating}
            className="shrink-0 rounded-[9px] border border-[rgba(200,241,53,0.18)] bg-[rgba(200,241,53,0.08)] px-[12px] py-[11px] text-[11px] font-medium text-[var(--accent)] disabled:opacity-70"
          >
            {locating ? 'Locating...' : 'Use location'}
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
          'CREATE ACCOUNT'
        )}
      </button>

      <div className="text-center text-[12px] text-[var(--muted)]">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-[var(--accent)]">
          Sign in
        </button>
      </div>
    </form>
  )
}
