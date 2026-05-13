import React from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

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

const ContactInfoCards = () => {
  return (
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
  )
}

export default ContactInfoCards
