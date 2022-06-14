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
          value={value}
          valueattr={value}
          arrowClosed={<div className="dropdown-selector__arrow-closed"><IconTriangleSelector /></div>}
          arrowOpen={<div className="dropdown-selector__arrow-open"><IconTriangleSelector /></div>}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
      { messageText && <div className='stx-field__message'>{ messageText }</div> }
    </div>
  );
};

export default SelectField;
