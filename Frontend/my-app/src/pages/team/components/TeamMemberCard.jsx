import TeamCard from './TeamCardWrapper'

const TeamMemberCard = ({ member }) => {
  return (
    <TeamCard hover>
      <div className="flex flex-col items-center">
        <img
          src={member.image}
          alt={member.name}
          className="mb-6 h-24 w-24 rounded-full object-cover"
        />
        <h3 className="text-2xl font-semibold text-slate-900">{member.name}</h3>
        <p className="mt-2 text-lg text-green-500">{member.role}</p>
      </div>
      <p className="mt-6 text-base leading-7 text-slate-500">{member.description}</p>
    </TeamCard>
  )
}

export default TeamMemberCard
