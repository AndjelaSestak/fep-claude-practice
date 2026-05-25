import { createContext, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTemplateForm } from '../hooks/useTemplateForm'

const NewTemplateContext = createContext(null)

export const NewTemplateProvider = ({ children }) => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const template = state?.template ?? null

  const value = useTemplateForm({
    onClose: () => navigate('/templates'),
    onSuccess: () => {
      toast.success(template ? 'Template updated.' : 'Template created.')
      navigate('/templates')
    },
    template
  })

  return <NewTemplateContext.Provider value={value}>{children}</NewTemplateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNewTemplateContext = () => {
  const ctx = useContext(NewTemplateContext)
  if (!ctx) throw new Error('useNewTemplateContext must be used within a NewTemplateProvider')
  return ctx
}
