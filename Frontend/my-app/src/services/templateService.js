import api from './api'

export const createTemplate = async (data) => {
  try {
    const response = await api.post('/templates/create_template', data)
    return response.data
  } catch (error) {
    console.error('Error creating template:', error)
    throw error
  }
}

export const getTemplates = async () => {
  try {
    const response = await api.get('/templates/get_all_templates')
    return response.data
  } catch (error) {
    console.error('Error fetching templates:', error)
    throw error
  }
}

export const getTemplateById = async (templateId) => {
  try {
    const response = await api.get(`/templates/get_template_details/${templateId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching template:', error)
    throw error
  }
}

export const updateTemplate = async (templateId, data) => {
  try {
    const response = await api.patch(`/templates/update_template/${templateId}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating template:', error)
    throw error
  }
}

export const deleteTemplate = async (templateId) => {
  try {
    const response = await api.delete(`/templates/delete_template/${templateId}`)
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
