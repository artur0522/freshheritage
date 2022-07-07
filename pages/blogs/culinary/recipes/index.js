import React, {useState, useEffect} from 'react'
import { nacelleClient } from 'services'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard'
import IconSearch from '@/svgs/search.svg'
import PaginationLeft from '@/svgs/pagination-left.svg'
import PaginationRight from '@/svgs/pagination-right.svg'

import classes from "./RecipesListings.module.scss"
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import FullBleedHero from '@/components/Sections/FullBleedHero'
import ArticleRow from '@/components/Sections/ArticleRow'
import { filter } from 'lodash-es'

const RecipeListings = ({recipeArticles, blogSettings, recipeListings}) => {
  console.log(recipeArticles)
  const { content } = recipeListings[0].fields
  const heroSection = content?.find(section => section._type === 'hero')
  const articleRowSection = content?.find(section => section._type === 'articleRow')

  // pagination
  const [pages] = useState(Math.ceil(recipeArticles.length / 20));
  const [currentPage, setCurrentPage] = useState(1);

  // filters
  const [filterDrawer, toggleFilterDrawer]= useState(true)


  // useEffect(() => {
  //   window.scrollTo({ behavior: 'smooth', top: '0px' });
  // }, [currentPage]);

  console.log('pages', pages)

  const goToNextPage = () => {
      // not yet implemented
      setCurrentPage((page) => page + 1)
  }

  const goToPreviousPage = () => {
      // not yet implemented
      setCurrentPage((page) => page - 1);
  }

  const changePage = (event) => {
    // not yet implemented
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
      // not yet implemented
      const startIndex = currentPage * 20 - 20;
      const endIndex = startIndex + 20;
      console.log('getpagdata')
      console.log(recipeArticles.slice(startIndex, endIndex))
      return recipeArticles.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
      // not yet implemented
      let start = Math.floor((currentPage - 1) / pages) * pages;
      return new Array(pages).fill().map((_, idx) => start + idx + 1);
  };
  

  return (
    <>
      <ArticleSplitHero fields={''} renderType="blog-listing" blogType="culinary" blogSettings={blogSettings} />
      <div className={classes['recipes']}>
      
          <form className={`${classes['recipes__filter-wrap']} container`}>
            <div className={classes['recipes__search']}>
              <button type="button">
                  <IconSearch />
              </button>
              <input type="text" placeholder='Search' className="body" />
            </div>

            <div className={classes['recipes__filter-row']}>
              <button onClick={() => toggleFilterDrawer(!filterDrawer)} type="button" className={classes['toggle-filters']}>
                {filterDrawer ? <span className="body">Hide Filters</span> : <span className="body">Show Filters</span>}
              </button>

              <div className={classes['sort-by']}>
                  <label className="body">Sort By</label>
                    <select className="body">
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
              </div>
            </div>
          </form>



        <div className={`${classes['filters-list__wrap']}`}>



          {filterDrawer && <div className={`${classes['filters']}`}>
            <div className="container">
              <h1>Filters</h1>
            </div>
          </div>}


          <div className={`${classes['recipes__list-wrap']} ${classes[filterDrawer ? 'filters-open' : '']}`}>
            {recipeArticles.length > 0 && currentPage === 1 && <div className={`${classes['recipes__list']} ${classes[filterDrawer ? 'filters-open' : '']} container`}>
              {recipeArticles.slice(0, 8).map((article, index) => {
                  return (
                    <div key={article.handle}>
                      <DynamicArticleCard article={article} />
                    </div>
                  )
              })}
            </div>}

            {recipeArticles.length >= 8 && currentPage === 1 && 
              <FullBleedHero fields={heroSection} key={heroSection._key} />
            }

            {recipeArticles.length >= 8 && currentPage === 1 && <div className={`${classes['recipes__list']} ${classes[filterDrawer ? 'filters-open' : '']} container`}>
              {recipeArticles.slice(8, 16).map((article, index) => {
                  return (
                    <div key={article.handle}>
                      <DynamicArticleCard article={article} />
                    </div>
                  )
              })}
            </div>}

            {recipeArticles.length >= 17 && currentPage === 1 &&  
              <ArticleRow fields={articleRowSection} />
            }

            {recipeArticles.length >= 17 && currentPage === 1 && <div className={`${classes['recipes__list']} container`}>
              {recipeArticles.slice(17, 21).map((article, index) => {
                  return (
                    <div key={article.handle}>
                      <DynamicArticleCard article={article} />
                    </div>
                  )
              })}
          </div>}

          {currentPage !== 1 && <div className={`${classes['recipes__list']} container`}>
            {getPaginatedData().map((article, index) => (
               <div key={article.handle}>
                <DynamicArticleCard article={article} />
              </div>
            ))}
          </div>}
          </div>



          </div>







        <div className={classes['pagination']}>
          {/* previous button */}
          <button
            onClick={goToPreviousPage}
            className={`${classes['prev']} ${classes[currentPage === 1 ? 'disabled' : '']} pagination-btn`}
          >
            <PaginationLeft />
          </button>

          {/* show page numbers */}
          {getPaginationGroup().map((item, index) => (
              <button
                key={index}
                onClick={changePage}
                className={`${classes['paginationItem']} ${classes[currentPage === item ? 'active' : null]}`}
              >
                <span>{item}</span>
              </button>
            ))}

            {/* next button */}
            <button
              onClick={goToNextPage}
              className={`${classes['next']} ${classes[currentPage === pages ? 'disabled' : '']} pagination-btn`}
            >
              <PaginationRight />
            </button>
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