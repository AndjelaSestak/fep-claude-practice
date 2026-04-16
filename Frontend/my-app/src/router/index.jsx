import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import DashboardPage from '../pages/DashboardPage'
import AboutPage from '../pages/AboutPage'
import ContactUsPage from '../pages/ContactUsPage'
import TeamPage from '../pages/TeamPage'
import RegistrationPage from '../pages/RegistrationPage'
import SettingsPage from '../pages/SettingsPage'

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
        element: <DashboardPage />,
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
        path: '/settings',
        element: <SettingsPage />,
    }
    
])

export default router
