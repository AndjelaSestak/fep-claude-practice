import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import { TransactionItem } from "../components/ui/TransactionItem";
import { ItemList } from "../components/ui/ItemList";
import { TransactionFilters } from "../components/ui/TransactionFilters";
import Button from "../components/ui/Button";
import { getTransactionById, getTransactionsForUser } from "../services/transactionService";
import NewTransactionModal from "../components/ui/NewTransactionModal";
import { exportTransactions } from "../services/generateReportService";
import { triggerDownload } from "../utils/reportHelper";


const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  

  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({ search: "", type: "all", direction: "all" });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const handleExport = async (format) => {
    try {
        
        const blobData = await exportTransactions(
            format, 
            filters.search, 
            filters.type, 
            filters.direction
        );
        
      
        triggerDownload(blobData, `izvestaj.${format}`);
    } catch (error) {
        console.error("Desila se greška pri preuzimanju:", error);
        // Ovde možeš staviti neki toast.error("Preuzimanje nije uspelo")
    }
};

  // 1. DOHVATANJE PODATAKA (Search ide na backend)
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const data = await getTransactionsForUser(
        filters.search,
        limit,
        offset,
        filters.type,
        filters.direction
      );
      setTransactions(data);
    } catch (error) {
      console.error("Greška pri fetchu:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters.search, filters.type, filters.direction]);

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
            
            <header className="relative bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
    
                <div className="absolute -left-4 -top-4 w-32 h-32 bg-primary/15 rounded-full blur-3xl"></div>
                <div className="absolute right-10 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                    <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">Management</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">
                    Transactions
                    </h1>
                    <p className="text-gray-700 font-semibold opacity-80">
                    View and manage your financial history.
                    </p>
                </div>

                {/* GRUPA DUGMIĆA - Sređena sa stilom */}
                <div className="relative z-10 flex flex-wrap gap-3">
                    <div className="flex bg-white/40 p-1 rounded-2xl backdrop-blur-sm border border-white/50">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleExport('csv')}
                        className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
                    >
                        📊 CSV
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleExport('pdf')}
                        className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
                    >
                        📄 PDF
                    </Button>
                    </div>
                    
                    <Button
                      onClick={() => setNewTransactionOpen(true)}
                      className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6 rounded-2xl font-bold"
                    >
                      + New Transaction
                    </Button>
                </div>
                </header>

            <NewTransactionModal
              open={newTransactionOpen}
              onClose={() => setNewTransactionOpen(false)}
              onSuccess={fetchTransactions}
            />

            {/* Reusable Filteri */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <TransactionFilters 
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(1);
              }}
            />
            </div>
    
            <ItemList title="Transaction History" description={loading ? "Loading..." : `Page ${page}`}>
              <div className="grid gap-3">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <div key={t.id} onClick={() => handleTransactionClick(t.id)} className="cursor-pointer hover:opacity-80 transition-opacity">
                      <TransactionItem transaction={t} onCancel={fetchTransactions} />
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