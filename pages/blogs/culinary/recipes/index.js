import React from 'react'
import { nacelleClient } from 'services'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard'
import IconSearch from '@/svgs/search.svg'
import IconArrow from '@/svgs/arrow-down.svg'

import classes from "./RecipesListings.module.scss"
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import PageSEO from '@/components/SEO/PageSEO'

const RecipeListings = ({page, recipeArticles, blogSettings}) => {

  const { hero } = page.fields
  const blogType = page.fields.blogType
  const blogGlobalSettings = blogSettings ? blogSettings.fields[blogType] : undefined
  hero.header = page.title
  hero.subheader = page.fields.subheader

  return (
    <>
      {/* <PageSEO seo={page.fields.seo} /> */}
      <ArticleSplitHero fields={hero} renderType="blog-listing" blogType="culinary" blogGlobalSettings={blogGlobalSettings} />
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
    </>
  )
}

export default RecipeListings

export async function getStaticProps() {

  const pages = await nacelleClient.content({
    handles: ['recipes']
  })

  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle'
  })


  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  if (!recipeArticles.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      page: pages[0],
      recipeArticles: recipeArticles,
      blogSettings: blogSettings[0],
    }
  }
}