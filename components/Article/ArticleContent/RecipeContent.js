import React, { forwardRef } from 'react'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import Link from 'next/link'
import IconStar from '@/svgs/empty-star.svg'
import ArticleProduct from '../ArticleProduct'
import ArticleSocialSharing from '../ArticleSocialSharing'

const RecipeContent = forwardRef(({fields, product}, ref) => {

  const { description, content } = fields

  console.log("fields:", fields)

  const myPortableTextComponents = {
    block: {
      h1: ({children}) => {
        if (ref.current[children[0]]) {
          return <h1 ref={ref.current[children[0]]}>{children}</h1>
        }

        return <h1>{children}</h1>
      }
    },
    marks: {
      buttonLink: ({ children, value }) => (<Link href={value.href}>
        <a className={`${classes['article-ingredient__btn-link']} btn salmon`}>{children}</a>
      </Link>)
    },
    types: {
      image: ({value}) => (<div className={classes['article-section__image']}>
        <ResponsiveImage src={value.asset.url} alt={value.asset.alt || ''} />
      </div>),
      productBlock: () => (
        <ArticleProduct product={product} parentClasses={classes} />
      )
    },
    list: {
      bullet: ({children}) => (<ul className={classes['article-ingredients']}>{children}</ul>)
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

      <div className={`${classes['article-section__content']}`}>
        <PortableText value={content} components={myPortableTextComponents} />
      </div>

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