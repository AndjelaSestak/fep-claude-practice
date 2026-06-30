import { Link } from 'react-router-dom'

const AccessDeniedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary">403</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">Access Denied</h2>
      <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
      <Link to="/dashboard" className="mt-6 text-primary hover:underline">
        Go back to Dashboard
      </Link>
    </div>
  )
}
export default AccessDeniedPage
