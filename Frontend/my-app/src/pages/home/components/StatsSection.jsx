const stats = [
  { value: '500K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '$2B+', label: 'Transactions' },
  { value: '150+', label: 'Countries' }
]

const StatsSection = () => (
  <section className="flex justify-around py-16 px-8">
    {stats.map(({ value, label }) => (
      <div key={label} className="text-center">
        <p className="text-4xl font-bold text-primary">{value}</p>
        <p className="text-gray-500 mt-1">{label}</p>
      </div>
    ))}
  </section>
)

export default StatsSection
