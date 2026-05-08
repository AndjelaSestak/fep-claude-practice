const Input = ({ placeholder, type = 'text', value, onChange, className, error, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-gray-50 border rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-primary'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default Input
