import {useState, useEffect} from 'react'

import ResponsiveImage from "@/components/ResponsiveImage"

import classes from "./FishermenPartners.module.scss"

import IconSearch from '@/svgs/search.svg'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

const FishermenPartners = ({ fields }) => {
  const [filterDrawer, toggleFilterDrawer]= useState(true)
  const { filterGroups, illustration, header, fishermen, calloutHeader, calloutSubheader } = fields
  const drawerContext = useArticleFiltersDrawerContext()
  const { addFilters, setIsFishermen, openDrawer, closeDrawer, isOpen, selectChangeHandler, selectedFilterList, addListings, addTagArray, sortListings, addOriginalListings, listings, addTagCount, originalListings } = drawerContext
  
  useEffect(() => {
    setIsFishermen()

    addListings(fishermen)
    addOriginalListings(fishermen)
    // sortListings(fishermen, true)

    const tagCount = {}
    const tagArray = []
    fishermen?.forEach((fisherman) => {
        fisherman.species?.forEach((tag) => {
        if(!tagCount[tag.title.toLowerCase()]) {
            tagCount[tag.title.toLowerCase()] = 1
        }

        if(tagCount[tag.title.toLowerCase()]) {
            tagCount[tag.title.toLowerCase()]++
        }

        tagArray.push(tag.title.toLowerCase())
        })
    })
    
    console.log(tagCount)
    console.log(tagArray)

    console.log('tags', tagCount)

    addTagArray(tagArray)
    addTagCount(tagCount)
    console.log("fishermen", fishermen)

    const filterGroupObj = {}
    filterGroups?.map((group) => {
      filterGroupObj[group.title.toLowerCase()] = {
        options: {}
      }

      group.filterOptions?.map((option) => {
        console.log('option', option)
          filterGroupObj[group.title.toLowerCase()].options[option.value.toLowerCase()] = {
            checked: false
          }
      })
    })

    console.log('fgobj', filterGroupObj)
    addFilters(filterGroupObj)
  }, [])

  return (
    <div className={`${classes['fishermen']}`}>
         {calloutHeader && <div className={`${classes['callout']} container`}>
            {calloutHeader && <h4>{calloutHeader}</h4>}
            {calloutSubheader && <p>{calloutSubheader}</p>}
        </div>}

        <div className={classes['illustration-wrap']}>
            {illustration && <div className={classes['illustration']}>
                <ResponsiveImage
                    src={illustration.asset.url}
                    layout="fill"
                    alt='illustration'
                />
            </div>}
        </div>


        <div className={classes['fishermen-wrap']}>
            <form className={`${classes['filter-wrap']} container`}>
                {header && <h1>{header}</h1>}
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

            <div className={`${classes['recipes__list-wrap']} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']}`}>
                {listings.length > 0 && selectedFilterList.length > 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']} container`}>
                    {listings.map((article) => {
                        return (
                        <div className={classes['grid-item']} key={article.handle}>
                            {article.title}
                        </div>
                        )
                    })}
                </div>}

                {fishermen.length > 0 && selectedFilterList.length === 0 && <div className={`${classes['recipes__list']} ${classes[filterDrawer && filterGroups ? 'filters-open' : '']} container`}>
                    {fishermen.map((article) => {
                        return (
                        <div className={classes['grid-item']} key={article.handle}>
                            {article.title}
                        </div>
                        )
                    })}
                </div>}
            </div>
        </div>
    </div>
  )
}

export default FishermenPartners