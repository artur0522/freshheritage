/* eslint-disable */
import cn from 'classnames';
import Select, { components } from 'react-select'
import IconTriangleSelector from '@/svgs/triangle-selector.svg'

const SelectField = ({
  placeholder,
  disabled,
  children,
  value,
  messageType,
  messageText,
  className,
  ...otherProps
}) => {

  const classNames = cn([
    'select-field',
    {'select-field--alert': messageType === 'alert' || messageType === 'error'},
    {'select-field--disabled': disabled}
  ])

  const options = children.map(child => {
    return {
      value: child.props.value,
      label: child.props.children
    }
  })

  let defaultValue = options.find(option => option.value === value) || '';

  const DropdownIndicator = props => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <div className="dropdown-selector__arrow-open"><IconTriangleSelector /></div>
        </components.DropdownIndicator>
      )
    );
  };

  const colourStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected || state.isFocused ? '#163144' : '#fcfaf8',
      color: state.isSelected || state.isFocused ? '#fffdfc' : '#163144',
    }),
  };


  return (
    <div className="input-group">
      <div className={classNames}>
        {otherProps.name &&
          <label className="checkout-dropdown-label">{otherProps.name}</label>
        }
        <Select
          {...otherProps}
          className={`new-checkout-dropdown-selector`}
          classNamePrefix="react-select"
          options={options}
          value={defaultValue}
          components={{ DropdownIndicator }}
          isDisabled={disabled}
          placeholder={placeholder}
          styles={colourStyles}
        />
        { messageText && <div className='field__message'>{ messageText }</div> }
      </div>
    </div>
  );
};

export default SelectField;
