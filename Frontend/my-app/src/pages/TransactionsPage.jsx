import { useState, useEffect } from "react";
import Sidebar from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import { TransactionItem } from "../components/ui/TransactionItem";
import { ItemList } from "../components/ui/ItemList";
import { TransactionFilters } from "../components/ui/TransactionFilters";
import Button from "../components/ui/Button";
import NewTransactionModal from "../components/ui/NewTransactionModal";
import { getTransactionsForUser } from "../services/transactionService";


const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  

  const [page, setPage] = useState(1);
  const limit = 10; 

  
  const [filters, setFilters] = useState({ search: "", type: "all", dateRange: "all" });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      
      const data = await getTransactionsForUser(filters.search, limit, offset);
      setTransactions(data);
    } catch (error) {
      console.error("Greška pri učitavanju transakcija:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, filters.search]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        
        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <header className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-500">View and manage your transactions</p>
              </div>
              <Button onClick={() => setNewTransactionOpen(true)}>
                + New Transaction
              </Button>
            </header>

            <NewTransactionModal
              open={newTransactionOpen}
              onClose={() => setNewTransactionOpen(false)}
              onSuccess={fetchTransactions}
            />

            {/* Reusable Filteri */}
            <TransactionFilters 
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(1); // Resetuje na prvu stranu kad se filter promeni
              }} 
            />

            {/* Lista sa transakcijama */}
            <ItemList 
              title="Transaction History" 
              description={loading ? "Loading..." : `Page ${page}`}
            >
              <div className="grid gap-3">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <TransactionItem key={t.id} transaction={t} onCancel={fetchTransactions} />
                  ))
                ) : (
                  !loading && <p className="text-center py-10 text-gray-500">No transactions found.</p>
                )}
              </div>
            </ItemList>

            {/* Paginacija Kontrole */}
            <div className="flex justify-center items-center gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              
              <span className="text-sm font-medium">Page {page}</span>
              
              <Button 
                variant="outline" 
                onClick={() => setPage(p => p + 1)}
                disabled={transactions.length < limit || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransactionsPage;