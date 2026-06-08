import api from './api'

export const createTemplate = async (data) => {
  try {
    const response = await api.post('/templates', data)
    return response.data
  } catch (error) {
    console.error('Error creating template:', error)
    throw error
  }
}

export const getTemplates = async () => {
  try {
    const response = await api.get('/templates')
    return response.data
  } catch (error) {
    console.error('Error fetching templates:', error)
    throw error
  }
}

export const getTemplateById = async (templateId) => {
  try {
    const response = await api.get(`/templates/${templateId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching template:', error)
    throw error
  }
}

export const updateTemplate = async (templateId, data) => {
  try {
    const response = await api.put(`/templates/${templateId}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating template:', error)
    throw error
  }
}

export const deleteTemplate = async (templateId) => {
  try {
    const response = await api.delete(`/templates/${templateId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting template:', error)
    throw error
  }
}

export const executeTemplate = async (templateId, pin) => {
  try {
    const response = await api.post(`/templates/${templateId}/execute`, { pin })
    return response.data
  } catch (error) {
    console.error('Error executing template:', error)
    throw error
  }
}
