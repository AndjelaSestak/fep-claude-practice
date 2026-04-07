import Navbar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'


const HomePage = () => {
  return (
    <div>
      <Navbar />

      
      <section className="bg-primary-light flex flex-col items-center justify-center text-center px-8 py-24">
        <h1 className="text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Banking Made <span className="text-primary">Simple</span> and <span className="text-primary">Secure</span>
        </h1>
        <p className="text-gray-500 mt-6 max-w-xl text-lg">
          Experience the future of banking with SecureBank. Manage your finances, track expenses, and make payments—all from one secure platform.
        </p>
        <div className="flex gap-4 mt-8">
          <Button variant="default" size="lg" onClick={() => window.location.href = '/register'}>
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/about'} >
            Learn More
          </Button>
        </div>
      </section>

     
      <section className="flex justify-around py-16 px-8">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">500K+</p>
          <p className="text-gray-500 mt-1">Active Users</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">99.9%</p>
          <p className="text-gray-500 mt-1">Uptime</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">$2B+</p>
          <p className="text-gray-500 mt-1">Transactions</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-primary">150+</p>
          <p className="text-gray-500 mt-1">Countries</p>
        </div>
      </section>

      <Footer />
    </div>
   
  )
}

export default HomePage