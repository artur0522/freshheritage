import React from 'react'

import classes from "./BoldHeaderText.module.scss"

const BoldHeaderText = ({fields}) => {
  const { headerText, alignTextBlock, textAlign, topPadding, bottomPadding } = fields
  return (
    <div className={`${classes['text-wrap']} flex ${alignTextBlock} container  ${topPadding ? classes['top-padding'] : ''} ${bottomPadding ? classes['bottom-padding'] : ''}`}>
        {headerText && <h1 className={`${classes['text']} ${textAlign}`}>{headerText}</h1>}
    </div>
  )
}

export default BoldHeaderText