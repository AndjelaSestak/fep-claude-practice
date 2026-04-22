import { useState } from "react";
import SearchBar from "./SearchBar";
import Select from "./Select";
import { cn } from "../../utils/cn";

export function TransactionFilters({ onFilterChange, className }) {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",      // single ili recurring
    direction: "all", // incoming ili outgoing
  });

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <section className={cn("space-y-4 mb-8", className)}>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        {/* Search deo */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Transactions
          </label>
          <SearchBar 
            placeholder="Search by recipient or sender..." 
            value={filters.search}
            onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Filter po Tipu (Single/Recurring) */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <Select
            value={filters.type}
            onChange={(e) => updateFilters({ ...filters, type: e.target.value })}
            options={[
              { value: "all", label: "All Types" },
              { value: "single", label: "Single" },
              { value: "recurring", label: "Recurring" },
            ]}
          />
        </div>

        {/* Filter po Smeru (Incoming/Outgoing) */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Direction
          </label>
          <Select
            value={filters.direction}
            onChange={(e) => updateFilters({ ...filters, direction: e.target.value })}
            options={[
              { value: "all", label: "All Directions" },
              { value: "incoming", label: "Incoming" },
              { value: "outgoing", label: "Outgoing" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}