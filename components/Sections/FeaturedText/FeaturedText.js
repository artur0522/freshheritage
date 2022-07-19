import React, { useEffect, useState } from "react"

import classes from './FeaturedText.module.scss'

const FeaturedText = ({ fields }) => {
    const {alignTextBlock, textAlign, smallTextTop, smallTextBottom, featuredText} = fields
    return (
        <div className={`${classes['featured-text']} container`}>
            <div className={`${classes['featured-text__inner']} ${alignTextBlock}`}>
                <div className={`${classes['text']} ${textAlign}`}>
                    {smallTextTop && <p className={`${classes['top-text']} secondary--body`}>{smallTextTop}</p>}
                    {featuredText && <h4>{featuredText}</h4>}
                    {smallTextBottom && <p className={`${classes['bottom-text']} secondary--body`}>{smallTextBottom}</p>}
                </div>
            </div>
        </div>
    )
}

export default FeaturedText
