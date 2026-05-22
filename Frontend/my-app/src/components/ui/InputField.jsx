import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const Input = ({ placeholder, type = 'text', value, onChange, className, error, ...props }) => {
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)

  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${isPassword ? 'pr-11' : ''} ${error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-primary'} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default Input
