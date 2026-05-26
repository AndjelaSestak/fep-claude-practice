import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queryKeys } from '../lib/queryKeys'
import { getTemplates, deleteTemplate, executeTemplate } from '../services/templateService'
import {
  activateRecurringTransaction,
  deactivateRecurringTransaction
} from '../services/recurringTransactionService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

export const useTemplates = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deactivateTarget, setDeactivateTarget] = useState(null)

  const invalidateTemplates = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.templates.all, exact: true })

  const { data: templates = [], isLoading } = useQuery({
    queryKey: queryKeys.templates.all,
    queryFn: getTemplates,
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to load templates.'))
  })

  const deleteMutation = useMutation({
    mutationFn: (templateId) => deleteTemplate(templateId),
    onSuccess: () => {
      invalidateTemplates()
      toast.success('Template deleted.')
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to delete template.'))
  })

  const activateMutation = useMutation({
    mutationFn: (recurringId) => activateRecurringTransaction(recurringId),
    onSuccess: () => {
      invalidateTemplates()
      toast.success('Subscription activated.')
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to activate subscription.'))
  })

  const deactivateMutation = useMutation({
    mutationFn: (recurringId) => deactivateRecurringTransaction(recurringId),
    onSuccess: () => {
      invalidateTemplates()
      toast.success('Subscription deactivated.')
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to deactivate subscription.'))
  })

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) })
  }

  const confirmDeactivate = () => {
    if (!deactivateTarget) return
    const recurringId = deactivateTarget.recurring_transactions?.[0]?.id
    if (recurringId) {
      deactivateMutation.mutate(recurringId, { onSettled: () => setDeactivateTarget(null) })
    }
  }

  const handleActivate = (template) => {
    const recurringId = template.recurring_transactions?.[0]?.id
    if (recurringId) activateMutation.mutate(recurringId)
  }

  const [pinDialogOpen, setPinDialogOpen] = useState(false)
  const [pinTarget, setPinTarget] = useState(null)
  const [executeSuccessOpen, setExecuteSuccessOpen] = useState(false)
  const [executeErrorOpen, setExecuteErrorOpen] = useState(false)

  const executeMutation = useMutation({
    mutationFn: ({ templateId, pin }) => executeTemplate(templateId, pin),
    onSuccess: () => {
      setPinDialogOpen(false)
      setExecuteSuccessOpen(true)
      toast.success('Template executed successfully.')
    },
    onError: (err) => {
      setPinDialogOpen(false)
      setExecuteErrorOpen(true)
      toast.error(getApiErrorMessage(err, 'Failed to execute template.'))
    }
  })

  const handleExecuteClick = (templateId) => {
    setPinTarget(templateId)
    setPinDialogOpen(true)
  }

  const singleTemplates = templates.filter((t) => t.type === 'single')
  const recurringTemplates = templates.filter((t) => t.type === 'recurring')

  return {
    singleTemplates,
    recurringTemplates,
    isLoading,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    deactivateTarget,
    setDeactivateTarget,
    confirmDeactivate,
    handleActivate,
    handleExecuteClick,
    onNewTemplate: () => navigate('/new-template'),
    onEditTemplate: (template) => navigate('/new-template', { state: { template } }),
    pinDialogOpen,
    onPinClose: () => setPinDialogOpen(false),
    onPinConfirm: (pin) => executeMutation.mutate({ templateId: pinTarget, pin }),
    pinLoading: executeMutation.isPending,
    executeSuccessOpen,
    onExecuteSuccessClose: () => setExecuteSuccessOpen(false),
    executeErrorOpen,
    onExecuteErrorClose: () => setExecuteErrorOpen(false)
  }
}
