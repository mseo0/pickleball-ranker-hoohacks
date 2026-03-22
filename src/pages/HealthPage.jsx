import { useEffect, useRef, useState } from 'react'
// Remove mockHealthData; rely only on backend
// import { mockHealthData } from '../data/mockHealth'

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const sec = String(seconds % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

function BoltIcon({ stroke = '#C8F135', className = 'h-[12px] w-[12px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m13 2-7 10h5l-1 10 8-12h-5l0-8Z" stroke={stroke} strokeWidth="1.8" />
    </svg>
  )
}

function HeartIcon({ stroke = '#f87171', className = 'h-[12px] w-[12px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 20s-6.5-3.9-8.6-8C1.7 8.7 3.1 5 7 5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.9 0 5.3 3.7 3.6 7-2.1 4.1-8.6 8-8.6 8Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
    </svg>
  )
}

function FireIcon({ stroke = '#facc15', className = 'h-[12px] w-[12px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3c1 3-1 4.2-1 6.2 0 1.3.8 2.2 2 2.2 2.2 0 3-2.1 2.6-4.4C18.8 9 21 11 21 14.5A9 9 0 1 1 6 7.8c.7 1.8 2.2 2.9 3.4 2.9C9.8 8.5 11.3 6.9 12 3Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
    </svg>
  )
}

function WaveIcon({ stroke = '#88b4ff', className = 'h-[12px] w-[12px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <polyline
        points="22 12 18 12 15 21 9 3 6 12 2 12"
        stroke={stroke}
        strokeWidth="1.8"
      />
    </svg>
  )
}

function SunIcon({ stroke = '#facc15', className = 'h-[14px] w-[14px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth="1.8" />
      <path
        d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
        stroke={stroke}
        strokeWidth="1.8"
      />
    </svg>
  )
}

function DropletIcon({ stroke = '#60a5fa', className = 'h-[14px] w-[14px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2s6 6.8 6 11a6 6 0 1 1-12 0c0-4.2 6-11 6-11Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
    </svg>
  )
}

function ClockIcon({ stroke = '#4ade80', className = 'h-[14px] w-[14px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke={stroke} strokeWidth="1.8" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[13px] w-[13px]">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="#a78bfa"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[13px] w-[13px]">
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        stroke="#4ade80"
        strokeWidth="1.8"
      />
      <path d="m9 12 2 2 4-4" stroke="#4ade80" strokeWidth="1.8" />
    </svg>
  )
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-[14px] tracking-[0.06em] text-[#e8f0e8]">{title}</h2>
      {action ? <span className="text-[11px] text-[#C8F135]">{action}</span> : null}
    </div>
  )
}

function StatCard({ accentColor, iconBg, icon, value, unit, label, fillPct }) {
  return (
    <article className="relative overflow-hidden rounded-[11px] border border-[rgba(200,241,53,0.12)] bg-[#162016] px-[13px] py-[12px]">
      <div className="absolute bottom-0 right-0 top-0 w-[3px]" style={{ background: accentColor }} />
      <div
        className="mb-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-[8px]"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex items-end">
        <span className="font-display text-[28px] leading-none text-[#e8f0e8]">{value}</span>
        {unit ? (
          <span className="ml-[3px] text-[11px]" style={{ color: accentColor }}>
            {unit}
          </span>
        ) : null}
      </div>
      <p className="mt-[3px] text-[10px] uppercase tracking-[0.05em] text-[#7a9a7a]">{label}</p>
      <div className="mt-[8px] h-[3px] overflow-hidden rounded-[2px] bg-[#1a2a1a]">
        <div className="h-full rounded-[2px]" style={{ width: `${fillPct}%`, background: accentColor }} />
      </div>
    </article>
  )
}

function SleepSummaryCard({ sleep }) {
  return (
    <article className="relative overflow-hidden rounded-[11px] border border-[rgba(200,241,53,0.12)] bg-[#162016] px-[13px] py-[12px]">
      <div className="absolute bottom-0 right-0 top-0 w-[3px] bg-[#a78bfa]" />
      <div className="mb-[8px] flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-[rgba(167,139,250,0.13)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-[14px] w-[14px]">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            stroke="#a78bfa"
            strokeWidth="1.8"
          />
        </svg>
      </div>

      <div className="flex items-end">
        <span className="font-display text-[28px] leading-none text-[#e8f0e8]">{sleep.hours}</span>
        <span className="ml-[3px] text-[11px] text-[#a78bfa]">h {sleep.minutes}m</span>
      </div>

      <p className="mt-[3px] text-[10px] uppercase tracking-[0.05em] text-[#7a9a7a]">SLEEP</p>

      <div className="mt-[5px] inline-flex rounded-[20px] border border-[rgba(167,139,250,0.22)] bg-[rgba(167,139,250,0.13)] px-[7px] py-[2px] text-[9px] font-semibold text-[#a78bfa]">
        {sleep.quality} · {sleep.score}%
      </div>

      <div className="mt-[6px] flex h-[3px] gap-[2px] overflow-hidden rounded-[2px]">
        <div className="flex-[0.5] rounded-[2px] bg-[#f87171]" />
        <div className="flex-[1.5] rounded-[2px] bg-[#a78bfa]" />
        <div className="flex-[3] rounded-[2px] bg-[#60a5fa]" />
        <div className="flex-[2] rounded-[2px] bg-[#1d4ed8]" />
        <div className="flex-[1] rounded-[2px] bg-[#a78bfa]" />
      </div>
    </article>
  )
}

function TodayStatsGrid({ health }) {
  const today = health.today

  const caloriesData = {
    accentColor: '#facc15',
    iconBg: 'rgba(250,204,21,0.14)',
    icon: <SunIcon stroke="#facc15" />,
    value: today.calories.value.toLocaleString(),
    unit: today.calories.unit,
    label: 'Calories Burned',
    fillPct: today.calories.pct,
  }

  const stepsData = {
    accentColor: '#C8F135',
    iconBg: 'rgba(200,241,53,0.12)',
    icon: <BoltIcon stroke="#C8F135" className="h-[14px] w-[14px]" />,
    value: today.steps.value.toLocaleString(),
    unit: today.steps.unit,
    label: 'Steps Today',
    fillPct: today.steps.pct,
  }

  const activeTimeData = {
    accentColor: '#4ade80',
    iconBg: 'rgba(74,222,128,0.13)',
    icon: <ClockIcon stroke="#4ade80" />,
    value: today.active.value,
    unit: today.active.unit,
    label: 'Active Time',
    fillPct: today.active.pct,
  }

  return (
    <section className="flex flex-col gap-[8px]">
      <SectionHeader title="TODAY'S STATS" />
      <div className="grid grid-cols-2 gap-2">
        <StatCard {...caloriesData} />
        <StatCard {...stepsData} />
        <SleepSummaryCard sleep={health.sleep} />
        <StatCard {...activeTimeData} />
      </div>
    </section>
  )
}

function HeartRateCard({ health }) {
  const { heartRate } = health

  return (
    <section className="rounded-[11px] border border-[rgba(200,241,53,0.12)] bg-[#162016] px-[14px] py-[12px]">
      <div className="mb-[3px] flex items-center gap-[6px]">
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-[rgba(248,113,113,0.15)]">
          <HeartIcon stroke="#f87171" className="h-[13px] w-[13px]" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.06em] text-[#7a9a7a]">HEART RATE</span>
      </div>

      <div className="flex items-end">
        <span className="font-display text-[38px] leading-none text-[#e8f0e8]">{heartRate.avg}</span>
        <span className="ml-[2px] text-[12px] text-[#7a9a7a]">bpm avg</span>
      </div>

      <div className="mt-[4px] flex gap-[10px]">
        <div>
          <div className="text-[12px] font-semibold text-[#4ade80]">{heartRate.min}</div>
          <div className="text-[9px] text-[#7a9a7a]">Min</div>
        </div>
        <div>
          <div className="text-[12px] font-semibold text-[#f87171]">{heartRate.max}</div>
          <div className="text-[9px] text-[#7a9a7a]">Max</div>
        </div>
        <div>
          <div className="text-[12px] font-semibold text-[#facc15]">{heartRate.zone}</div>
          <div className="text-[9px] text-[#7a9a7a]">Zone</div>
        </div>
      </div>

      <div className="mb-[4px] mt-[8px] text-[9px] uppercase tracking-[0.06em] text-[#7a9a7a]">
        HEART RATE ZONES
      </div>

      <div className="flex h-[5px] gap-[3px]">
        <div className="flex-[2] rounded-[3px] bg-[#4ade80]" />
        <div className="flex-[1.5] rounded-[3px] bg-[#a3e635]" />
        <div className="flex-[3] rounded-[3px] bg-[#facc15]" />
        <div className="flex-[2] rounded-[3px] bg-[#f97316]" />
        <div className="flex-[0.5] rounded-[3px] bg-[#ef4444]" />
      </div>

      <div className="mt-[4px] flex justify-between text-[8px]">
        <span className="text-[#4ade80]">Rest</span>
        <span className="text-[#a3e635]">Fat Burn</span>
        <span className="text-[#facc15]">Cardio</span>
        <span className="text-[#f97316]">Peak</span>
        <span className="text-[#ef4444]">Max</span>
      </div>
    </section>
  )
}

function SleepCard({ health }) {
  const { sleep } = health

  return (
    <section className="rounded-[11px] border border-[rgba(200,241,53,0.12)] bg-[#162016] px-[14px] py-[12px]">
      <div className="mb-[8px] flex items-start justify-between">
        <div>
          <div className="mb-[4px] flex items-center gap-[6px]">
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-[rgba(138,100,255,0.15)]">
              <MoonIcon />
            </div>
            <span className="text-[10px] uppercase tracking-[0.06em] text-[#7a9a7a]">
              SLEEP QUALITY
            </span>
          </div>
          <div className="flex items-end">
            <span className="font-display text-[32px] leading-none text-[#e8f0e8]">{sleep.hours}</span>
            <span className="ml-[2px] text-[11px] text-[#7a9a7a]">h {sleep.minutes}m</span>
          </div>
        </div>

        <span className="rounded-[20px] border border-[rgba(167,139,250,0.25)] bg-[rgba(167,139,250,0.15)] px-[8px] py-[2px] text-[10px] font-semibold text-[#a78bfa]">
          {sleep.quality} · {sleep.score}%
        </span>
      </div>

      <div className="flex h-[6px] gap-[3px]">
        <div className="flex-[0.5] rounded-[3px] bg-[#f87171]" />
        <div className="flex-[1.5] rounded-[3px] bg-[#a78bfa]" />
        <div className="flex-[3] rounded-[3px] bg-[#60a5fa]" />
        <div className="flex-[2] rounded-[3px] bg-[#1d4ed8]" />
        <div className="flex-[1] rounded-[3px] bg-[#a78bfa]" />
        <div className="flex-[1.5] rounded-[3px] bg-[#60a5fa]" />
      </div>

      <div className="mt-[6px] flex flex-wrap gap-x-[10px] gap-y-[6px]">
        {[
          ['Deep', '#1d4ed8'],
          ['Light', '#60a5fa'],
          ['REM', '#a78bfa'],
          ['Awake', '#f87171'],
        ].map(([label, color]) => (
          <div key={label} className="flex items-center gap-[5px]">
            <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] text-[#7a9a7a]">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function RecoveryMetricCard({ iconBg, icon, value, unit, label, status }) {
  return (
    <article className="rounded-[11px] border border-[rgba(200,241,53,0.12)] bg-[#162016] px-[13px] py-[12px]">
      <div
        className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px]"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="mt-[8px] flex items-end">
        <span className="font-display text-[26px] leading-none text-[#e8f0e8]">{value}</span>
        <span className="ml-[2px] text-[12px] text-[#7a9a7a]">{unit}</span>
      </div>
      <p className="mt-[3px] text-[9px] uppercase tracking-[0.06em] text-[#7a9a7a]">{label}</p>
      <p className="mt-[4px] text-[10px] font-semibold text-[#4ade80]">{status}</p>
    </article>
  )
}

function RecoveryRow({ health }) {
  const { hrv, recovery } = health

  return (
    <div className="grid grid-cols-2 gap-[8px]">
      <RecoveryMetricCard
        iconBg="rgba(200,241,53,0.12)"
        icon={<WaveIcon stroke="#C8F135" className="h-[13px] w-[13px]" />}
        value={hrv.value}
        unit={hrv.unit}
        label="HRV"
        status={hrv.status}
      />
      <RecoveryMetricCard
        iconBg="rgba(74,222,128,0.12)"
        icon={<CheckCircleIcon />}
        value={recovery.value}
        unit={recovery.unit}
        label="RECOVERY"
        status={recovery.status}
      />
    </div>
  )
}

export default function HealthPage() {
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  async function refreshHealthFromBackend() {
    try {
      const res = await fetch('/api/healthkit/latest')
      if (!res.ok) {
        if (res.status === 404) {
          setHealthData(null)
          setError(null)
          return
        }
        throw new Error('Failed to fetch health data')
      }

      const json = await res.json()
      const metrics = json.metrics || {}
      const today = metrics.today || {}
      const hasTodayMetrics = Boolean(today.steps || today.active_energy_burned)
      const hasSleepMetric = typeof metrics.sleep?.value === 'number'
      const hasHeartRateMetric = typeof metrics.heart_rate?.value === 'number'
      const hasHrvMetric = typeof metrics.hrv?.value === 'number'

      // Simple recovery score algorithm based on HRV and today's steps
      function computeRecovery(metricsObj, todayObj) {
        const hrvMetric = metricsObj.hrv
        const stepsToday = todayObj.steps?.value ?? 0

        // baseline
        let score = 50

        // HRV contribution (assuming 20–120 ms typical range)
        if (hrvMetric && typeof hrvMetric.value === 'number') {
          const hrv = hrvMetric.value
          if (hrv >= 90) score += 25
          else if (hrv >= 70) score += 15
          else if (hrv >= 50) score += 5
          else if (hrv < 30) score -= 10
        }

        // Activity contribution based on today's steps
        if (stepsToday > 0) {
          if (stepsToday >= 10000) score += 15
          else if (stepsToday >= 7000) score += 8
          else if (stepsToday >= 4000) score += 4
          else if (stepsToday < 1500) score -= 5
        }

        // clamp 0–100
        score = Math.max(0, Math.min(100, Math.round(score)))

        let status
        if (score >= 80) status = 'Ready to play'
        else if (score >= 60) status = 'Moderate'
        else if (score >= 40) status = 'Take it easy'
        else status = 'Rest day'

        return { value: score, unit: '%', status }
      }

      const mapped = {
        // --- TODAY (only use metrics.today from backend) ---
        today:
          hasTodayMetrics
            ? {
                calories: today.active_energy_burned
                  ? {
                      value: Math.round(today.active_energy_burned.value ?? 0),
                      unit: today.active_energy_burned.unit || 'kcal',
                      pct: 75,
                    }
                  : {
                      value: 0,
                      unit: 'cal',
                      pct: 0,
                    },
                steps: today.steps
                  ? {
                      value: Math.round(today.steps.value ?? 0),
                      unit: today.steps.unit || 'steps',
                      pct: 80,
                    }
                  : {
                      value: 0,
                      unit: 'steps',
                      pct: 0,
                    },
                active: {
                  // rough estimate for active minutes from today steps
                  value: `${Math.max(1, Math.round((today.steps?.value ?? 0) / 100))}`,
                  unit: 'min',
                  pct: 60,
                },
              }
            : {
                calories: { value: 0, unit: 'kcal', pct: 0 },
                steps: { value: 0, unit: 'steps', pct: 0 },
                active: { value: '0', unit: 'min', pct: 0 },
              },

        // --- HEART RATE (all‑time avg from backend metric) ---
        heartRate: hasHeartRateMetric
          ? {
              avg: Math.round(metrics.heart_rate.value ?? 0),
              min: Math.round((metrics.heart_rate.value ?? 0) * 0.7),
              max: Math.round((metrics.heart_rate.value ?? 0) * 1.3),
              zone: 'Cardio',
            }
          : {
              avg: 0,
              min: 0,
              max: 0,
              zone: 'Unknown',
            },

        // --- SLEEP (use backend sleep metric hours, but still treat as one summary) ---
        sleep: hasSleepMetric
          ? {
              // backend sleep.value is total hours; clamp to a reasonable display range
              hours: Math.min(12, Math.max(3, Math.round((metrics.sleep.value ?? 0) % 24))),
              minutes: 0,
              quality: 'Good',
              score: 82,
            }
          : {
              hours: 0,
              minutes: 0,
              quality: 'No data',
              score: 0,
            },

        // --- HRV ---
        hrv: hasHrvMetric
          ? {
              value: Math.round(metrics.hrv.value ?? 0),
              unit: metrics.hrv.unit || 'ms',
              status: 'Stable',
            }
          : { value: 0, unit: 'ms', status: 'No data' },

        // --- RECOVERY (computed from metrics + today) ---
        recovery: computeRecovery(metrics, today),
      }

      setHealthData(mapped)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load health data')
      setHealthData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshHealthFromBackend()
  }, [])

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/healthkit/upload-xml', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to upload Apple Health export')
      }

      // refresh metrics from backend
      await refreshHealthFromBackend()
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  function handleSelectFile() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-[12px] overflow-y-auto bg-[#0f1a0f] px-[14px] py-[8px]">
      {/* Apple Health upload / status section */}
      <section className="rounded-[11px] border border-[rgba(200,241,53,0.25)] bg-[#162016] px-[14px] py-[10px]">
        <div className="flex items-center justify-between gap-[8px]">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#7a9a7a]">Apple Health</p>
            <p className="text-[12px] text-[#e8f0e8]">
              {loading
                ? 'Loading your latest Health data...'
                : !healthData
                  ? 'No Apple Health data yet. Import an export.xml file to see your real stats.'
                  : 'Using your latest Apple Health snapshot.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSelectFile}
            className="shrink-0 rounded-[999px] border border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.12)] px-[10px] py-[6px] text-[11px] font-semibold text-[#C8F135]"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Import XML'}
          </button>
        </div>
        {uploadError ? (
          <p className="mt-[4px] text-[10px] text-[#f87171]">{uploadError}</p>
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml,text/xml,application/xml"
          className="hidden"
          onChange={handleFileChange}
        />
      </section>

      {error ? (
        <section className="rounded-[11px] border border-[rgba(248,113,113,0.22)] bg-[rgba(90,22,22,0.55)] px-[14px] py-[10px]">
          <p className="text-[11px] font-semibold text-[#fca5a5]">Unable to load health metrics</p>
          <p className="mt-[3px] text-[11px] text-[#fecaca]">{error}</p>
        </section>
      ) : null}

      {/* Only show aggregated health stats when real data is available */}
      {healthData ? (
        <>
          <TodayStatsGrid health={healthData} />
          <HeartRateCard health={healthData} />
          <SleepCard health={healthData} />
          <RecoveryRow health={healthData} />
        </>
      ) : null}

      <div className="h-2" />
    </main>
  )
}
