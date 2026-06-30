import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-6 text-primary hover:underline">
        Go back to Dashboard
      </Link>
    </div>
  )
}
export default NotFoundPage
