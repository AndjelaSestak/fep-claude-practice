import { z } from 'zod'

const newTransactionSchema = z.object({
  card_id: z.string().min(1, 'Card is required'),
  recipient: z.string().min(2, 'Recipient must be at least 2 characters'),
  recipient_account_number: z
    .string()
    .min(1, 'Recipient account number is required')
    .refine((value) => value.replace(/\D/g, '').length === 16, {
      message: 'Recipient account number must contain exactly 16 digits'
    }),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((value) => Number(value) > 0, {
      message: 'Amount must be greater than 0'
    }),
  currency: z.string().min(1, 'Currency is required')
})

export const createTransactionSchema = newTransactionSchema
