const Navbar = () => {
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
        <a href="/" className="text-primary font-medium">Home</a>
        <a href="/about" className="text-gray-600 hover:text-primary">About</a>
        <a href="/team" className="text-gray-600 hover:text-primary">Team</a>
        <a href="/contact" className="text-gray-600 hover:text-primary">Contact</a>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <a href="/login" className="text-gray-600 hover:text-primary font-medium">Sign in</a>
        <a href="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark font-medium">
          Get Started
        </a>
      </div>
    </nav>
  )
}

export default Navbar