import { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'

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

function HealthNudge({ color = 'green' }) {
  const state = stateMap[color] || stateMap.green
  const [geminiAdvice, setGeminiAdvice] = useState('')

  useEffect(() => {
    let intervalId
    async function fetchAdvice() {
      try {
        const res = await fetch('/api/healthkit/pickleball-advice')
        const data = await res.json()
        setGeminiAdvice(data.advice || '')
      } catch (e) {
        setGeminiAdvice('')
      }
    }
    fetchAdvice()
    intervalId = setInterval(fetchAdvice, 10000) // Poll every 10 seconds
    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className={`relative flex items-center gap-3 overflow-hidden rounded-[10px] border px-4 py-[13px] ${state.box}`}>
      <div className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] ${state.iconBox}`}>
        <Activity className={`h-4 w-4 ${state.iconColor}`} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold leading-[1.3] text-[var(--text)]">Health Suggestions</div>
        <div className="mt-[2px] text-[11px] text-[var(--muted)]">
          {geminiAdvice || 'Loading personalized advice...'}
        </div>
      </div>
    </section>
  )
}

export default HealthNudge
