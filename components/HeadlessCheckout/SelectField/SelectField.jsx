/* eslint-disable */
import cn from 'classnames';
import React from 'react';
import Dropdown from 'react-dropdown'
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

  let defaultValue = value;

  if (options.length === 0) {
    defaultValue = options.some(option => option.value === value) ? options.find(option => option.value === value) : options[0]
  }

  return (
    <div className="input-group">
      <div className={classNames}>
        {otherProps.name &&
          <label className="checkout-dropdown-label">{otherProps.name}</label>
        }
         <Dropdown
          {...otherProps}
          className={`checkout-dropdown-selector`}
          options={options}
          value={defaultValue}
          valueattr={defaultValue}
          arrowClosed={<div className="dropdown-selector__arrow-closed"><IconTriangleSelector /></div>}
          arrowOpen={<div className="dropdown-selector__arrow-open"><IconTriangleSelector /></div>}
          disabled={disabled}
          placeholder={placeholder}
        />
        { messageText && <div className='field__message'>{ messageText }</div> }
      </div>
    </div>
  );
};

export default SelectField;
