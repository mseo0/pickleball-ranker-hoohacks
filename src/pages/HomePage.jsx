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
import UpcomingMatchCard from '../components/home/UpcomingMatchCard'
import { buildLocalMatchResult } from '../data/mockMatch'

function HomePage() {
  const { currentUser } = useAuth()
  const { courts, locationStatus, isUsingPreciseLocation } = useCourtData()
  const [users, setUsers] = useState([])
  const [currentMatch, setCurrentMatch] = useState(null)

  // Gemini / health advice + recovery score from backend snapshot
  const [recoveryScore, setRecoveryScore] = useState(null)
  const [advice, setAdvice] = useState(null)

  const nearbyCourts =
    isUsingPreciseLocation || locationStatus === 'denied' || locationStatus === 'unsupported'
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

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('pr_match_state')
      const savedMatch = localStorage.getItem('pr_current_match')
      if (savedState === 'confirmed' && savedMatch) {
        setCurrentMatch(JSON.parse(savedMatch))
      } else {
        setCurrentMatch(null)
      }
    } catch (error) {
      console.error(error)
      setCurrentMatch(null)
    }
  }, [])

  useEffect(() => {
    if (!currentMatch || users.length === 0) return

    const hasLocalOpponent = users.some((user) => user.id === currentMatch.opponent?.id)
    if (!hasLocalOpponent) {
      const nextMatch = buildLocalMatchResult(users, currentUser)
      setCurrentMatch(nextMatch)
      localStorage.setItem('pr_current_match', JSON.stringify(nextMatch))
    }
  }, [currentMatch, currentUser, users])

  // Fetch the latest snapshot once on mount.
  // Advice is generated and cached when new HealthKit data is uploaded.
  useEffect(() => {
    let cancelled = false

    async function loadHealthAndAdvice() {
      try {
        const latestRes = await fetch('/api/healthkit/latest')
        if (latestRes.ok) {
          const latest = await latestRes.json()
          const recoveryMetric = latest.metrics?.recovery
          if (!cancelled && recoveryMetric && typeof recoveryMetric.value === 'number') {
            setRecoveryScore(recoveryMetric.value)
          }
          if (!cancelled) {
            setAdvice(latest.advice || null)
          }
        }
      } catch (error) {
        console.error('Failed to load health advice', error)
      }
    }

    loadHealthAndAdvice()

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

  const currentUserRank = leaderboardEntries.find((entry) => entry.isMe)?.rank ?? 1

  return (
    <div className="grid gap-[18px] px-5 py-5 sm:px-7 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-[18px]">
        <EloHero />
        {currentMatch ? (
          <UpcomingMatchCard
            match={currentMatch}
            onCancel={() => {
              if (window.confirm('Cancel this confirmed match?')) {
                setCurrentMatch(null)
                localStorage.removeItem('pr_match_state')
                localStorage.removeItem('pr_current_match')
              }
            }}
          />
        ) : null}
        <StatsRow localRank={currentUserRank} matches={currentUserMatches} />
        <HealthNudge recoveryScore={recoveryScore ?? 0} advice={advice} />
        <RecentMatches matches={currentUserMatches.slice(0, 5)} />
      </div>

      <div className="flex flex-col gap-[18px]">
        <NearbyCourts
          courts={nearbyCourts}
          isLoading={!isUsingPreciseLocation && locationStatus === 'loading'}
        />
        <LocalLeaderboard entries={leaderboardEntries} />
      </div>
    </div>
  )
}

export default HomePage
