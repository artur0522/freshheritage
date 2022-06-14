import { useState, useEffect } from 'react'

import classes from './ProductGiftForm.module.scss'

const defaultFormFields = {
    giftCardButtons: 50,
    name: '',
    email: '',
    message: ''
}

const ProductGiftForm = (props) => {
    const { checked, handle } = props
    const [formFields, setFormFields] = useState(defaultFormFields)
    const { giftCardButtons, name, email, message } = formFields

    // Methods
    const formSubmit = (event) => {
        event.preventDefault()
        console.log('form submit')
    }

    console.log(formFields)

    const handleChange = (event) => {
        const {name, value} = event.target
        setFormFields({...formFields, [name]:value })
    }

    return (                
        <form onSubmit={(event) => formSubmit(event)} className={classes['gift__info']}>
            {handle === 'digital-gift-card' && <div className={classes['gift-card']}>
                <div className={classes['gift-card__amount']}>
                    <h4><span className={classes['number']}>1</span>Amount</h4>
                </div>

                <div className={classes['gift-card__buttons']}>
                    <div className={classes['btn']}>
                        <input type="radio" id="fifty" name="giftCardButtons" onChange={handleChange} value={50} />
                        <label htmlFor="fifty">$50</label>
                    </div>

                    <div className={classes['btn']}>
                        <input type="radio" id="one-hundred" name="giftCardButtons" onChange={handleChange} value={100} />
                        <label htmlFor="one-hundred">$100</label>
                    </div>
                    
                    <div className={classes['btn']}>
                        <input type="radio" id="one-fifty" name="giftCardButtons" onChange={handleChange} value={150} />
                        <label htmlFor="one-fifty">$150</label>
                    </div>
                    
                    <div className={classes['btn']}>
                        <input type="radio" id="two-hundred"  name="giftCardButtons" onChange={handleChange} value={200} />
                        <label htmlFor="two-hundred">$200</label>
                    </div>
                </div>
            </div>}

            {checked && <div className={classes['gift__info-header']}>
                <h4>
                {handle === 'digital-gift-card' && <span className={classes['number']}>2</span>}
                Recipient's Information
                </h4>
                <span className={`${classes['delivery']} delivery--time`}>Delivered via email one day after purchase.</span>
            </div>}
        
        
            {checked && <div className={classes['form__inner']}>
                <div className={classes['form__col']}>
                    <label className="secondary--body" htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" className="secondary--body" onChange={handleChange} value={email} />
                </div>
                <div className={classes['form__col']}>
                    <label className="secondary--body" htmlFor="name">Recipient's Name</label>
                    <input type="text" id="name" name="name" className="secondary--body" onChange={handleChange} value={name} />
                </div>
                {handle === 'digital-gift-card' && <div className={`${classes['form__col']} ${classes['textarea']}`}>
                    <label className="secondary--body" htmlFor="message">Message</label>
                    <textarea type="text" id="message" name="message" maxLength="250" className="secondary--body" onChange={handleChange} value={message} />
                    <p className="disclaimer">*Digital giftcard will be delivered to recipient via email one day after purchase and will include your gift message! </p>
                </div>}
            </div>}
            <button type="submit" className="btn salmon">Add to Cart</button>
        </form>
    )
}

export default ProductGiftForm