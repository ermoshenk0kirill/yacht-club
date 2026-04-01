// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
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
import CaptainCalendar from './pages/captain/Calendar'
import CaptainNews from './pages/captain/News'           // ← Новая страница

// Manager
import ManagerBookings from './pages/manager/Bookings'
import ManagerNews from './pages/manager/News'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

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
          path="/captain/news"
          element={
            <ProtectedRoute role="captain">
              <Layout title="Новости порта">
                <CaptainNews />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain/vessels"
          element={
            <ProtectedRoute role="captain">
              <Layout title="Мои суда">
                <Vessels />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain/bookings"
          element={
            <ProtectedRoute role="captain">
              <Layout title="Мои заявки">
                <CaptainBookings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/captain/calendar"
          element={
            <ProtectedRoute role="captain">
              <Layout title="Календарь">
                <CaptainCalendar />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* === MANAGER ROUTES === */}
        <Route
          path="/manager/bookings"
          element={
            <ProtectedRoute role="manager">
              <Layout title="Управление заявками">
                <ManagerBookings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/news"
          element={
            <ProtectedRoute role="manager">
              <Layout title="Управление новостями">
                <ManagerNews />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </AuthProvider>
  )
}