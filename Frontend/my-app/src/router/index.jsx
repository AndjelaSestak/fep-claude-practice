import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import DashboardPage from '../pages/DashboardPage'
import AboutPage from '../pages/AboutPage'
import ContactUsPage from '../pages/ContactUsPage'
import TeamPage from '../pages/TeamPage'
import RegistrationPage from '../pages/RegistrationPage'
import ProtectedRoute from './ProtectedRoute'

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
    }
])

export default router
