import React, { forwardRef } from 'react'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import Link from 'next/link'
import IconStar from '@/svgs/empty-star.svg'
import ArticleProduct from '../ArticleProduct'
import ArticleSocialSharing from '../ArticleSocialSharing'

const RecipeContent = forwardRef(({fields, product}, ref) => {

  const { directionsRef, ingredientsRef, proTipsRef } = ref.current

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

  return (
    <div className={`${classes['article-content']}`}>

      {/* description */}
      <div className={`${classes['article-description']} ${classes['article-section']}`}>
        <PortableText value={description} />
      </div>

      <ArticleSocialSharing />

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