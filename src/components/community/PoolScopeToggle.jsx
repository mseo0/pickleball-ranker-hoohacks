const scopeOptions = [
  { id: 'anyone', label: 'Anyone on Picklerank' },
  { id: 'specific', label: 'Specific Communities' },
  { id: 'my-communities', label: 'My Communities Only' },
]

function PoolScopeToggle({ value, onChange }) {
  return (
    <div className="flex gap-[6px]">
      {scopeOptions.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={[
              'flex-1 rounded-[9px] border px-[10px] py-[8px] text-center text-[11px] transition-colors',
              active
                ? 'border-[rgba(200,241,53,0.35)] bg-[rgba(200,241,53,0.12)] font-semibold text-[var(--accent)]'
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

export default PoolScopeToggle
