import SectionHeader from '../layout/SectionHeader'
import CommunityCard from './CommunityCard'

function YourCommunitiesGrid({ communities }) {
  return (
    <section className="flex flex-col gap-[14px]">
      <div className="flex items-center justify-between">
        <div className="text-[16px] font-medium text-[var(--text)]">Your Communities</div>
        <div className="text-[11px] text-[var(--accent)]">Browse all →</div>
      </div>
      <div className="grid grid-cols-3 gap-[14px]">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </section>
  )
}

export default YourCommunitiesGrid
