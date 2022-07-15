import React, {useState, useEffect} from 'react'
import { useMediaQuery } from 'react-responsive'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import FullBleedHero from '@/components/Sections/FullBleedHero'
import ArticleRow from '@/components/Sections/ArticleRow'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard' 
import BlogFilters from '@/components/Blog/BlogFilters'

import IconSearch from '@/svgs/search.svg'
import PaginationLeft from '@/svgs/pagination-left.svg'
import PaginationRight from '@/svgs/pagination-right.svg' 

import classes from "./ListingsTemplate.module.scss"

import PageSEO from '@/components/SEO/PageSEO'

const ListingsTemplate = ({ articles, blogSettings, page }) => {
    const drawerContext = useArticleFiltersDrawerContext()
    const { addFilters, openDrawer, closeDrawer, isOpen, selectChangeHandler, selectedFilterList, addListings, sortListings, addOriginalListings, listings, addTagCount, originalListings } = drawerContext

    const { content, filterGroups } = page.fields
    const heroSection = content?.find(section => section._type === 'hero')
    const articleRowSection = content?.find(section => section._type === 'articleRow')

    const [pages, setPages] = useState(Math.ceil(articles.length / 20))
    const [currentPage, setCurrentPage] = useState(1)
    const [filterDrawer, toggleFilterDrawer]= useState(true) 
    const [mounted, setMounted]= useState(false) 

    const isDesktop = useMediaQuery({query: '(min-width: 1074px)'})

    const { hero } = page?.fields
    const blogType = page?.fields?.blogType
    const blogGlobalSettings = blogSettings ? blogSettings?.fields[blogType] : undefined
    hero.header = page.title
    hero.subheader = page.fields?.subheader

    useEffect(() => {
        setMounted(true)

        addListings(articles)
        addOriginalListings(articles)
        sortListings(articles, true)

        if(!isDesktop && filterGroups.length > 0 && mounted) {
            openDrawer()
        } else {
            closeDrawer()
        }
        
        const tagCount = {}  
        articles.forEach((article) => {
        if(article.fields?.articleTags && !tagCount[article.fields?.articleTags[1]?.value]) {
            tagCount[article.fields?.articleTags[1]?.value] = 1
        }
        if(article.fields?.articleTags && tagCount[article.fields?.articleTags[1]?.value]) {
            tagCount[article.fields?.articleTags[1]?.value]++
        }
        })

        addTagCount(tagCount)

        const filterGroupObj = {}
        filterGroups?.map((group) => {
        filterGroupObj[group.title] = { 
            options: {}
        }

        group.filterOptions?.map((option) => {
            filterGroupObj[group.title].options[option.value] = {
            checked: false,
            subFilters: {}
            }

            if(option.subFilters) { 
            option.subFilters.map((subFilter) => {
                filterGroupObj[group.title].options[option.value].subFilters[subFilter.value] = {
                checked: false
                } 
            })
            }
        })
        })

        addFilters(filterGroupObj)
        window.scrollTo({ behavior: 'smooth', top: '0px' })

        if(selectedFilterList.length > 0) { 
        setCurrentPage(1)
        setPages(Math.ceil(listings.length / 20))
        }
    }, [currentPage, pages, originalListings])


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
  return (
        <>
     {/* <PageSEO seo={page.fields.seo} /> */}
     <ArticleSplitHero fields={hero} renderType="blog-listing" blogType={blogType} blogGlobalSettings={blogGlobalSettings} />
     <div className={classes['recipes']}>
       <form className={`${classes['recipes__filter-wrap']} container`}>
         <div className={classes['recipes__search']}>
           <button type="button">
               <IconSearch />
           </button>
           <input type="text" placeholder='Search' className="body" />
         </div> 

         <div className={classes['recipes__filter-row']}> 
           {filterGroups && filterGroups?.length > 0 && <button onClick={() => toggleFilterDrawer(!filterDrawer)} type="button" className={`${classes['toggle-filters']} ${classes['desktop']}`}>
             {filterDrawer ? <span className="body">Hide Filters</span> : <span className="body">Show Filters</span>}
           </button>}

           {filterGroups && filterGroups?.length > 0 && <button onClick={() => openDrawer()} type="button" className={`${classes['toggle-filters']} ${classes['mobile']}`}>
             {isOpen ? <span className="body">Hide Filters</span> : <span className="body">Show Filters</span>}
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

       <div className={`${classes['filters-list__wrap']} ${filterDrawer ? 'open' : 'close'}`}>
             {filterDrawer && filterGroups?.length > 0 && <div className={`${classes['filters']}`}>
             <BlogFilters />
       </div>}

       <div className={`${classes['recipes__list-wrap']} ${classes[filterDrawer ? 'filters-open' : '']}`}>
         {listings.length > 0 && currentPage === 1 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer ? 'filters-open' : '']} container`}>
             {listings.slice(0, 8).map((article) => {
               return (
                 <div className={classes['grid-item']} key={article.handle}> 
                   <DynamicArticleCard article={article} responsiveImage={true} /> 
                 </div>
               )
             })}
         </div>}

         {listings.length >= 8 && currentPage === 1 && selectedFilterList.length === 0 &&
           <FullBleedHero fields={heroSection} key={heroSection._key} />
         }

         {listings.length >= 8 && currentPage === 1 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer ? 'filters-open' : '']} container`}>
           {listings.slice(8, 16).map((article) => {
               return (
                 <div className={classes['grid-item']} key={article.handle}>
                   <DynamicArticleCard article={article} responsiveImage={true} />
                 </div>
               )
           })}
         </div>}

         {listings.length >= 17 && currentPage === 1 && selectedFilterList.length === 0 &&
           <ArticleRow fields={articleRowSection} />
         }

         {listings.length >= 17 && currentPage === 1 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer ? 'filters-open' : '']} container`}>
           {listings.slice(17, 21).map((article) => {
               return (
                 <div className={classes['grid-item']} key={article.handle}>
                   <DynamicArticleCard article={article} responsiveImage={true} />
                 </div>
               )
           })}
         </div>} 

         {currentPage !== 1 && <div className={`${classes['recipes__list']} ${classes[filterDrawer ? 'filters-open' : '']} container`}>
           {getPaginatedData().map((article) => (
               <div className={classes['grid-item']} key={article.handle}>
                 <DynamicArticleCard article={article} responsiveImage={true} />
             </div>
           ))}
         </div>}

         {selectedFilterList.length > 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer ? 'filters-open' : '']} container`}>
           {listings.map((article) => ( 
               <div className={classes['grid-item']} key={article.handle}>
                 <DynamicArticleCard article={article} responsiveImage={true} />
             </div>
           ))}
         </div>}
       </div>
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
    </>
  )
}

export default ListingsTemplate