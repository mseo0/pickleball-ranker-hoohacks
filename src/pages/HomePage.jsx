import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { fetchUsers } from '../auth/authUtils'
import { useCourtData } from '../hooks/useCourtData'
import EloHero from '../components/home/EloHero'
import HealthNudge from '../components/home/HealthNudge'
import LocalLeaderboard from '../components/home/LocalLeaderboard'
import NearbyCourts from '../components/home/NearbyCourts'
import RecentMatches from '../components/home/RecentMatches'
import StatsRow from '../components/home/StatsRow'
import { mockHealth } from '../data/mockHealth'

function HomePage() {
  const { currentUser } = useAuth()
  const { courts, locationStatus, isUsingPreciseLocation } = useCourtData()
  const [users, setUsers] = useState([])
  const nearbyCourts = isUsingPreciseLocation || locationStatus === 'denied' || locationStatus === 'unsupported'
    ? courts.slice(0, 3)
    : []

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

  const leaderboardEntries = useMemo(
    () =>
      [...users]
        .sort((left, right) => (right.profile?.eloRating ?? 0) - (left.profile?.eloRating ?? 0))
        .map((user, index) => ({
          rank: index + 1,
          initials: user.avatar,
          avatarBg: user.id === currentUser?.id ? 'rgba(200,241,53,0.2)' : 'rgba(136,180,255,0.12)',
          avatarColor: user.id === currentUser?.id ? 'var(--accent)' : '#88b4ff',
          name: user.id === currentUser?.id ? 'You' : user.username,
          score: user.profile?.eloRating ?? 0,
          isMe: user.id === currentUser?.id,
        })),
    [currentUser?.id, users],
  )
  const currentUserMatches = users.find((user) => user.id === currentUser?.id)?.recentMatches ?? []

  const currentUserRank =
    leaderboardEntries.find((entry) => entry.isMe)?.rank ?? 1

  return (
    <div className="grid gap-[18px] px-5 py-5 sm:px-7 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-[18px]">
        <EloHero />
        <StatsRow localRank={currentUserRank} matches={currentUserMatches} />
        <HealthNudge recoveryScore={mockHealth.recoveryScore} />
        <RecentMatches matches={currentUserMatches.slice(0, 5)} />
      </div>

      <div className="flex flex-col gap-[18px]">
        <NearbyCourts courts={nearbyCourts} isLoading={!isUsingPreciseLocation && locationStatus === 'loading'} />
        <LocalLeaderboard entries={leaderboardEntries} />
      </div>
    </div>
  )
}

export default HomePage
