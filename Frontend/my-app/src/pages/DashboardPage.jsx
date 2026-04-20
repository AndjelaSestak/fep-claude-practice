import  Sidebar  from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import InfoCard from "../components/ui/InfoCard";
import Select from "../components/ui/Select";
import {TransactionItem} from "../components/ui/TransactionItem";
import { ItemList } from "../components/ui/ItemList";
import { getCurrencies, getExchangeRate, getWalletBalance } from "../services/walletService";
import { useEffect, useState } from "react";

// Test example transactions - in a real app, these would come from an API
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


const DashboardPage = () => {
const [walletBalance, setWalletBalance] = useState(null);
const [walletCurrency, setWalletCurrency] = useState("");
const [currencies, setCurrencies] = useState([]);
const [selectedCurrency, setSelectedCurrency] = useState("");
const [displayBalance, setDisplayBalance] = useState(null);

useEffect(() => {
    const loadBalance = async () => {
        try {
            const wallet = await getWalletBalance();
            setWalletBalance(wallet.balance);
            setWalletCurrency(wallet.currency);
            setSelectedCurrency(wallet.currency);
            setDisplayBalance(wallet.balance);
        } catch (error) {
            console.error("Failed to load wallet balance:", error);
        }
    }
    loadBalance();
}, []);

useEffect(() => {
    const loadCurrencies = async () => {
        try {
            const currencyOptions = await getCurrencies();
            setCurrencies(currencyOptions);
        } catch (error) {
            console.error("Failed to load currencies:", error);
        }
    };

    loadCurrencies();
}, []);

useEffect(() => {
    const convertBalance = async () => {
        if (walletBalance === null) {
            return;
        }

        if (!walletCurrency || !selectedCurrency) {
            return;
        }

        if (selectedCurrency === walletCurrency) {
            setDisplayBalance(walletBalance);
            return;
        }

        try {
            const rate = await getExchangeRate(walletCurrency, selectedCurrency);
            setDisplayBalance(walletBalance * rate);
        } catch (error) {
            console.error("Failed to convert wallet balance:", error);
        }
    };

    convertBalance();
}, [selectedCurrency, walletBalance, walletCurrency]);

const formattedBalance =
  displayBalance !== null
    ? `${selectedCurrency || walletCurrency} ${displayBalance.toFixed(2)}`
    : "Loading...";

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        
        <main className="p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6 text-[#111827]">Dashboard Page</h1>

          <div className="mb-10">
            <SearchBar placeholder="Search users..." />
          </div>

          <div className="flex flex-wrap gap-4 border-t pt-8">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </main>
      </div>

      {/* --- Transactions List --- */}
      <div className="mt-10">
        <ItemList title="Recent Transactions" description="Your latest transactions">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </ItemList>
      </div>

          <div className="p-8">
            <InfoCard 
              title="Wallet Balance"
              value={formattedBalance}
              action={
                <div className="w-32">
                  <Select
                    value={selectedCurrency}
                    onChange={(event) => setSelectedCurrency(event.target.value)}
                    options={currencies.map((currency) => ({
                      value: currency.value,
                      label: currency.value,
                    }))}
                    placeholder="Currency"
                  />
                </div>
              }
            />
          </div>

    </div>

  )
}

export default DashboardPage;
