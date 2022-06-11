import cn from 'classnames';
import React from 'react';

const InputField = ({
  value,
  placeholder,
  disabled,
  messageText,
  messageType,
  className,
  ...otherParams
}) => {
  const containerClassNames = cn([
    'input-field__container',
    className
  ]);

  const classNames = cn([
    'input-field',
    {'input-field--alert': messageType === 'alert' || messageType === 'error'},
    {'input-field--disabled': disabled}
  ])

  return (
    <div className={containerClassNames}>
      <div className={classNames}>
        <input
          {...otherParams}
          className="input-field__input"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
      { messageText && <div className='input-field__message'>{ messageText }</div> }
    </div>
  );
};

export default InputField;
