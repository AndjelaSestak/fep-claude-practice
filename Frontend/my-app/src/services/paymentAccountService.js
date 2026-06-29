// TODO: replace mock with api.get('/payment-accounts') when backend endpoint exists
const MOCK_ACCOUNTS = [
  { id: '1', currency: 'USD', balance: 1250.5, account_number: '1234567890123456' },
  { id: '2', currency: 'EUR', balance: 830.0, account_number: '9876543210987654' },
  { id: '3', currency: 'GBP', balance: 420.75, account_number: '1111222233334444' },
  { id: '4', currency: 'CHF', balance: 2100.0, account_number: '5555666677778888' },
  { id: '5', currency: 'JPY', balance: 95000.0, account_number: '9999000011112222' },
  { id: '6', currency: 'CAD', balance: 640.2, account_number: '3333444455556666' }
]

export const getPaymentAccounts = async () => {
  // When backend is ready, replace with:
  // const response = await api.get('/payment-accounts')
  // return response.data
  return MOCK_ACCOUNTS
}
