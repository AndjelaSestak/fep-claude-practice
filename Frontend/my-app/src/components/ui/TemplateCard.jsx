import { FileText, Play, Pencil, Trash2, RefreshCw } from "lucide-react";
import Button from "./Button";

const TemplateCard = ({
  title,
  provider,
  amount,
  currency = "RSD",
  cardType,
  cardNumber,
  isRecurring = false,
  frequency,
  onExecute,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">

      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-green-600" />
        </div>
        {isRecurring && (
          <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <RefreshCw className="w-3 h-3" />
            {frequency ? frequency.charAt(0).toUpperCase() + frequency.slice(1) : "Recurring"}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <p className="text-gray-500 text-sm">{provider}</p>
      </div>

      <div>
        <p className="text-3xl font-bold text-gray-900">{currency} {amount}</p>
        <p className="text-gray-400 text-sm mt-1">{cardType} {cardNumber}</p>
      </div>

      {!isRecurring && (
        <Button onClick={onExecute} className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Execute
        </Button>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onEdit} className="flex-1">
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete} className="flex-1">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

    </div>
  );
};

export default TemplateCard;
