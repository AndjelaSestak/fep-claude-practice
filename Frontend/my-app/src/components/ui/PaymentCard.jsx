import { useState } from 'react'
import { Lock, Unlock, AlertTriangle, Trash2, FileText, Copy, Check } from 'lucide-react'
import Button from './Button'
import { Visa as VisaLogo, Mastercard as MastercardLogo } from 'react-payment-logos/dist/flat'

const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 8) return accountNumber
  return `${accountNumber.slice(0, 4)} •••• •••• ${accountNumber.slice(-4)}`
}

// Logo rendered in original colours on a small white pill so it stays legible
// on any card background without needing CSS filter hacks.
const CardNetworkLogo = ({ cardType }) => {
  const type = cardType?.toLowerCase()
  const pill = 'bg-white rounded-md px-2 py-1 flex items-center justify-center shadow-sm'

  if (type === 'visa')
    return (
      <div className={pill}>
        <VisaLogo style={{ width: 38, height: 'auto' }} />
      </div>
    )
  if (type === 'mastercard')
    return (
      <div className={pill}>
        <MastercardLogo style={{ width: 34, height: 'auto' }} />
      </div>
    )

  return (
    <div className={pill}>
      <span className="text-slate-700 text-[10px] font-bold tracking-widest uppercase px-1">
        {cardType}
      </span>
    </div>
  )
}

// Gold EMV chip with contact line etching
const EmvChip = () => (
  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-md relative overflow-hidden flex-shrink-0">
    <div className="absolute top-[28%] inset-x-0 h-px bg-amber-700/30" />
    <div className="absolute top-[60%] inset-x-0 h-px bg-amber-700/30" />
    <div className="absolute left-[28%] inset-y-0 w-px bg-amber-700/30" />
    <div className="absolute left-[68%] inset-y-0 w-px bg-amber-700/30" />
    <div className="absolute inset-[18%] rounded-sm bg-amber-200/40" />
  </div>
)

const PaymentCard = ({
  cardNumber,
  accountNumber,
  cardType,
  status = 'verified',
  onBlock,
  onUnblock,
  onReportStolen,
  onReportLost,
  onRemove,
  onViewReports
}) => {
  const [copied, setCopied] = useState(false)

  const isBlocked =
    status === 'blocked' || status === 'reported_lost' || status === 'reported_stolen'

  const handleCopy = () => {
    if (!accountNumber) return
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    // Outer white card — matches the app's existing card style (bg-white, rounded-2xl, shadow-sm)
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-80">
      {/* ── CARD VISUAL ─────────────────────────────────────────────────────── */}
      <div
        className={`
          relative aspect-[1.586/1] rounded-none overflow-hidden cursor-default select-none
          bg-gradient-to-br from-green-500 via-green-600 to-emerald-800
          transition-all duration-500
          ${isBlocked ? 'grayscale opacity-60' : ''}
        `}
      >
        {/* Soft light blob top-right for depth */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        {/* Darker blob bottom-left for contrast */}
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-900/30 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Top shimmer line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between p-5">
          {/* TOP ROW: chip + logo */}
          <div className="flex items-center justify-between">
            <EmvChip />
            <CardNetworkLogo cardType={cardType} />
          </div>

          {/* CARD NUMBER */}
          <p
            className="text-white/90 text-sm tracking-[0.15em] drop-shadow-sm whitespace-nowrap"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            •••• &nbsp;•••• &nbsp;•••• &nbsp;{cardNumber}
          </p>

          {/* BOTTOM ROW: account number pill + status badge */}
          <div className="flex items-end justify-between gap-2">
            {accountNumber ? (
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 min-w-0">
                <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
                  ACC
                </span>
                <span
                  className="text-white/85 text-[11px] truncate"
                  style={{ fontFamily: "'Courier New', Courier, monospace" }}
                >
                  {maskAccountNumber(accountNumber)}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label="Copy account number"
                  className="text-white/50 hover:text-white flex-shrink-0 transition-colors ml-0.5"
                >
                  {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ) : (
              <span />
            )}

            {/* Status badge */}
            <div
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-[11px] font-semibold backdrop-blur-sm border
                ${
                  isBlocked
                    ? 'bg-red-500/25 border-red-300/30 text-red-100'
                    : 'bg-white/20 border-white/30 text-white'
                }
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-red-300' : 'bg-white animate-pulse'}`}
              />
              {isBlocked ? 'Blocked' : 'Active'}
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION BUTTONS ──────────────────────────────────────────────────── */}
      {/* Inside the same white card — separated by the card visual above */}
      <div className="p-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={isBlocked ? onUnblock : onBlock}
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
              onClick={onReportLost}
              className="flex items-center justify-center gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Report Lost
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onReportStolen}
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
          onClick={onViewReports}
          className="w-full flex items-center justify-center gap-2"
        >
          <FileText className="w-3.5 h-3.5" />
          View History
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="w-full flex items-center justify-center gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove Card
        </Button>
      </div>
    </div>
  )
}

export default PaymentCard
