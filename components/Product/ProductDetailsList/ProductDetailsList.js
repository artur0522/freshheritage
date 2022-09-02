import { useState } from 'react'
import classes from './ProductDetailsList.module.scss'
import { PortableText } from '@portabletext/react'
import Expand from 'react-expand-animated'
import IconMinus from '@/svgs/minus.svg'
import IconPlus from '@/svgs/plus.svg'

const ProductDetailsList = ({fields, enableToggle = false, expandOnLoad = false }) => {

  const [height, setHeight] = useState(expandOnLoad ? 'auto' : 0)

  const toggleExpand = () => {
    if (!enableToggle) {
      return
    }
    height === 0 ? setHeight('auto') : setHeight(0)
  }

  return (
    <div className={`${classes['product-details']} ${enableToggle ? '' : classes['disable-toggle']}`}>
      <h4 onClick={() => toggleExpand()}>
        {fields.detailsTitle}
        {height !== 0 ? (
          <IconMinus className={classes['minus']} />
        ):(
          <IconPlus className={classes['plus']} />
        )}
      </h4>

      {fields.description != undefined || fields.description != null ? (
        <div className="body">{fields.description?.replace(/(<([^>]+)>)/ig, '')}</div>
      ):(
        <Expand open={height !== 0} duration={300}>
          <ul className={classes['product-details__items']}>
            {fields.detailsItems.map((item, index) => {
              if (item.text) {
                return <li className={classes['product-details__item']} key={item._key}>
                  <PortableText value={item.text[0]} />
                </li>
              }
              return <li className={classes['product-details__item']} key={index}><p>{item}</p></li>

            })}
          </ul>
        </Expand>
      )}

    </div>
  )
}

export default ProductDetailsList