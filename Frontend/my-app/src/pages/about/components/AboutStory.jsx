const AboutStory = () => {
  return (
    <section className="px-16 py-12 flex gap-16 items-start max-w-6xl mx-auto">
      <div className="flex-1 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
        <p className="text-gray-600">
          SecureBank was born from a simple observation: traditional banking was too complicated,
          too expensive, and too inaccessible for millions of people around the world.
        </p>
        <p className="text-gray-600">
          Our founders, a team of fintech veterans and security experts, set out to create a banking
          platform that would put users first—combining cutting-edge technology with bank-grade
          security and an intuitive user experience.
        </p>
        <p className="text-gray-600">
          Today, we're proud to serve over half a million customers across 150 countries, processing
          billions in transactions while maintaining our commitment to security, transparency, and
          excellent customer service.
        </p>
        <p className="text-primary font-medium">
          This is an educational platform demonstrating modern banking features and best practices.
        </p>
      </div>

      <div className="w-80 bg-primary-light rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <p className="text-6xl font-bold text-primary">500K+</p>
        <p className="text-xl font-semibold text-gray-900 mt-4">Active Users</p>
        <p className="text-gray-500 mt-2">Trusting SecureBank with their finances</p>
      </div>
    </section>
  )
}

export default AboutStory
