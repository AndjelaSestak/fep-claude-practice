import React from 'react'
import Navbar from '../../components/layout/NavBar'
import Footer from '../../components/layout/Footer'
import ContactInfoCards from '../contactUs/components/ContactInfoCards'
import ContactForm from '../contactUs/components/ContactUsForm'
import ContactUsHero from '../contactUs/components/ContactUsHero'

const ContactUsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        
        <ContactUsHero />
        <ContactInfoCards />
        <ContactForm />

      </div>
      <Footer />
    </div>
  )
}

export default ContactUsPage