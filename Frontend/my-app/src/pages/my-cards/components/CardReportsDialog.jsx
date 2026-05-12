import Dialog, { DialogContent } from '../../../components/ui/Dialog'
import { formatReportType } from '../../../utils/formatters'

const REPORT_TYPE_STYLES = {
  manual_block: { card: 'border-red-600 bg-red-50', text: 'text-red-700' },
  admin_block: { card: 'border-slate-900 bg-slate-50', text: 'text-slate-900' },
  stolen: { card: 'border-orange-600 bg-orange-50', text: 'text-orange-700' },
  lost: { card: 'border-yellow-400 bg-yellow-50', text: 'text-yellow-700' }
}

const DEFAULT_REPORT_TYPE_STYLE = { card: 'border-gray-200 bg-white', text: 'text-gray-900' }

const getReportTypeStyle = (reportType) =>
  REPORT_TYPE_STYLES[reportType] || DEFAULT_REPORT_TYPE_STYLE

const CardReportsDialog = ({ open, onClose, reportsLoading, selectedCardReports }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <h2 className="text-lg font-semibold text-gray-900">Card reports</h2>
      <p className="text-sm text-slate-600 mt-1 mb-5">
        {reportsLoading ? 'Loading reports...' : `${selectedCardReports.length} report(s) found.`}
      </p>

      {!reportsLoading && selectedCardReports.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No reports found for this card.</p>
      ) : (
        <div className="space-y-2">
          {!reportsLoading &&
            selectedCardReports.map((report, index) => {
              const { card: cardStyle, text: textStyle } = getReportTypeStyle(report.report_type)
              return (
              <div
                key={`${report.report_type}-${report.created_at}-${index}`}
                className={`rounded-lg border p-4 ${cardStyle}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-sm font-semibold ${textStyle}`}
                  >
                    {formatReportType(report.report_type)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {report.created_at
                      ? new Date(report.created_at).toLocaleString()
                      : 'Unknown date'}
                  </span>
                </div>
              </div>
            )})}
        </div>
      )}
    </DialogContent>
  </Dialog>
)

export default CardReportsDialog
