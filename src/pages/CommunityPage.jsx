import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlobalMatchmakingPanel from '../components/community/GlobalMatchmakingPanel'
import YourCommunitiesGrid from '../components/community/YourCommunitiesGrid'
import ClubQuickStats from '../components/community/ClubQuickStats'
import MembersOnline from '../components/community/MembersOnline'
import UpcomingEvents from '../components/community/UpcomingEvents'
import RecentActivity from '../components/community/RecentActivity'
import { mockCommunities } from '../data/mockCommunities'
import { mockMembers } from '../data/mockMembers'
import { mockEvents } from '../data/mockEvents'
import { mockActivity } from '../data/mockActivity'
import { mockMatchResult } from '../data/mockMatch'

const userElo = 5600

const selectableCourts = [
  { id: 'darden', name: 'Darden Towe', dist: '0.8 mi', status: 'Open', color: '#4ade80' },
  { id: 'pen', name: 'Pen Park', dist: '1.4 mi', status: 'Busy', color: '#facc15' },
  { id: 'mcint', name: 'McIntire Park', dist: '2.1 mi', status: 'Full', color: '#ef4444' },
]

function toggleFromArray(values, id) {
  return values.includes(id) ? values.filter((value) => value !== id) : [...values, id]
}

function CommunityPage() {
  const navigate = useNavigate()
  const [poolScope, setPoolScope] = useState('anyone')
  const [selectedCommunities, setSelectedCommunities] = useState(['cville', 'sunday'])
  const [matchTypes, setMatchTypes] = useState(['rated', 'unrated', 'doubles'])
  const [eloMin, setEloMin] = useState(5450)
  const [eloMax, setEloMax] = useState(5750)
  const [selectedCourts, setSelectedCourts] = useState(['darden', 'pen'])
  const [selectedSlots, setSelectedSlots] = useState(['10am', '12pm', '4pm'])
  const [eloRangeDelta, setEloRangeDelta] = useState(150)
  const [isAdjustingRange, setIsAdjustingRange] = useState(false)
  const [isSearchingMatch, setIsSearchingMatch] = useState(false)
  const [searchElapsed, setSearchElapsed] = useState(0)

  useEffect(() => {
    if (!isSearchingMatch) {
      setSearchElapsed(0)
      return undefined
    }

    const interval = setInterval(() => {
      setSearchElapsed((prev) => prev + 1)
    }, 1000)

    const timer = setTimeout(() => {
      localStorage.setItem('pr_match_state', 'confirmed')
      localStorage.setItem('pr_current_match', JSON.stringify(mockMatchResult))
      setIsSearchingMatch(false)
      navigate('/')
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [isSearchingMatch, navigate])

  const handleAdjustRange = (nextRange) => {
    setEloRangeDelta(nextRange)
    setEloMin(userElo - nextRange)
    setEloMax(userElo + nextRange)
  }

  const handleFindMatch = () => {
    if (isSearchingMatch) return

    const matchRequest = {
      poolScope,
      communities: selectedCommunities,
      matchTypes,
      eloMin,
      eloMax,
      courts: selectedCourts,
      timeSlots: selectedSlots,
      userId: 'aj',
      userElo,
    }

    console.log(matchRequest)
    localStorage.setItem('pr_match_state', 'searching')
    localStorage.removeItem('pr_current_match')
    setIsSearchingMatch(true)
  }

  return (
    <main className="flex flex-1 overflow-hidden max-xl:flex-col">
      <div className="flex flex-1 flex-col gap-[22px] overflow-y-auto px-[24px] py-[20px]">
        <GlobalMatchmakingPanel
          queueCount={143}
          poolScope={poolScope}
          setPoolScope={setPoolScope}
          communities={mockCommunities}
          selectedCommunities={selectedCommunities}
          toggleCommunity={(id) => setSelectedCommunities((prev) => toggleFromArray(prev, id))}
          matchTypes={matchTypes}
          toggleMatchType={(id) => setMatchTypes((prev) => toggleFromArray(prev, id))}
          userElo={userElo}
          eloMin={eloMin}
          eloMax={eloMax}
          rangeDelta={eloRangeDelta}
          isAdjustingRange={isAdjustingRange}
          toggleAdjustRange={() => setIsAdjustingRange((prev) => !prev)}
          adjustRange={handleAdjustRange}
          courts={selectableCourts}
          selectedCourts={selectedCourts}
          toggleCourt={(id) => setSelectedCourts((prev) => toggleFromArray(prev, id))}
          selectedSlots={selectedSlots}
          toggleSlot={(id) => setSelectedSlots((prev) => toggleFromArray(prev, id))}
          onFindMatch={handleFindMatch}
          isSearching={isSearchingMatch}
          searchElapsed={searchElapsed}
        />

        <YourCommunitiesGrid communities={mockCommunities} />
      </div>

      <aside className="w-[310px] shrink-0 overflow-y-auto border-l border-[rgba(200,241,53,0.10)] bg-[rgba(9,21,9,0.35)] px-[18px] py-[20px] max-xl:w-full max-xl:border-l-0 max-xl:border-t">
        <div className="flex flex-col gap-[18px]">
          <ClubQuickStats />
          <MembersOnline members={mockMembers} />
          <UpcomingEvents events={mockEvents} />
          <RecentActivity activity={mockActivity} />
        </div>
      </aside>
    </main>
  )
}

export default CommunityPage
