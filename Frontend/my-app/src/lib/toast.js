import { toast as reactToast } from 'react-toastify'

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
}

export const toast = {
  success: (message, options = {}) =>
    reactToast.success(message, { ...defaultOptions, ...options }),
  error: (message, options = {}) => reactToast.error(message, { ...defaultOptions, ...options }),
  info: (message, options = {}) => reactToast.info(message, { ...defaultOptions, ...options }),
  warning: (message, options = {}) => reactToast.warning(message, { ...defaultOptions, ...options })
}
