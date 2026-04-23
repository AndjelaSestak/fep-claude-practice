import { CreditCard, Lock, AlertTriangle, Trash2, FileText } from "lucide-react";
import Button from "./Button";

const PaymentCard = ({
  cardNumber,
  cardType,
  status = "verified",
  onBlock,
  onUnblock,
  onReportStolen,
  onReportLost,
  onRemove,
  onViewReports,
}) => {
  const isBlocked =
    status === "blocked" ||
    status === "reported_lost" ||
    status === "reported_stolen";


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-80">

      {/* Colored top border - zelena verified, zuta blocked */}
      <div className={`h-1.5 w-full ${isBlocked ? "bg-yellow-400" : "bg-primary"}`} />

      <div className="p-6 flex flex-col gap-6">

        {/* Ikonica i status badge */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-blue-500" />
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
            isBlocked
              ? "text-yellow-600 border-yellow-300 bg-yellow-50"
              : "text-primary border-primary bg-primary-light"
          }`}>
            {isBlocked ? "Blocked" : "Verified"}
          </span>
        </div>

        {/* Broj kartice i tip */}
        <div>
          <p className="text-2xl font-bold text-gray-900 tracking-widest">
            •••• •••• •••• {cardNumber}
          </p>
          <p className="text-gray-400 text-sm mt-1">{cardType}</p>
        </div>

        {/* Dugmad */}
        <div className="flex flex-col gap-3">

          {/* Block/Unblock dugme */}
          <Button variant="outline" onClick={isBlocked ? onUnblock : onBlock} className="w-full">
            <Lock className="w-4 h-4 mr-2" />
            {isBlocked ? "Unblock Card" : "Block Card"}
          </Button>

          {/* Report dugmad - samo ako nije blokirana */}
          {!isBlocked && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onReportStolen} className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Stolen
              </Button>
              <Button variant="outline" onClick={onReportLost} className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Lost
              </Button>
            </div>
          )}

          {/* Remove Card */}
          <Button
            variant="destructive"
            onClick={onRemove}
            className="w-full gap-2 text-slate-600 hover:text-primary"
          >
            <Trash2 className="w-4 h-4" />
            Remove Card
          </Button>

          <Button
            variant="default"
            onClick={onViewReports}
            className="w-full gap-2 text-slate-600 hover:text-primary"
          >
            <FileText className="w-4 h-4" />
            View Card reports
          </Button>

        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
