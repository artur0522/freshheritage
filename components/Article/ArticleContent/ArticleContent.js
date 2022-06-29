import React, { useState, useEffect, forwardRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import { usePDPDrawerContext } from '@/context/PDPDrawerContext'
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext'
import { getCartVariant } from 'utils/getCartVariant'
import Link from 'next/link'
import IconPrinter from '@/svgs/printer.svg'
import IconBookmark from '@/svgs/bookmark.svg'
import IconShare from '@/svgs/share.svg'
import IconStar from '@/svgs/empty-star.svg'

const ArticleContent = forwardRef(({fields, product}, ref) => {

  const { directionsRef, ingredientsRef, proTipsRef } = ref.current

  const PDPDrawerContext = usePDPDrawerContext()
  const { addItemToOrder } = useHeadlessCheckoutContext()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 768px)'}
  )

  const { description, directions, ingredients, proTips } = fields

  const myPortableTextComponents = {
    marks: {
      buttonLink: ({ children, value }) => (<Link href={value.href}>
        <a className={`${classes['article-ingredient__btn-link']} btn salmon`}>{children}</a>
      </Link>)
    },
    types: {
      image: ({value}) => (<div className={classes['article-section__image']}>
        <ResponsiveImage src={value.asset.url} alt={value.asset.alt || ''} />
      </div>)
    },
    listItem: {
      bullet: ({children}) => {

        const button = children[2]

        if (button) {
          return (
            <li className={classes['article-ingredient--with-btn']}>
              <span><p>{children.slice(0, 2)}</p></span><div>{button}</div>
            </li>
          )
        }

        return (
          <li>
            <p>{children}</p>
          </li>
        )
      }
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`${classes['article-content']} ${classes['article-section']}`}>

      {/* description */}
      <div className={classes['article-description']}>
        <PortableText value={description} />
      </div>

      {/* social sharing  */}
      <ul className={classes['article-social-sharing']}>
        {/* <li>
          <button>
            <IconBookmark /><span>Save</span>
          </button>
        </li> */}
        <li>
          <button>
            <IconShare /><span>Share</span>
          </button>
        </li>
        <li>
          <button onClick={() => window.print()}>
            <IconPrinter /><span>Print</span>
          </button>
        </li>
      </ul>

      {/* inredients */}
      {ingredients && <div ref={ingredientsRef} className={`${classes['article-ingredients']} ${classes['article-section']}`}>
        <h4>Ingredients</h4>
        <div className={classes['article-section__content']}>
          {ingredients.map(item => {
            return <PortableText key={item._key} value={item} components={myPortableTextComponents} />
          })}
        </div>
      </div>}

      {/* directions */}
      {directions && <div ref={directionsRef} className={`${classes['article-directions']} ${classes['article-section']}`}>
        <h4>Directions</h4>
        <div className={classes['article-section__content']}>
          {directions.map(item => {
            return <PortableText key={item._key} value={item} />
          })}
        </div>
      </div>}

      {/* ATC - product */}
      {product &&
        <div className={`${classes['article-product']} ${classes['article-section']}`}>
          <div className={classes['article-product__card']}>
            <div className={classes['article-product__content']}>
              <div className={classes['article-product__image']}>
                <ResponsiveImage
                  src={product.content.media[0].src}
                  alt={product.content.media[0].altText || product.content.title}
                />
              </div>
              <div className={classes['article-product__details']}>
                <h4 className="heading--product-title">{product.content.title}</h4>
                <div className={`${classes['article-product____tier-price-pounds']} secondary--body`}>
                  <span>${product.variants[0].price} / box</span>
                  <span>{product.variants[0].weight} lbs</span>
                </div>
                <div className={classes['article-product__details-footer']}>
                  <button
                    onClick={() => PDPDrawerContext.openDrawer(product)}
                    className="btn-link-underline">
                      Details & Projected Harvest
                  </button>
                  <button
                    onClick={() => {
                      const variant = getCartVariant({
                        product,
                        variant: product.variants[0]
                      });
                      addItemToOrder({variant})
                    }}
                    className="btn salmon"
                  >Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Pro Tips */}
      {proTips && <div ref={proTipsRef} className={`${classes['article-pro-tips']} ${classes['article-section']}`}>
        <h4>Pro Tips</h4>
        <div className={classes['article-section__content']}>
          {proTips.map(item => {
            return <PortableText key={item._key} value={item} />
          })}
        </div>
      </div>}

      {/* Rate Recipe */}
      {/* <div className={`${classes['article-rate-recipe']} ${classes['article-section']}`}>
        <div className={classes['article-rate-recipe__card']}>
          <div className={classes['article-rate-recipe__content']}>
            <h4>Rate This Recipe</h4>
            <h6>Requires Account</h6>
            <div className={classes['article-rate-recipe__rating']}>
              <ul>
                {[...Array(5).keys()].map((_, x) => {
                  return <li key={x}><IconStar /></li>
                })}
              </ul>
              <button class="btn salmon">Rate</button>
            </div>
          </div>
        </div>
      </div> */}

    </div>
  )
})

export default ArticleContent