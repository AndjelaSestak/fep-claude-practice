import { FileText, Play, Pencil, Trash2 } from "lucide-react";

const TemplateCard = ({
  title,
  provider,
  amount,
  cardType,
  cardNumber,
  onExecute,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 w-72">

      {/* Ikonica dokumenta */}
      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
        <FileText className="w-5 h-5 text-green-600" />
      </div>

      {/* Naziv i provajder */}
      <div>
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <p className="text-gray-500 text-sm">{provider}</p>
      </div>

      {/* Iznos i podaci o kartici */}
      <div>
        <p className="text-3xl font-bold text-gray-900">RSD {amount}</p>
        <p className="text-gray-400 text-sm mt-1">{cardType} •••• {cardNumber}</p>
        <p className="text-gray-400 text-sm">Card: {cardNumber}</p>
      </div>

      {/* Execute dugme */}
      <button
        onClick={onExecute}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <Play className="w-4 h-4" />
        Execute
      </button>

      {/* Edit i Delete dugmad */}
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex-1 border border-red-200 hover:bg-red-50 text-red-500 font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

    </div>
  );
};

export default TemplateCard;