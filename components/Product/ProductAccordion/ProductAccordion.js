import React, {useState} from 'react'

import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/accordion-minus.svg'

import classes from "./ProductAccordion.module.scss"

const ProductAccordion = (props) => {
    const { header, content } = props
    const [isAccordionActive, setIsAccordionActive] = useState(false);

    return (
            <div className={classes['accordion__row']}>
                <button className="h4" onClick={() => setIsAccordionActive(!isAccordionActive)}>
                    <span>{header}</span>
                    {isAccordionActive ? <IconMinus className={classes['minus']} /> : <IconPlus className={classes['plus']} />}
                </button>
                {isAccordionActive && <ul className={classes['accordion__content']}>
                {content.map((listItem) => {
                    return (
                    <li>{listItem}</li>
                    )
                })}
                </ul>}
            </div>
    )
}


export default ProductAccordion