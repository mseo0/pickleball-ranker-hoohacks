import { Activity } from 'lucide-react'

const stateMap = {
  green: {
    box: 'border-[var(--green-bd)] bg-[var(--green-bg)]',
    iconBox: 'bg-[color:color-mix(in_srgb,var(--green)_15%,transparent)]',
    iconColor: 'text-[var(--green)]',
    title: "You're ready to play — HRV is strong today",
    sub: 'Recovery 82% · 7h 20m sleep · Resting HR 52 bpm',
    pill: 'Peak',
    pillClass: 'bg-[color:color-mix(in_srgb,var(--green)_12%,transparent)] text-[var(--green)]',
    stripe: 'bg-[var(--green)]',
  },
  yellow: {
    box: 'border-[color:rgba(250,204,21,0.25)] bg-[var(--yellow-bg)]',
    iconBox: 'bg-[color:rgba(250,204,21,0.15)]',
    iconColor: 'text-[var(--yellow)]',
    title: 'Take it steady — moderate recovery today',
    sub: 'Recovery 54% · 6h sleep · Slightly elevated HR',
    pill: 'Moderate',
    pillClass: 'bg-[color:rgba(250,204,21,0.12)] text-[var(--yellow)]',
    stripe: 'bg-[var(--yellow)]',
  },
  red: {
    box: 'border-[var(--red-bd)] bg-[var(--red-bg)]',
    iconBox: 'bg-[color:rgba(248,113,113,0.15)]',
    iconColor: 'text-[#f87171]',
    title: 'Rest recommended — body is still recovering',
    sub: 'Recovery 28% · 5h sleep · High resting HR',
    pill: 'Rest',
    pillClass: 'bg-[color:rgba(248,113,113,0.12)] text-[#f87171]',
    stripe: 'bg-[#f87171]',
  },
}

function HealthNudge({ recoveryScore }) {
  const stateKey = recoveryScore >= 70 ? 'green' : recoveryScore >= 40 ? 'yellow' : 'red'
  const state = stateMap[stateKey]

  return (
    <section className={`relative flex items-center gap-3 overflow-hidden rounded-[10px] border px-4 py-[13px] ${state.box}`}>
      <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${state.iconBox}`}>
        <Activity className={`h-4 w-4 ${state.iconColor}`} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold leading-[1.3] text-[var(--text)]">{state.title}</div>
        <div className="mt-[2px] text-[11px] text-[var(--muted)]">{state.sub}</div>
      </div>

      <div className={`shrink-0 rounded-[20px] px-[10px] py-[3px] text-[11px] font-semibold ${state.pillClass}`}>
        {state.pill}
      </div>

      <div className={`absolute bottom-0 right-0 top-0 w-[3px] ${state.stripe}`} />
    </section>
  )
}

export default HealthNudge
