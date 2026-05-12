import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useSettings } from '../../../hooks/useSettings'
import FormWrapper from '../../../components/ui/FormWrapper'
import Button from '../../../components/ui/Button'
import AlertDialog from '../../../components/ui/AlertDialog'

const AccountManagementSection = () => {
  const { deleteAccount, isDeleteAccountPending } = useSettings()
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  return (
    <FormWrapper className="border-red-200  max-w-none">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold">Account Management</h3>
          <p className="text-sm text-gray-500">Irreversible actions</p>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="destructive"
        disabled={isDeleteAccountPending}
        onClick={() => setIsAlertDialogOpen(true)}
      >
        {isDeleteAccountPending ? 'Deleting...' : 'Delete account'}
      </Button>

      <AlertDialog
        open={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
        onConfirm={deleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        confirmLabel={isDeleteAccountPending ? 'Deleting...' : 'Delete account'}
        confirmDisabled={isDeleteAccountPending}
      />
    </FormWrapper>
  )
}

export default AccountManagementSection
