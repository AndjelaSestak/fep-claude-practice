import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NavBarAfterLogin = () => {
  const { user, logout } = useAuth()
  const username = user?.name || 'User'

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <p className="text-gray-700 font-medium">Welcome back, {username}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
        <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {username.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default NavBarAfterLogin
