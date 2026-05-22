import { z } from 'zod'

const isAtLeast18 = (dateString) => {
  const date = new Date(dateString)

  const today = new Date()
  const eighteenthBirthday = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate())

  return eighteenthBirthday <= today
}

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  city: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z
    .string()
    .nullable()
    .optional()
    .refine((date) => !date || isAtLeast18(date), {
      message: 'You must be at least 18 years old'
    })
})

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(8, 'Current password must be at least 8 characters'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_new_password: z.string().min(8, 'Confirm new password must be at least 8 characters')
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'New password and confirm new password must match',
    path: ['confirm_new_password']
  })
