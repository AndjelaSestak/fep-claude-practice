const TextArea = ({ placeholder, value, onChange, rows = 4, ...props }) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
      {...props}
    />
  )
}

export default TextArea
