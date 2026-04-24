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
import { getTemplates, deleteTemplate, executeTemplate } from "../services/templateService";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newTemplateOpen, setNewTemplateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [executeSuccessOpen, setExecuteSuccessOpen] = useState(false);
  const [executeErrorOpen, setExecuteErrorOpen] = useState(false);
  const [executeErrorMessage, setExecuteErrorMessage] = useState('');

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

  const handleExecute = async (templateId) => {
    try {
      await executeTemplate(templateId);
      setExecuteSuccessOpen(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setExecuteErrorMessage(typeof detail === 'string' ? detail : 'Failed to execute template.');
      setExecuteErrorOpen(true);
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

  const singleTemplates = templates.filter((t) => t.type === "single");
  const recurringTemplates = templates.filter((t) => t.type === "recurring");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-10">

            <header className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Transaction Templates</h1>
                <p className="text-gray-500">Save and reuse transaction details</p>
              </div>
              <Button onClick={() => setNewTemplateOpen(true)}>
                + New Template
              </Button>
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
                      onExecute={() => handleExecute(t.id)}
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
                      frequency={t.recurring_transactions?.[0]?.frequency}
                      onEdit={() => setEditTarget(t)}
                      onDelete={() => setDeleteTarget(t)}
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

      <AlertDialog open={executeErrorOpen} onClose={() => setExecuteErrorOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Execution failed</AlertDialogTitle>
          <AlertDialogDescription>{executeErrorMessage}</AlertDialogDescription>
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
    </div>
  );
};

export default TemplatesPage;
