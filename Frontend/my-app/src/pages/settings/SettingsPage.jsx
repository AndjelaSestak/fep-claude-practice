import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import SettingsHeader from './components/SettingsHeader'
import ProfileInformationForm from './components/ProfileInformationForm'
import PasswordManagementForm from './components/PasswordManagementForm'
import AccountManagementSection from './components/AccountManagementSection'

const SettingsPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        <NavBarAfterLogin />

        <div className="flex-1 bg-slate-50 flex flex-col px-8 pt-12 gap-8">
          <SettingsHeader />

          <ProfileInformationForm />

          <PasswordManagementForm />

          <AccountManagementSection />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
