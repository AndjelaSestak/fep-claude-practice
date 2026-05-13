import React, { useState } from 'react'
import { cn } from '../../utils/cn'

export default function FilterBar({ label, options, value, onChange, className }) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-base font-medium hover:bg-slate-50"
      >
        {selectedOption ? selectedOption.label : label}
        <span className={cn('ml-2 transition-transform', isOpen && 'rotate-180')}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-sm">
          <div
            onClick={() => {
              onChange('')
              setIsOpen(false)
            }}
            className={cn(
              'px-4 py-2 text-base cursor-pointer hover:bg-slate-100',
              value === '' && 'font-semibold bg-slate-100'
            )}
          >
            {label}
          </div>

          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
              className={cn(
                'px-4 py-2 text-base cursor-pointer hover:bg-slate-100',
                value === opt.value && 'font-semibold bg-slate-100'
              )}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
