import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import CardsList from './components/CardsList'
import CardsModals from './components/CardsModals'
import { CardsProvider, useCardsContext } from '../../context/CardsContext'

const MyCardsContent = () => {
  const navigate = useNavigate()
  const {
    cards,
    loading,
    handleBlock,
    handleUnblock,
    handleReportLost,
    handleReportStolen,
    handleRemove,
    handleViewReports
  } = useCardsContext()

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="flex-1 overflow-y-auto p-8">
          <PageHeader
            label="My Cards"
            title="Payment Cards"
            subtitle="Manage your payment cards and settings."
          >
            <Button
              onClick={() => navigate('/add_card')}
              className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6 rounded-2xl font-bold"
            >
              + New Card
            </Button>
          </PageHeader>

          <CardsList
            cards={cards}
            loading={loading}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
            onReportStolen={handleReportStolen}
            onReportLost={handleReportLost}
            onRemove={handleRemove}
            onViewReports={handleViewReports}
          />
        </main>
      </div>

      <CardsModals />
    </div>
  )
}

const MyCardsPage = () => (
  <CardsProvider>
    <MyCardsContent />
  </CardsProvider>
)

export default MyCardsPage
