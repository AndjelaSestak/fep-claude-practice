import TeamMemberCard from './TeamMemberCard'

const teamMembers = [
  {
    name: 'Stasa Dragovic',
    role: 'Full Stack Developer',
    image: '/images/stasa.png',
    description:
      'A confident and outspoken leader with outstanding organizational abilities and strong development expertise built from an early start in high school, further refined through academic experience at university in the capital.'
  },
  {
    name: 'Andjela Sestak',
    role: 'Full Stack Developer',
    image: '/images/andjela.png',
    description:
      'A highly adaptable developer with a keen eye for detail, known for deep, in-depth work and playing a key role in maintaining team balance and cohesion.'
  },
  {
    name: 'Lazar Mrdjenovic',
    role: 'Full Stack Developer',
    image: '/images/lazar.png',
    description:
      'A highly efficient, reliable developer and an ideal teammate, whose experience in the gaming industry was instrumental in designing this platform.'
  },
  {
    name: 'Vladimir Josic',
    role: 'Full Stack Developer',
    image: '/images/vladimir.png',
    description:
      'A dedicated and versatile developer with a strong focus on building well-structured solutions, while fostering a positive team atmosphere and keeping morale high.'
  },
  {
    name: 'Visnja Stojsin',
    role: 'ML Engineer',
    image: '/images/visnja.png',
    description:
      'A passionate machine learning engineer with a strong analytical mindset, bringing data-driven insights and intelligent solutions to the platform while bridging the gap between engineering and innovation.'
  }
]

const LeadershipTeam = () => {
  return (
    <section className="bg-surface px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Leadership Team</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-500">
            Meet the experienced leaders guiding SecureBank&apos;s vision.
          </p>
        </div>

        <div className="mt-14 grid gap-8 xl:grid-cols-2">
          {teamMembers.slice(0, 4).map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}

          <div className="flex justify-center xl:col-span-2">
            <div className="xl:w-1/2">
              <TeamMemberCard member={teamMembers[4]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LeadershipTeam
