const PageHeader = ({ label, title, subtitle, children }) => {
  return (
    <header className="relative bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden mb-8">
      <div className="absolute -left-4 -top-4 w-32 h-32 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute right-10 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
          <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">
            {label}
          </span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">{title}</h1>
        <p className="text-gray-700 font-semibold opacity-80">{subtitle}</p>
      </div>

      {children && <div className="relative z-10">{children}</div>}
    </header>
  )
}

export default PageHeader
