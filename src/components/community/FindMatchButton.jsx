function SearchPlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f1a0f"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  )
}

function FindMatchButton({ poolLabel, eloRange, courtCount, slotCount, typeCount, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-[10px] bg-[var(--accent)] px-[16px] py-[11px]"
    >
      <div className="flex flex-col text-left">
        <div className="font-display text-[17px] tracking-[0.05em] text-[#0f1a0f]">Find My Match</div>
        <div className="mt-[2px] text-[10px] text-[rgba(15,26,15,0.60)]">
          {poolLabel} · ±{eloRange} ELO · {courtCount} courts · {slotCount} time slots · {typeCount}
        </div>
      </div>
      <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[rgba(15,26,15,0.15)]">
        <SearchPlusIcon />
      </div>
    </button>
  )
}

export default FindMatchButton
