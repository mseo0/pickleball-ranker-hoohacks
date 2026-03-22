import { useEffect, useState } from 'react'
import { mockHealthData } from '../data/mockHealth'

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const sec = String(seconds % 60).padStart(2, '0')
  return `${h}:${m}:${sec}`
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-[#0f1a0f] stroke-[#0f1a0f]">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
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

function StartWorkoutButton({ onStart }) {
  return (
    <div
      onClick={onStart}
      className="relative flex cursor-pointer items-center justify-between overflow-hidden rounded-[14px] bg-[#C8F135] px-[20px] py-[16px]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15), transparent 60%)',
        }}
      />

      <div className="relative flex flex-col gap-[2px]">
        <p className="font-display text-[22px] tracking-[0.04em] text-[#0f1a0f]">
          Start Pickleball Workout
        </p>
        <p className="text-[11px] font-medium text-[rgba(15,26,15,0.65)]">
          Track steps · heart rate · calories · time
        </p>
      </div>

      <div className="relative flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[rgba(15,26,15,0.18)]">
        <PlayIcon />
      </div>
    </div>
  )
}

function ActiveWorkoutCard({ elapsed, stats, paused, onPause, onStop }) {
  const cells = [
    {
      icon: <BoltIcon stroke="#C8F135" />,
      value: Math.round(stats.steps).toLocaleString(),
      label: 'STEPS',
      valueClass: 'text-[#e8f0e8]',
    },
    {
      icon: <HeartIcon stroke="#f87171" />,
      value: stats.bpm,
      label: 'BPM',
      valueClass: 'text-[#f87171]',
    },
    {
      icon: <FireIcon stroke="#facc15" />,
      value: Math.round(stats.calories),
      label: 'CAL',
      valueClass: 'text-[#facc15]',
    },
    {
      icon: <WaveIcon stroke="#88b4ff" />,
      value: stats.miles.toFixed(1),
      label: 'MILES',
      valueClass: 'text-[#88b4ff]',
    },
  ]

  return (
    <section className="rounded-[14px] border border-[rgba(200,241,53,0.25)] bg-[#162016] p-[14px]">
      <div className="mb-[12px] flex items-center justify-between">
        <p className="font-display text-[15px] tracking-[0.06em] text-[#C8F135]">
          Pickleball Session
        </p>
        <div className="flex items-center gap-[6px]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#ef4444]" />
          <span className="text-[10px] font-semibold text-[#ef4444]">LIVE</span>
        </div>
      </div>

      <div className="mb-[12px] text-center font-display text-[44px] tracking-[0.06em] text-[#e8f0e8]">
        {formatTime(elapsed)}
      </div>

      <div className="mb-[12px] grid grid-cols-4 gap-[6px]">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="flex flex-col items-center rounded-[8px] bg-[#1a2a1a] px-[6px] py-[8px] text-center"
          >
            {cell.icon}
            <div className={`mt-[4px] font-display text-[18px] ${cell.valueClass}`}>{cell.value}</div>
            <div className="mt-[1px] text-[8px] uppercase tracking-[0.06em] text-[#7a9a7a]">
              {cell.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-[8px]">
        <button
          type="button"
          onClick={onStop}
          className="flex-1 rounded-[9px] border border-[rgba(248,113,113,0.30)] bg-[rgba(248,113,113,0.12)] px-[9px] py-[9px] text-[12px] font-semibold text-[#f87171]"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={onPause}
          className="flex-1 rounded-[9px] border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.10)] px-[9px] py-[9px] text-[12px] font-semibold text-[#C8F135]"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </section>
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

function SleepSummaryCard() {
  const { sleep } = mockHealthData

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

function TodayStatsGrid() {
  const today = mockHealthData.today

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
      <SectionHeader title="TODAY'S STATS" action="History →" />
      <div className="grid grid-cols-2 gap-2">
        <StatCard {...caloriesData} />
        <StatCard {...stepsData} />
        <SleepSummaryCard />
        <StatCard {...activeTimeData} />
      </div>
    </section>
  )
}

function HeartRateCard() {
  const { heartRate } = mockHealthData

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

      <svg viewBox="0 0 340 36" width="100%" height="36" className="mt-[6px]">
        <polyline
          points="0,28 20,24 40,20 60,22 80,16 100,10 120,14 140,8 160,12 180,18 200,14 220,20 240,16 260,22 280,18 300,24 320,20 340,16"
          fill="none"
          stroke="#f87171"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    </section>
  )
}

function SleepCard() {
  const { sleep } = mockHealthData

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

function RecoveryRow() {
  const { hrv, recovery } = mockHealthData

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
  const [workoutActive, setWorkoutActive] = useState(false)
  const [workoutPaused, setWorkoutPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [liveStats, setLiveStats] = useState({
    steps: 0,
    bpm: 0,
    calories: 0,
    miles: 0,
  })

  useEffect(() => {
    if (!workoutActive || workoutPaused) return undefined

    const id = window.setInterval(() => {
      setElapsed((s) => s + 1)
      setLiveStats((prev) => ({
        steps: prev.steps + Math.floor(Math.random() * 3 + 1),
        bpm: 120 + Math.floor(Math.random() * 30),
        calories: prev.calories + Math.random() * 0.15,
        miles: prev.miles + 0.0003,
      }))
    }, 1000)

    return () => clearInterval(id)
  }, [workoutActive, workoutPaused])

  return (
    <main className="flex flex-1 flex-col gap-[12px] overflow-y-auto bg-[#0f1a0f] px-[14px] py-[8px]">
      {!workoutActive ? (
        <StartWorkoutButton
          onStart={() => {
            setWorkoutActive(true)
            setWorkoutPaused(false)
            setElapsed(0)
            setLiveStats({ steps: 0, bpm: 142, calories: 0, miles: 0 })
          }}
        />
      ) : null}

      {workoutActive ? (
        <ActiveWorkoutCard
          elapsed={elapsed}
          stats={liveStats}
          paused={workoutPaused}
          onPause={() => setWorkoutPaused((p) => !p)}
          onStop={() => {
            setWorkoutActive(false)
            setWorkoutPaused(false)
            setElapsed(0)
            setLiveStats({ steps: 0, bpm: 0, calories: 0, miles: 0 })
          }}
        />
      ) : null}

      <TodayStatsGrid />
      <HeartRateCard />
      <SleepCard />
      <RecoveryRow />
      <div className="h-2" />
    </main>
  )
}
