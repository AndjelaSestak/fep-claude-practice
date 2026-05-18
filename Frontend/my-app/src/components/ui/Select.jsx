import ReactSelect from 'react-select'

const Select = ({
  options = [],
  value,
  onChange,
  name,
  required,
  disabled,
  isDisabled,
  ...props
}) => {
  const selectedOption = options.find((option) => option.value === value) ?? null

  return (
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
  )
}

export default Select
