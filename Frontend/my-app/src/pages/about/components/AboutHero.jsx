import PageHero from '../../../components/ui/PageHero'

const AboutHero = () => {
  return (
    <PageHero
      title={
        <>
          About <span className="text-primary">SecureBank</span>
        </>
      }
      subtitle="We're on a mission to make banking accessible, secure, and effortless for everyone. Founded in 2020, SecureBank has grown to serve over 500,000 customers worldwide."
    />
  )
}

export default AboutHero
