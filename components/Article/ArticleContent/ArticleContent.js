import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'

const ArticleContent = ({fields}) => {
  console.log("fields:", fields)

  const { addToCartProduct, description, directions, ingredients, proTips } = fields

  return (
    <div className={classes['article-content']}>
      <div className={classes['article-description']}>
        <PortableText value={description} />
      </div>

      {ingredients && <div class={classes['article-ingredients']}>
        <h4>Ingredients</h4>
        <ul>
          {ingredients.ingredientList.map(item => {
            return <li key={item._key}>
              <PortableText value={item.text} />
            </li>
          })}
        </ul>
      </div>}

      {directions && <div class={classes['article-directions']}>
        <h4>Directions</h4>
        <ul>
          {directions.stepList.map(item => {
            return <li key={item._key}>
              <h5>{item.header}</h5>
              <PortableText value={item.text} />
            </li>
          })}
        </ul>
      </div>}

      {proTips && <div class={classes['article-pro-tips']}>
        <h4>Pro Tips</h4>
        <ul>
          {directions.stepList.map(item => {
            return <li key={item._key}>
              <h5>{item.header}</h5>
              <PortableText value={item.text} />
            </li>
          })}
        </ul>
      </div>}

    </div>
  )
}

export default ArticleContent