import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import DashboardPage from '../pages/DashboardPage'
import AboutPage from '../pages/AboutPage'
import ContactUsPage from '../pages/ContactUsPage'
import TeamPage from '../pages/TeamPage'
import RegistrationPage from '../pages/RegistrationPage'
import OTPVerificationPage from '../pages/OTPVerificationPage'
import ProtectedRoute from './ProtectedRoute'
import SettingsPage from '../pages/SettingsPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import AddCardPage from '../pages/AddCardPage'
import MyCardsPage from '../pages/MyCardsPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/about',
        element: <AboutPage />,
    },
    {
        path: '/contactus',
        element: <ContactUsPage />,
    },
    {
        path: '/team',
        element: <TeamPage />,
    },
    {
        path: '/register',
        element: <RegistrationPage />,
    },
    {
        path: '/verify-email',
        element: <OTPVerificationPage />,
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
    },
    {
        path: '/settings',
        element: <SettingsPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    },
    {
        path: '/add-card',
        element: <AddCardPage />,
    },
    {
        path: '/my-cards',
        element: <MyCardsPage />,
    }
    
])

export default router
