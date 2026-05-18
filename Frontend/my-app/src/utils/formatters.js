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
