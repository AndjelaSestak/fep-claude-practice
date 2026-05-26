import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import { TemplatesProvider, useTemplatesContext } from '../../context/TemplatesContext'
import TemplatesHeader from './components/TemplatesHeader'
import TemplateSection from './components/TemplateSection'
import TemplatesModals from './components/TemplatesModals'

const TemplatesContent = () => {
  const {
    singleTemplates,
    recurringTemplates,
    onNewTemplate,
    onEditTemplate,
    setDeleteTarget,
    handleActivate,
    handleExecuteClick,
    setDeactivateTarget
  } = useTemplatesContext()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <TemplatesHeader onNewTemplate={onNewTemplate} />
            <TemplateSection
              label="Single Templates"
              templates={singleTemplates}
              onExecute={handleExecuteClick}
              onEdit={onEditTemplate}
              onDelete={setDeleteTarget}
            />
            <TemplateSection
              label="Recurring Templates"
              templates={recurringTemplates}
              onEdit={onEditTemplate}
              onDelete={setDeleteTarget}
              onActivate={handleActivate}
              onDeactivate={setDeactivateTarget}
            />
          </div>
        </main>
      </div>
      <TemplatesModals />
    </div>
  )
}

const TemplatesPage = () => (
  <TemplatesProvider>
    <TemplatesContent />
  </TemplatesProvider>
)

export default TemplatesPage
