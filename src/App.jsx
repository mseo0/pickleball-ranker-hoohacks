import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import { useTheme } from './hooks/useTheme'
import CommunityPage from './pages/CommunityPage'
import CourtsMapPage from './pages/CourtsMapPage'
import HealthPage from './pages/HealthPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'

const pageTitles = {
  '/': 'Dashboard',
  '/health': 'Health',
  '/community': 'Community',
  '/courts': 'Courts',
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1a0f]">
      <div className="h-[40px] w-[40px] animate-spin rounded-full border-[3px] border-[rgba(200,241,53,0.2)] border-t-[var(--accent)]" />
    </div>
  )
}

function MainApp() {
  const { theme, setTheme } = useTheme()
  const { currentUser } = useAuth()
  const location = useLocation()
  const pathname = location.pathname
  const pageTitle = pageTitles[pathname] ?? 'Dashboard'

  return (
    <div className="app-shell bg-[var(--bg)] text-[var(--text)]">
      <Sidebar currentUser={currentUser} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <TopBar currentUser={currentUser} pageTitle={pageTitle} theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courts" element={<CourtsMapPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function AppRoutes() {
  const { currentUser, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!currentUser) return <LoginPage />

  return <MainApp />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
