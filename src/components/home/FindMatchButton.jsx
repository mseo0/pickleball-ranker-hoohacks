import { useNavigate } from 'react-router-dom'

function FindMatchButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/community')}
      className="mt-2 flex w-full cursor-pointer items-center justify-between rounded-[9px] border border-[rgba(200,241,53,0.28)] bg-[rgba(200,241,53,0.08)] px-[14px] py-[11px]"
    >
      <div className="flex items-center gap-[9px]">
        <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[rgba(200,241,53,0.12)]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C8F135"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v6M8 11h6" />
          </svg>
        </div>

        <div className="text-left">
          <div className="font-display text-[15px] leading-tight tracking-[0.05em] text-[var(--accent)]">
            Find a Match
          </div>
          <div className="mt-[1px] text-[10px] text-[var(--muted)]">Queue with nearby players</div>
        </div>
      </div>

      <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[rgba(200,241,53,0.10)]">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C8F135"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

export default FindMatchButton
