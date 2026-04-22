import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import { TransactionItem } from "../components/ui/TransactionItem";
import { ItemList } from "../components/ui/ItemList";
import { TransactionFilters } from "../components/ui/TransactionFilters";
import Button from "../components/ui/Button";
import { getTransactionById, getTransactionsForUser } from "../services/transactionService";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({ search: "", type: "all", direction: "all" });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // 1. DOHVATANJE PODATAKA (Search ide na backend)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const data = await getTransactionsForUser(filters.search, limit, offset);
      setTransactions(data);
    } catch (error) {
      console.error("Greška pri fetchu:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters.search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 2. LOGIKA FILTRIRANJA (Frontend: Type + Direction)
  useEffect(() => {
    let result = [...transactions];

    console.log("Trenutni filteri:", filters);
    console.log("Podaci pre filtriranja:", transactions.length);

    if (filters.type !== "all") {
      result = result.filter(t => t.type?.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.direction !== "all") {
      result = result.filter(t => t.direction?.toLowerCase() === filters.direction.toLowerCase());
    }

    setFilteredTransactions(result);
  }, [transactions, filters]); // Reaguje na svaku promenu podataka ili filtera

  const handleTransactionClick = async (id) => {
    setDetailsLoading(true);
    setIsModalOpen(true);
    try {
      const data = await getTransactionById(id);
      setSelectedTransaction(data);
    } catch (error) {
      console.error("Greška kod detalja:", error);
      setIsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
              <p className="text-gray-500">History of your payments.</p>
            </header>

            <TransactionFilters
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(1);
              }}
            />

            <ItemList title="Transaction History" description={loading ? "Loading..." : `Page ${page}`}>
              <div className="grid gap-3">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <div key={t.id} onClick={() => handleTransactionClick(t.id)} className="cursor-pointer hover:opacity-80 transition-opacity">
                      <TransactionItem transaction={t} />
                    </div>
                  ))
                ) : (
                  !loading && <p className="text-center py-10 text-gray-500">No results found for these filters.</p>
                )}
              </div>
            </ItemList>

            <div className="flex justify-center items-center gap-4 pt-4">
              <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
                Previous
              </Button>
              <span className="text-sm font-medium">Page {page}</span>
              <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={transactions.length < limit || loading}>
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL ZA DETALJE (Isti kao tvoj, samo proveri da li je tu) */}
    {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl m-4">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {detailsLoading ? (
              <p className="text-center py-10">Loading data...</p>
            ) : selectedTransaction ? (
              <div className="space-y-4">
                 <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-bold ${selectedTransaction.status === 'completed' ? 'text-green-600' : 'text-orange-500'}`}>
                    {selectedTransaction.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold">{selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Recipient:</span>
                  <span className="font-semibold">{selectedTransaction.recipient || "N/A"}</span>
                </div>
                 <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Acc. Number:</span>
                  <span className="text-sm font-mono">{selectedTransaction.recipient_account_number || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Reference:</span>
                  <span className="italic">{selectedTransaction.reference || "None"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Date:</span>
                  <span>{new Date(selectedTransaction.created_at).toLocaleString("sr-RS")}</span>
                </div>
                <Button
                     className="w-full"
                     size="lg"
                     onClick={() => setIsModalOpen(false)}
                      disabled={loading}
                     >
                     Close
                </Button>
              </div>
            ) : (
              <p className="text-red-500 text-center">Error while loading.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;