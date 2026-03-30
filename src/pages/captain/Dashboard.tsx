import Layout from '../../shared/ui/Layout'

export default function CaptainDashboard() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Captain Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">My Vessels</div>
        <div className="bg-white p-4 rounded shadow">My Bookings</div>
        <div className="bg-white p-4 rounded shadow">Notifications</div>
      </div>
    </Layout>
  )
}