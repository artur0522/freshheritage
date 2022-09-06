import React, {useState, useEffect} from 'react'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/router'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import FullBleedHero from '@/components/Sections/FullBleedHero'
import ArticleRow from '@/components/Sections/ArticleRow'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard'
import BlogFilters from '@/components/Blog/BlogFilters'
import IconFilters from '@/svgs/filters.svg'
import ArticleCookingClassHero from '@/components/Article/ArticleCookingClassHero'

import IconSearch from '@/svgs/search.svg'
import PaginationLeft from '@/svgs/pagination-left.svg'
import PaginationRight from '@/svgs/pagination-right.svg'

import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'

import classes from "./ListingsTemplate.module.scss"

const ListingsTemplate = ({ articles, blogSettings, page }) => {
    const router = useRouter()
    const drawerContext = useArticleFiltersDrawerContext()
    const { replaceSelectedFilters, addUrl, addFilters, openDrawer, isOpen, selectChangeHandler, selectedFilterList, addListings, addTagArray, sortListings, addOriginalListings, listings, addTagCount, originalListings } = drawerContext

    const { content, filterGroups } = page.fields
    const heroSection = content?.find(section => section._type === 'hero')
    const articleRowSection = content?.find(section => section._type === 'articleRow')

    const [pages, setPages] = useState(Math.ceil(articles.length / 20))
    const [currentPage, setCurrentPage] = useState(1)
    const [filterDrawer, toggleFilterDrawer]= useState(true)
    const [mounted, setMounted]= useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const isDesktop = useMediaQuery({query: '(min-width: 1074px)'})

    const { hero } = page?.fields
    const blogType = page?.fields?.blogType
    const blogGlobalSettings = blogSettings ? { ...blogSettings.fields[blogType], blogType} : undefined

    hero.header = page.title
    hero.subheader = page.fields?.subheader

    useEffect(() => {
        setMounted(true)

        addListings(articles)
        addOriginalListings(articles)
        sortListings(articles, true)
        
        if(isDesktop && mounted && filterGroups?.length === 0) {
          toggleFilterDrawer(false)
        }

        const tagCount = {}
        const tagArray = []
        articles.map((article) => {
          article.fields?.articleTags?.map((tag) => {
            if(!tagCount[tag.value.toLowerCase()]) {
              tagCount[tag.value.toLowerCase()] = 1
            }

            if(tagCount[tag.value.toLowerCase()]) {
              tagCount[tag.value.toLowerCase()]++
            }

            tagArray.push(tag.value.toLowerCase())
            })
        })

        const filterGroupObj = {}
        const multipleSelectedFilters = {}

        filterGroups?.map((group) => {
          multipleSelectedFilters[group.title.toLowerCase()] = []

          filterGroupObj[group.title.toLowerCase()] = {
            options: {}
          }

          group.filterOptions?.map((option) => {
            filterGroupObj[group.title.toLowerCase()].options[option.value.toLowerCase()] = {
              checked: false,
              subFilters: {}
            }

            option.subFilters?.map((subFilter) => {
              if(tagCount[subFilter.value?.toLowerCase()] >= 4) {
                filterGroupObj[group.title.toLowerCase()].options[option.value.toLowerCase()].subFilters[subFilter.value.toLowerCase()] = {
                  checked: false
                }
              }
            })
          })
        })

        if(router.query.filters) {
          addUrl(router.query.filters)
    
          const refinedSelectedFilters = router.query.filters.split("&")
          let newSelectedFilterList = []

          refinedSelectedFilters.map((group) => {
            const splitGroup = group.split('=')
    
            if(splitGroup.length === 2) {
              filterGroupObj[splitGroup[0]].options[splitGroup[1]].checked = true
              if(!filterGroupObj[splitGroup[0]].options[splitGroup[1]].subFilters) {
                newSelectedFilterList.push(splitGroup[1])
              }

              if(filterGroupObj[splitGroup[0]].options[splitGroup[1]].subFilters) {
                Object.keys(filterGroupObj[splitGroup[0]].options[splitGroup[1]].subFilters).map((subFilter) => {
                  newSelectedFilterList.push(subFilter)    
                })
              }
            }
    
            if(splitGroup.length === 3) {
              newSelectedFilterList.push(splitGroup[2])
            }
          })

          replaceSelectedFilters(newSelectedFilterList)
        }

        addTagArray(tagArray)
        addTagCount(tagCount)
        addFilters(filterGroupObj)

        // PAGINATION
        if(selectedFilterList.length > 0) {
          setCurrentPage(1)
        }
        setPages(Math.ceil(listings.length / 20))
    }, [articles, pages, originalListings])

    useEffect(() => {
      window.scrollTo({ behavior: 'smooth', top: '0px' })
    }, [currentPage])

    const getPaginatedData = () => {
        const startIndex = currentPage * 20 - 20
        const endIndex = startIndex + 20
        return listings.slice(startIndex, endIndex)
    }

    const getPaginationGroup = () => {
      let start = Math.floor((currentPage - 1) / pages) * pages
      return new Array(pages).fill().map((_, idx) => start + idx + 1)
    }

    const goToNextPage = () => {
        setCurrentPage((page) => page + 1)
    }

    const goToPreviousPage = () => {
        setCurrentPage((page) => page - 1)
    }

    const changePage = (event) => {
        const pageNumber = Number(event.target.textContent)
        setCurrentPage(pageNumber)
    }

    const handleChange = (e) => {
      setSearchTerm(e.target.value)
    }
  
    const handleKeyDown = (e) => {
      let index
      if(blogType === 'culinary') {
        index = 'culinary_articles'
      } else {
        index = 'brand_articles'
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        router.push(`/pages/search?query=${searchTerm}&index=${index}`)
      }
    }

  return (
    <div className="category-listing-page">
      <StructuredData type="blog" data={page} />
      <PageSEO seo={page.fields.seo} />
      {page.type === "cookingClassCategory" ? (
        <ArticleCookingClassHero fields={page} />
      ):(
        <ArticleSplitHero fields={hero} renderType="blog-listing" blogType={blogType} blogGlobalSettings={blogGlobalSettings} />
      )}
      <div className={classes["recipes"]}>
        <form className={`${classes['recipes__filter-wrap']} container`}>
          <div className={classes['recipes__search']}>
            <button type="button">
                <IconSearch />
            </button>
            <input type="text" placeholder='Search' className="body" onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => handleChange(e)} value={searchTerm} />
          </div>

          <div className={classes['recipes__filter-row']}>
            {filterGroups && filterGroups?.length > 0 && <button onClick={() => toggleFilterDrawer(!filterDrawer)} type="button" className={`${classes['toggle-filters']} ${classes['desktop']}`}>
              {filterDrawer ? <span className="body">Hide Filters <IconFilters/></span> : <span className="body">Show Filters <IconFilters/></span>}
            </button>}

            {filterGroups && filterGroups?.length > 0 && <button onClick={() => openDrawer()} type="button" className={`${classes['toggle-filters']} ${classes['mobile']}`}>
              {isOpen ? <span className="body">Hide Filters <IconFilters/></span> : <span className="body">Show Filters <IconFilters/></span>}
            </button>}

            <div className={classes['sort-by']}>
              <label className="body">Sort By</label>
              <select className="body" onChange={(e) => selectChangeHandler(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </form>

        <div className={`${classes['filters-list__wrap']} ${filterDrawer ? 'open container' : 'close'}`}>
          {filterDrawer && filterGroups?.length > 0 && <div className={`${classes['filters']}`}>
            <BlogFilters />
          </div>}

          {!articles.length ? (
            <div className={`${classes['recipes__list-loading']}`}>
              <h2>Loading Articles...</h2>
            </div>
          ):(
          <div className={`${classes['recipes__list-wrap']} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']} ${filterDrawer && filterGroups ? 'listing-pages--filters-open' : ''}`}>
            {listings.length > 0 && currentPage === 1 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${filterDrawer ? '' : 'container'} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']}`}>
                  {listings.slice(0, 8).map((article) => {
                    return (
                      <div className={classes['grid-item']} key={article.handle}>
                          <DynamicArticleCard article={article} />
                      </div>
                    )
              })}
            </div>}

            {listings.length >= 8 && currentPage === 1 && selectedFilterList.length === 0 && heroSection &&
              <FullBleedHero fields={heroSection} key={heroSection._key} />
            }

            {listings.length >= 8 && currentPage === 1 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${filterDrawer ? '' : 'container'} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']}`}>
              {listings.slice(8, 16).map((article) => {
                  return (
                    <div className={classes['grid-item']} key={article.handle}>
                      <DynamicArticleCard article={article} />
                    </div>
                  )
              })}
            </div>}

            {listings.length >= 17 && currentPage === 1 && selectedFilterList.length === 0 && articleRowSection &&
              <div>
                <ArticleRow fields={articleRowSection} />
              </div>
            }

            {listings.length >= 17 && currentPage === 1 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${filterDrawer ? '' : 'container'} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']}`}>
              {listings.slice(17, 21).map((article) => {
                  return (
                    <div className={classes['grid-item']} key={article.handle}>
                        <DynamicArticleCard article={article} />
                    </div>
                  )
              })}
            </div>}

            {currentPage !== 1 && <div className={`${classes['recipes__list']} ${filterDrawer ? '' : 'container'} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']}`}>
              {getPaginatedData().map((article) => (
                  <div className={classes['grid-item']} key={article.handle}>
                    <DynamicArticleCard article={article}  />
                </div>
              ))}
            </div>}

            {selectedFilterList.length > 0 && <div className={`${classes['recipes__list']} ${filterDrawer ? '' : 'container'} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']}`}>
              {listings.map((article) => (
                <div className={classes['grid-item']} key={article.handle}>
                  <DynamicArticleCard article={article} />
                </div>
              ))}
            </div>}
          </div>
        )}

      </div>

        {selectedFilterList.length === 0 && <div className={classes['pagination']}>
          <button
            onClick={goToPreviousPage}
            className={`${classes['prev']} ${classes[currentPage === 1 ? 'disabled' : '']} pagination-btn`}
          >
            <PaginationLeft />
          </button>

            {getPaginationGroup().map((item, index) => (
              <button
                key={index}
                onClick={changePage}
                className={`${classes['paginationItem']} ${classes[currentPage === item ? 'active' : null]}`}
              >
                <span>{item}</span>
              </button>
            ))}

            <button
              onClick={goToNextPage}
              className={`${classes['next']} ${classes[currentPage === pages ? 'disabled' : '']} pagination-btn`}
            >
              <PaginationRight />
            </button>
          </div>}
        </div>
    </div>
  )
}

export default ListingsTemplate