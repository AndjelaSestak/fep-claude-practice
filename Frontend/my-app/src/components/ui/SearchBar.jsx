import React from 'react'
import { Search } from 'lucide-react'
import { cn } from '../../utils/cn'
import InputField from './InputField'

/**
 * USAGE:
 * <SearchBar
 *   value={searchValue}
 *   onChange={(e) => setSearchValue(e.target.value)}
 *   placeholder="Search items..."
 *   className="additional-tailwind-classes"
 * />
 */

export default function SearchBar({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <div className={cn('relative w-full max-w-lg', className)}>
      {/* Search icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      {/* InputField component */}
      <InputField
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-11 pr-3"
      />
    </div>
  )
}
