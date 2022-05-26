import { useState, useEffect } from 'react'
import Image from 'next/image'
import { nacelleClient } from 'services'
import IconBullet from '@/svgs/list-item.svg'
import { getSelectedVariant } from 'utils/getSelectedVariant';
import { PortableText } from '@portabletext/react';
import classes from './ChooseYourBox.module.scss'

const ChooseYourBox = ({props}) => {

  console.log("props:", props)

  const [products, setProducts] = useState([])

  useEffect(() => {
    async function getProducts() {
      const products = await nacelleClient.products({
        handles: props.tiers.map(tier => tier.product)
      })
      console.log("products:", products)
      setProducts(products)
    }
    getProducts()
  }, [])

  return (
    <div className={classes['choose-your-box']}>
      <div className="container">
        <div className={classes['choose-your-box__header']}>
          <h1>{props.header}</h1>
          <h2>{props.subheader}</h2>
          <ul className={classes['choose-your-box__value-props']}>
            {props.headerBullets.map((item, index) => {
              return <li className="secondary--body" key={index}><IconBullet />{item}</li>
            })}
          </ul>
        </div>
        <div className={classes['choose-your-box__tiers']}>
          <ul className={classes['choose-your-box__tier-list']}>
            {products?.length && props.tiers?.length && props.tiers.map(item => {
              const isPopular = item.markAsMostPopular
              const product = products.find(product => product.content.handle === item.product)
              const variant = product.variants[0]
              return <li className={`${classes['choose-your-box__tier']}  ${isPopular ? classes['is-popular'] : ''} `} key={item._key}>
                        <div className={classes['choose-your-box__tier-container']}>
                          <div className={classes['choose-your-box__tier-image']}>
                            <Image src={product.content.media[0].src} layout="fill" objectFit="cover" alt={product.content.media[0].alt || product.content.title} />
                          </div>
                          <div className={classes['choose-your-box__tier-details']}>
                            <h2 className={`${classes['choose_your-box__tier-title']} h1`}>{product.content.title.replace('Subscription', '')}</h2>
                            <div className={`${classes['choose-your-box__tier-price-pounds']} secondary--body`}>
                              <span>${variant.price} / box</span>
                              <span>{variant.weight} lbs</span>
                            </div>
                            <button className="btn salmon">{props.tierCtaText}</button>
                          </div>
                          <div className={classes['choose-your-box__tier-details-footer']}>
                            <button className="btn-link-underline">{props.tierDetailsText}</button>
                          </div>
                        </div>
                    </li>
            })}
          </ul>
        </div>
        {props.tierContent &&
          <div className={`${classes['choose-your-box__tier-content']}`}>
            <PortableText value={props.tierContent} />
          </div>
        }
      </div>
    </div>
  )
}

export default ChooseYourBox