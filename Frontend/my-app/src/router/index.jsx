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
import ResetPasswordPage from '../pages/ResetPasswordPage'

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
    }
    
])

export default router
