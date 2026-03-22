import SectionHeader from '../layout/SectionHeader'
import CommunityCard from './CommunityCard'

function YourCommunitiesGrid({ communities }) {
  return (
    <section className="flex flex-col gap-[14px]">
      <SectionHeader title="YOUR COMMUNITIES" link="Browse all →" />
      <div className="grid grid-cols-3 gap-[14px]">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </section>
  )
}

export default YourCommunitiesGrid
