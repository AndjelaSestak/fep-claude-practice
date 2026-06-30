export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 8) return accountNumber
  return `${accountNumber.slice(0, 4)} •••• •••• ${accountNumber.slice(-4)}`
}

export const getLastFourDigits = (cardNumberMasked) => cardNumberMasked?.slice(-4)

export const formatReportType = (reportType) => {
  if (!reportType) return 'Unknown'
  return reportType
    .replaceAll('_', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const ACCOUNT_NUMBER_LENGTH = 16

export const getAccountNumberDigits = (value) =>
  value.replace(/\D/g, '').slice(0, ACCOUNT_NUMBER_LENGTH)

export const formatAccountNumber = (value) =>
  getAccountNumberDigits(value)
    .replace(/(.{4})/g, '$1 ')
    .trim()

export const formatBalance = (balance) =>
  new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(balance)

export const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('sr-RS')
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('sr-RS')
}
