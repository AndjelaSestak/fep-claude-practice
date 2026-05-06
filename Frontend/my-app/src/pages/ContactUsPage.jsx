import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../components/ui/FormField'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import TextArea from '../components/ui/TextArea'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import Navbar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import { sendMessageFromContactUsPage } from '../services/visitorService'
import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '../components/ui/AlertDialog'

const ContactUsPage = () => {
  const navigate = useNavigate()

  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={24} />,
      title: 'Email',
      value: 'support@securebank.com',
      description: 'Send us an email anytime',
      isLink: true
    },
    {
      icon: <Phone className="text-primary" size={24} />,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm',
      isLink: true
    },
    {
      icon: <MapPin className="text-primary" size={24} />,
      title: 'Office',
      value: '123 Financial District, New York, NY 10004',
      description: 'Visit our headquarters',
      isLink: false
    },
    {
      icon: <Clock className="text-primary" size={24} />,
      title: 'Business Hours',
      value: 'Monday - Friday: 8am - 6pm EST',
      description: 'Weekend: Closed',
      isLink: false
    }
  ]

  // 1. Dodat 'subject' i usaglašen state
  const [formData, setFormData] = useState({
    sender: '',
    sender_email: '',
    subject: '',
    message: ''
  })

  const [loading, setLoading] = useState(false) // 2. Dodat loading state
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await sendMessageFromContactUsPage(
        formData.sender,
        formData.subject,
        formData.sender_email,
        formData.message
      )

      setSuccessDialogOpen(true)

      // Opciono: Resetuj formu nakon uspešnog slanja
      setFormData({
        sender: '',
        subject: '',
        sender_email: '',
        message: ''
      })
    } catch (err) {
      const detail = err.response?.data?.detail
      let textToShow = 'Slanje poruke nije uspelo. Pokušajte ponovo.'

      // FastAPI za grešku 422 vraća niz objekata, moramo to da pretvorimo u tekst
      if (Array.isArray(detail)) {
        textToShow = detail.map((e) => `Polje ${e.loc[e.loc.length - 1]}: ${e.msg}`).join(', ')
      } else if (typeof detail === 'string') {
        textToShow = detail
      }

      setErrorMessage(textToShow)
      setErrorDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* SUCCESS DIALOG */}
      <AlertDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Message sent</AlertDialogTitle>
          <AlertDialogDescription>Your message has been sent successfully.</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setSuccessDialogOpen(false)
              navigate('/contactus', { replace: true })
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* ERROR DIALOG */}
      <AlertDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Message failed</AlertDialogTitle>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>

      <Navbar />

      <div className="min-h-screen bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <section className="bg-primary-light flex flex-col items-center justify-center text-center px-8 py-24">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-lg text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>
        </section>

        {/* Info Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-6">
                {info.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
              <p
                className={`text-sm mb-1 ${info.isLink ? 'text-primary font-medium' : 'text-gray-900 font-medium'}`}
              >
                {info.value}
              </p>
              <p className="text-sm text-gray-500">{info.description}</p>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-8 md:p-12">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
            <p className="text-gray-500 mt-2">
              Fill out the form below and our team will get back to you within 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Full Name" required>
                <InputField
                  name="sender"
                  value={formData.sender}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </FormField>

              <FormField label="Email" required>
                <InputField
                  type="email"
                  name="sender_email"
                  value={formData.sender_email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField label="Subject" required>
                <InputField
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </FormField>
            </div>

            <FormField label="Message" required>
              <TextArea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows={5}
                required
              />
            </FormField>

            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactUsPage
