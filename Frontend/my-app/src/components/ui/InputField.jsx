const Input = ({
  placeholder,
  type = "text",
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">

    
      {/* Input polje */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${className}`}
        {...props}
      />

    </div>
  );
};

export default Input;