// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './app/providers/AuthProvider'
import { ProtectedRoute } from './app/router/ProtectedRoute'

import Layout from './shared/ui/Layout'

// Public
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

// Captain
import CaptainDashboard from './pages/captain/Dashboard'
import Vessels from './pages/captain/Vessels'
import CaptainBookings from './pages/captain/Bookings'
import Calendar from './pages/captain/Calendar'

// Manager
import ManagerBookings from './pages/manager/Bookings'
import ManagerNews from './pages/manager/News'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === CAPTAIN ROUTES === */}
        <Route
          path="/captain"
          element={
            <ProtectedRoute role="captain">
              <Layout title="Dashboard">
                <CaptainDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain/vessels"
          element={
            <ProtectedRoute role="captain">
              <Layout title="My Vessels">
                <Vessels />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain/bookings"
          element={
            <ProtectedRoute role="captain">
              <Layout title="My Bookings">
                <CaptainBookings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain/calendar"
          element={
            <ProtectedRoute role="captain">
              <Layout title="Calendar">
                <Calendar />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* === MANAGER ROUTES === */}
        <Route
          path="/manager/bookings"
          element={
            <ProtectedRoute role="manager">
              <Layout title="Manage Bookings">
                <ManagerBookings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/news"
          element={
            <ProtectedRoute role="manager">
              <Layout title="News Management">
                <ManagerNews />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout title="404">
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-8xl font-bold text-purple-500 mb-4">404</h1>
                <h2 className="text-3xl font-semibold mb-2">Страница не найдена</h2>
                <p className="text-gray-400 mb-8">Запрошенный адрес не существует</p>
                <a
                  href="/"
                  className="btn btn-primary px-8 py-3 text-lg"
                >
                  Вернуться на главную
                </a>
              </div>
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  )
}