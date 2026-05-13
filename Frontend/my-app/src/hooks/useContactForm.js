import { useState } from 'react'
import { toast } from 'react-toastify'
import { sendContactMessage } from '../services/visitorService'

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    sender: '',
    sender_email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

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
      await sendContactMessage(
        formData.sender,
        formData.subject,
        formData.sender_email,
        formData.message
      )

     
      toast.success('Your message has been sent successfully!')

      setFormData({
        sender: '',
        subject: '',
        sender_email: '',
        message: ''
      })
    } catch (err) {
      const detail = err.response?.data?.detail
      let textToShow = 'Slanje poruke nije uspelo. Pokušajte ponovo.'

      if (Array.isArray(detail)) {
        textToShow = detail.map((e) => `Polje ${e.loc[e.loc.length - 1]}: ${e.msg}`).join(', ')
      } else if (typeof detail === 'string') {
        textToShow = detail
      }

     
      toast.error(textToShow)
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    loading,
    handleChange,
    handleSubmit
  }
}
