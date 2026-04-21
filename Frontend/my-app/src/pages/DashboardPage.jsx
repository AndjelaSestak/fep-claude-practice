import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import InfoCard from "../components/ui/InfoCard";
import Select from "../components/ui/Select";
import { TransactionItem } from "../components/ui/TransactionItem";
import { ItemList } from "../components/ui/ItemList";
import { TransactionFilters } from "../components/ui/TransactionFilters";
import { getCurrencies, getExchangeRate, getWalletBalance } from "../services/walletService";

// Privremeni podaci (dok ne povežeš pravi API poziv za transakcije)
const mockTransactions = [
  {
    id: 1,
    direction: "outgoing",
    recipient: "Amazon",
    sender: null,
    type: "single",
    amount: 90,
    currency: "RSD",
    created_at: "2026-03-28T14:30:00Z",
  },
  {
    id: 2,
    direction: "incoming",
    recipient: null,
    sender: "Salary Deposit",
    type: "recurring",
    amount: 5000,
    currency: "RSD",
    created_at: "2026-03-25T09:00:00Z",
  },
];

const DashboardPage = () => {
  // State za balans i valute
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletCurrency, setWalletCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [displayBalance, setDisplayBalance] = useState(null);

  // State za transakcije (originalni i filtrirani niz)
  const [allTransactions, setAllTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);

  // --- LOGIKA ZA BALANS ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [wallet, currencyOptions] = await Promise.all([
          getWalletBalance(),
          getCurrencies()
        ]);
        setWalletBalance(wallet.balance);
        setWalletCurrency(wallet.currency);
        setSelectedCurrency(wallet.currency);
        setDisplayBalance(wallet.balance);
        setCurrencies(currencyOptions);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const convertBalance = async () => {
      if (walletBalance === null || !walletCurrency || !selectedCurrency) return;
      if (selectedCurrency === walletCurrency) {
        setDisplayBalance(walletBalance);
        return;
      }
      try {
        const rate = await getExchangeRate(walletCurrency, selectedCurrency);
        setDisplayBalance(walletBalance * rate);
      } catch (error) {
        console.error("Failed to convert balance:", error);
      }
    };
    convertBalance();
  }, [selectedCurrency, walletBalance, walletCurrency]);

  // --- LOGIKA ZA FILTRIRANJE ---
  const handleFilterChange = useCallback((activeFilters) => {
    let result = [...allTransactions];

    // 1. Search filter
    if (activeFilters.search.trim() !== "") {
      const term = activeFilters.search.toLowerCase();
      result = result.filter(t => 
        (t.recipient && t.recipient.toLowerCase().includes(term)) ||
        (t.sender && t.sender.toLowerCase().includes(term))
      );
    }

    // 2. Type filter (income/outgoing)
    if (activeFilters.type !== "all") {
      result = result.filter(t => t.direction === activeFilters.type);
    }

    // 3. Date range filter
    if (activeFilters.dateRange !== "all") {
      const now = new Date();
      result = result.filter(t => {
        const tDate = new Date(t.created_at);
        if (activeFilters.dateRange === "today") {
          return tDate.toDateString() === now.toDateString();
        }
        if (activeFilters.dateRange === "last7") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return tDate >= sevenDaysAgo;
        }
        if (activeFilters.dateRange === "last30") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return tDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    setFilteredTransactions(result);
  }, [allTransactions]);

  const formattedBalance = displayBalance !== null
    ? `${selectedCurrency} ${displayBalance.toLocaleString("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "Loading...";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header i Balans */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening with your money.</p>
              </div>
              
              <div className="w-full md:w-80">
                <InfoCard
                  title="Total Balance"
                  value={formattedBalance}
                  action={
                    <div className="w-28">
                      <Select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        options={currencies.map((c) => ({ value: c.value, label: c.value }))}
                      />
                    </div>
                  }
                />
              </div>
            </header>

            {/* Filteri i Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <TransactionFilters onFilterChange={handleFilterChange} />
            </div>

            {/* Lista transakcija */}
            <div className="space-y-4">
              <ItemList 
                title="Transactions" 
                description={`Showing ${filteredTransactions.length} results`}
                emptyMessage="No transactions found matching your filters."
              >
                <div className="grid gap-3">
                  {filteredTransactions.map((transaction) => (
                    <TransactionItem 
                      key={transaction.id} 
                      transaction={transaction} 
                    />
                  ))}
                </div>
              </ItemList>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;