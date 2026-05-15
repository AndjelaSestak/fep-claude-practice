import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import DashboardHeader from './components/DashboardHeader'
import DashboardTransactions from './components/DashboardTransactions'

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            <DashboardHeader />
            <DashboardTransactions />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
