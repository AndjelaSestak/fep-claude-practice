export const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

export const EMPTY_FORM_TEMPLATES = {
  name: '',
  type: 'single',
  recipient: '',
  recipient_account_number: '',
  amount: '',
  currency: '',
  card_id: '',
  reference: '',
  frequency: 'monthly',
  start_date: '',
  end_date: ''
}

export const EMPTY_FORM_TRANSACTION = {
  card_id: '',
  amount: '',
  currency: '',
  recipient: '',
  recipient_account_number: '',
  reference: ''
}

export const ACTION_CONFIG_CARDS = {
  block: {
    title: 'Block card',
    description:
      'Are you sure you want to block this card? You will not be able to use it until you unblock it.',
    confirmLabel: 'Block'
  },
  unblock: {
    title: 'Unblock card',
    description: 'Are you sure you want to unblock this card?',
    confirmLabel: 'Unblock'
  },
  reportLost: {
    title: 'Report as lost',
    description: 'Are you sure you want to report this card as lost?',
    confirmLabel: 'Report Lost'
  },
  reportStolen: {
    title: 'Report as stolen',
    description: 'Are you sure you want to report this card as stolen?',
    confirmLabel: 'Report Stolen'
  }
}
