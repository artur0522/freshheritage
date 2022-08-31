import React from 'react'
import classes from './Button.module.scss'

export default function Button({ type, onClick, disabled, text, style = 'rounded' }) {
  return (
    <button
      className={`${classes['button']} ${classes[style]}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
