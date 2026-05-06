import { useLocation } from 'react-router-dom'

import Button from '../ui/Button'

const Navbar = () => {
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contactus' }
  ]

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-primary rounded-lg p-2">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <span className="font-bold text-xl">SecureBank</span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.path}
            className={
              location.pathname === link.path
                ? 'text-primary font-medium'
                : 'text-gray-600 hover:text-primary'
            }
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <Button version="secondary" size="lg" onClick={() => (window.location.href = '/login')}>
          Sign in
        </Button>
        <Button version="secondary" size="lg" onClick={() => (window.location.href = '/register')}>
          Get Started
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
