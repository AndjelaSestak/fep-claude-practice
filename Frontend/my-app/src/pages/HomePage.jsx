import Navbar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import { Shield, CreditCard, TrendingUp, Clock, Lock, Headphones } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Bank-Grade Security', desc: 'Your data is protected with military-grade encryption and multi-factor authentication.' },
  { icon: CreditCard, title: 'Smart Card Management', desc: 'Manage multiple cards, set limits, and receive real-time fraud alerts.', featured: true },
  { icon: TrendingUp, title: 'Financial Insights', desc: 'Track spending patterns and get personalized recommendations to save more.' },
  { icon: Clock, title: 'Instant Transfers', desc: 'Send and receive money instantly with zero fees on most transactions.' },
  { icon: Lock, title: 'Privacy First', desc: 'We never sell your data. Your financial information stays private and secure.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated support team is always available to help you with any questions.' },
]


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
        

<section className="px-8 py-16 bg-gray-50">
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-900">Everything You Need to Manage Your Money</h2>
    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
      SecureBank provides all the tools you need to take control of your financial life.
    </p>
  </div>

  <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
    {features.map(({ icon: Icon, title, desc, featured }) => (
  <div
    key={title}
    className={`p-6 rounded-xl border ${featured ? 'border-green-400 bg-white' : 'border-gray-100 bg-white'}`}
  >
    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
      <Icon size={22} className="text-green-500" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
))}
  </div>
</section>
    
      <Footer />
    </div>
   
  )
}

export default HomePage