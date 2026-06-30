export const queryKeys = {
  auth: {
    me: ['auth', 'me']
  },
  cards: {
    all: ['cards'],
    detail: (cardId) => ['cards', cardId],
    reports: (cardId) => ['cards', cardId, 'reports']
  },
  currencies: {
    all: ['currencies'],
    exchangeRate: (fromCurrency, toCurrency) => [
      'currencies',
      'exchange_rate',
      fromCurrency,
      toCurrency
    ]
  },
  wallet: {
    walletBalance: ['wallet', 'balance']
  },
  templates: {
    all: ['templates'],
    detail: (templateId) => ['templates', templateId]
  },
  transactions: {
    all: ['transactions'],
    list: (filters = {}) => ['transactions', 'list', filters],
    detail: (transactionId) => ['transactions', 'detail', transactionId]
  },
  paymentAccounts: {
    all: ['paymentAccounts']
  }
}
