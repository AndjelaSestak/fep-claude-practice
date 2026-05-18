import Button from '../../../components/ui/Button'

const MonthlyExportActions = ({ onExport }) => {
  return (
    <div>
      <div className="flex justify-end w-full">
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-[0.12em]">
          Download monthly export
        </p>
      </div>

      <div className="flex justify-end w-full">
        <div className="flex bg-primary/20 p-1 rounded-2xl backdrop-blur-sm border border-white/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport('csv')}
            className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
          >
            📊 CSV
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExport('pdf')}
            className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
          >
            📄 PDF
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MonthlyExportActions
