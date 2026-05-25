import ReactSelect from 'react-select'

const Select = ({
  options = [],
  value,
  onChange,
  name,
  required,
  disabled,
  isDisabled,
  error,
  ...props
}) => {
  const selectedOption = options.find((option) => option.value === value) ?? null

  return (
    <div className="flex flex-col gap-1">
      <ReactSelect
        {...props}
        name={name}
        options={options}
        value={selectedOption}
        onChange={(option) =>
          onChange?.({
            target: {
              name,
              value: option?.value ?? ''
            }
          })
        }
        isDisabled={disabled || isDisabled}
        isClearable={!required}
        required={required}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default Select
