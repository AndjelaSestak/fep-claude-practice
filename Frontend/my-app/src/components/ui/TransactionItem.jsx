import { cn } from "../../utils/cn";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";


/*
const transactions = [
  {
    id: 1,
    direction: "outgoing",
    recipient: "Amazon",
    sender: null,
    type: "single",
    amount: 90,
    currency: "RSD",
    created_at: "2026-03-28T00:00:00Z",
  },
  {
    id: 2,
    direction: "incoming",
    recipient: null,
    sender: "Salary Deposit",
    type: "single",
    amount: 5000,
    currency: "RSD",
    created_at: "2026-03-25T00:00:00Z",
  },
];
*\ */


export function TransactionItem({ transaction, className }) {
  const isIncoming = transaction.direction === "incoming";

  const displayName = isIncoming
    ? transaction.sender || "Unknown sender"
    : transaction.recipient || "Unknown recipient";

  const displayType =
    transaction.type === "reccuring" ? "Recurring" : "Single";

  const formattedDate = new Date(transaction.created_at).toLocaleDateString(
    "sr-RS"
  );

  const formattedAmount = `${isIncoming ? "+" : "-"}${transaction.currency} ${Number(
    transaction.amount
  ).toLocaleString("sr-RS", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border border-gray-200 bg-surface px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            isIncoming
              ? "bg-green-100 text-primary-dark"
              : "bg-red-100 text-red-500"
          )}
        >
          {isIncoming ? (
            <ArrowDownLeft className="h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </div>

        <div>
          <p className="text-base font-medium text-gray-900">{displayName}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={cn(
            "text-base font-medium",
            isIncoming ? "text-primary" : "text-gray-900"
          )}
        >
          {formattedAmount}
        </p>
        <p className="text-sm text-gray-500">{displayType}</p>
      </div>
    </div>
  );
}
