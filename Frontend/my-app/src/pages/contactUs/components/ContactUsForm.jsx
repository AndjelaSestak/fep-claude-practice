import React from 'react';
import FormField from '../../../components/ui/FormField'
import InputField from '../../../components/ui/InputField'
import TextArea from '../../../components/ui/TextArea'
import Button from '../../../components/ui/Button'
import { useContactForm } from '../../../hooks/useContactForm'

const ContactUsForm = () => {

  const { formData, loading, handleChange, handleSubmit } = useContactForm();

  return (
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
            <InputField name="sender" value={formData.sender} onChange={handleChange} placeholder="John Doe" required />
          </FormField>

          <FormField label="Email" required>
            <InputField type="email" name="sender_email" value={formData.sender_email} onChange={handleChange} placeholder="john@example.com" required />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormField label="Subject" required>
            <InputField name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required />
          </FormField>
        </div>

        <FormField label="Message" required>
          <TextArea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your inquiry..." rows={5} required />
        </FormField>

        <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};

export default ContactUsForm;