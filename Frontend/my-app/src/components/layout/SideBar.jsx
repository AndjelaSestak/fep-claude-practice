import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, CreditCard, Wallet, FileText, Settings } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
  { label: 'Cards', icon: CreditCard, path: '/my-cards' },
  { label: 'Templates', icon: FileText, path: '/templates' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

const Sidebar = () => {
  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="bg-green-500 rounded-lg p-2">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <span className="font-bold text-xl">SecureBank</span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar