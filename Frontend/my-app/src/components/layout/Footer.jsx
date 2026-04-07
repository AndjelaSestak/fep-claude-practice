import { Shield } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="rounded-lg p-2 flex items-center justify-center"
                                style={{ backgroundColor: '#2ECC71' }}
                            >
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl" style={{ color: '#1B1B1B' }}>
                                SecureBank
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600">
                            Your trusted partner for secure and modern banking solutions.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold mb-4" style={{ color: '#1B1B1B' }}>
                            Company
                        </h3>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <a
                                    href="/about"
                                    className="text-sm text-slate-600 transition-colors hover:underline"
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2ECC71')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/team"
                                    className="text-sm text-slate-600 transition-colors hover:underline"
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2ECC71')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                >
                                    Team
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-sm text-slate-600 transition-colors hover:underline"
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2ECC71')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Get Started Links */}
                    <div>
                        <h3 className="font-semibold mb-4" style={{ color: '#1B1B1B' }}>
                            Get Started
                        </h3>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <a
                                    href="/login"
                                    className="text-sm text-slate-600 transition-colors hover:underline"
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2ECC71')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                >
                                    Sign in
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/register"
                                    className="text-sm text-slate-600 transition-colors hover:underline"
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#2ECC71')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                >
                                    Register
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Divider + Copyright */}
            <div className="border-t border-slate-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-slate-500">
                        © {new Date().getFullYear()} SecureBank. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
