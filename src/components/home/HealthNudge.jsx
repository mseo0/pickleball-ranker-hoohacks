import { Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

const stateMap = {
  green: {
    box: 'border-[var(--green-bd)] bg-[var(--green-bg)]',
    iconBox: 'bg-[color:color-mix(in_srgb,var(--green)_15%,transparent)]',
    iconColor: 'text-[var(--green)]',
  },
  yellow: {
    box: 'border-[color:rgba(250,204,21,0.25)] bg-[var(--yellow-bg)]',
    iconBox: 'bg-[color:rgba(250,204,21,0.15)]',
    iconColor: 'text-[var(--yellow)]',
  },
  red: {
    box: 'border-[var(--red-bd)] bg-[var(--red-bg)]',
    iconBox: 'bg-[color:rgba(248,113,113,0.15)]',
    iconColor: 'text-[#f87171]',
  },
}

function HealthNudge({ color = 'green', advice }) {
  const state = stateMap[color] || stateMap.green

  return (
    <section className={`relative overflow-hidden rounded-[10px] border px-4 py-[13px] ${state.box}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${state.iconBox}`}>
          <Activity className={`h-4 w-4 ${state.iconColor}`} strokeWidth={1.8} />
        </div>
        <Link
          to="/health"
          className="rounded-full border border-[color:rgba(200,241,53,0.28)] bg-[color:rgba(200,241,53,0.12)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)] transition hover:bg-[color:rgba(200,241,53,0.18)]"
        >
          View Health
        </Link>
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold leading-[1.3] text-[var(--text)]">Health Suggestions</div>
        <div className="mt-[2px] text-[11px] text-[var(--muted)]">
          {advice || 'Upload Apple Health data to get personalized advice.'}
        </div>
      </div>
    </section>
  )
}

export default HealthNudge
