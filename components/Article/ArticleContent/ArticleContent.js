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
        <li>
          <button>
            <IconBookmark /><span>Save</span>
          </button>
        </li>
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
        <ul>
          {ingredients.ingredientList.map((item, index) => {

            return <li key={item._key}>
              <PortableText value={item.text} />
              {index === 0 && ingredients.ctaText && ingredients.ctaUrl &&
                <Link href={ingredients.ctaUrl || ''}>
                  <a className={`${classes['article-section__cta-btn']} btn salmon`}>{ingredients.ctaText}</a>
                </Link>
              }
            </li>
          })}
        </ul>
        {ingredients.mobileBackgroundImage && isMobile && mounted &&
          <div className={classes['article-section__image']}>
            <ResponsiveImage
              src={ingredients.mobileBackgroundImage.asset.url}
              alt={ingredients.mobileBackgroundImage.asset.alt || ''}
            />
          </div>
        }
        {ingredients.desktopBackgroundImage && isDesktop && mounted &&
          <div className={classes['article-section__image']}>
            <ResponsiveImage
              src={ingredients.desktopBackgroundImage.asset.url}
              alt={ingredients.desktopBackgroundImage.asset.alt || ''}
            />
          </div>
        }
      </div>}

      {/* directions */}
      {directions && <div ref={directionsRef} className={`${classes['article-directions']} ${classes['article-section']}`}>
        <h4>Directions</h4>
        <ul>
          {directions.stepList.map(item => {
            return <li key={item._key}>
              <h5>{item.header}</h5>
              <PortableText value={item.text} />
            </li>
          })}
        </ul>
        {directions.mobileBackgroundImage && isMobile && mounted &&
          <div className={classes['article-section__image']}>
            <ResponsiveImage
              src={directions.mobileBackgroundImage.asset.url}
              alt={directions.mobileBackgroundImage.asset.alt || ''}
            />
          </div>
        }
        {directions.desktopBackgroundImage && isDesktop && mounted &&
          <div className={classes['article-section__image']}>
            <ResponsiveImage
              src={directions.desktopBackgroundImage.asset.url}
              alt={directions.desktopBackgroundImage.asset.alt || ''}
            />
          </div>
        }
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
        <ul>
          {proTips.proTipList.map(item => {
            return <li key={item._key}>
              <h5>{item.header}</h5>
              <PortableText value={item.text} />
            </li>
          })}
        </ul>
        {proTips.mobileBackgroundImage && isMobile && mounted &&
          <div className={classes['article-section__image']}>
            <ResponsiveImage
              src={proTips.mobileBackgroundImage.asset.url}
              alt={proTips.mobileBackgroundImage.asset.alt || ''}
            />
          </div>
        }
        {proTips.desktopBackgroundImage && isDesktop && mounted &&
          <div className={classes['article-section__image']}>
            <ResponsiveImage
              src={proTips.desktopBackgroundImage.asset.url}
              alt={proTips.desktopBackgroundImage.asset.alt || ''}
            />
          </div>
        }
      </div>}

      {/* Rate Recipe */}
      <div className={`${classes['article-rate-recipe']} ${classes['article-section']}`}>
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
      </div>

    </div>
  )
})

export default ArticleContent