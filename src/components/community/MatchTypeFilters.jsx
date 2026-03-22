const matchTypeOptions = [
  { id: 'rated', label: 'Rated' },
  { id: 'unrated', label: 'Unrated' },
  { id: 'competitive', label: 'Competitive' },
  { id: 'casual', label: 'Casual only' },
  { id: 'doubles', label: 'Doubles' },
  { id: 'singles', label: 'Singles' },
]

function MatchTypeFilters({ value, onToggle }) {
  return (
    <div className="flex flex-wrap gap-[6px]">
      {matchTypeOptions.map((option) => {
        const active = value.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onToggle(option.id)}
            className={[
              'rounded-[20px] border px-[11px] py-[4px] text-[10px] transition-colors',
              active
                ? 'border-[rgba(200,241,53,0.30)] bg-[rgba(200,241,53,0.12)] font-medium text-[var(--accent)]'
                : 'border-[rgba(200,241,53,0.10)] bg-transparent text-[var(--muted)]',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default MatchTypeFilters
