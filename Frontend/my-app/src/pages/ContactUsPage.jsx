import FormField from '../components/ui/FormField';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import TextArea from '../components/ui/TextArea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react'; // Možeš koristiti bilo koje ikonice
import Navbar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';

const ContactUsPage = () => {
  const contactInfo = [
    {
      icon: <Mail className="text-primary" size={24} />,
      title: "Email",
      value: "support@securebank.com",
      description: "Send us an email anytime",
      isLink: true
    },
    {
      icon: <Phone className="text-primary" size={24} />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm",
      isLink: true
    },
    {
      icon: <MapPin className="text-primary" size={24} />,
      title: "Office",
      value: "123 Financial District, New York, NY 10004",
      description: "Visit our headquarters",
      isLink: false
    },
    {
      icon: <Clock className="text-primary" size={24} />,
      title: "Business Hours",
      value: "Monday - Friday: 8am - 6pm EST",
      description: "Weekend: Closed",
      isLink: false
    }
  ];

  

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
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>
      </section>

      {/* Info Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactInfo.map((info, index) => (
          <div key={index} className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-6">
              {info.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
            <p className={`text-sm mb-1 ${info.isLink ? 'text-primary font-medium' : 'text-gray-900 font-medium'}`}>
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
          <p className="text-gray-500 mt-2">Fill out the form below and our team will get back to you within 24 hours</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name" required>
              <InputField placeholder="John" />
            </FormField>
            <FormField label="Last Name" required>
              <InputField placeholder="Doe" />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Email" required>
              <InputField type="email" placeholder="john@example.com" />
            </FormField>
            <FormField label="Phone (Optional)">
              <InputField placeholder="+1 (555) 123-4567" />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Subject" required>
              <InputField placeholder="How can we help?" />
            </FormField>
          </div>

          <FormField label="Message" required>
            <TextArea placeholder="Tell us more about your inquiry..." rows={5} />
          </FormField>

          <Button size="lg" className="w-full text-lg h-14">
            Send Message
          </Button>
        </form>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ContactUsPage;