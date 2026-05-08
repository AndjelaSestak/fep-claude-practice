const PageHero = ({ title, subtitle, children }) => {
  return (
    <section className="bg-primary-light flex flex-col items-center justify-center text-center px-8 py-24">
      <h1 className="text-5xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg">{subtitle}</p>
      )}
      {children}
    </section>
  )
}

export default PageHero
