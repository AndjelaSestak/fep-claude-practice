import { UserRound } from 'lucide-react'

const SettingsHeader = () => {
  return (
    <header className="bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
          <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">
            Account Info
          </span>
        </div>

        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">Profile Settings</h1>

        <p className="text-gray-700 font-semibold opacity-80">
          Manage your account information and preferences.
        </p>
      </div>

      <UserRound className="hidden md:block w-20 h-20 text-primary-dark opacity-20" />
    </header>
  )
}

export default SettingsHeader
