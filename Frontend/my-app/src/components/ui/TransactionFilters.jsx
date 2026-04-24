import { useState } from "react";
import SearchBar from "./SearchBar";
import Select from "./Select";
import { cn } from "../../utils/cn";

export function TransactionFilters({ onFilterChange, className }) {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    direction: "all",
  });

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <section className={cn("w-full", className)}>
      <div className="flex flex-col md:flex-row gap-6 items-end">
        
        {/* Search deo - Prostraniji i moderniji */}
        <div className="flex-1 w-full group">
          <label className="block text-[11px] font-black text-primary-dark uppercase tracking-widest mb-2 ml-1 opacity-70">
            Search Transactions
          </label>
          <div className="relative transition-all duration-300 focus-within:transform focus-within:-translate-y-1">
            <SearchBar 
              placeholder="Search by recipient or sender..." 
              value={filters.search}
              onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
              // Ovde proveri da li tvoj SearchBar prihvata className, 
              // ako da, prosledi mu: "bg-gray-50/80 border-gray-100 rounded-2xl"
            />
          </div>
        </div>

        {/* Filter po Tipu */}
        <div className="w-full md:w-56">
          <label className="block text-[11px] font-black text-primary-dark uppercase tracking-widest mb-2 ml-1 opacity-70">
            Type
          </label>
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-0.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5">
            <Select
              value={filters.type}
              onChange={(e) => updateFilters({ ...filters, type: e.target.value })}
              className="bg-transparent border-none focus:ring-0 font-bold text-gray-700"
              options={[
                { value: "all", label: "All Types" },
                { value: "single", label: "Single" },
                { value: "recurring", label: "Recurring" },
              ]}
            />
          </div>
        </div>

        {/* Filter po Smeru */}
        <div className="w-full md:w-56">
          <label className="block text-[11px] font-black text-primary-dark uppercase tracking-widest mb-2 ml-1 opacity-70">
            Direction
          </label>
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-0.5 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5">
            <Select
              value={filters.direction}
              onChange={(e) => updateFilters({ ...filters, direction: e.target.value })}
              className="bg-transparent border-none focus:ring-0 font-bold text-gray-700"
              options={[
                { value: "all", label: "All Directions" },
                { value: "incoming", label: "Incoming" },
                { value: "outgoing", label: "Outgoing" },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}