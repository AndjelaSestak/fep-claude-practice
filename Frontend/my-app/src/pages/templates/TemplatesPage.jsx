import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import { useTemplates } from '../../hooks/useTemplates'
import TemplatesHeader from './components/TemplatesHeader'
import TemplateSection from './components/TemplateSection'
import TemplatesModals from './components/TemplatesModals'

const TemplatesPage = () => {
  const {
    singleTemplates,
    recurringTemplates,
    newTemplateOpen,
    setNewTemplateOpen,
    editTarget,
    setEditTarget,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    deactivateTarget,
    setDeactivateTarget,
    confirmDeactivate,
    handleActivate,
    handleExecuteClick,
    pinDialogOpen,
    onPinClose,
    onPinConfirm,
    pinLoading,
    executeSuccessOpen,
    onExecuteSuccessClose,
    executeErrorOpen,
    onExecuteErrorClose
  } = useTemplates()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <TemplatesHeader onNewTemplate={() => setNewTemplateOpen(true)} />
            <TemplateSection
              label="Single Templates"
              templates={singleTemplates}
              isRecurring={false}
              onExecute={handleExecuteClick}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
            <TemplateSection
              label="Recurring Templates"
              templates={recurringTemplates}
              isRecurring={true}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              onActivate={handleActivate}
              onDeactivate={setDeactivateTarget}
            />
          </div>
        </main>
      </div>

      <TemplatesModals
        newTemplateOpen={newTemplateOpen}
        onNewTemplateClose={() => setNewTemplateOpen(false)}
        editTarget={editTarget}
        onEditClose={() => setEditTarget(null)}
        deleteTarget={deleteTarget}
        onDeleteCancel={() => setDeleteTarget(null)}
        onDeleteConfirm={confirmDelete}
        deactivateTarget={deactivateTarget}
        onDeactivateCancel={() => setDeactivateTarget(null)}
        onDeactivateConfirm={confirmDeactivate}
        executeSuccessOpen={executeSuccessOpen}
        onExecuteSuccessClose={onExecuteSuccessClose}
        executeErrorOpen={executeErrorOpen}
        onExecuteErrorClose={onExecuteErrorClose}
        pinDialogOpen={pinDialogOpen}
        onPinClose={onPinClose}
        onPinConfirm={onPinConfirm}
        pinLoading={pinLoading}
      />
    </div>
  )
}

export default TemplatesPage
