import { useState, useEffect } from "react";
import Sidebar from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import TemplateCard from "../components/ui/TemplateCard";
import Button from "../components/ui/Button";
import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/AlertDialog";
import NewTemplateModal from "../components/ui/NewTemplateModal";
import PinModal from "../components/ui/PinModal";
import { getTemplates, deleteTemplate, executeTemplate } from "../services/templateService";
import { activateRecurringTransaction, deactivateRecurringTransaction } from "../services/recurringTransactionService";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [executeSuccessOpen, setExecuteSuccessOpen] = useState(false);
  const [executeErrorOpen, setExecuteErrorOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinTarget, setPinTarget] = useState(null);
  const [executeLoading, setExecuteLoading] = useState(false);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch {
      // TODO: error handling
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleExecuteClick = (templateId) => {
    setPinTarget(templateId);
    setPinDialogOpen(true);
  };

  const handlePinConfirm = async (pin) => {
    setExecuteLoading(true);
    try {
      await executeTemplate(pinTarget, pin);
      setPinDialogOpen(false);
      setExecuteSuccessOpen(true);
    } finally {
      setExecuteLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTemplate(deleteTarget.id);
      setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } catch {
      // TODO: error handling
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeactivate = async () => {
    try {
      
      const recurringId = deactivateTarget.recurring_transactions?.[0]?.id;
      if (recurringId) {
        await deactivateRecurringTransaction(recurringId);
        await fetchTemplates(); 
      }
    } catch (err) {
      console.error("Failed to deactivate", err);
    } finally {
      setDeactivateTarget(null);
    }
  };

  const handleActivate = async (template) => {
    try {
      const recurringId = template.recurring_transactions?.[0]?.id;
      if (recurringId) {
        await activateRecurringTransaction(recurringId);
        await fetchTemplates();
      }
    } catch (err) {
      console.error("Failed to activate", err);
    }
  };

  const singleTemplates = templates.filter((t) => t.type === "single");
  const recurringTemplates = templates.filter((t) => t.type === "recurring");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">

            <header className="relative bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
              <div className="absolute -left-4 -top-4 w-32 h-32 bg-primary/15 rounded-full blur-3xl"></div>
              <div className="absolute right-10 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">Save & Reuse</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">
                  Transaction Templates
                </h1>
                <p className="text-gray-700 font-semibold opacity-80">
                  Save and reuse transaction details.
                </p>
              </div>

              <div className="relative z-10">
                <Button
                  onClick={() => setNewTemplateOpen(true)}
                  className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6 rounded-2xl font-bold"
                >
                  + New Template
                </Button>
              </div>
            </header>

            {/* Single Templates */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Single</h2>
              {singleTemplates.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {singleTemplates.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.name}
                      provider={t.recipient}
                      amount={t.amount}
                      currency={t.currency}
                      cardType={t.card?.card_type?.name}
                      cardNumber={t.card?.card_number_masked}
                      isRecurring={false}
                      onExecute={() => handleExecuteClick(t.id)}
                      onEdit={() => setEditTarget(t)}
                      onDelete={() => setDeleteTarget(t)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No single templates yet.</p>
              )}
            </section>

            {/* Recurring Templates */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Recurring</h2>
              {recurringTemplates.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {recurringTemplates.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.name}
                      provider={t.recipient}
                      amount={t.amount}
                      currency={t.currency}
                      cardType={t.card?.card_type?.name}
                      cardNumber={t.card?.card_number_masked}
                      isRecurring={true}
                      isActive={t.recurring_transactions?.[0]?.is_active}
                      frequency={t.recurring_transactions?.[0]?.frequency}
                      onEdit={() => setEditTarget(t)}
                      onDelete={() => setDeleteTarget(t)}
                      onDeactivate={() => setDeactivateTarget(t)}
                      onActivate={() => handleActivate(t)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No recurring templates yet.</p>
              )}
            </section>

          </div>
        </main>
      </div>

      <NewTemplateModal
        open={newTemplateOpen}
        onClose={() => setNewTemplateOpen(false)}
        onSuccess={fetchTemplates}
      />

      <NewTemplateModal
        open={!!editTarget}
        template={editTarget}
        onClose={() => setEditTarget(null)}
        onSuccess={() => { setEditTarget(null); fetchTemplates(); }}
      />

      <AlertDialog open={executeSuccessOpen} onClose={() => setExecuteSuccessOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Transaction submitted</AlertDialogTitle>
          <AlertDialogDescription>
            Your transaction has been submitted and is being processed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setExecuteSuccessOpen(false)}>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      <PinModal
        open={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        onConfirm={handlePinConfirm}
        loading={executeLoading}
      />

      <AlertDialog open={executeErrorOpen} onClose={() => setExecuteErrorOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Execution failed</AlertDialogTitle>
          <AlertDialogDescription>Failed to execute template.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setExecuteErrorOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>

      <AlertDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete template?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>


      <AlertDialog open={!!deactivateTarget} onClose={() => setDeactivateTarget(null)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate Subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to stop future payments for "{deactivateTarget?.name}"? 
            This will not delete the template, but payments will no longer trigger automatically.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeactivateTarget(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} className="bg-orange-600 hover:bg-orange-700">
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
};

export default TemplatesPage;
