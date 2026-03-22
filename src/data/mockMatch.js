export const mockMatchResult = {
  opponent: {
    id: '88519c58-80bc-4a7c-9361-d525ee4936b9',
    name: 'Leo',
    avatar: 'LE',
    eloRating: 4890,
    rank: 'Gold II',
    winRate: 62,
    recentForm: ['W', 'W', 'L', 'W', 'W'],
    headToHead: { wins: 1, losses: 1 },
    avgMatchMins: 52,
    avatarColor: '#60a5fa',
    avatarBg: 'rgba(96,165,250,0.15)',
  },
  matchQuality: 91,
  court: {
    name: 'Pen Park',
    courtNum: 2,
    distMiles: 0.8,
    mapsUrl: 'https://maps.apple.com/?q=Pen+Park+Charlottesville',
  },
  scheduledTime: '3:30 PM',
  scheduledDate: 'Today',
  durationMins: 60,
  eloStake: 18,
  format: 'Singles',
  bestOf: 3,
}

function computeMatchQuality(userElo, opponentElo, distMiles) {
  const eloDiff = Math.abs(userElo - opponentElo)
  const eloScore = Math.max(0, 100 - eloDiff / 4)
  const distScore = Math.max(0, 100 - distMiles * 10)
  return Math.round(eloScore * 0.7 + distScore * 0.3)
}

export function buildLocalMatchResult(users = [], currentUser = null) {
  const availableOpponent =
    users.find((user) => user.id !== currentUser?.id) ||
    users[0]

  if (!availableOpponent) {
    return mockMatchResult
  }

  const myElo = currentUser?.profile?.eloRating ?? 1200
  const opponentElo = availableOpponent.profile?.eloRating ?? 1200

  return {
    ...mockMatchResult,
    opponent: {
      ...mockMatchResult.opponent,
      id: availableOpponent.id,
      name: availableOpponent.username,
      avatar: availableOpponent.avatar || availableOpponent.username.slice(0, 2).toUpperCase(),
      eloRating: opponentElo,
      rank: opponentElo >= 5000 ? 'Gold II' : opponentElo >= 4500 ? 'Silver III' : 'Bronze I',
      winRate: availableOpponent.profile?.matchesPlayed
        ? Math.round(((availableOpponent.profile?.wins ?? 0) / availableOpponent.profile.matchesPlayed) * 100)
        : 50,
    },
    matchQuality: computeMatchQuality(myElo, opponentElo, mockMatchResult.court.distMiles),
  }
}
