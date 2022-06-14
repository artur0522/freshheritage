import cn from 'classnames';
import React from 'react';

const InputField = ({
  value,
  placeholder,
  disabled,
  messageText,
  messageType,
  className,
  label,
  ...otherParams
}) => {
  const classNames = cn([
    'input-field',
    {'input-field--alert': messageType === 'alert' || messageType === 'error'},
    {'input-field--disabled': disabled}
  ])

  return (
    <div className="input-group">
      <div className={classNames}>
        {label &&
          <label className="input-field__label">{label}</label>
        }
        <input
          {...otherParams}
          className="input-field__input"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default InputField;
