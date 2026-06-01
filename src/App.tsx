import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SetupProfilePage } from './pages/SetupProfilePage'
import { FeedPage } from './pages/FeedPage'
import { ExplorePage } from './pages/ExplorePage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { MessagesPage } from './pages/MessagesPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('bz_splash_done'))
  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem('bz_splash_done', '1')
    setShowSplash(false)
  }, [])

  return (
    <>
    {showSplash && <SplashScreen onDone={handleSplashDone} />}
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/setup-profile" element={<SetupProfilePage />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
