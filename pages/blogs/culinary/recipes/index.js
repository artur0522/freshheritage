import React from 'react'
import { nacelleClient } from 'services'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard'
import IconSearch from '@/svgs/search.svg'
import IconArrow from '@/svgs/arrow-down.svg'

import classes from "./RecipesListings.module.scss"
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'

const RecipeListings = ({recipeArticles, blogSettings, recipeListings}) => {
  const { content } = recipeListings[0].fields
  const heroSection = content?.find(section => section._type === 'hero')
  const articleRowSection = content?.find(section => section.__type === 'recipeArticleRow')

  return (
    <>
      <ArticleSplitHero fields={''} renderType="blog-listing" blogType="culinary" blogSettings={blogSettings} />
      <div className={classes['recipes']}>
        <div className="container">

          <form className={classes['recipes__filter-wrap']}>
            <div className={classes['recipes__search']}>
              <button type="button">
                  <IconSearch />
              </button>
              <input type="text" placeholder='Search' className="body" />
            </div>

            <div className={classes['recipes__filter-row']}>
              <button type="button" className={classes['toggle-filters']}><span className="body">Show Filters</span></button>

              <div className={classes['sort-by']}>
                  <label className="body">Sort By</label>
                    <select className="body">
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
              </div>
            </div>
          </form>

          <div className={classes['recipes__list']}>
            {recipeArticles.map(article => <div key={article.handle}><DynamicArticleCard article={article} /></div>)}
          </div>


          <div className={classes['recipes__pagination']}>
            pagination
          </div>

        </div>
      </div>
    </>
  )
}

export default RecipeListings

export async function getStaticProps({ params }) {

  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle'
  })


  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const recipeListings  = await nacelleClient.content({
    handles: ['recipe-listings'],
    type: 'blog'
  })

  if (!recipeArticles.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      recipeArticles: recipeArticles,
      blogSettings: blogSettings[0],
      recipeListings: recipeListings
    }
  }
}