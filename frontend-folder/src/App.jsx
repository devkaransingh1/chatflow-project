import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ChatPage from './pages/ChatPage'
import LandingPage from './pages/LandingPage'


function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  if (!accessToken && !refreshToken) {
    return <Navigate to="/login" replace />
  }

  return children
}


function PublicRoute({ children }) {
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  if (accessToken || refreshToken) {
    return <Navigate to="/chat" replace />
  }

  return children
}


function App() {
  return (
    <Router>
      <Routes>

        {/* Landing page */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Chat dashboard */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  )
}

export default App