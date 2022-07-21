import React from 'react'

import classes from "./BoldHeaderText.module.scss"

const BoldHeaderText = ({fields}) => {
  console.log('fields', fields)
  const { headerText, alignTextBlock, textAlign } = fields
  return (
    <div className={`${classes['text-wrap']} flex ${alignTextBlock} container`}>
        {headerText && <h1 className={`${classes['text']} ${textAlign}`}>{headerText}</h1>}
    </div>
  )
}

export default BoldHeaderText