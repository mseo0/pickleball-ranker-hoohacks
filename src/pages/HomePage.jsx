import EloHero from '../components/home/EloHero'
import HealthNudge from '../components/home/HealthNudge'
import LocalLeaderboard from '../components/home/LocalLeaderboard'
import NearbyCourts from '../components/home/NearbyCourts'
import RecentMatches from '../components/home/RecentMatches'
import StatsRow from '../components/home/StatsRow'
import { mockCourts } from '../data/mockCourts'
import { mockHealth } from '../data/mockHealth'
import { mockLeaderboard } from '../data/mockLeaderboard'
import { mockMatches } from '../data/mockMatches'

function HomePage() {
  return (
    <div className="grid gap-[18px] px-5 py-5 sm:px-7 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-[18px]">
        <EloHero />
        <StatsRow />
        <HealthNudge recoveryScore={mockHealth.recoveryScore} />
        <RecentMatches matches={mockMatches} />
      </div>

      <div className="flex flex-col gap-[18px]">
        <NearbyCourts courts={mockCourts} />
        <LocalLeaderboard entries={mockLeaderboard} />
      </div>
    </div>
  )
}

export default HomePage
