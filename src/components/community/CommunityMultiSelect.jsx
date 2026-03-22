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
              'flex items-center gap-[5px] rounded-[20px] border px-[9px] py-[3px] text-[10px]',
              selected
                ? 'border-[rgba(200,241,53,0.40)] bg-[rgba(200,241,53,0.15)] font-medium text-[var(--accent)]'
                : 'border-[rgba(200,241,53,0.10)] bg-transparent text-[var(--muted)]',
            ].join(' ')}
          >
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{ backgroundColor: selected ? '#C8F135' : '#4a6a4a' }}
            />
            <span>{community.name}</span>
          </button>
        )
      })}
      <button
        type="button"
        className="rounded-[20px] border border-dashed border-[rgba(200,241,53,0.20)] px-[9px] py-[3px] text-[10px] text-[var(--dim)]"
      >
        + Add
      </button>
    </div>
  )
}

export default CommunityMultiSelect
