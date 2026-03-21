import { Route, Routes, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import { useTheme } from './hooks/useTheme'
import CommunityPage from './pages/CommunityPage'
import GearPage from './pages/GearPage'
import HealthPage from './pages/HealthPage'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'

const pageTitles = {
  '/': 'Dashboard',
  '/health': 'Health',
  '/community': 'Community',
  '/gear': 'My Gear',
  '/news': 'News & Market',
}

function App() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const pathname = location.pathname
  const pageTitle = pageTitles[pathname] ?? 'Dashboard'

  return (
    <div className="app-shell bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <TopBar pageTitle={pageTitle} theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/gear" element={<GearPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
