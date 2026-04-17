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
        path: '/settings',
        element: <SettingsPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    }
    
])

export default router
