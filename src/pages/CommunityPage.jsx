import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUsers } from '../auth/authUtils'
import GlobalMatchmakingPanel from '../components/community/GlobalMatchmakingPanel'
import YourCommunitiesGrid from '../components/community/YourCommunitiesGrid'
import ClubQuickStats from '../components/community/ClubQuickStats'
import MembersOnline from '../components/community/MembersOnline'
import UpcomingEvents from '../components/community/UpcomingEvents'
import RecentActivity from '../components/community/RecentActivity'
import { mockCommunities } from '../data/mockCommunities'
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
  const [users, setUsers] = useState([])
  const [customCommunities, setCustomCommunities] = useState([])
  const [showCreateCommunity, setShowCreateCommunity] = useState(false)
  const [newCommunity, setNewCommunity] = useState({
    title: '',
    description: '',
    type: 'open_play',
    minPickElo: 4500,
  })
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
    let cancelled = false

    async function loadUsers() {
      try {
        const nextUsers = await fetchUsers()
        if (!cancelled) {
          setUsers(nextUsers)
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pr_custom_communities')
      if (raw) {
        setCustomCommunities(JSON.parse(raw))
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    const openModal = () => setShowCreateCommunity(true)
    window.addEventListener('pr-open-create-community', openModal)
    return () => window.removeEventListener('pr-open-create-community', openModal)
  }, [])

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

  const allCommunities = useMemo(() => [...mockCommunities, ...customCommunities], [customCommunities])

  const membersOnline = useMemo(() => {
    const palette = [
      { bg: 'rgba(200,241,53,0.15)', color: '#C8F135' },
      { bg: 'rgba(136,180,255,0.12)', color: '#88b4ff' },
      { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
      { bg: 'rgba(248,191,36,0.12)', color: '#fbbf24' },
      { bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
    ]
    const statuses = [
      { status: 'Queued now', statusColor: '#4ade80' },
      { status: 'Online', statusColor: '#C8F135' },
      { status: 'Available 12–2 PM', statusColor: '#7a9a7a' },
      { status: 'Available 4–6 PM', statusColor: '#7a9a7a' },
      { status: 'Queued now', statusColor: '#4ade80' },
    ]

    return users.map((user, index) => ({
      initials: user.avatar || user.username.slice(0, 2).toUpperCase(),
      bg: palette[index % palette.length].bg,
      color: palette[index % palette.length].color,
      name: user.username,
      status: statuses[index % statuses.length].status,
      statusColor: statuses[index % statuses.length].statusColor,
      elo: user.profile?.eloRating ?? 1200,
    }))
  }, [users])

  const avgElo = useMemo(() => {
    if (users.length === 0) return 0
    return Math.round(users.reduce((sum, user) => sum + (user.profile?.eloRating ?? 0), 0) / users.length)
  }, [users])

  const submitCommunity = () => {
    if (!newCommunity.title.trim() || !newCommunity.description.trim()) return

    const created = {
      id: `custom_${Date.now()}`,
      name: newCommunity.title.trim(),
      desc: newCommunity.description.trim(),
      gradient:
        newCommunity.type === 'competitive'
          ? 'linear-gradient(135deg,#3a1a1a,#2a0d0d)'
          : newCommunity.type === 'social'
            ? 'linear-gradient(135deg,#2a1a3a,#1a0d2a)'
            : 'linear-gradient(135deg,#1a3a1a,#0d2a0d)',
      badges: [
        newCommunity.type === 'competitive' ? 'comp' : newCommunity.type === 'social' ? 'casual' : 'open',
        newCommunity.rating === 'all_levels' ? 'open' : 'rated',
      ],
      members: 1,
      memberStack: [{ initials: 'YU', bg: 'rgba(200,241,53,0.2)', color: '#C8F135' }],
      joined: true,
      joinType: 'joined',
      requirementLabel:
        newCommunity.minPickElo > 0 ? `PickElo ${newCommunity.minPickElo}+` : undefined,
    }

    const next = [...customCommunities, created]
    setCustomCommunities(next)
    localStorage.setItem('pr_custom_communities', JSON.stringify(next))
    setShowCreateCommunity(false)
    setNewCommunity({
      title: '',
      description: '',
      type: 'open_play',
      minPickElo: 4500,
    })
  }

  return (
    <>
      <main className="flex flex-1 overflow-hidden max-xl:flex-col">
        <div className="flex flex-1 flex-col gap-[22px] overflow-y-auto px-[24px] py-[20px]">
        <GlobalMatchmakingPanel
          queueCount={143}
          poolScope={poolScope}
          setPoolScope={setPoolScope}
          communities={allCommunities}
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

          <YourCommunitiesGrid communities={allCommunities} />
        </div>

        <aside className="w-[310px] shrink-0 overflow-y-auto border-l border-[rgba(200,241,53,0.10)] bg-[rgba(9,21,9,0.35)] px-[18px] py-[20px] max-xl:w-full max-xl:border-l-0 max-xl:border-t">
          <div className="flex flex-col gap-[18px]">
            <ClubQuickStats totalMembers={users.length} avgElo={avgElo} activeToday={users.length} />
            <MembersOnline members={membersOnline} />
            <UpcomingEvents events={mockEvents} />
            <RecentActivity activity={mockActivity} />
          </div>
        </aside>
      </main>

      {showCreateCommunity ? (
        <>
          <button
            type="button"
            aria-label="Close create community"
            onClick={() => setShowCreateCommunity(false)}
            className="fixed inset-0 z-[199] bg-[rgba(0,0,0,0.6)]"
          />
          <div className="fixed left-1/2 top-1/2 z-[200] w-full max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border border-[rgba(200,241,53,0.16)] bg-[var(--card)] p-6 shadow-2xl">
            <div className="font-display text-[22px] tracking-[0.05em] text-[var(--text)]">Create Community</div>
            <div className="mt-2 text-[12px] leading-[1.5] text-[var(--muted)]">
              Add a new local community with a title, description, play style, and PickElo point filter.
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.06em] text-[var(--muted)]">Title</div>
                <input
                  value={newCommunity.title}
                  onChange={(event) => setNewCommunity((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-[12px] border border-[rgba(200,241,53,0.14)] bg-[var(--card2)] px-4 py-[13px] text-[13px] text-[var(--text)] outline-none"
                  placeholder="Charlottesville Sunrise Open Play"
                />
              </div>

              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.06em] text-[var(--muted)]">Description</div>
                <textarea
                  value={newCommunity.description}
                  onChange={(event) => setNewCommunity((prev) => ({ ...prev, description: event.target.value }))}
                  className="min-h-[108px] w-full rounded-[12px] border border-[rgba(200,241,53,0.14)] bg-[var(--card2)] px-4 py-[13px] text-[13px] leading-[1.5] text-[var(--text)] outline-none"
                  placeholder="What kind of group is this?"
                />
              </div>

              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.06em] text-[var(--muted)]">Community Type</div>
                <div className="flex flex-wrap gap-4">
                  {[
                    ['open_play', 'Open Play'],
                    ['competitive', 'Competitive'],
                    ['social', 'Social'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setNewCommunity((prev) => ({ ...prev, type: id }))}
                      className="rounded-full px-5 py-[11px] text-[13px] font-semibold tracking-[0.01em]"
                      style={{
                        background: newCommunity.type === id ? 'var(--accent)' : 'var(--card2)',
                        color: newCommunity.type === id ? 'var(--accent-dark)' : 'var(--text)',
                        border:
                          newCommunity.type === id
                            ? 'none'
                            : '1px solid rgba(200,241,53,0.12)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.06em] text-[var(--muted)]">PickElo Point Filter</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1000"
                    max="7000"
                    step="50"
                    value={newCommunity.minPickElo}
                    onChange={(event) =>
                      setNewCommunity((prev) => ({ ...prev, minPickElo: Number(event.target.value) }))
                    }
                    className="h-[6px] flex-1 cursor-pointer accent-[var(--accent)]"
                  />
                  <input
                    type="number"
                    min="1000"
                    max="7000"
                    step="50"
                    value={newCommunity.minPickElo}
                    onChange={(event) =>
                      setNewCommunity((prev) => ({
                        ...prev,
                        minPickElo: Number(event.target.value || 0),
                      }))
                    }
                    className="w-[96px] rounded-[12px] border border-[rgba(200,241,53,0.14)] bg-[var(--card2)] px-3 py-[10px] text-[13px] text-[var(--text)] outline-none"
                  />
                </div>
                <div className="mt-2 text-[11px] text-[var(--muted)]">
                  Minimum PickElo required to join this community.
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateCommunity(false)}
                className="flex-1 rounded-[12px] border-2 border-[rgba(200,241,53,0.20)] bg-[var(--card2)] px-4 py-[12px] text-[12px] font-semibold text-[var(--text)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitCommunity}
                className="flex-1 rounded-[12px] border-2 border-[rgba(200,241,53,0.95)] bg-[var(--accent)] px-4 py-[12px] text-[12px] font-semibold text-[var(--accent-dark)] shadow-[0_0_0_1px_rgba(200,241,53,0.12)]"
              >
                Create Community
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}

export default CommunityPage
