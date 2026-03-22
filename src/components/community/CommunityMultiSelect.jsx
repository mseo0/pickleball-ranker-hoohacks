function CommunityMultiSelect({ communities, selectedCommunities, onToggle }) {
  return (
    <div className="flex flex-wrap gap-[6px]">
      {communities.map((community) => {
        const selected = selectedCommunities.includes(community.id)
        return (
          <button
            key={community.id}
            type="button"
            onClick={() => onToggle(community.id)}
            className={[
              'flex items-center gap-[5px] rounded-[20px] border px-[10px] py-[3px] text-[10px] transition-all duration-150',
              selected
                ? 'border-[rgba(200,241,53,0.85)] bg-[rgba(200,241,53,0.14)] font-medium text-[var(--accent)] shadow-[0_0_0_1px_rgba(200,241,53,0.12)]'
                : 'border-[rgba(200,241,53,0.18)] bg-[rgba(20,32,20,0.65)] text-[var(--muted)] hover:border-[rgba(200,241,53,0.34)]',
            ].join(' ')}
          >
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: selected ? '#C8F135' : '#4a6a4a' }}
            />
            <span>{community.name}</span>
          </button>
        )
      })}
      <button
        type="button"
        className="rounded-[20px] border border-dashed border-[rgba(200,241,53,0.28)] bg-[rgba(20,32,20,0.55)] px-[10px] py-[3px] text-[10px] text-[var(--dim)]"
      >
        + Add
      </button>
    </div>
  )
}

export default CommunityMultiSelect
