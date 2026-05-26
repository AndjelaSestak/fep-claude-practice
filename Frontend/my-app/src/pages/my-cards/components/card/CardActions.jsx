import { Lock, Unlock, AlertTriangle, Trash2, FileText } from 'lucide-react'
import Button from '../../../../components/ui/Button'
import { useCardsContext } from '../../../../context/CardsContext'

const CardActions = ({ cardId, isBlocked, lastFourDigits }) => {
  const {
    handleBlock,
    handleUnblock,
    handleReportLost,
    handleReportStolen,
    handleViewReports,
    handleRemove,
    coolingDownCardId
  } = useCardsContext()

  return (
    <div className="p-4 flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={coolingDownCardId === cardId}
        onClick={() => (isBlocked ? handleUnblock(cardId) : handleBlock(cardId))}
        className="w-full flex items-center justify-center gap-2"
      >
        {isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        {isBlocked ? 'Unblock Card' : 'Block Card'}
      </Button>

      {!isBlocked && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReportLost(cardId)}
            className="flex items-center justify-center gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Lost
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReportStolen(cardId)}
            className="flex items-center justify-center gap-1.5 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Stolen
          </Button>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewReports(cardId)}
        className="w-full flex items-center justify-center gap-2"
      >
        <FileText className="w-3.5 h-3.5" />
        View History
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleRemove(cardId, lastFourDigits)}
        className="w-full flex items-center justify-center gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Remove Card
      </Button>
    </div>
  )
}

export default CardActions
