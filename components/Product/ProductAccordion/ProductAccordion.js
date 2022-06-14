import React, {useState, useEffect} from 'react'

import IconPlus from '@/svgs/plus.svg'
import IconMinus from '@/svgs/accordion-minus.svg'

import classes from "./ProductAccordion.module.scss"

const ProductAccordion = (props) => {
    const { header, content } = props
    const [isAccordionActive, setIsAccordionActive] = useState(false)
    const [isDeliveryAccordionActive, setIsDeliveryAccordionActive] = useState(false)

    console.log(props)

    useEffect(() => {
        if(props.header === 'Delivery Details') {
            setIsAccordionActive(true)
        }
    }, [])

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