import React, { useState, useEffect, forwardRef } from 'react'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import Link from 'next/link'
import IconThreeDotsCircle from '@/svgs/three-dots-circle.svg'
import IconPrinter from '@/svgs/printer.svg'
import IconBookmark from '@/svgs/bookmark.svg'
import IconShare from '@/svgs/share.svg'
import IconStar from '@/svgs/empty-star.svg'
import ArticleProduct from '../ArticleProduct'

const RecipeContent = forwardRef(({fields, product}, ref) => {

  const { directionsRef, ingredientsRef, proTipsRef } = ref.current

  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  const { description, directions, ingredients, proTips } = fields

  console.log("fields:", fields)

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
    <div className={`${classes['article-content']}`}>

      {/* description */}
      <div className={`${classes['article-description']} ${classes['article-section']}`}>
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
        {isMobile && mounted && <li>
          <button className={classes['more-info-btn']}>
            <IconThreeDotsCircle /><span>More Info</span>
          </button>
        </li>}
        {isDesktop && mounted && <li>
          <button onClick={() => window.print()}>
            <IconPrinter /><span>Print</span>
          </button>
        </li>}
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
        <ArticleProduct product={product} parentClasses={classes} />
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

export default RecipeContent