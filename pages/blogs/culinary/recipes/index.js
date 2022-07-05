import React from 'react'
import { nacelleClient } from 'services'
import DynamicArticleCard from '@/components/DynamicArticleCard'
import IconSearch from '@/svgs/search.svg'
import IconArrow from '@/svgs/arrow-down.svg'

import classes from "./RecipesListings.module.scss"

const RecipeListings = (props) => {
  const { recipeArticles } = props
  return (
    <div className={classes['recipes']}>
      <div className="container">
        <div className={classes['recipes__search']}>
            <form>
                <button type="button">
                    <IconSearch />
                </button>
            <input type="text" placeholder='Search' className="secondary--body" />
            </form>
        </div>

        <div className={classes['recipes__filter-row']}>
          <button className={classes['toggle-filters']}><span>Show Filters</span></button>

          <div className={classes['sort-by']}>
           <label>Sort By</label>
           <select>
              <option>Newest</option>
              <option>Oldest</option>
           </select>
           <IconArrow />
          </div>
        </div>

        <div className={classes['recipes__list']}>
          {recipeArticles.map(article => <div key={article.handle}><DynamicArticleCard article={article} /></div>)}
        </div>
      </div>
    </div>
  )
}

export default RecipeListings

export async function getStaticProps({ params }) {

  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle'
  })

  if (!recipeArticles.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      recipeArticles: recipeArticles
    }
  }
}