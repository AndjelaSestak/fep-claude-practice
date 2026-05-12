export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  const messages = error.response?.data?.messages
  const detail = error.response?.data?.detail

  if (Array.isArray(messages) && messages.length > 0) {
    return messages.join(', ')
  }

  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    const detailMessages = detail.map((item) => item?.msg).filter(Boolean)

    if (detailMessages.length > 0) {
      return detailMessages.join(', ')
    }
  }

  return error.message || fallback
}
