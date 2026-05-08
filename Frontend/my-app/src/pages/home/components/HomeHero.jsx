import PageHero from '../../../components/ui/PageHero'
import Button from '../../../components/ui/Button'

const HomeHero = () => (
  <PageHero
    title={<>Banking Made <span className="text-primary">Simple</span> and <span className="text-primary">Secure</span></>}
    subtitle="Experience the future of banking with SecureBank. Manage your finances, track expenses, and make payments—all from one secure platform."
  >
    <div className="flex gap-4 mt-8">
      <Button variant="default" size="lg" onClick={() => (window.location.href = '/register')}>
        Get Started Free
      </Button>
      <Button variant="outline" size="lg" onClick={() => (window.location.href = '/about')}>
        Learn More
      </Button>
    </div>
  </PageHero>
)

export default HomeHero
