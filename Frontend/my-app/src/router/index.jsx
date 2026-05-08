import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/login/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import DashboardPage from '../pages/DashboardPage'
import ContactUsPage from '../pages/contactUs/ContactUsPage'
import AboutPage from '../pages/about/AboutPage'
import TeamPage from '../pages/TeamPage'
import RegistrationPage from '../pages/register/RegistrationPage'
import OTPVerificationPage from '../pages/OTPVerificationPage'
import ProtectedRoute from './ProtectedRoute'
import SettingsPage from '../pages/settings/SettingsPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import TransactionsPage from '../pages/TransactionsPage'
import AddCardPage from '../pages/AddCardPage'
import MyCardsPage from '../pages/my-cards/MyCardsPage'
import TemplatesPage from '../pages/TemplatesPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/forgot_password',
    element: <ForgotPasswordPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: '/contactus',
    element: <ContactUsPage />
  },
  {
    path: '/team',
    element: <TeamPage />
  },
  {
    path: '/register',
    element: <RegistrationPage />
  },
  {
    path: '/verify_email',
    element: <OTPVerificationPage />
  },
  {
    path: '/reset_password',
    element: <ResetPasswordPage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/forgot_password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/transactions',
    element: <TransactionsPage />
  },
  {
    path: '/add_card',
    element: <AddCardPage />
  },
  {
    path: '/my_cards',
    element: <MyCardsPage />
  },
  {
    path: '/templates',
    element: <TemplatesPage />
  }
])

export default router
