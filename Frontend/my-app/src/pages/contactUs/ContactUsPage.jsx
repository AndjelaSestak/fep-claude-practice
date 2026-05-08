import React from 'react'
import Navbar from '../../components/layout/NavBar'
import Footer from '../../components/layout/Footer'
import ContactInfoCards from '../contactUs/components/ContactInfoCards'
import ContactForm from '../contactUs/components/ContactUsForm'

const ContactUsPage = () => {
  return (
    <div>
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

        <ContactInfoCards />
        <ContactForm />

      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;