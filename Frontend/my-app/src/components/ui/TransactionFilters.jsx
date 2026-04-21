import { useState } from "react";
import SearchBar from "./SearchBar";
import Select from "./Select";
import { cn } from "../../utils/cn";

export function TransactionFilters({ onFilterChange, className }) {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    dateRange: "all",
  });

  // Funkcija koja se poziva na svaku promenu i šalje ažurirane filtre roditelju
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <section className={cn("space-y-4 mb-8", className)}>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        {/* Search deo - SearchBar */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Transactions
          </label>
          <SearchBar 
            placeholder="Search by recipient, sender or description..." 
            value={filters.search}
            onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Filter po Tipu */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <Select
            value={filters.type}
            onChange={(e) => updateFilters({ ...filters, type: e.target.value })}
            options={[
              { value: "all", label: "All Transactions" },
              { value: "incoming", label: "Income" },
              { value: "outgoing", label: "Expense" },
            ]}
          />
        </div>

        {/* Filter po Vremenu */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Period
          </label>
          <Select
            value={filters.dateRange}
            onChange={(e) => updateFilters({ ...filters, dateRange: e.target.value })}
            options={[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "last7", label: "Last 7 Days" },
              { value: "last30", label: "Last 30 Days" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}