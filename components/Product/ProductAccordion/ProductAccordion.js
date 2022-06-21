import React, {useState, useEffect} from 'react'
import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/accordion-minus.svg'

import classes from "./ProductAccordion.module.scss"

const ProductAccordion = (props) => {
    const { header, contentList, description } = props
    const [isAccordionActive, setIsAccordionActive] = useState(false)
    const strippedDescription = description?.replace(/(<([^>]+)>)/ig, '')

    useEffect(() => {
        if(header === 'Product Description') {
            setIsAccordionActive(true)
        }
    }, [])

    return (
        <div className={classes['accordion__row']}>
            <button className="h4" onClick={() => setIsAccordionActive(!isAccordionActive)}>
                <span>{header}</span>
                {isAccordionActive ? <IconMinus className={classes['minus']} /> : <IconPlus className={classes['plus']} />}
            </button>
            {isAccordionActive && contentList && <ul className={classes['accordion__content']}>
                {contentList.map((listItem, index) => {
                    return (
                    <li key={index} className="body">{listItem}</li>
                    )
                })}
            </ul>}
            {isAccordionActive && description && <div className={classes['accordion__desc']}>
                <p>{strippedDescription}</p>
            </div>}
        </div>
    )
}


export default ProductAccordion