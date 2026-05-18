import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { sendContactMessage } from '../services/visitorService'

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    sender: '',
    sender_email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const sendMutation = useMutation({
    mutationFn: () =>
      sendContactMessage(
        formData.sender,
        formData.subject,
        formData.sender_email,
        formData.message
      ),
    onSuccess: () => {
      toast.success('Your message has been sent successfully!')
      setFormData({ sender: '', sender_email: '', subject: '', message: '' })
    },
    onError: (err) => {
      const detail = err.response?.data?.detail
      let textToShow = 'Sending message failed. Please try again.'
      if (Array.isArray(detail)) {
        textToShow = detail.map((e) => `Field ${e.loc[e.loc.length - 1]}: ${e.msg}`).join(', ')
      } else if (typeof detail === 'string') {
        textToShow = detail
      }
      toast.error(textToShow)
    }
  })

  return {
    formData,
    loading: sendMutation.isPending,
    handleChange,
    handleSubmit: (e) => {
      e.preventDefault()
      sendMutation.mutate()
    }
  }
}
