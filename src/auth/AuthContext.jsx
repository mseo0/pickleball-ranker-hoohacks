import { createContext, useContext, useEffect, useState } from 'react'
import {
  fetchUsers,
  generateId,
  generateToken,
  hashPassword,
  isValidEmail,
  isValidPassword,
  makeAvatar,
  saveUsers,
} from './authUtils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const restore = async () => {
      try {
        const raw = localStorage.getItem('pr_session')
        if (!raw) return
        const session = JSON.parse(raw)
        const users = await fetchUsers()
        const user = users.find((entry) => entry.id === session.userId)
        if (user) {
          setCurrentUser(user)
        } else {
          localStorage.removeItem('pr_session')
        }
      } catch {
        localStorage.removeItem('pr_session')
      } finally {
        setLoading(false)
      }
    }

    restore()
  }, [])

  const login = async (emailOrUsername, password) => {
    setError(null)
    const users = await fetchUsers()
    const user = users.find(
      (entry) =>
        entry.email.toLowerCase() === emailOrUsername.toLowerCase() ||
        entry.username.toLowerCase() === emailOrUsername.toLowerCase(),
    )

    if (!user) {
      setError('No account found with that email or username.')
      return false
    }

    const hash = await hashPassword(password)
    if (hash !== user.passwordHash) {
      setError('Incorrect password.')
      return false
    }

    const token = generateToken()
    localStorage.setItem(
      'pr_session',
      JSON.stringify({
        userId: user.id,
        token,
      }),
    )
    setCurrentUser(user)
    return true
  }

  const register = async ({ username, email, password, city }) => {
    setError(null)

    if (!username || username.length < 2) {
      setError('Username must be at least 2 characters.')
      return false
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters.')
      return false
    }

    const users = await fetchUsers()
    if (users.find((entry) => entry.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with that email already exists.')
      return false
    }
    if (users.find((entry) => entry.username.toLowerCase() === username.toLowerCase())) {
      setError('That username is already taken.')
      return false
    }

    const hash = await hashPassword(password)
    const newUser = {
      id: generateId(),
      username,
      email,
      passwordHash: hash,
      avatar: makeAvatar(username),
      createdAt: new Date().toISOString(),
      profile: {
        eloRating: 1200,
        duprRating: 1.2,
        city: city || 'Unknown',
        matchesPlayed: 0,
        wins: 0,
      },
    }

    await saveUsers([...users, newUser])

    const token = generateToken()
    localStorage.setItem(
      'pr_session',
      JSON.stringify({
        userId: newUser.id,
        token,
      }),
    )
    setCurrentUser(newUser)
    return true
  }

  const logout = () => {
    localStorage.removeItem('pr_session')
    setCurrentUser(null)
  }

  const switchAccount = async (userId) => {
    const users = await fetchUsers()
    const user = users.find((entry) => entry.id === userId)
    if (!user) return

    const token = generateToken()
    localStorage.setItem('pr_session', JSON.stringify({ userId: user.id, token }))
    setCurrentUser(user)
    setError(null)
  }

  const updateProfile = async (updates) => {
    const users = await fetchUsers()
    const updatedUsers = users.map((user) => (user.id === currentUser.id ? { ...user, ...updates } : user))
    await saveUsers(updatedUsers)
    setCurrentUser((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        switchAccount,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
